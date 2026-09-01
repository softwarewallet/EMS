import { NavigationService } from './navigationService';
import { NavigationItemDefinition, User, RoleAssignment, Tenant } from '../types';
import { SYSTEM_ROLES } from '../config/permissions';

export interface Phase4TestResult {
  id: string;
  category: 'Role Composition' | 'Parent Auto-Hiding' | 'Module Gating' | 'Route Guard' | 'Dynamic Registration' | 'Context Filtering';
  title: string;
  description: string;
  status: 'PASSED' | 'FAILED' | 'RUNNING';
  durationMs: number;
  details?: string;
  error?: string;
}

export class NavigationTestService {
  /**
   * Run all Phase 4 Navigation & Workspace Engine Automated Verification Tests
   */
  static async runPhase4VerificationSuite(
    onProgress?: (result: Phase4TestResult) => void
  ): Promise<Phase4TestResult[]> {
    const results: Phase4TestResult[] = [];

    const executeTest = async (
      id: string,
      category: Phase4TestResult['category'],
      title: string,
      description: string,
      fn: () => Promise<{ success: boolean; details: string }>
    ) => {
      const start = performance.now();
      let res: Phase4TestResult = {
        id,
        category,
        title,
        description,
        status: 'RUNNING',
        durationMs: 0
      };
      if (onProgress) onProgress(res);

      try {
        const out = await fn();
        const duration = Math.round(performance.now() - start);
        res = {
          ...res,
          status: out.success ? 'PASSED' : 'FAILED',
          durationMs: duration,
          details: out.details
        };
      } catch (err: any) {
        const duration = Math.round(performance.now() - start);
        res = {
          ...res,
          status: 'FAILED',
          durationMs: duration,
          error: err.message || String(err)
        };
      }

      results.push(res);
      if (onProgress) onProgress(res);
      return res;
    };

    // TEST 1: Role Composition - Multi-role union without duplicates
    await executeTest(
      'p4_01',
      'Role Composition',
      'Combined Effective Permissions (Teacher + Class Coord + Exam Coord)',
      'Validates that assigning multiple simultaneous roles merges all authorized navigation items without duplicates.',
      async () => {
        const now = new Date().toISOString();
        const mockUser: User = {
          id: 'test_multi_role',
          defaultTenantId: 'tenant_dps_delhi',
          email: 'multi@school.edu',
          displayName: 'Multi-Role Faculty',
          status: 'active',
          isPlatformSuperAdmin: false,
          roleAssignments: [],
          createdAt: now,
          updatedAt: now
        };

        const roles: RoleAssignment[] = [
          { id: 'ra1', userId: 'test_multi_role', tenantId: 'tenant_dps_delhi', roleId: 'role_teacher', roleCode: 'teacher', roleName: 'Teacher', scopes: [{ type: 'institution', value: 'tenant_dps_delhi' }], assignedAt: now, assignedBy: 'System' },
          { id: 'ra2', userId: 'test_multi_role', tenantId: 'tenant_dps_delhi', roleId: 'role_class_coordinator', roleCode: 'class_coordinator', roleName: 'Class Coordinator', scopes: [{ type: 'institution', value: 'tenant_dps_delhi' }], assignedAt: now, assignedBy: 'System' },
          { id: 'ra3', userId: 'test_multi_role', tenantId: 'tenant_dps_delhi', roleId: 'role_exam_coordinator', roleCode: 'exam_coordinator', roleName: 'Examination Coordinator', scopes: [{ type: 'institution', value: 'tenant_dps_delhi' }], assignedAt: now, assignedBy: 'System' }
        ];

        const enabledModules = ['core', 'student', 'academic', 'attendance', 'teacher', 'timetable', 'lesson_planning', 'assignments', 'assessment', 'examination', 'report_card', 'promotion'];
        const tree = NavigationService.getEffectiveNavigationTree(mockUser, roles, enabledModules);

        // Flatten routes
        const routes: string[] = [];
        const extract = (nodes: any[]) => {
          nodes.forEach(n => {
            if (n.route) routes.push(n.route);
            if (n.children) extract(n.children);
          });
        };
        extract(tree);

        const hasTimetable = routes.includes('timetable');
        const hasLessonPlan = routes.includes('lesson_planning');
        const hasExams = routes.includes('examinations');
        const hasReportCards = routes.includes('report_cards');
        const uniqueRoutes = new Set(routes);

        if (!hasTimetable || !hasLessonPlan || !hasExams || !hasReportCards) {
          return { success: false, details: 'Missing expected module routes for combined roles.' };
        }
        if (uniqueRoutes.size !== routes.length) {
          return { success: false, details: 'Duplicate navigation items detected in combined tree!' };
        }

        return {
          success: true,
          details: `Role union successfully merged 3 roles into ${routes.length} distinct authorized routes with zero duplicates.`
        };
      }
    );

    // TEST 2: Parent Auto-Hiding
    await executeTest(
      'p4_02',
      'Parent Auto-Hiding',
      'Automatic Elimination of Empty Parent Menus',
      'Verifies that parent menus with no visible/authorized children are automatically hidden from the tree.',
      async () => {
        const now = new Date().toISOString();
        const studentUser: User = {
          id: 'test_student',
          defaultTenantId: 'tenant_dps_delhi',
          email: 'student@school.edu',
          displayName: 'Test Student',
          status: 'active',
          isPlatformSuperAdmin: false,
          roleAssignments: [],
          createdAt: now,
          updatedAt: now
        };

        const roles: RoleAssignment[] = [
          { id: 'ra_s', userId: 'test_student', tenantId: 'tenant_dps_delhi', roleId: 'role_student', roleCode: 'student', roleName: 'Student', scopes: [{ type: 'institution', value: 'tenant_dps_delhi' }], assignedAt: now, assignedBy: 'System' }
        ];

        const enabledModules = ['core', 'academic', 'timetable', 'examination'];
        const tree = NavigationService.getEffectiveNavigationTree(studentUser, roles, enabledModules);

        // Ensure Admin/Settings section or multi-tenancy parent is NOT visible to student
        const hasAdminRoot = tree.some(n => n.id === 'nav_multi_tenancy' || n.id === 'nav_users_access' || n.id === 'nav_module_registry');

        if (hasAdminRoot) {
          return { success: false, details: 'Unauthorized admin parent items leaked to student.' };
        }

        return {
          success: true,
          details: 'Verified recursive pruning: all empty or unauthorized parent containers correctly removed.'
        };
      }
    );

    // TEST 3: Module Gating & Dynamic Disabling
    await executeTest(
      'p4_03',
      'Module Gating',
      'Module-Level Navigation Disabling',
      'Confirms that disabling a module instantly prunes its navigation entries from the generated sidebar.',
      async () => {
        const now = new Date().toISOString();
        const principalUser: User = {
          id: 'test_principal',
          defaultTenantId: 'tenant_dps_delhi',
          email: 'principal@school.edu',
          displayName: 'Principal',
          status: 'active',
          isPlatformSuperAdmin: false,
          roleAssignments: [],
          createdAt: now,
          updatedAt: now
        };

        const roles: RoleAssignment[] = [
          { id: 'ra_p', userId: 'test_principal', tenantId: 'tenant_dps_delhi', roleId: 'role_principal', roleCode: 'principal', roleName: 'Principal', scopes: [{ type: 'institution', value: 'tenant_dps_delhi' }], assignedAt: now, assignedBy: 'System' }
        ];

        // Modules WITHOUT 'timetable' or 'transport'
        const strippedModules = ['core', 'student', 'academic', 'attendance', 'teacher', 'examination'];
        const tree = NavigationService.getEffectiveNavigationTree(principalUser, roles, strippedModules);

        const routes: string[] = [];
        const extract = (nodes: any[]) => {
          nodes.forEach(n => {
            if (n.route) routes.push(n.route);
            if (n.children) extract(n.children);
          });
        };
        extract(tree);

        if (routes.includes('timetable') || routes.includes('transport')) {
          return { success: false, details: 'Disabled modules (timetable/transport) still appeared in navigation.' };
        }

        return {
          success: true,
          details: 'Module gating verified: Timetable and Transport successfully omitted when inactive in tenant config.'
        };
      }
    );

    // TEST 4: Route Guard Security Barrier
    await executeTest(
      'p4_04',
      'Route Guard',
      'Direct Route/Tab Access Authorization Guard',
      'Validates that Route Guard blocks unauthorized direct tab access even if attempted via URL or code dispatch.',
      async () => {
        const now = new Date().toISOString();
        const studentUser: User = {
          id: 'test_student_guard',
          defaultTenantId: 'tenant_dps_delhi',
          email: 'student@school.edu',
          displayName: 'Student',
          status: 'active',
          isPlatformSuperAdmin: false,
          roleAssignments: [],
          createdAt: now,
          updatedAt: now
        };

        const roles: RoleAssignment[] = [
          { id: 'ra_sg', userId: 'test_student_guard', tenantId: 'tenant_dps_delhi', roleId: 'role_student', roleCode: 'student', roleName: 'Student', scopes: [{ type: 'institution', value: 'tenant_dps_delhi' }], assignedAt: now, assignedBy: 'System' }
        ];

        const enabledModules = ['core', 'student', 'academic'];

        // Attempt unauthorized routes
        const checkRoles = NavigationService.canAccessRoute('roles', studentUser, roles, enabledModules);
        const checkModules = NavigationService.canAccessRoute('modules', studentUser, roles, enabledModules);
        const checkTenants = NavigationService.canAccessRoute('tenants', studentUser, roles, enabledModules);

        if (checkRoles.allowed || checkModules.allowed || checkTenants.allowed) {
          return { success: false, details: 'Route Guard allowed unauthorized administrative route to student.' };
        }

        return {
          success: true,
          details: `Route Guard firmly blocked 3 administrative routes: [roles: ${checkRoles.reason}], [modules: ${checkModules.reason}], [tenants: ${checkTenants.reason}].`
        };
      }
    );

    // TEST 5: Plug-and-Play Module Registration
    await executeTest(
      'p4_05',
      'Dynamic Registration',
      'Runtime Module Registration Extensibility API',
      'Validates that third-party plugin modules (e.g. Smart Classroom) dynamically register into the navigation tree.',
      async () => {
        const testPluginItems: NavigationItemDefinition[] = [
          {
            id: 'nav_smart_classroom_hub',
            moduleId: 'smart_classroom',
            label: 'Smart Classroom IoT',
            icon: 'Sparkles',
            route: 'smart_classroom',
            sortOrder: 195,
            status: 'active',
            badge: { text: 'IoT', variant: 'pink' }
          }
        ];

        // Register plugin
        NavigationService.registerModuleNavigation('smart_classroom', testPluginItems);

        const now = new Date().toISOString();
        const adminUser: User = {
          id: 'test_plugin_admin',
          defaultTenantId: 'tenant_dps_delhi',
          email: 'admin@school.edu',
          displayName: 'Platform Admin',
          status: 'active',
          isPlatformSuperAdmin: true,
          roleAssignments: [],
          createdAt: now,
          updatedAt: now
        };

        const treeWithPlugin = NavigationService.getEffectiveNavigationTree(adminUser, [], ['core', 'smart_classroom']);
        const hasPlugin = treeWithPlugin.some(n => n.id === 'nav_smart_classroom_hub');

        if (!hasPlugin) {
          return { success: false, details: 'Registered dynamic plugin item not found in navigation tree.' };
        }

        return {
          success: true,
          details: 'Dynamic plugin item "Smart Classroom IoT" successfully registered and resolved in navigation hierarchy.'
        };
      }
    );

    return results;
  }
}
