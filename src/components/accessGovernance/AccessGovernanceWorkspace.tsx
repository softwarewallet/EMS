// EMS Phase 7.25: Platform Administration, User Lifecycle & Access Governance Engine
// Production-grade security-hardened workspace

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Shield, 
  Users, 
  ShieldAlert, 
  Key, 
  ClipboardCheck, 
  History, 
  Search, 
  Plus, 
  Trash2, 
  Calendar, 
  FileText, 
  Ban, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Fingerprint,
  RefreshCw,
  Globe,
  Clock,
  ArrowRight,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTenant } from '../../context/TenantContext';
import { useNotification } from '../../context/NotificationContext';
import { AccessGovernanceService } from '../../services/accessGovernanceService';
import { db } from '../../config/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { 
  UserGovernanceStatus,
  TemporaryAccessGrant,
  DelegatedAdministrationGrant,
  AccessReview,
  AccessReviewItem,
  SecuritySession,
  AccessGovernanceAnalyticsCache
} from '../../types/accessGovernance';
import { User, ScopeConstraint } from '../../types';

export const AccessGovernanceWorkspace: React.FC = () => {
  const { currentUser, allUsers, refreshUsers } = useAuth();
  const { currentTenant } = useTenant();
  const { notify } = useNotification();

  // Active workspace tab: 'users' | 'assignments' | 'temp_access' | 'reviews' | 'sessions'
  const [activeSubTab, setActiveSubTab] = useState<'users' | 'assignments' | 'temp_access' | 'reviews' | 'sessions'>('users');

  // Search filter
  const [searchTerm, setSearchTerm] = useState('');

  // Analytics & state caches
  const [analytics, setAnalytics] = useState<AccessGovernanceAnalyticsCache | null>(null);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);

  // Dynamic lists from Firestore
  const [temporaryGrants, setTemporaryGrants] = useState<TemporaryAccessGrant[]>([]);
  const [delegatedGrants, setDelegatedGrants] = useState<DelegatedAdministrationGrant[]>([]);
  const [accessReviews, setAccessReviews] = useState<AccessReview[]>([]);
  const [reviewItems, setReviewItems] = useState<AccessReviewItem[]>([]);
  const [activeSessions, setActiveSessions] = useState<SecuritySession[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  // Modals / Action states
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [lifecycleAction, setLifecycleAction] = useState<UserGovernanceStatus | 'REVOKE_ROLE' | null>(null);
  const [actionReason, setActionReason] = useState('');
  const [targetRoleId, setTargetRoleId] = useState('');
  const [targetRoleAssignmentId, setTargetRoleAssignmentId] = useState('');

  // Form states for creating new allocations
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState('institution_manager');

  const [showTempModal, setShowTempModal] = useState(false);
  const [tempUserId, setTempUserId] = useState('');
  const [tempRoleCode, setTempRoleCode] = useState('');
  const [tempUntil, setTempUntil] = useState('');

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewTargetType, setReviewTargetType] = useState<'USERS' | 'ROLES' | 'MODULES'>('USERS');

  // Scope constraints editor
  const [scopeType, setScopeType] = useState<'platform' | 'institution' | 'campus' | 'class'>('campus');
  const [scopeValue, setScopeValue] = useState('*');

  // Load analytics and reactive elements
  const loadData = useCallback(async () => {
    if (!currentTenant) return;
    setIsLoadingAnalytics(true);
    try {
      // 1. Fetch real analytics cache projection
      const stats = await AccessGovernanceService.getAccessGovernanceAnalytics(currentTenant.id);
      setAnalytics(stats);

      // 2. Fetch active temporary access grants
      const tempSnap = await getDocs(
        query(collection(db, 'temporary_access_grants'), where('tenantId', '==', currentTenant.id))
      );
      setTemporaryGrants(tempSnap.docs.map(d => d.data() as TemporaryAccessGrant));

      // 3. Fetch delegated administration grants
      const delSnap = await getDocs(
        query(collection(db, 'delegated_administration_grants'), where('tenantId', '==', currentTenant.id))
      );
      setDelegatedGrants(delSnap.docs.map(d => d.data() as DelegatedAdministrationGrant));

      // 4. Fetch access review campaigns
      const revSnap = await getDocs(
        query(collection(db, 'access_reviews'), where('tenantId', '==', currentTenant.id))
      );
      setAccessReviews(revSnap.docs.map(d => d.data() as AccessReview));

      // 5. Fetch review items if active review is selected
      const revItemsSnap = await getDocs(
        query(collection(db, 'access_review_items'), where('tenantId', '==', currentTenant.id))
      );
      setReviewItems(revItemsSnap.docs.map(d => d.data() as AccessReviewItem));

      // 6. Fetch live security sessions
      const sessionsSnap = await getDocs(
        query(collection(db, 'security_sessions'), where('tenantId', '==', currentTenant.id))
      );
      setActiveSessions(sessionsSnap.docs.map(d => d.data() as SecuritySession));

      // 7. Fetch recent audit logs from our authoritative audit logger
      const auditSnap = await getDocs(
        query(collection(db, 'audit_logs'), where('tenantId', '==', currentTenant.id))
      );
      setAuditLogs(auditSnap.docs.map(d => d.data()).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 50));

    } catch (e) {
      console.error('Failed to load governance collections:', e);
    } finally {
      setIsLoadingAnalytics(false);
    }
  }, [currentTenant]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filtered users
  const filteredUsersList = useMemo(() => {
    return allUsers.filter(u => {
      if (currentTenant && u.defaultTenantId !== currentTenant.id && u.defaultTenantId !== 'ALL') return false;
      if (!searchTerm) return true;
      return (
        u.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [allUsers, searchTerm, currentTenant]);

  // Action Handlers
  const handleUserStatusTransition = async () => {
    if (!selectedUser || !currentTenant || !currentUser || !lifecycleAction || !actionReason.trim()) return;

    try {
      await AccessGovernanceService.updateUserStatus(
        currentTenant.id,
        selectedUser.id,
        lifecycleAction as UserGovernanceStatus,
        actionReason,
        {
          id: currentUser.id || currentUser.uid,
          email: currentUser.email,
          name: currentUser.displayName
        }
      );
      
      // Cleanup state
      setSelectedUser(null);
      setLifecycleAction(null);
      setActionReason('');
      await refreshUsers();
      await loadData();
    } catch (err: any) {
      notify('error', 'Governance Failure', err.message);
    }
  };

  const handleAssignRole = async () => {
    if (!selectedUser || !currentTenant || !currentUser || !targetRoleId || !actionReason.trim()) return;

    try {
      const scopeConstraint: ScopeConstraint = {
        type: scopeType,
        value: scopeValue,
        name: scopeValue === '*' ? 'All Scope' : `${(scopeType || 'CAMPUS').toUpperCase()} Isolation`
      };

      await AccessGovernanceService.assignRole(
        currentTenant.id,
        selectedUser.id,
        targetRoleId,
        `role_${(targetRoleId || '').toLowerCase()}`,
        [scopeConstraint],
        actionReason,
        {
          id: currentUser.id || currentUser.uid,
          email: currentUser.email,
          name: currentUser.displayName
        }
      );

      setSelectedUser(null);
      setTargetRoleId('');
      setActionReason('');
      await refreshUsers();
      await loadData();
    } catch (err: any) {
      notify('error', 'Role Assignment Failure', err.message);
    }
  };

  const handleRevokeRole = async () => {
    if (!selectedUser || !currentTenant || !currentUser || !targetRoleAssignmentId || !actionReason.trim()) return;

    try {
      await AccessGovernanceService.revokeRole(
        currentTenant.id,
        selectedUser.id,
        targetRoleAssignmentId,
        actionReason,
        {
          id: currentUser.id || currentUser.uid,
          email: currentUser.email,
          name: currentUser.displayName
        }
      );

      setSelectedUser(null);
      setTargetRoleAssignmentId('');
      setLifecycleAction(null);
      setActionReason('');
      await refreshUsers();
      await loadData();
    } catch (err: any) {
      notify('error', 'Role Revocation Failure', err.message);
    }
  };

  const handleCreateTempGrant = async () => {
    if (!tempUserId || !tempRoleCode || !tempUntil || !actionReason.trim() || !currentUser || !currentTenant) return;

    try {
      const scopeConstraint: ScopeConstraint = {
        type: 'campus',
        value: '*',
        name: 'Temporary Assigned Campus'
      };

      await AccessGovernanceService.createTemporaryAccessGrant(
        currentTenant.id,
        {
          tenantId: currentTenant.id,
          userId: tempUserId,
          roleCode: tempRoleCode,
          scope: [scopeConstraint],
          effectiveFrom: new Date().toISOString(),
          effectiveUntil: new Date(tempUntil).toISOString(),
          reason: actionReason,
          approvedBy: currentUser.displayName
        },
        currentUser.id || currentUser.uid
      );

      setShowTempModal(false);
      setTempUserId('');
      setTempRoleCode('');
      setTempUntil('');
      setActionReason('');
      await loadData();
    } catch (err: any) {
      notify('error', 'Temporary Privilege Failure', err.message);
    }
  };

  const handleRevokeTempGrant = async (grantId: string) => {
    if (!currentUser || !currentTenant) return;
    try {
      await AccessGovernanceService.revokeTemporaryAccessGrant(currentTenant.id, grantId, currentUser.displayName);
      await loadData();
    } catch (err: any) {
      notify('error', 'Revocation Failure', err.message);
    }
  };

  const handleLaunchReview = async () => {
    if (!reviewTitle.trim() || !currentUser || !currentTenant) return;

    try {
      await AccessGovernanceService.createAccessReview(
        currentTenant.id,
        reviewTitle,
        reviewTargetType as any,
        currentUser.displayName
      );

      setShowReviewModal(false);
      setReviewTitle('');
      await loadData();
    } catch (err: any) {
      notify('error', 'Launch Review Failure', err.message);
    }
  };

  const handleCertifyItem = async (itemId: string, decision: 'APPROVE' | 'REVOKE', reason: string) => {
    if (!currentUser || !currentTenant) return;
    try {
      await AccessGovernanceService.reviewAccessItem(
        currentTenant.id,
        itemId,
        decision,
        reason,
        currentUser.displayName
      );
      await loadData();
    } catch (err: any) {
      notify('error', 'Review Certify Failure', err.message);
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    if (!currentUser || !currentTenant) return;
    try {
      await AccessGovernanceService.revokeSecuritySession(currentTenant.id, sessionId, currentUser.displayName);
      await loadData();
    } catch (err: any) {
      notify('error', 'Revoke Session Failure', err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm gap-4">
        <div>
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">
            <Shield className="w-4 h-4 text-slate-500" />
            Security & Identity Suite
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Access Governance & Platform Administration</h1>
          <p className="text-slate-500 text-sm mt-1">
            Authoritative lifecycle audits, role assignments, boundaries, and temporary privileges.
          </p>
        </div>
        <button 
          onClick={loadData}
          disabled={isLoadingAnalytics}
          className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-700 px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium transition disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isLoadingAnalytics ? 'animate-spin' : ''}`} />
          Force Synchronization
        </button>
      </div>

      {/* Analytics Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Total Users</span>
            <span className="p-1.5 bg-sky-50 rounded-lg text-sky-600"><Users className="w-4 h-4" /></span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">{analytics?.totalUsers ?? 0}</div>
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block"></span>
            {analytics?.activeUsers ?? 0} active profiles verified
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Suspended Accounts</span>
            <span className="p-1.5 bg-rose-50 rounded-lg text-rose-600"><Ban className="w-4 h-4" /></span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">{analytics?.suspendedUsers ?? 0}</div>
          <div className="text-xs text-slate-500 mt-1">
            Suspended or deactivated for compliance reasons
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Temp Access Grants</span>
            <span className="p-1.5 bg-amber-50 rounded-lg text-amber-600"><Key className="w-4 h-4" /></span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">{analytics?.activeTemporaryGrantsCount ?? 0}</div>
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            {analytics?.expiringGrantsCount ?? 0} auto-expiring in 24h
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Governance Violations</span>
            <span className="p-1.5 bg-red-50 rounded-lg text-red-600"><ShieldAlert className="w-4 h-4" /></span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">{analytics?.blockedEscalationsCount ?? 0}</div>
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1 text-red-600 font-semibold">
            <AlertTriangle className="w-3.5 h-3.5" />
            Zero trust blocks recorded
          </div>
        </div>
      </div>

      {/* Primary Workspace Sections */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        {/* Sub-tabs header */}
        <div className="border-b border-slate-200 flex overflow-x-auto bg-slate-50">
          <button 
            onClick={() => setActiveSubTab('users')}
            className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium border-b-2 transition whitespace-nowrap ${
              activeSubTab === 'users' 
                ? 'border-sky-600 text-sky-600 bg-white' 
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
            }`}
          >
            <Users className="w-4 h-4" />
            User Lifecycle Manager
          </button>
          <button 
            onClick={() => setActiveSubTab('assignments')}
            className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium border-b-2 transition whitespace-nowrap ${
              activeSubTab === 'assignments' 
                ? 'border-sky-600 text-sky-600 bg-white' 
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
            }`}
          >
            <Globe className="w-4 h-4" />
            Access Allocations
          </button>
          <button 
            onClick={() => setActiveSubTab('temp_access')}
            className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium border-b-2 transition whitespace-nowrap ${
              activeSubTab === 'temp_access' 
                ? 'border-sky-600 text-sky-600 bg-white' 
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
            }`}
          >
            <Key className="w-4 h-4" />
            Temp & Delegated Access
          </button>
          <button 
            onClick={() => setActiveSubTab('reviews')}
            className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium border-b-2 transition whitespace-nowrap ${
              activeSubTab === 'reviews' 
                ? 'border-sky-600 text-sky-600 bg-white' 
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
            }`}
          >
            <ClipboardCheck className="w-4 h-4" />
            Access Certifications ({analytics?.pendingAccessReviewsCount ?? 0})
          </button>
          <button 
            onClick={() => setActiveSubTab('sessions')}
            className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium border-b-2 transition whitespace-nowrap ${
              activeSubTab === 'sessions' 
                ? 'border-sky-600 text-sky-600 bg-white' 
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
            }`}
          >
            <Fingerprint className="w-4 h-4" />
            Active Sessions & Audits
          </button>
        </div>

        {/* Tab contents */}
        <div className="p-6">
          {/* USER LIFECYCLE TAB */}
          {activeSubTab === 'users' && (
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search user profiles by name or email..."
                    className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  />
                </div>
              </div>

              {/* Users table */}
              <div className="overflow-x-auto border border-slate-200/80 rounded-lg">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      <th className="px-6 py-3">Profile</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Active Role Assignments</th>
                      <th className="px-6 py-3">Created At</th>
                      <th className="px-6 py-3 text-right">Administrative Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                    {filteredUsersList.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                          <Users className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                          No user profiles matched search filters.
                        </td>
                      </tr>
                    ) : (
                      filteredUsersList.map(user => (
                        <tr key={user.id} className="hover:bg-slate-50/50">
                          <td className="px-6 py-4">
                            <div className="font-semibold text-slate-900">{user.displayName}</div>
                            <div className="text-slate-500 text-xs">{user.email}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                              user.status === 'active' 
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}>
                              {user.status === 'active' ? 'Active' : 'Suspended'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1 max-w-xs">
                              {(user.roleAssignments || []).map(ra => (
                                <span key={ra.id} className="inline-block bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-xs">
                                  {ra.roleCode} ({ra.tenantId})
                                </span>
                              ))}
                              {(user.roleAssignments || []).length === 0 && (
                                <span className="text-slate-400 text-xs">No active assignments</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-slate-500 text-xs">
                            {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-right space-x-2">
                            <button 
                              onClick={() => { setSelectedUser(user); setLifecycleAction('SUSPENDED'); }}
                              disabled={user.status !== 'active'}
                              className="text-xs bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 px-2.5 py-1.5 rounded-md font-medium transition disabled:opacity-40"
                            >
                              Suspend
                            </button>
                            <button 
                              onClick={() => { setSelectedUser(user); setLifecycleAction('ACTIVE'); }}
                              disabled={user.status === 'active'}
                              className="text-xs bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 px-2.5 py-1.5 rounded-md font-medium transition disabled:opacity-40"
                            >
                              Activate / Unlock
                            </button>
                            <button 
                              onClick={() => { setSelectedUser(user); setLifecycleAction('REVOKE_ROLE'); }}
                              className="text-xs bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 px-2.5 py-1.5 rounded-md font-medium transition"
                            >
                              Assign/Manage Roles
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ACCESS ALLOCATIONS TAB */}
          {activeSubTab === 'assignments' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-sky-50/50 p-4 rounded-lg border border-sky-100">
                <div className="text-sm text-sky-800">
                  <span className="font-bold">Privilege & Isolation Governance:</span> Allocations enforce absolute isolation boundaries. Cross-tenant or unconstrained platform permissions are rejected.
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Role Allocation Panel */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-sky-600" />
                    New Scoped Role Allocation
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Target User profile</label>
                      <select 
                        onChange={(e) => {
                          const u = allUsers.find(usr => usr.id === e.target.value);
                          if (u) setSelectedUser(u);
                        }}
                        className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                      >
                        <option value="">-- Select Candidate Profile --</option>
                        {allUsers.map(usr => (
                          <option key={usr.id} value={usr.id}>{usr.displayName} ({usr.email})</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Role Definition</label>
                        <select 
                          value={targetRoleId}
                          onChange={(e) => setTargetRoleId(e.target.value)}
                          className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:outline-none"
                        >
                          <option value="">-- Select Role --</option>
                          <option value="PLATFORM_SUPER_ADMINISTRATOR">PLATFORM SUPER ADMIN</option>
                          <option value="institution_manager">INSTITUTION MANAGER</option>
                          <option value="campus_administrator">CAMPUS ADMINISTRATOR</option>
                          <option value="finance_manager">FINANCE MANAGER</option>
                          <option value="hr_recruiter">HR RECRUITER</option>
                          <option value="teacher">TEACHER</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Scope Level</label>
                        <select 
                          value={scopeType}
                          onChange={(e: any) => setScopeType(e.target.value)}
                          className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:outline-none"
                        >
                          <option value="campus">Campus Specific</option>
                          <option value="institution">Tenant-Wide</option>
                          <option value="class">Class Level</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Scope Isolation ID</label>
                        <input 
                          type="text" 
                          value={scopeValue}
                          onChange={(e) => setScopeValue(e.target.value)}
                          className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:outline-none"
                          placeholder="e.g. campus_01, class_04, or *"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Audit Consensus Reason</label>
                        <input 
                          type="text" 
                          value={actionReason}
                          onChange={(e) => setActionReason(e.target.value)}
                          className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:outline-none"
                          placeholder="Required for audit trace"
                        />
                      </div>
                    </div>

                    <button 
                      onClick={handleAssignRole}
                      disabled={!selectedUser || !targetRoleId || !actionReason.trim()}
                      className="w-full bg-sky-600 hover:bg-sky-700 text-white font-medium py-2 rounded-lg text-sm transition disabled:opacity-50"
                    >
                      Authorize Access Assignment
                    </button>
                  </div>
                </div>

                {/* Scope limits audit view */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
                  <h3 className="font-bold text-slate-900">Active Allocations Audit Logs</h3>
                  <div className="space-y-3 max-h-72 overflow-y-auto text-xs text-slate-600">
                    {allUsers.flatMap(u => (u.roleAssignments || []).map(ra => (
                      <div key={ra.id} className="bg-white p-3 rounded-lg border border-slate-200 flex justify-between items-start gap-2">
                        <div>
                          <div className="font-semibold text-slate-900">{ra.roleCode}</div>
                          <div className="text-slate-500 mt-0.5">Assigned to user: {u.displayName} ({u.email})</div>
                          <div className="text-slate-500 mt-0.5">Scopes: {JSON.stringify(ra.scopes)}</div>
                        </div>
                        <button 
                          onClick={() => { setSelectedUser(u); setTargetRoleAssignmentId(ra.id); setLifecycleAction('REVOKE_ROLE'); }}
                          className="text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Revoke
                        </button>
                      </div>
                    )))}
                    {allUsers.every(u => !u.roleAssignments?.length) && (
                      <div className="text-center text-slate-400 py-12">No active roles allocated to current tenants.</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TEMPORARY ACCESS TAB */}
          {activeSubTab === 'temp_access' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-slate-900">Active Temporary & Delegated Access Grants</h3>
                <button 
                  onClick={() => setShowTempModal(true)}
                  className="flex items-center gap-1.5 bg-sky-600 hover:bg-sky-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition"
                >
                  <Plus className="w-4 h-4" />
                  Issue Temporary Privilege
                </button>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-left border-collapse text-sm text-slate-700">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      <th className="px-6 py-3">Subject ID</th>
                      <th className="px-6 py-3">Assigned Temporary Role</th>
                      <th className="px-6 py-3">Valid Until</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Approved By</th>
                      <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {temporaryGrants.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                          <Key className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                          No temporary or auto-expiring privilege grants currently exist.
                        </td>
                      </tr>
                    ) : (
                      temporaryGrants.map(grant => (
                        <tr key={grant.id}>
                          <td className="px-6 py-4 font-semibold text-slate-900">{grant.userId}</td>
                          <td className="px-6 py-4">{grant.roleCode}</td>
                          <td className="px-6 py-4 text-xs font-mono">{new Date(grant.effectiveUntil).toLocaleString()}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                              grant.status === 'ACTIVE' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {grant.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-500">{grant.approvedBy}</td>
                          <td className="px-6 py-4 text-right">
                            {grant.status === 'ACTIVE' && (
                              <button 
                                onClick={() => handleRevokeTempGrant(grant.id)}
                                className="text-xs bg-rose-50 hover:bg-rose-100 text-rose-700 px-2.5 py-1 rounded transition"
                              >
                                Revoke Now
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ACCESS REVIEW / CERTIFICATIONS TAB */}
          {activeSubTab === 'reviews' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-slate-900">Periodic Access Certifications Campaigns</h3>
                <button 
                  onClick={() => setShowReviewModal(true)}
                  className="flex items-center gap-1.5 bg-sky-600 hover:bg-sky-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition"
                >
                  <Plus className="w-4 h-4" />
                  Launch Review Campaign
                </button>
              </div>

              {/* Campaign cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {accessReviews.length === 0 ? (
                  <div className="md:col-span-2 text-center p-12 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-400">
                    <ClipboardCheck className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    No active periodic review campaigns. Use "Launch Campaign" to initiate compliance.
                  </div>
                ) : (
                  accessReviews.map(campaign => {
                    const pct = Math.round((campaign.reviewedItems / (campaign.totalItems || 1)) * 100);
                    return (
                      <div key={campaign.id} className="bg-white p-5 border border-slate-200 rounded-xl shadow-sm flex flex-col justify-between space-y-4">
                        <div>
                          <div className="flex justify-between items-start">
                            <span className="bg-sky-100 text-sky-700 text-xs font-semibold px-2 py-0.5 rounded">
                              {campaign.status}
                            </span>
                            <span className="text-slate-400 text-xs font-mono">{campaign.id}</span>
                          </div>
                          <h4 className="font-bold text-slate-900 mt-2">{campaign.title}</h4>
                          <p className="text-xs text-slate-500 mt-1">
                            Target Subject: {campaign.targetType} • Initiated by: {campaign.initiatedBy}
                          </p>
                        </div>

                        {/* Progress bar */}
                        <div>
                          <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                            <span>Campaign Progress</span>
                            <span>{pct}% ({campaign.reviewedItems}/{campaign.totalItems})</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div className="bg-sky-600 h-full rounded-full transition-all" style={{ width: `${pct}%` }}></div>
                          </div>
                        </div>

                        {/* Items under campaign */}
                        <div className="border-t border-slate-100 pt-3 space-y-2">
                          <h5 className="text-xs font-bold text-slate-700">Action Required: Pending Certification Items</h5>
                          <div className="max-h-40 overflow-y-auto space-y-1.5 text-xs text-slate-600">
                            {reviewItems
                              .filter(item => item.reviewId === campaign.id && item.status === 'PENDING')
                              .map(item => (
                                <div key={item.id} className="bg-slate-50 p-2 rounded border border-slate-200 flex justify-between items-center gap-2">
                                  <div>
                                    <div className="font-semibold text-slate-900">{item.subjectName}</div>
                                    <div className="text-slate-400 text-[10px]">{item.resourceDetails}</div>
                                  </div>
                                  <div className="space-x-1.5">
                                    <button 
                                      onClick={() => handleCertifyItem(item.id, 'APPROVE', 'Certified and approved')}
                                      className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-semibold"
                                    >
                                      Approve
                                    </button>
                                    <button 
                                      onClick={() => handleCertifyItem(item.id, 'REVOKE', 'Revoked due to lack of need')}
                                      className="bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded text-[10px] font-semibold"
                                    >
                                      Revoke
                                    </button>
                                  </div>
                                </div>
                              ))}
                            {reviewItems.filter(item => item.reviewId === campaign.id && item.status === 'PENDING').length === 0 && (
                              <div className="text-center text-slate-400 py-4">No pending certification items. This campaign is fully certified.</div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* SESSIONS & AUDITS TAB */}
          {activeSubTab === 'sessions' && (
            <div className="space-y-6">
              {/* Active authentication sessions buffer */}
              <div className="space-y-3">
                <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Fingerprint className="w-5 h-5 text-sky-600" />
                  Active Session Buffers (Administrative Kill-Switch)
                </h3>

                <div className="overflow-x-auto border border-slate-200 rounded-lg">
                  <table className="w-full text-left border-collapse text-sm text-slate-700">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        <th className="px-6 py-3">User</th>
                        <th className="px-6 py-3">IP Address</th>
                        <th className="px-6 py-3">Login Timestamp</th>
                        <th className="px-6 py-3">Last Activity</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3 text-right">Emergency Revocation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {activeSessions.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                            No active authentication session records tracked.
                          </td>
                        </tr>
                      ) : (
                        activeSessions.map(session => (
                          <tr key={session.id}>
                            <td className="px-6 py-4">
                              <div className="font-semibold text-slate-900">{session.userEmail}</div>
                              <div className="text-xs text-slate-400">ID: {session.id}</div>
                            </td>
                            <td className="px-6 py-4 text-xs font-mono">{session.ipAddress || '127.0.0.1'}</td>
                            <td className="px-6 py-4 text-xs">{new Date(session.loginTimestamp).toLocaleString()}</td>
                            <td className="px-6 py-4 text-xs">{new Date(session.lastActivity).toLocaleString()}</td>
                            <td className="px-6 py-4">
                              <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-xs font-semibold">
                                {session.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              {session.status === 'ACTIVE' && (
                                <button 
                                  onClick={() => handleRevokeSession(session.id)}
                                  className="text-xs bg-red-50 hover:bg-red-100 text-red-700 border border-red-100 px-2.5 py-1 rounded-md transition"
                                >
                                  Kill Session
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Real-time administrative Audit Trails */}
              <div className="space-y-3 pt-4 border-t border-slate-200">
                <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <History className="w-5 h-5 text-sky-600" />
                  Immutable Security Audit Trails (Last 50 Logs)
                </h3>

                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 max-h-[350px] overflow-y-auto space-y-2">
                  {auditLogs.length === 0 ? (
                    <div className="text-center text-slate-400 py-12">No audit logs recorded for this tenant.</div>
                  ) : (
                    auditLogs.map((log: any) => (
                      <div key={log.id} className="bg-white p-3 rounded border border-slate-200 text-xs flex justify-between items-start gap-4 hover:shadow-sm transition">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-800 uppercase bg-slate-100 px-1.5 py-0.5 rounded">
                              {log.action}
                            </span>
                            <span className="text-slate-400 font-mono text-[10px]">ID: {log.id}</span>
                          </div>
                          <p className="text-slate-700 mt-1 font-medium">{log.notes || 'No description notes.'}</p>
                          <div className="text-slate-500 mt-1 flex items-center gap-2 text-[10px]">
                            <span>Actor: {log.userDisplayName} ({log.userEmail})</span>
                            <span>•</span>
                            <span>IP: {log.ipAddress}</span>
                          </div>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono whitespace-nowrap">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* STATUS TRANSITION REASON MODAL */}
      {lifecycleAction && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-xl border border-slate-200 max-w-md w-full shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-rose-600 font-bold">
              <ShieldAlert className="w-5 h-5" />
              Administrative Consensus Required
            </div>
            
            <p className="text-sm text-slate-600">
              You are about to perform action <span className="font-bold text-slate-900">"{lifecycleAction}"</span> on user <span className="font-bold text-slate-900">{selectedUser.displayName}</span>. Please specify the required audit reason.
            </p>

            <div className="space-y-3">
              {lifecycleAction === 'REVOKE_ROLE' ? (
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Target Role to Revoke</label>
                  <select 
                    value={targetRoleAssignmentId}
                    onChange={(e) => setTargetRoleAssignmentId(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:outline-none"
                  >
                    <option value="">-- Select Active Assignment --</option>
                    {(selectedUser.roleAssignments || []).map(ra => (
                      <option key={ra.id} value={ra.id}>{ra.roleCode} ({ra.tenantId})</option>
                    ))}
                  </select>
                </div>
              ) : null}

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Audit Consensus Reason</label>
                <textarea 
                  value={actionReason}
                  onChange={(e) => setActionReason(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:outline-none min-h-[80px]"
                  placeholder="e.g., Compliance audit de-provisioning, role changed due to department transfer."
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button 
                onClick={() => { setSelectedUser(null); setLifecycleAction(null); setActionReason(''); }}
                className="bg-slate-50 hover:bg-slate-100 text-slate-700 px-4 py-2 rounded-lg text-sm transition"
              >
                Cancel
              </button>
              <button 
                onClick={lifecycleAction === 'REVOKE_ROLE' ? handleRevokeRole : handleUserStatusTransition}
                disabled={!actionReason.trim() || (lifecycleAction === 'REVOKE_ROLE' && !targetRoleAssignmentId)}
                className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition disabled:opacity-50"
              >
                Sign & Authorize Action
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ISSUE TEMP ACCESS MODAL */}
      {showTempModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-xl border border-slate-200 max-w-md w-full shadow-xl space-y-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
              <Key className="w-5 h-5 text-sky-600" />
              Issue Auto-Expiring Privilege Grant
            </h3>

            <div className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Target User</label>
                <select 
                  value={tempUserId}
                  onChange={(e) => setTempUserId(e.target.value)}
                  className="w-full border border-slate-200 p-2 rounded-lg"
                >
                  <option value="">-- Select Candidate User --</option>
                  {allUsers.map(usr => (
                    <option key={usr.id} value={usr.id}>{usr.displayName} ({usr.email})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Assigned Temporary Role</label>
                <select 
                  value={tempRoleCode}
                  onChange={(e) => setTempRoleCode(e.target.value)}
                  className="w-full border border-slate-200 p-2 rounded-lg"
                >
                  <option value="">-- Select Role --</option>
                  <option value="institution_manager">INSTITUTION MANAGER</option>
                  <option value="campus_administrator">CAMPUS ADMINISTRATOR</option>
                  <option value="finance_manager">FINANCE MANAGER</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Expiration Timestamp</label>
                <input 
                  type="datetime-local" 
                  value={tempUntil}
                  onChange={(e) => setTempUntil(e.target.value)}
                  className="w-full border border-slate-200 p-2 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Consensus Reason</label>
                <input 
                  type="text" 
                  value={actionReason}
                  onChange={(e) => setActionReason(e.target.value)}
                  className="w-full border border-slate-200 p-2 rounded-lg"
                  placeholder="e.g. Temporary assistance during admissions window"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowTempModal(false)} className="bg-slate-50 px-4 py-2 rounded-lg text-sm">Cancel</button>
              <button 
                onClick={handleCreateTempGrant}
                disabled={!tempUserId || !tempRoleCode || !tempUntil || !actionReason.trim()}
                className="bg-sky-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition disabled:opacity-50"
              >
                Issue Grant
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LAUNCH REVIEW CAMPAIGN MODAL */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-xl border border-slate-200 max-w-md w-full shadow-xl space-y-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
              <ClipboardCheck className="w-5 h-5 text-sky-600" />
              Launch Access Review Campaign
            </h3>

            <div className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Campaign Title</label>
                <input 
                  type="text" 
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  className="w-full border border-slate-200 p-2 rounded-lg"
                  placeholder="e.g. Q3 Comprehensive Permissions Audit"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Audit Subject Focus</label>
                <select 
                  value={reviewTargetType}
                  onChange={(e: any) => setReviewTargetType(e.target.value)}
                  className="w-full border border-slate-200 p-2 rounded-lg"
                >
                  <option value="USERS">All active users status</option>
                  <option value="ROLES">Active role allocations</option>
                  <option value="MODULES">Active module extensions</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowReviewModal(false)} className="bg-slate-50 px-4 py-2 rounded-lg text-sm">Cancel</button>
              <button 
                onClick={handleLaunchReview}
                disabled={!reviewTitle.trim()}
                className="bg-sky-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition disabled:opacity-50"
              >
                Launch Campaign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default AccessGovernanceWorkspace;
