# EduTech-SMS Platform Architecture

## 1. Core Architecture
EduTech-SMS is a modular monolith built on React, TypeScript, and Firebase. It is designed to host multiple institutions (Multi-Tenancy) while maintaining strict data isolation, role-based access control (RBAC), and modular feature enablement.

The platform is split into:
- **Core Engine:** Handles Authentication, Tenant Routing, Module Lifecycle, Security, Navigation, and Event dispatching.
- **Business Modules:** Independent domains (e.g., Academics, Student, Attendance, Examinations) that plug into the Core via standardized contracts.

## 2. Universal Module Contract
Every module must conform to the `UniversalModuleContract` (defined in `src/core/contracts/ModuleContract.ts`). Modules must not directly mutate core UI components (like Sidebars) or core tables. 
- **Registration:** Modules register themselves with the `ModuleEngine`.
- **Dependencies:** A module can declare required and optional dependencies. The engine enforces resolution before enablement.
- **Permissions:** Modules declare their own custom permissions which merge into the global RBAC system.
- **Configuration:** Modules expose `ModuleConfigField` schemas. Tenant settings are isolated.
- **Navigation:** Modules supply `NavigationItemDefinition` objects. The dynamic Navigation Engine renders these based on RBAC and Module Enablement.

## 3. Tenant Architecture
- Multi-tenancy is implemented logically within a single database using a `tenantId` on every document.
- Users can belong to multiple tenants (via `RoleAssignments`). 
- Queries **must** always filter by `tenantId`.

## 4. Authorization Architecture
Security requires all of the following to align before granting access:
1. **Authentication:** Valid Firebase Auth session.
2. **Tenant Isolation:** The user has an active `RoleAssignment` for the requested `tenantId`.
3. **Module Enablement:** The tenant has enabled the required module.
4. **RBAC:** The user possesses a Role containing the Required Permission.
5. **Scope:** (Optional) The action is restricted to a specific campus, class, or entity.

## 5. Navigation Architecture
- Sidebar and dashboards are purely dynamic and driven by `NavigationService`.
- No hardcoded routes in the sidebar. Modules supply their routes in their Contract.

## 6. Event Architecture
- Domain Events (e.g., `STUDENT_ADMITTED`, `MARKS_SUBMITTED`) are defined in `EventContract.ts`.
- Future inter-module communication should happen via Domain Events rather than direct database manipulation.
- Audit Logging (`AuditService`) is distinct from Domain Events. Audit logs track *who did what* for compliance.

## 7. Configuration & Storage Architecture
- Tenant-specific module settings are stored in the Tenant profile.
- Documents/files should be referenced via a central `DocumentService` rather than a hardcoded storage provider, allowing future object storage swapping.

## 8. Database Ownership
- Each module strictly owns its database collections. 
- The Student module owns `students`. The Admissions module (future) will own `admission_applications`. Admissions may reference `student_id` but must not redefine the student schema.

## 9. Testing Standards
- Modules must be testable in isolation.
- Validation checks must include Dependency Resolution, RBAC enforcement, and Tenant Boundary isolation.


## 10. Security Review
- **Authentication:** Managed by Firebase Auth, enforcing logged-in users only.
- **Authorization:** `AuthContext` accurately resolves effective roles based on `tenantId`.
- **Tenant Isolation:** Checked at the lowest level in `TenantService` & Firebase rules. Users cannot read data outside their `RoleAssignment`.
- **Scope:** Dynamic navigation removes access points. Route Guards enforce `canAccessRoute` checking Role, Module Status, and Tenant limits.
- **Audit:** All sensitive mutations (e.g., `toggleModule`, `createTenant`) log to the `AuditService`. Users cannot alter audit records directly as there are no write APIs for normal roles.

## 11. Performance Review
- **Navigation Efficiency:** Navigation tree computes only upon active role/tenant switch (`useMemo` in `NavigationContext`).
- **Module Lookup:** `ModuleEngine` maps modules by ID for O(1) retrieval.
- **Dependency Checks:** Fast set-based and linear filtering prevents deep recursion loops.
- **Database Access:** Firebase's native indexing and local caching ensures fast reads. Queries always include `tenantId` enabling proper sharding and fast sequential access.

## 12. Regression Test Results
- Navigation continues to render successfully for platform super admins and tenant-specific roles.
- The Dashboard remains functional.
- The Module enablement toggle safely falls back to Universal Module rules for new modules (e.g., Attendance) and legacy checks for older ones.
- Zero feature breakage.
