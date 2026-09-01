# EduTech-SMS Security Specification & Threat Model

## 1. Data Invariants
1. **Tenant Boundary Isolation**: All institutional records (campuses, academic years, classes, sections, subjects, students, attendance, and audit logs) MUST contain a non-empty `tenantId` property.
2. **User Identity & Role Association**: A user record contains role assignments scoped to specific tenants or the platform (`tenantId: 'ALL'`).
3. **Audit Trail Immutability**: Audit logs are append-only. Once recorded, entries cannot be modified or deleted.
4. **Attendance Integrity**: Attendance records are bound to a specific date, student ID, and tenant ID.
5. **Path Validation**: Document IDs must not exceed 128 characters and must match alphanumeric/hyphen/underscore patterns.

## 2. Dirty Dozen Threat Vectors
1. **Tenant Spoofing**: Attempt to write student data with mismatched or empty `tenantId`.
2. **ID Injection Attack**: Passing malicious 2KB string as `tenantId` or `studentId`.
3. **Audit Tampering**: Attempting to execute `update` or `delete` on `/audit_logs/{id}`.
4. **Shadow Field Injection**: Injecting unauthorized `isPlatformSuperAdmin: true` into standard user profile updates.
5. **Malformed Date Strings**: Sending invalid timestamp strings that bypass date constraints.
6. **Orphaned Class Reference**: Creating a section with non-existent or invalid `classId`.
7. **Cross-Tenant Roster Access**: Querying students across differing tenant boundaries without authorization.
8. **Attendance Falsification**: Creating an attendance log without required date and status fields.
9. **Role Escalation**: Self-assigning `super_admin` role assignment.
10. **Denial of Wallet Flooding**: Sending arbitrarily huge JSON objects (>100KB) into configuration fields.
11. **Negative Capacity / Enrollment Limits**: Supplying negative numbers for class capacity or student counts.
12. **Unvalidated Status Enum Values**: Setting student or tenant status to arbitrary strings.
