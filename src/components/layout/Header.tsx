import React, { useState } from 'react';
import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '../../context/NavigationContext';
import { 
  Menu,
  Search, 
  Bell, 
  Mail, 
  MessageSquare,
  User, 
  Settings, 
  Power,
  ChevronDown, 
  Check, 
  Building2, 
  ShieldCheck, 
  FolderTree,
  Star,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { DynamicIcon } from './DynamicIcon';

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { tenants, currentTenant, switchTenant } = useTenant();
  const { currentUser, activeRoleAssignment, allUsers, switchPersona } = useAuth();
  const { 
    searchQuery, 
    setSearchQuery, 
    searchResults, 
    activeTab,
    setActiveTab, 
    toggleSidebarCollapse 
  } = useNavigation();
  
  const [showTenantMenu, setShowTenantMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showMailModal, setShowMailModal] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [personaSearch, setPersonaSearch] = useState('');

  return (
    <header className="h-14 bg-white border-b border-slate-200/90 px-4 sm:px-6 flex items-center justify-between shadow-2xs z-30 sticky top-0">
      {/* LEFT ZONE: Hamburger + Dynamic Search Input */}
      <div className="flex items-center gap-4 flex-1 max-w-lg">
        <button 
          onClick={onToggleSidebar || toggleSidebarCollapse}
          className="p-1.5 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
          title="Toggle Navigation"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5 text-slate-600" />
        </button>

        {/* Global Navigation & Workspace Search */}
        <div className="relative w-full max-w-sm">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            placeholder="Search menus, features, records... (Ctrl+K)"
            className="w-full bg-[#f4f7fa] hover:bg-[#eef2f6] focus:bg-white text-xs text-slate-800 placeholder-slate-400 pl-3 pr-8 py-1.5 rounded-full border border-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500 transition-all"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />

          {/* Autocomplete Search Results Dropdown */}
          {isSearchFocused && searchResults.length > 0 && (
            <div className="absolute top-full left-0 mt-1.5 w-full bg-white rounded-xl shadow-2xl border border-slate-200 py-1.5 z-50 max-h-80 overflow-y-auto">
              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Accessible Navigation ({searchResults.length})
              </div>
              {searchResults.map((result, idx) => (
                <button
                  key={`${result.item.id}_${idx}`}
                  onMouseDown={() => {
                    if (result.item.route) {
                      setActiveTab(result.item.route);
                      setSearchQuery('');
                    }
                  }}
                  className="w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-sky-50 transition-colors border-b border-slate-50 last:border-0 cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <DynamicIcon name={result.item.icon} className="w-4 h-4 text-sky-600 shrink-0" />
                    <div className="truncate">
                      <p className="font-semibold text-slate-800 truncate">{result.item.label}</p>
                      <p className="text-[10px] text-slate-400 truncate">
                        {result.breadcrumbs.join(' → ')}
                      </p>
                    </div>
                  </div>
                  {result.item.badge && (
                    <span className="px-1.5 py-0.5 text-[9px] font-bold bg-sky-100 text-sky-700 rounded-full">
                      {result.item.badge.text}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT ZONE: Quick Action Options (User, Messages, Noticeboard, Settings), Badges, Tenant Switcher, Profile */}
      <div className="flex items-center gap-1.5 sm:gap-3">
        {/* Educational Tenant Selector */}
        <div className="relative hidden md:block">
          <button
            onClick={() => setShowTenantMenu(!showTenantMenu)}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold bg-slate-50 text-slate-700 rounded-full hover:bg-slate-100 transition-colors border border-slate-200 cursor-pointer"
          >
            <Building2 className="w-3.5 h-3.5 text-slate-500" />
            <span className="max-w-[130px] truncate">{currentTenant?.name}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showTenantMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowTenantMenu(false)} />
              <div className="absolute top-full right-0 mt-1.5 w-64 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-1 divide-y divide-slate-100">
                <div className="px-3 py-2 text-2xs font-semibold text-slate-400 uppercase tracking-wider">
                  Select Educational Tenant
                </div>
                <div className="py-1 max-h-56 overflow-y-auto">
                  {tenants.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        switchTenant(t.id);
                        setShowTenantMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer ${
                        currentTenant?.id === t.id ? 'font-bold text-sky-600 bg-sky-50/50' : 'text-slate-700'
                      }`}
                    >
                      <div className="truncate">
                        <p className="truncate font-semibold">{t.name}</p>
                        <p className="text-2xs text-slate-400">{t.code} • {t.type?.replace('_', ' ') || 'Unknown'}</p>
                      </div>
                      {currentTenant?.id === t.id && <Check className="w-4 h-4 shrink-0 text-sky-600" />}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Quick Action Options Toolbar in Header */}
        <div className="flex items-center gap-1 sm:gap-1.5 bg-slate-50/80 p-1 rounded-full border border-slate-200/80">
          {/* Quick Option 1: User Profile / Directory */}
          <button
            onClick={() => setActiveTab('users')}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              activeTab === 'users'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
            }`}
            title="User Profile & Directory"
            aria-label="User Profile"
          >
            <User className="w-4 h-4" />
          </button>

          {/* Quick Option 2: Email Messages / Inbox */}
          <div className="relative">
            <button 
              onClick={() => setActiveTab('inbox')}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all relative cursor-pointer ${
                activeTab === 'inbox'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
              }`}
              title="Email Messages & Inbox"
              aria-label="Email Messages"
            >
              <Mail className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#4caf50] ring-2 ring-white" />
            </button>
          </div>

          {/* Quick Option 3: Discussions & Noticeboard */}
          <button
            onClick={() => setActiveTab('noticeboard')}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              activeTab === 'noticeboard'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
            }`}
            title="Discussions & Noticeboard"
            aria-label="Discussions & Noticeboard"
          >
            <MessageSquare className="w-4 h-4" />
          </button>

          {/* Quick Option 4: Settings */}
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
            }`}
            title="System & Tenant Settings"
            aria-label="System Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

        {/* Notifications Bell Icon with Pink Badge */}
        <div className="relative">
          <button 
            onClick={() => setShowNotificationModal(!showNotificationModal)}
            className="w-8 h-8 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-100 flex items-center justify-center transition-colors relative cursor-pointer"
            title="System Notifications"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4 text-slate-600" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#ff4081] ring-2 ring-white" />
          </button>

          {showNotificationModal && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotificationModal(false)} />
              <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="font-bold text-xs text-slate-800">Notifications</h4>
                  <span className="text-2xs text-sky-600 font-semibold cursor-pointer">Mark all as read</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 bg-blue-50/70 rounded-lg text-slate-700">
                    <p className="font-semibold text-slate-800 text-xs">Role assignments synced</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Dynamic workspace updated</p>
                  </div>
                  <div className="p-2.5 bg-emerald-50/70 rounded-lg text-slate-700">
                    <p className="font-semibold text-slate-800 text-xs">Navigation Policy Engine</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Phase 4 Engine Active</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            title="User Account"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden ring-1 ring-slate-300">
              <img 
                src={currentUser?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"} 
                alt={currentUser?.displayName || "John Doe"} 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xs font-semibold text-slate-700 hidden sm:inline-block">
              {currentUser?.displayName?.split(' ')[0] || 'John'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showUserMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
              <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 divide-y divide-slate-100">
                <div className="p-4 bg-slate-50/70">
                  <p className="text-xs font-bold text-slate-900">{currentUser?.displayName || 'John Doe'}</p>
                  <p className="text-2xs text-slate-500">{currentUser?.email}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    {currentUser?.roleAssignments?.map((ra, i) => (
                      <Badge key={i} variant={i === 0 ? 'primary' : 'neutral'} size="sm">
                        {ra.roleName}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="p-2">
                  <div className="flex items-center justify-between px-2 py-1">
                    <p className="text-3xs font-bold text-slate-400 uppercase tracking-wider">
                      Switch Test Persona ({allUsers.length})
                    </p>
                  </div>
                  <input
                    type="text"
                    value={personaSearch}
                    onChange={(e) => setPersonaSearch(e.target.value)}
                    placeholder="Search persona or role..."
                    className="w-full text-xs px-2.5 py-1 mb-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                  <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
                    {allUsers
                      .filter(u => {
                        if (!personaSearch.trim()) return true;
                        const q = personaSearch.toLowerCase();
                        const rolesStr = u.roleAssignments.map(r => r.roleName + ' ' + r.roleCode).join(' ').toLowerCase();
                        return u.displayName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || rolesStr.includes(q);
                      })
                      .map((u) => {
                        const rolesList = u.roleAssignments.map(r => r.roleName).join(' + ') || 'User';
                        const isSelected = currentUser?.id === u.id;
                        return (
                          <button
                            key={u.id}
                            onClick={() => {
                              switchPersona(u.id);
                              setShowUserMenu(false);
                            }}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-sky-50 text-sky-700 font-bold border border-sky-200'
                                : 'text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <div className="truncate pr-2">
                              <div className="flex items-center gap-1.5">
                                <p className="font-semibold text-xs truncate">{u.displayName}</p>
                                {u.isDemo && (
                                  <span className="text-[9px] px-1 py-0.2 rounded bg-amber-100 text-amber-800 font-bold shrink-0">DEMO</span>
                                )}
                              </div>
                              <p className="text-2xs text-slate-400 truncate">{rolesList}</p>
                            </div>
                            {isSelected && <Check className="w-3.5 h-3.5 text-sky-600 shrink-0" />}
                          </button>
                        );
                      })}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
