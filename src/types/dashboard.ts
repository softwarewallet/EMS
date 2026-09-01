// Dashboard Engine Types
// Multi-Tenant, Role-Based Analytics & Governance

export interface SystemHealthInfo {
  cpu: number; // Percentage, e.g. 18
  memory: number; // Percentage, e.g. 42
  databaseConnection: boolean; // true/false
  storage: number; // Percentage, e.g. 35
}

export interface TenantActivitySummary {
  id: string;
  name: string;
  type: string;
  status: string;
  createdAt: string;
}

export interface SecurityEventSummary {
  id: string;
  userEmail: string;
  action: string;
  result: string;
  timestamp: string;
  ipAddress?: string;
}

export interface ModuleHealthSummary {
  moduleId: string;
  name: string;
  version: string;
  status: 'healthy' | 'warning' | 'critical';
  responseTime: number; // ms
}

export interface PlatformGovernanceStats {
  totalTenants: number;
  totalCampuses: number;
  totalUsers: number;
  totalStudents: number;
  totalStaff: number;
  totalModulesRegistry: number;
  totalModulesCatalog: number;
  securityAlertsCount: number;
  activeSessionsCount: number;
  failedLoginAttempts: number;
  tenantStatusCounts: Record<string, number>;
  tenantTypeCounts: Record<string, number>;
  systemHealth: SystemHealthInfo;
  recentTenants: TenantActivitySummary[];
  recentSecurityEvents: SecurityEventSummary[];
  moduleHealths: ModuleHealthSummary[];
}

export interface TenantOperationalStats {
  totalStudents: number;
  totalTeachers: number;
  totalStaff: number;
  totalClassrooms: number;
  monthlyRevenue: number;
  averageAttendance: number;
  recentEnrollments: {
    studentId: string;
    name: string;
    className: string;
    status: string;
  }[];
  attendanceSummary: {
    date: string;
    rate: number;
  }[];
  revenueOverview: {
    month: string;
    value: number;
  }[];
}

export interface TeacherAcademicStats {
  totalClassesToday: number;
  totalAssignmentsToGrade: number;
  averageClassAttendance: number;
  nextClassTime: string;
  todaySchedule: {
    id: string;
    className: string;
    sectionName: string;
    subjectName: string;
    time: string;
  }[];
  recentSubmissions: {
    id: string;
    studentName: string;
    assignmentTitle: string;
    submittedAt: string;
  }[];
}

export interface StudentAcademicStats {
  attendanceRate: number;
  pendingAssignmentsCount: number;
  latestGrade: string;
  nextClassSubject: string;
  upcomingTasks: {
    id: string;
    title: string;
    dueDate: string;
    completed: boolean;
  }[];
  recentGrades: {
    id: string;
    subjectName: string;
    marks: number;
    maxMarks: number;
    grade: string;
  }[];
}

export interface ParentGovernanceStats {
  children: {
    id: string;
    name: string;
    attendanceRate: number;
    grade: string;
    pendingAssignments: number;
  }[];
  unpaidFeesAmount: number;
  recentNotices: {
    id: string;
    title: string;
    date: string;
    content: string;
  }[];
  teacherMessagesCount: number;
}
