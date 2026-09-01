import React, { useState, useMemo } from 'react';
import { 
  FolderTree, 
  ShieldCheck, 
  Layers, 
  Sparkles, 
  Boxes, 
  Play, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Plus, 
  Trash2, 
  Eye, 
  RefreshCw, 
  Check, 
  ShieldAlert,
  GraduationCap,
  Users,
  Award,
  BookOpen,
  Sliders,
  Cpu,
  Lock,
  Unlock,
  Building,
  Briefcase
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTenant } from '../../context/TenantContext';
import { useNavigation } from '../../context/NavigationContext';
import { NavigationService } from '../../services/navigationService';
import { NavigationTestService, Phase4TestResult } from '../../services/navigationTestService';
import { SYSTEM_ROLES } from '../../config/permissions';
import { DynamicIcon } from '../layout/DynamicIcon';
import { Badge } from '../common/Badge';
import { NavigationItemDefinition, User } from '../../types';

export const NavigationEngineView: React.FC = () => {
  const { currentUser, userPermissions, effectiveRoleAssignments } = useAuth();
  const { currentTenant } = useTenant();
  const { rawRegistry, registerPluginModule, unregisterPluginModule, refreshNavigation } = useNavigation();

  // Active Tab within Engine Inspector
  const [activeTab, setActiveTab] = useState<'simulator' | 'plugins' | 'registry' | 'tests'>('simulator');

  // Simulator State: Selected roles for role composition
  const [simulatedRoleCodes, setSimulatedRoleCodes] = useState<string[]>(['teacher', 'class_coordinator', 'exam_coordinator']);
  const [simulatedModules, setSimulatedModules] = useState<string[]>([
    'core', 'student', 'academic', 'attendance', 'teacher', 'timetable', 
    'lesson_planning', 'assignments', 'assessment', 'examination', 'report_card', 'promotion'
  ]);
  const [searchFilter, setSearchFilter] = useState('');

  // Automated Tests State
  const [testResults, setTestResults] = useState<Phase4TestResult[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);

  // Plugin state tracking
  const [installedPlugins, setInstalledPlugins] = useState<Record<string, boolean>>({
    smart_classroom: false,
    lms: false,
    government: false,
    finance_hr: false
  });

  // Calculate simulated effective permissions
  const simulatedPermissions = useMemo(() => {
    const perms = new Set<string>();
    simulatedRoleCodes.forEach(code => {
      const role = SYSTEM_ROLES.find(r => r.code === code);
      if (role) {
        role.permissions.forEach(p => perms.add(p));
      }
    });
    return Array.from(perms);
  }, [simulatedRoleCodes]);

  // Calculate simulated navigation tree
  const simulatedTree = useMemo(() => {
    const now = new Date().toISOString();
    const mockUser: User = {
      id: 'sim_user',
      defaultTenantId: currentTenant?.id || 'tenant_dps_delhi',
      email: 'simulation@school.edu',
      displayName: 'Simulated User',
      status: 'active',
      isPlatformSuperAdmin: simulatedRoleCodes.includes('super_admin'),
      roleAssignments: simulatedRoleCodes.map((code, idx) => ({
        id: `sim_ra_${idx}`,
        userId: 'sim_user',
        tenantId: currentTenant?.id || 'tenant_dps_delhi',
        roleId: `role_${code}`,
        roleCode: code,
        roleName: SYSTEM_ROLES.find(r => r.code === code)?.name || code,
        scopes: [{ type: 'institution', value: currentTenant?.id || 'tenant_dps_delhi' }],
        assignedAt: now,
        assignedBy: 'System'
      })),
      createdAt: now,
      updatedAt: now
    };

    return NavigationService.getEffectiveNavigationTree(
      mockUser,
      mockUser.roleAssignments,
      simulatedModules
    );
  }, [simulatedRoleCodes, simulatedModules, currentTenant]);

  const toggleSimRole = (code: string) => {
    setSimulatedRoleCodes(prev => 
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };

  const toggleSimModule = (mod: string) => {
    setSimulatedModules(prev => 
      prev.includes(mod) ? prev.filter(m => m !== mod) : [...prev, mod]
    );
  };

  // Run Phase 4 Automated Verification Suite
  const runVerificationSuite = async () => {
    setIsRunningTests(true);
    setTestResults([]);
    try {
      const results = await NavigationTestService.runPhase4VerificationSuite((res) => {
        setTestResults(prev => {
          const idx = prev.findIndex(r => r.id === res.id);
          if (idx >= 0) {
            const copy = [...prev];
            copy[idx] = res;
            return copy;
          }
          return [...prev, res];
        });
      });
      setTestResults(results);
    } catch (e) {
      console.error(e);
    } finally {
      setIsRunningTests(false);
    }
  };

  // Plugin dynamic installation demos
  const handleTogglePlugin = (pluginKey: string) => {
    const currentState = installedPlugins[pluginKey];
    if (currentState) {
      // Unregister
      unregisterPluginModule(pluginKey);
      setInstalledPlugins(prev => ({ ...prev, [pluginKey]: false }));
      setSimulatedModules(prev => prev.filter(m => m !== pluginKey));
    } else {
      // Register plugin items
      let items: NavigationItemDefinition[] = [];
      if (pluginKey === 'smart_classroom') {
        items = [
          {
            id: 'nav_smart_classroom_header',
            moduleId: 'smart_classroom',
            label: '-- Smart Campus & IoT',
            sortOrder: 185,
            status: 'active',
            isSectionHeader: true
          },
          {
            id: 'nav_smart_classroom_devices',
            moduleId: 'smart_classroom',
            label: 'IoT Interactive Displays',
            icon: 'Cpu',
            route: 'smart_classroom',
            sortOrder: 186,
            status: 'active',
            badge: { text: 'IoT Active', variant: 'pink' }
          },
          {
            id: 'nav_smart_cctv',
            moduleId: 'smart_classroom',
            label: 'AI Attendance Cameras',
            icon: 'Eye',
            route: 'smart_classroom',
            sortOrder: 187,
            status: 'active'
          }
        ];
      } else if (pluginKey === 'lms') {
        items = [
          {
            id: 'nav_lms_header',
            moduleId: 'lms',
            label: '-- LMS & Online Learning',
            sortOrder: 190,
            status: 'active',
            isSectionHeader: true
          },
          {
            id: 'nav_lms_courses',
            moduleId: 'lms',
            label: 'Course Catalog & Video',
            icon: 'BookOpen',
            route: 'lesson_planning',
            sortOrder: 191,
            status: 'active',
            badge: { text: 'LMS Pro', variant: 'emerald' }
          }
        ];
      } else if (pluginKey === 'government') {
        items = [
          {
            id: 'nav_govt_header',
            moduleId: 'government',
            label: '-- Government Oversight',
            sortOrder: 390,
            status: 'active',
            isSectionHeader: true
          },
          {
            id: 'nav_govt_compliance',
            moduleId: 'government',
            label: 'National Compliance Audit',
            icon: 'Building',
            route: 'audit',
            sortOrder: 391,
            status: 'active',
            badge: { text: 'Govt EDI', variant: 'amber' }
          }
        ];
      } else if (pluginKey === 'finance_hr') {
        items = [
          {
            id: 'nav_finance_header',
            moduleId: 'finance_hr',
            label: '-- Enterprise HR & Payroll',
            sortOrder: 350,
            status: 'active',
            isSectionHeader: true
          },
          {
            id: 'nav_hr_payroll',
            moduleId: 'finance_hr',
            label: 'Biometric Payroll & Tax',
            icon: 'Briefcase',
            route: 'accounting',
            sortOrder: 351,
            status: 'active',
            badge: { text: 'ERP', variant: 'sky' }
          }
        ];
      }

      registerPluginModule(pluginKey, items);
      setInstalledPlugins(prev => ({ ...prev, [pluginKey]: true }));
      setSimulatedModules(prev => [...prev, pluginKey]);
    }
  };

  const allAvailableModules = [
    { code: 'core', label: 'Core System' },
    { code: 'student', label: 'Student Management' },
    { code: 'academic', label: 'Academic Hierarchy' },
    { code: 'teacher', label: 'Faculty Management' },
    { code: 'timetable', label: 'Timetable Master' },
    { code: 'lesson_planning', label: 'Lesson Planning' },
    { code: 'assignments', label: 'Homework & Tasks' },
    { code: 'assessment', label: 'CCE Assessments' },
    { code: 'examination', label: 'Exams & Marks' },
    { code: 'report_card', label: 'Report Cards' },
    { code: 'promotion', label: 'Student Promotion' },
    { code: 'attendance', label: 'Attendance Registry' },
    { code: 'fees', label: 'Fees & Accounting' },
    { code: 'library', label: 'Library Catalog' },
    { code: 'transport', label: 'Transportation' }
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#20293a] text-white p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sky-400 font-semibold text-xs uppercase tracking-wider">
            <FolderTree className="w-4 h-4" />
            <span>EMS Platform Core • Phase 4 Engine</span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">
            Dynamic Role-Based Navigation & Workspace Engine
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl mt-1">
            Permission-aware, module-gated, multi-role compositional navigation engine. Renders personalized, zero-duplicate workspaces for any combination of roles and active tenant modules.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={runVerificationSuite}
            disabled={isRunningTests}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-900/30 transition-all cursor-pointer disabled:opacity-50"
          >
            {isRunningTests ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
            <span>Run Phase 4 Verification Suite</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveTab('simulator')}
          className={`px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'simulator'
              ? 'bg-sky-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Role Composition Simulator</span>
        </button>

        <button
          onClick={() => setActiveTab('plugins')}
          className={`px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'plugins'
              ? 'bg-sky-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Boxes className="w-4 h-4" />
          <span>Plug-and-Play Module API</span>
          {Object.values(installedPlugins).some(Boolean) && (
            <span className="w-2 h-2 rounded-full bg-pink-500 ring-2 ring-white" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('registry')}
          className={`px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'registry'
              ? 'bg-sky-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Centralized Registry ({rawRegistry.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('tests')}
          className={`px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'tests'
              ? 'bg-sky-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Automated Verification Suite</span>
          {testResults.length > 0 && (
            <Badge variant="success" size="sm">
              {testResults.filter(t => t.status === 'PASSED').length}/{testResults.length} Passed
            </Badge>
          )}
        </button>
      </div>

      {/* TAB 1: ROLE COMPOSITION SIMULATOR */}
      {activeTab === 'simulator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-5">
            {/* Roles Picker (Additive Union) */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <Users className="w-4 h-4 text-sky-600" />
                  Role Composition Matrix (Multi-Role)
                </h3>
                <span className="text-[11px] font-semibold text-slate-500">
                  {simulatedRoleCodes.length} active
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Select any combination of roles. The engine computes the mathematical union of permissions and renders the resulting unified navigation tree.
              </p>

              <div className="grid grid-cols-2 gap-1.5 max-h-56 overflow-y-auto pr-1">
                {SYSTEM_ROLES.map(role => {
                  const isChecked = simulatedRoleCodes.includes(role.code);
                  return (
                    <button
                      key={role.id}
                      onClick={() => toggleSimRole(role.code)}
                      className={`p-2 rounded-lg text-xs font-medium text-left flex items-center justify-between border transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-sky-50 border-sky-300 text-sky-900 font-bold shadow-2xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="truncate text-xs">{role.name}</span>
                      {isChecked && <Check className="w-3.5 h-3.5 text-sky-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Modules Picker */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <Boxes className="w-4 h-4 text-emerald-600" />
                  Tenant Module Status Simulator
                </h3>
                <span className="text-[11px] font-semibold text-slate-500">
                  {simulatedModules.length} enabled
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Toggle modules to verify dynamic item removal. Disabling a module instantly prunes its corresponding navigation subtrees.
              </p>

              <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto">
                {allAvailableModules.map(mod => {
                  const isEnabled = simulatedModules.includes(mod.code);
                  return (
                    <button
                      key={mod.code}
                      onClick={() => toggleSimModule(mod.code)}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer flex items-center gap-1.5 ${
                        isEnabled
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold'
                          : 'bg-slate-100 text-slate-500 border-slate-200 line-through'
                      }`}
                    >
                      <span>{mod.label}</span>
                      {isEnabled ? <Check className="w-3 h-3 text-emerald-600" /> : <Lock className="w-3 h-3 text-slate-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Computed Effective Permissions Summary */}
            <div className="bg-slate-900 text-white rounded-xl p-4 shadow-md space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between text-slate-400">
                <span>Effective Permissions Set:</span>
                <span className="text-sky-400 font-bold">{simulatedPermissions.length} permissions</span>
              </div>
              <div className="max-h-28 overflow-y-auto flex flex-wrap gap-1 text-[10px] text-slate-300 pt-1">
                {simulatedPermissions.map(p => (
                  <span key={p} className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Live Dynamic Workspace Preview */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">
                    Live Dynamic Workspace Preview
                  </h3>
                  <p className="text-xs text-slate-500">
                    Computed for {simulatedRoleCodes.map(c => SYSTEM_ROLES.find(r => r.code === c)?.name || c).join(' + ')}
                  </p>
                </div>
                <Badge variant="primary" size="sm">
                  {simulatedTree.length} Root Items
                </Badge>
              </div>

              {/* Sidebar Preview Box styled as Spice Theme */}
              <div className="bg-[#273246] rounded-xl p-3.5 border border-[#1e2738] text-slate-300 max-h-[500px] overflow-y-auto space-y-1 text-xs">
                {simulatedTree.map(node => (
                  <div key={node.id}>
                    {node.isSectionHeader ? (
                      <div className="px-2 pt-3 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {node.label}
                      </div>
                    ) : (
                      <div className="px-3 py-2 bg-[#20293a]/80 hover:bg-[#20293a] rounded-lg flex items-center justify-between transition-colors">
                        <div className="flex items-center gap-2.5">
                          <DynamicIcon name={node.icon} className="w-4 h-4 text-sky-400 shrink-0" />
                          <span className="font-medium text-slate-200">{node.label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {node.badge && (
                            <span className="px-1.5 py-0.5 text-[9px] font-bold bg-[#ff4081] text-white rounded-full">
                              {node.badge.text}
                            </span>
                          )}
                          <span className="text-[10px] text-slate-500 font-mono">[{node.moduleId}]</span>
                        </div>
                      </div>
                    )}

                    {node.children && node.children.length > 0 && (
                      <div className="pl-6 space-y-1 my-1 border-l border-slate-700/50 ml-3">
                        {node.children.map(child => (
                          <div key={child.id} className="px-2.5 py-1.5 bg-[#1c2433]/70 rounded flex items-center justify-between text-[11px]">
                            <div className="flex items-center gap-2">
                              <DynamicIcon name={child.icon} className="w-3.5 h-3.5 text-slate-400" />
                              <span className="text-slate-300">{child.label}</span>
                            </div>
                            <span className="text-[9px] text-slate-500 font-mono">[{child.moduleId}]</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PLUG-AND-PLAY MODULE REGISTRATION API */}
      {activeTab === 'plugins' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Boxes className="w-5 h-5 text-sky-600" />
                Plug-and-Play Module Registration Architecture
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
                Future modules (Smart Classroom, NextGen LMS, Government Portals, Finance Suites) can be plugged into EMS dynamically without touching core sidebar code. Click below to test runtime module registration and observe live navigation tree expansion.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Plugin 1: Smart Classroom IoT */}
              <div className={`p-4 rounded-xl border transition-all ${
                installedPlugins.smart_classroom ? 'bg-pink-50/50 border-pink-300' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-pink-100 text-pink-600 flex items-center justify-center">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Smart Classroom & IoT Module</h4>
                      <p className="text-[11px] text-slate-500">Interactive boards, AI camera attendance, smart sensors</p>
                    </div>
                  </div>
                  <Badge variant={installedPlugins.smart_classroom ? 'pink' : 'neutral'} size="sm">
                    {installedPlugins.smart_classroom ? 'Registered & Live' : 'Unregistered'}
                  </Badge>
                </div>

                <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-200/60">
                  <span className="text-[10px] text-slate-400 font-mono">Module ID: smart_classroom</span>
                  <button
                    onClick={() => handleTogglePlugin('smart_classroom')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      installedPlugins.smart_classroom
                        ? 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                        : 'bg-pink-600 text-white hover:bg-pink-700 shadow-sm'
                    }`}
                  >
                    {installedPlugins.smart_classroom ? 'Unregister Module' : 'Register Module Navigation'}
                  </button>
                </div>
              </div>

              {/* Plugin 2: LMS Pro */}
              <div className={`p-4 rounded-xl border transition-all ${
                installedPlugins.lms ? 'bg-emerald-50/50 border-emerald-300' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">NextGen LMS & Video Classroom</h4>
                      <p className="text-[11px] text-slate-500">Online lecture streaming, interactive SCORM courses</p>
                    </div>
                  </div>
                  <Badge variant={installedPlugins.lms ? 'success' : 'neutral'} size="sm">
                    {installedPlugins.lms ? 'Registered & Live' : 'Unregistered'}
                  </Badge>
                </div>

                <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-200/60">
                  <span className="text-[10px] text-slate-400 font-mono">Module ID: lms</span>
                  <button
                    onClick={() => handleTogglePlugin('lms')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      installedPlugins.lms
                        ? 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'
                    }`}
                  >
                    {installedPlugins.lms ? 'Unregister Module' : 'Register Module Navigation'}
                  </button>
                </div>
              </div>

              {/* Plugin 3: Government Portal */}
              <div className={`p-4 rounded-xl border transition-all ${
                installedPlugins.government ? 'bg-amber-50/50 border-amber-300' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                      <Building className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Government Oversight & Inspection</h4>
                      <p className="text-[11px] text-slate-500">Ministry audits, regulatory compliance, national KPI telemetry</p>
                    </div>
                  </div>
                  <Badge variant={installedPlugins.government ? 'warning' : 'neutral'} size="sm">
                    {installedPlugins.government ? 'Registered & Live' : 'Unregistered'}
                  </Badge>
                </div>

                <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-200/60">
                  <span className="text-[10px] text-slate-400 font-mono">Module ID: government</span>
                  <button
                    onClick={() => handleTogglePlugin('government')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      installedPlugins.government
                        ? 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                        : 'bg-amber-600 text-white hover:bg-amber-700 shadow-sm'
                    }`}
                  >
                    {installedPlugins.government ? 'Unregister Module' : 'Register Module Navigation'}
                  </button>
                </div>
              </div>

              {/* Plugin 4: Finance & Payroll Suite */}
              <div className={`p-4 rounded-xl border transition-all ${
                installedPlugins.finance_hr ? 'bg-sky-50/50 border-sky-300' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Enterprise HR & Payroll Suite</h4>
                      <p className="text-[11px] text-slate-500">Tax deductions, direct salary disbursal, ledger reconciliation</p>
                    </div>
                  </div>
                  <Badge variant={installedPlugins.finance_hr ? 'primary' : 'neutral'} size="sm">
                    {installedPlugins.finance_hr ? 'Registered & Live' : 'Unregistered'}
                  </Badge>
                </div>

                <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-200/60">
                  <span className="text-[10px] text-slate-400 font-mono">Module ID: finance_hr</span>
                  <button
                    onClick={() => handleTogglePlugin('finance_hr')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      installedPlugins.finance_hr
                        ? 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                        : 'bg-sky-600 text-white hover:bg-sky-700 shadow-sm'
                    }`}
                  >
                    {installedPlugins.finance_hr ? 'Unregister Module' : 'Register Module Navigation'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CENTRALIZED REGISTRY TABLE */}
      {activeTab === 'registry' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Centralized Navigation Registry ({rawRegistry.length} Registered Definitions)
            </h3>
            <input
              type="text"
              placeholder="Filter by label or module..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="text-xs px-3 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 w-64"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/70 text-slate-600 font-bold border-b border-slate-200">
                  <th className="py-2.5 px-4">Menu Label</th>
                  <th className="py-2.5 px-4">Module ID</th>
                  <th className="py-2.5 px-4">Route ID</th>
                  <th className="py-2.5 px-4">Required Permission(s)</th>
                  <th className="py-2.5 px-4">Order</th>
                  <th className="py-2.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rawRegistry
                  .filter(item => 
                    item.label.toLowerCase().includes(searchFilter.toLowerCase()) || 
                    item.moduleId.toLowerCase().includes(searchFilter.toLowerCase())
                  )
                  .map(item => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-4 font-semibold text-slate-800 flex items-center gap-2">
                        <DynamicIcon name={item.icon} className="w-4 h-4 text-slate-500" />
                        <span>{item.label}</span>
                        {item.badge && (
                          <span className="px-1.5 py-0.2 text-[9px] font-bold bg-sky-100 text-sky-700 rounded-full">
                            {item.badge.text}
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-4 font-mono text-slate-600">{item.moduleId}</td>
                      <td className="py-2.5 px-4 font-mono text-slate-500">{item.route || '—'}</td>
                      <td className="py-2.5 px-4 text-slate-600 font-mono text-[11px]">
                        {item.requiredPermission 
                          ? (Array.isArray(item.requiredPermission) ? item.requiredPermission.join(', ') : item.requiredPermission)
                          : 'None (Public)'}
                      </td>
                      <td className="py-2.5 px-4 font-mono text-slate-500">{item.sortOrder}</td>
                      <td className="py-2.5 px-4">
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[10px] font-bold">
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: AUTOMATED TEST RUNNER */}
      {activeTab === 'tests' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Phase 4 Automated Verification Test Suite
              </h3>
              <p className="text-xs text-slate-500">
                Automated tests verifying multi-role composition, parent auto-hiding, module gating, route guards, and dynamic registration.
              </p>
            </div>
            <button
              onClick={runVerificationSuite}
              disabled={isRunningTests}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow transition-colors cursor-pointer disabled:opacity-50"
            >
              {isRunningTests ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
              <span>Execute Verification Tests</span>
            </button>
          </div>

          {testResults.length === 0 && !isRunningTests && (
            <div className="p-12 text-center bg-white rounded-xl border border-slate-200 text-slate-400 space-y-2">
              <ShieldCheck className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-sm font-semibold text-slate-600">Tests Ready to Run</p>
              <p className="text-xs text-slate-400">Click "Execute Verification Tests" to validate all Phase 4 technical engine requirements.</p>
            </div>
          )}

          {testResults.length > 0 && (
            <div className="space-y-3">
              {testResults.map(test => (
                <div 
                  key={test.id}
                  className={`p-4 rounded-xl border transition-all ${
                    test.status === 'PASSED'
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : test.status === 'FAILED'
                      ? 'bg-rose-50/40 border-rose-200'
                      : 'bg-blue-50/40 border-blue-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {test.status === 'PASSED' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                        {test.status === 'FAILED' && <XCircle className="w-5 h-5 text-rose-600" />}
                        {test.status === 'RUNNING' && <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{test.title}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/80 text-slate-600 border border-slate-200">
                            {test.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{test.description}</p>
                        {test.details && (
                          <p className="text-xs text-emerald-800 font-medium mt-1 bg-white/60 p-2 rounded border border-emerald-100">
                            {test.details}
                          </p>
                        )}
                        {test.error && (
                          <p className="text-xs text-rose-800 font-medium mt-1 bg-white/60 p-2 rounded border border-rose-100">
                            Error: {test.error}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0">
                      {test.durationMs}ms
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
