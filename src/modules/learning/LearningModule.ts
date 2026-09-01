import { UniversalModuleContract } from '../../core/contracts/ModuleContract';

export const LearningModule: UniversalModuleContract = {
  moduleId: 'mod_learning',
  name: 'Learning Management System',
  displayName: 'Learning Management, Digital Classroom & Teaching Delivery Governance Engine',
  description: 'Enterprise governance for courses, offerings, faculty assignments, digital content studio, assignments, quizzes, question banks, discussions, student progress, and learning analytics (Phase 7.22)',
  version: '1.0.0',
  status: 'AVAILABLE',
  category: 'Academics',
  provider: 'EMS',
  dependencies: [
    { moduleId: 'mod_core', optional: false },
    { moduleId: 'mod_student', optional: false },
    { moduleId: 'mod_staff', optional: false },
    { moduleId: 'mod_academic_year', optional: false },
    { moduleId: 'mod_communication', optional: true }
  ],
  configurationSchema: [],
  permissions: [
    { code: 'learning.view', name: 'View Learning Space', description: 'Access learning spaces, courses, and course offerings' },
    { code: 'learning.create', name: 'Create Courses', description: 'Draft and design new courses and units' },
    { code: 'learning.update', name: 'Update Courses', description: 'Modify course structures, lessons, and materials' },
    { code: 'learning.publish', name: 'Publish Course Versions', description: 'Formally publish immutable course versions' },
    { code: 'learning.manage_courses', name: 'Manage Offerings & Faculty', description: 'Create course offerings and assign teaching faculty' },
    { code: 'learning.manage_content', name: 'Manage Content Studio', description: 'Upload and organize digital learning resources and notes' },
    { code: 'learning.manage_assignments', name: 'Manage Assignments', description: 'Create, schedule, and publish coursework assignments' },
    { code: 'learning.manage_assessments', name: 'Manage Quizzes & Question Banks', description: 'Create question banks, items, and online quizzes' },
    { code: 'learning.grade', name: 'Grade & Evaluate Submissions', description: 'Grade assignment submissions and evaluate quiz attempts' },
    { code: 'learning.moderate', name: 'Moderate Discussions', description: 'Moderate and lock course discussion threads' },
    { code: 'learning.manage_discussions', name: 'Participate in Discussions', description: 'Create topics and post discussion replies' },
    { code: 'learning.view_progress', name: 'View Student Progress', description: 'Access student progress indicators and completion logs' },
    { code: 'learning.view_analytics', name: 'View Learning Analytics', description: 'Access course engagement and formative learning analytics' },
    { code: 'learning.export', name: 'Export Learning Data', description: 'Export learning progress and coursework reports' },
    { code: 'learning.audit', name: 'Audit Learning Logs', description: 'Access audit trail for learning management events' },
    { code: 'learning.admin', name: 'Learning System Admin', description: 'Full administrative control over learning delivery' }
  ],
  navigationItems: [
    {
      id: 'nav_learning_workspace',
      moduleId: 'mod_learning',
      label: 'Learning & Digital Classroom',
      icon: 'BookOpen',
      route: '/learning/workspace',
      requiredPermission: 'learning.view',
      sortOrder: 22,
      status: 'active'
    }
  ],
  onEnable: async (tenantId: string) => {
    console.log(`[ModuleEngine] LearningModule enabled for tenant ${tenantId}`);
  },
  onDisable: async (tenantId: string) => {
    console.log(`[ModuleEngine] LearningModule disabled for tenant ${tenantId}`);
  }
};
