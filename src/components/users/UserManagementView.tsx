import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTenant } from '../../context/TenantContext';
import { useNotification } from '../../context/NotificationContext';
import { DataTable, Column } from '../common/DataTable';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { User, ScopeConstraint, ScopeType } from '../../types';
import { SYSTEM_ROLES } from '../../config/permissions';
import { Users, UserPlus, Shield, KeyRound, Check, X, ShieldAlert } from 'lucide-react';
import { UserService } from '../../services/userService';

export const UserManagementView: React.FC = () => {
  const { allUsers, refreshUsers, assignUserRole, removeUserRole, currentUser, hasPermission } = useAuth();
  const { currentTenant, campuses } = useTenant();
  const { notify } = useNotification();

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Role Assignment State
  const [selectedRoleCode, setSelectedRoleCode] = useState('teacher');
  const [scopeType, setScopeType] = useState<ScopeType>('institution');
  const [scopeValue, setScopeValue] = useState('');
  const [scopeName, setScopeName] = useState('');

  // New User Form State
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newDesignation, setNewDesignation] = useState('');
  const [newDepartment, setNewDepartment] = useState('');

  const openAssignModal = (user: User) => {
    setSelectedUser(user);
    setSelectedRoleCode('teacher');
    setScopeType('institution');
    setScopeValue(currentTenant?.id || '');
    setScopeName(currentTenant?.name || '');
    setIsAssignModalOpen(true);
  };

  const handleAssignRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !currentTenant) return;

    try {
      const scopes: ScopeConstraint[] = [
        {
          type: scopeType,
          value: scopeValue || currentTenant.id,
          name: scopeName || scopeType
        }
      ];

      await assignUserRole(selectedUser.id, selectedRoleCode, scopes);
      notify('success', 'Role Assigned', `Role "${selectedRoleCode}" assigned to ${selectedUser.displayName} with ${scopeType} scope.`);
      setIsAssignModalOpen(false);
    } catch (err: any) {
      notify('error', 'Assignment Failed', err.message);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !newName || !currentTenant) return;

    try {
      const newId = `usr_${Date.now().toString(36)}`;
      const now = new Date().toISOString();
      const user: User = {
        id: newId,
        email: newEmail,
        displayName: newName,
        status: 'active',
        defaultTenantId: currentTenant.id,
        metadata: {
          designation: newDesignation,
          department: newDepartment
        },
        roleAssignments: [
          {
            id: `ra_${Date.now().toString(36)}`,
            userId: newId,
            roleId: 'role_teacher',
            roleCode: 'teacher',
            roleName: 'Teacher',
            tenantId: currentTenant.id,
            scopes: [{ type: 'institution', value: currentTenant.id }],
            assignedAt: now
          }
        ],
        createdAt: now,
        updatedAt: now
      };

      await UserService.upsertUser(user);
      notify('success', 'User Provisioned', `User account created for ${newName}.`);
      setIsNewUserModalOpen(false);
      setNewEmail('');
      setNewName('');
      await refreshUsers();
    } catch (err: any) {
      notify('error', 'User Provisioning Failed', err.message);
    }
  };

  const columns: Column<User>[] = [
    {
      header: 'User Profile',
      accessor: (u) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold text-xs">
            {u.displayName.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-slate-900 dark:text-slate-100">{u.displayName}</p>
            <p className="text-2xs text-slate-500">{u.email}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Role Assignments (Tenant Scoped)',
      accessor: (u) => (
        <div className="flex flex-wrap items-center gap-1.5 max-w-sm">
          {(u.roleAssignments || []).map((ra) => {
            const hasMultipleRoles = (u.roleAssignments || []).length > 1;
            return (
              <Badge key={ra.id} variant="primary" size="sm" className="inline-flex items-center gap-1 pr-1">
                <span>{ra.roleName}</span>
                {ra.scopes?.[0] && (
                  <span className="opacity-75 text-2xs">
                    ({ra.scopes[0].type})
                  </span>
                )}
                {hasPermission('role.manage') && (
                  <button
                    type="button"
                    onClick={async (e) => {
                      e.stopPropagation();
                      const confirmMsg = hasMultipleRoles
                        ? `Are you sure you want to remove the role "${ra.roleName}" from ${u.displayName}?`
                        : `"${ra.roleName}" is the only role assigned to ${u.displayName}. Are you sure you want to remove it?`;
                      if (window.confirm(confirmMsg)) {
                        try {
                          await removeUserRole(u.id, ra.id);
                          notify('success', 'Role Removed', `Role "${ra.roleName}" removed from ${u.displayName}.`);
                        } catch (err: any) {
                          notify('error', 'Role Removal Failed', err.message);
                        }
                      }
                    }}
                    className="ml-1 p-0.5 rounded hover:bg-rose-100 hover:text-rose-700 dark:hover:bg-rose-900/60 dark:hover:text-rose-300 text-slate-400 transition-colors cursor-pointer"
                    title={`Delete "${ra.roleName}" role assignment`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </Badge>
            );
          })}
          {(u.roleAssignments || []).length === 0 && (
            <span className="text-2xs text-slate-400">No active roles</span>
          )}
        </div>
      )
    },
    {
      header: 'Department / Title',
      accessor: (u) => (
        <span className="text-xs text-slate-600 dark:text-slate-400">
          {u.metadata?.designation || u.metadata?.department || 'Staff Member'}
        </span>
      )
    },
    {
      header: 'Status',
      accessor: (u) => (
        <Badge variant={u.status === 'active' ? 'success' : 'danger'}>
          {u.status.toUpperCase()}
        </Badge>
      )
    },
    {
      header: 'Actions',
      accessor: (u) => (
        <div className="flex items-center gap-2">
          {hasPermission('role.manage') && (
            <button
              onClick={() => openAssignModal(u)}
              className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-md text-xs font-medium transition-colors"
            >
              + Assign Role
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            User Management & Multi-Role Architecture
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Users can hold multiple roles simultaneously with fine-grained scope constraints (Campus, Class, Section).
          </p>
        </div>

        {hasPermission('user.create') && (
          <button
            onClick={() => setIsNewUserModalOpen(true)}
            className="px-3.5 py-2 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
          >
            <UserPlus className="w-3.5 h-3.5" />
            Provision New Staff User
          </button>
        )}
      </div>

      {/* Users Table */}
      <DataTable
        data={allUsers}
        columns={columns}
        keyExtractor={(u) => u.id}
        searchPlaceholder="Search users by name, email, or designation..."
        searchFilter={(u, q) =>
          u.displayName.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          (u.metadata?.designation && u.metadata.designation.toLowerCase().includes(q))
        }
      />

      {/* Modal: Assign Role */}
      <Modal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        title={`Assign Role to ${selectedUser?.displayName}`}
        subtitle="Configure role assignment with multi-level scope constraint."
      >
        <form onSubmit={handleAssignRole} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Select Role *
            </label>
            <select
              value={selectedRoleCode}
              onChange={(e) => setSelectedRoleCode(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
            >
              {SYSTEM_ROLES.map((r) => (
                <option key={r.code} value={r.code}>
                  {r.name} ({r.category.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Scope Restriction Level *
            </label>
            <select
              value={scopeType}
              onChange={(e) => setScopeType(e.target.value as ScopeType)}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
            >
              <option value="institution">Whole Institution ({currentTenant?.name})</option>
              <option value="campus">Specific Campus</option>
              <option value="class">Specific Class/Grade Level</option>
              <option value="section">Specific Section Roster</option>
              <option value="subject">Specific Subject / Course</option>
              {currentUser?.isPlatformSuperAdmin && (
                <option value="platform">Platform-Wide (Super Admin)</option>
              )}
            </select>
          </div>

          {scopeType === 'campus' && (
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Select Campus
              </label>
              <select
                value={scopeValue}
                onChange={(e) => {
                  setScopeValue(e.target.value);
                  const c = campuses.find(cmp => cmp.id === e.target.value);
                  setScopeName(c?.name || '');
                }}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
              >
                {campuses.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          )}

          {['class', 'section', 'subject'].includes(scopeType) && (
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Scope Description / Class Tag
              </label>
              <input
                type="text"
                value={scopeName}
                onChange={(e) => setScopeName(e.target.value)}
                placeholder="e.g. Grade 10 - Section A (Room 204)"
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
              />
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAssignModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-xs"
            >
              Assign Role to User
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: New User */}
      <Modal
        isOpen={isNewUserModalOpen}
        onClose={() => setIsNewUserModalOpen(false)}
        title="Provision New Staff Account"
        subtitle={`User will be assigned to ${currentTenant?.name}.`}
      >
        <form onSubmit={handleCreateUser} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Dr. Sunita Deshmukh"
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Work Email Address *
            </label>
            <input
              type="email"
              required
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="sunita.deshmukh@dpsrkp.edu.in"
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Designation / Job Title
              </label>
              <input
                type="text"
                value={newDesignation}
                onChange={(e) => setNewDesignation(e.target.value)}
                placeholder="Senior PGT Teacher"
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Department
              </label>
              <input
                type="text"
                value={newDepartment}
                onChange={(e) => setNewDepartment(e.target.value)}
                placeholder="Science & Computing"
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsNewUserModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-xs"
            >
              Create Account
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
