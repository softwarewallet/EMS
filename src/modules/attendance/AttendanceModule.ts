import { UniversalModuleContract } from '../../core/contracts/ModuleContract';

export const AttendanceModule: UniversalModuleContract = {
  moduleId: 'mod_attendance',
  name: 'Attendance',
  displayName: 'Attendance & Roster Tracking',
  description: 'Daily student attendance rosters, subject-wise attendance logs, faculty check-in, and absentee analytics.',
  version: '1.0.0',
  status: 'AVAILABLE',
  category: 'Operations',
  provider: 'EduTech Core Team',
  
  dependencies: [
    { moduleId: 'mod_core' },
    { moduleId: 'mod_student' },
    { moduleId: 'mod_academic' }
  ],
  
  configurationSchema: [
    {
      key: 'late_threshold_minutes',
      label: 'Late Threshold (Minutes)',
      type: 'number',
      defaultValue: 15,
      required: true,
      description: 'Number of minutes after class start before a student is marked late.'
    },
    {
      key: 'allow_excused_absence',
      label: 'Allow Excused Absences',
      type: 'boolean',
      defaultValue: true,
      description: 'Enable the excused absence status for attendance tracking.'
    }
  ],
  
  permissions: [
    { code: 'attendance.view', name: 'View Attendance', description: 'Can view attendance records.' },
    { code: 'attendance.mark', name: 'Mark Attendance', description: 'Can mark student attendance.' },
    { code: 'attendance.modify', name: 'Modify Attendance', description: 'Can change past attendance records.' },
    { code: 'attendance.reports', name: 'View Attendance Reports', description: 'Can generate attendance reports.' }
  ],
  
  navigationItems: [
    {
      id: 'nav_attendance',
      moduleId: 'mod_attendance',
      label: 'Attendance',
      icon: 'CalendarCheck',
      route: 'attendance',
      sortOrder: 40,
      status: 'active',
      requiredPermission: 'attendance.view',
      allowedRoles: ['super_admin', 'platform_admin', 'institution_manager', 'tenant_admin', 'principal', 'vice_principal', 'academic_coordinator', 'teacher', 'class_coordinator', 'student', 'parent', 'govt_admin', 'district_admin'],
      targetContext: 'tenant'
    }
  ],
  
  eventsEmitted: [
    { eventName: 'STUDENT_ATTENDANCE_MARKED', description: 'Fired when a student\'s daily attendance is recorded.' },
    { eventName: 'TEACHER_ATTENDANCE_MARKED', description: 'Fired when a teacher\'s daily attendance is recorded.' }
  ],
  
  reports: [
    {
      id: 'rpt_attendance_summary',
      title: 'Daily Attendance Summary',
      description: 'Provides a daily rollup of attendance metrics for the institution.',
      route: '/reports/attendance-summary',
      requiredPermission: 'attendance.reports'
    }
  ]
};
