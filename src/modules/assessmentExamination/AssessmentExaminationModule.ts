import { UniversalModuleContract } from '../../core/contracts/ModuleContract';

export const AssessmentExaminationModule: UniversalModuleContract = {
  moduleId: 'mod_assessment_examination',
  name: 'Institutional Assessment & Examination',
  displayName: 'Assessment & Examination',
  description: 'Authoritative operational module for institutional assessment, examination scheduling, marking, and results.',
  category: 'Core',
  status: 'REGISTERED',
  provider: 'CORE',
  version: '10.6.0',
  dependencies: [], // Inherently depends on 10.1-10.5
  configurationSchema: [],
  navigationItems: [
    {
      id: 'nav_assessment_examination',
      moduleId: 'mod_assessment_examination',
      label: 'Assessments & Exams',
      icon: 'FileSpreadsheet',
      route: 'assessment_examination',
      sortOrder: 6,
      status: 'active',
      requiredPermission: 'assessment.view',
      allowedRoles: ['super_admin', 'platform_admin', 'institution_admin', 'registrar', 'faculty'],
      targetContext: 'tenant'
    }
  ],
  permissions: [
    {
      code: 'assessment.view',
      name: 'View Assessments',
      description: 'Access assessments, examination schedules, and results'
    },
    {
      code: 'assessment.manage',
      name: 'Manage Assessments',
      description: 'Create assessments, schedule exams, and manage seating'
    },
    {
      code: 'assessment.result.override',
      name: 'Override Results',
      description: 'Four-Eyes SoD approval authority for grade changes'
    }
  ]
};
