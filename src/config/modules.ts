import { ModuleRegistryItem } from '../types';

export const MODULE_REGISTRY: ModuleRegistryItem[] = [
  {
    id: 'mod_core',
    code: 'core',
    name: 'Core Platform & Administration',
    description: 'Institution profile, campus structure, user directory, role-based access control, and audit logs.',
    version: '1.0.0',
    category: 'core',
    icon: 'Shield',
    route: '/admin',
    isCore: true,
    requiredPermissions: ['tenant.view'],
    dependencies: [],
    tenantAvailability: {
      supportedTypes: ['k12_school', 'higher_education', 'coaching_institute', 'vocational', 'multi_campus_group']
    }
  },
  {
    id: 'mod_student',
    code: 'student',
    name: 'Student & Guardian Information System',
    description: 'Comprehensive student profiles, guardian records, enrollment status, and demographic management.',
    version: '1.0.0',
    category: 'academics',
    icon: 'GraduationCap',
    route: '/students',
    isCore: false,
    requiredPermissions: ['student.view'],
    dependencies: [{ moduleId: 'mod_core' }],
    tenantAvailability: {
      supportedTypes: ['k12_school', 'higher_education', 'coaching_institute', 'vocational', 'multi_campus_group']
    }
  },
  {
    id: 'mod_academic',
    code: 'academic',
    name: 'Academic Curriculum & Structure',
    description: 'Academic calendar years, terms, grade levels, classroom sections, and course/subject allocations.',
    version: '1.0.0',
    category: 'academics',
    icon: 'BookOpen',
    route: '/academic',
    isCore: false,
    requiredPermissions: ['academic.view'],
    dependencies: [{ moduleId: 'mod_core' }],
    tenantAvailability: {
      supportedTypes: ['k12_school', 'higher_education', 'coaching_institute', 'vocational', 'multi_campus_group']
    }
  },
  {
    id: 'mod_attendance',
    code: 'attendance',
    name: 'Attendance & Roster Tracking',
    description: 'Daily student attendance rosters, subject-wise attendance logs, faculty check-in, and absentee analytics.',
    version: '1.0.0',
    category: 'operations',
    icon: 'CalendarCheck',
    route: '/attendance',
    isCore: false,
    requiredPermissions: ['attendance.view'],
    dependencies: [{ moduleId: 'mod_core' }, { moduleId: 'mod_student' }, { moduleId: 'mod_academic' }],
    tenantAvailability: {
      supportedTypes: ['k12_school', 'higher_education', 'coaching_institute', 'vocational', 'multi_campus_group']
    }
  },

  // ==========================================
  // PHASE 3: ACADEMIC MANAGEMENT EXTENSIONS
  // ==========================================
  {
    id: 'mod_teacher',
    code: 'teacher',
    name: 'Teacher & Faculty Management',
    description: 'Faculty profiles, qualifications, department specializations, and class-subject teaching allocations.',
    version: '1.0.0',
    category: 'academics',
    icon: 'Briefcase',
    route: '/teachers',
    isCore: false,
    requiredPermissions: ['teacher.view'],
    dependencies: [{ moduleId: 'mod_core' }, { moduleId: 'mod_academic' }],
    tenantAvailability: {
      supportedTypes: ['k12_school', 'higher_education', 'coaching_institute', 'vocational', 'multi_campus_group']
    }
  },
  {
    id: 'mod_timetable',
    code: 'timetable',
    name: 'Timetable & Class Schedules',
    description: 'Weekly period grids, classroom assignments, teacher schedules, and real-time conflict detection.',
    version: '1.0.0',
    category: 'academics',
    icon: 'Clock',
    route: '/timetable',
    isCore: false,
    requiredPermissions: ['timetable.view'],
    dependencies: [{ moduleId: 'mod_core' }, { moduleId: 'mod_academic' }, { moduleId: 'mod_teacher' }],
    tenantAvailability: {
      supportedTypes: ['k12_school', 'higher_education', 'coaching_institute', 'vocational', 'multi_campus_group']
    }
  },
  {
    id: 'mod_lesson_planning',
    code: 'lesson_planning',
    name: 'Lesson Planning & Smart Syllabus',
    description: 'Unit-by-unit teaching objectives, instructional materials, delivery tracking, and pedagogical notes.',
    version: '1.0.0',
    category: 'academics',
    icon: 'FileText',
    route: '/lesson-plans',
    isCore: false,
    requiredPermissions: ['lesson_plan.view'],
    dependencies: [{ moduleId: 'mod_core' }, { moduleId: 'mod_academic' }, { moduleId: 'mod_teacher' }],
    tenantAvailability: {
      supportedTypes: ['k12_school', 'higher_education', 'coaching_institute', 'vocational', 'multi_campus_group']
    }
  },
  {
    id: 'mod_assignments',
    code: 'assignments',
    name: 'Homework & Assignment Central',
    description: 'Assignment creation, student submissions, teacher reviews, scoring rubrics, and feedback tracking.',
    version: '1.0.0',
    category: 'academics',
    icon: 'CheckSquare',
    route: '/assignments',
    isCore: false,
    requiredPermissions: ['assignment.view'],
    dependencies: [{ moduleId: 'mod_core' }, { moduleId: 'mod_academic' }, { moduleId: 'mod_student' }],
    tenantAvailability: {
      supportedTypes: ['k12_school', 'higher_education', 'coaching_institute', 'vocational', 'multi_campus_group']
    }
  },
  {
    id: 'mod_assessment',
    code: 'assessment',
    name: 'Continuous Evaluation & Assessments',
    description: 'Class tests, quizzes, practical vivas, project assessments, and formative grading.',
    version: '1.0.0',
    category: 'academics',
    icon: 'Target',
    route: '/assessments',
    isCore: false,
    requiredPermissions: ['assessment.view'],
    dependencies: [{ moduleId: 'mod_core' }, { moduleId: 'mod_academic' }, { moduleId: 'mod_student' }],
    tenantAvailability: {
      supportedTypes: ['k12_school', 'higher_education', 'coaching_institute', 'vocational', 'multi_campus_group']
    }
  },
  {
    id: 'mod_examination',
    code: 'examination',
    name: 'Examination & Marks Central',
    description: 'CBSE/Term exam scheduling, hall allocations, marks entry workflow, verification, and results publishing.',
    version: '1.0.0',
    category: 'academics',
    icon: 'Award',
    route: '/examinations',
    isCore: false,
    requiredPermissions: ['exam.view'],
    dependencies: [{ moduleId: 'mod_core' }, { moduleId: 'mod_academic' }, { moduleId: 'mod_student' }],
    tenantAvailability: {
      supportedTypes: ['k12_school', 'higher_education', 'coaching_institute', 'vocational', 'multi_campus_group']
    }
  },
  {
    id: 'mod_report_card',
    code: 'report_card',
    name: 'Report Cards & Performance Portfolios',
    description: 'Automated GPA/grade calculation, CBSE scholastic & co-scholastic transcripts, teacher remarks, and printable PDF cards.',
    version: '1.0.0',
    category: 'academics',
    icon: 'FileSpreadsheet',
    route: '/report-cards',
    isCore: false,
    requiredPermissions: ['report_card.view'],
    dependencies: [{ moduleId: 'mod_core' }, { moduleId: 'mod_academic' }, { moduleId: 'mod_examination' }],
    tenantAvailability: {
      supportedTypes: ['k12_school', 'higher_education', 'coaching_institute', 'vocational', 'multi_campus_group']
    }
  },
  {
    id: 'mod_promotion',
    code: 'promotion',
    name: 'Student Promotion & Batch Rollover',
    description: 'End-of-year academic promotion, retention processing, conditional advancement, and historical academic preservation.',
    version: '1.0.0',
    category: 'academics',
    icon: 'TrendingUp',
    route: '/promotions',
    isCore: false,
    requiredPermissions: ['promotion.view'],
    dependencies: [{ moduleId: 'mod_core' }, { moduleId: 'mod_student' }, { moduleId: 'mod_academic' }],
    tenantAvailability: {
      supportedTypes: ['k12_school', 'higher_education', 'coaching_institute', 'vocational', 'multi_campus_group']
    }
  },
  {
    id: 'mod_admissions',
    code: 'admissions',
    name: 'Admissions & Enrollment',
    description: 'Complete student admission lifecycle from enquiries and applications, through document verification, tests, interviews, selection, to student creation and enrollment.',
    version: '1.0.0',
    category: 'academics',
    icon: 'UserPlus',
    route: '/admissions',
    isCore: false,
    requiredPermissions: ['admission.view'],
    dependencies: [{ moduleId: 'mod_core' }, { moduleId: 'mod_student' }, { moduleId: 'mod_academic' }],
    tenantAvailability: {
      supportedTypes: ['k12_school', 'higher_education', 'coaching_institute', 'vocational', 'multi_campus_group']
    }
  },
  {
    id: 'mod_student_exit',
    code: 'student_exit',
    name: 'Student Exit Management',
    description: 'Manages institution transfer and withdrawal requests with a dynamic, granular clearance framework and strict status progression controls.',
    version: '1.0.0',
    category: 'academics',
    icon: 'LogOut',
    route: '/student-exits',
    isCore: false,
    requiredPermissions: ['exit.view'],
    dependencies: [{ moduleId: 'mod_core' }, { moduleId: 'mod_student' }, { moduleId: 'mod_academic' }],
    tenantAvailability: {
      supportedTypes: ['k12_school', 'higher_education', 'coaching_institute', 'vocational', 'multi_campus_group']
    }
  },
  {
    id: 'mod_staff',
    code: 'staff',
    name: 'Staff, HR & Workforce Management',
    description: 'Authoritative workforce governance engine for staff profiles, employment lifecycle, assignments, qualifications, workload analytics, leave ledgers, substitutions, professional development, appraisals, compliance monitoring, HR cases, and offboarding clearances.',
    version: '1.0.0',
    category: 'operations',
    icon: 'Users',
    route: '/staff/workspace',
    isCore: false,
    requiredPermissions: ['hr.view'],
    dependencies: [{ moduleId: 'mod_core' }, { moduleId: 'mod_academic' }],
    tenantAvailability: {
      supportedTypes: ['k12_school', 'higher_education', 'coaching_institute', 'vocational', 'multi_campus_group']
    }
  },
  {
    id: 'mod_institutional_communication',
    code: 'institutional_communication',
    name: 'Institutional Communication & Stakeholder Relations',
    description: 'Governed institutional communications, multi-channel circulars, approval workflows, dynamic audience targeting, stakeholder inquiries, and delivery assurance.',
    version: '1.0.0',
    category: 'operations',
    icon: 'MessageSquare',
    route: '/institutional-communication',
    isCore: false,
    requiredPermissions: ['communication.view'],
    dependencies: [{ moduleId: 'mod_core' }],
    tenantAvailability: {
      supportedTypes: ['k12_school', 'higher_education', 'coaching_institute', 'vocational', 'multi_campus_group']
    }
  },
  {
    id: 'mod_enterprise_architecture',
    code: 'enterprise_architecture',
    name: 'Enterprise Architecture & Digital Governance',
    description: 'Institutional governance engine for technology architecture, application portfolios, digital services, technical standards, technology risks, technical debt, and modernization planning.',
    version: '1.0.0',
    category: 'operations',
    icon: 'Network',
    route: '/enterprise-architecture',
    isCore: false,
    requiredPermissions: ['tenant.view'],
    dependencies: [{ moduleId: 'mod_core' }],
    tenantAvailability: {
      supportedTypes: ['k12_school', 'higher_education', 'coaching_institute', 'vocational', 'multi_campus_group']
    }
  }
];

export const DEFAULT_ENABLED_MODULE_CODES = [
  'core',
  'student',
  'academic',
  'attendance',
  'teacher',
  'timetable',
  'lesson_planning',
  'assignments',
  'assessment',
  'examination',
  'report_card',
  'promotion',
  'admissions',
  'mod_admissions',
  'student_exit',
  'mod_student_exit',
  'staff',
  'mod_staff',
  'institutional_communication',
  'mod_institutional_communication',
  'enterprise_architecture',
  'mod_enterprise_architecture'
];
