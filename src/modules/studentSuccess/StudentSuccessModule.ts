import { UniversalModuleContract } from '../../core/contracts/ModuleContract';

export const StudentSuccessModule: UniversalModuleContract = {
  moduleId: 'mod_student_success',
  name: 'Student Success, Retention & Progression Engine',
  displayName: 'Student Success, Early Warning & Academic Progression',
  description: 'Governed early-warning indicator system, deterministic risk scoring, intervention workflows, retention case governance, and academic progression assessment.',
  version: '1.0.0',
  status: 'INSTALLED',
  category: 'Academics',
  provider: 'EMS Core',
  dependencies: [],
  configurationSchema: [],
  navigationItems: [],
  permissions: [
    {
      code: 'student_success.view',
      name: 'View Student Success Profiles',
      description: 'Allows viewing student success profiles, risk indicators, and intervention histories.'
    },
    {
      code: 'student_success.manage',
      name: 'Manage Student Success Profiles',
      description: 'Allows updating student success profiles and configuration parameters.'
    },
    {
      code: 'risk.view',
      name: 'View Risk Assessments',
      description: 'Allows viewing student risk scores and contributing factors.'
    },
    {
      code: 'risk.calculate',
      name: 'Calculate Risk Scores',
      description: 'Allows triggering deterministic risk calculations for students.'
    },
    {
      code: 'risk.override',
      name: 'Override Risk Scores',
      description: 'Allows formal override of automated risk scores with audit reasoning.'
    },
    {
      code: 'risk.verify',
      name: 'Verify Risk Overrides',
      description: 'Allows certifying manual risk score overrides (Four-Eyes governance).'
    },
    {
      code: 'early_warning.view',
      name: 'View Early Warning Signals',
      description: 'Allows viewing system-detected academic, attendance, and behavioral warning signals.'
    },
    {
      code: 'early_warning.manage',
      name: 'Manage Warning Signals',
      description: 'Allows acknowledging, actioning, and resolving early warning signals.'
    },
    {
      code: 'intervention.create',
      name: 'Create Student Interventions',
      description: 'Allows proposing new student support interventions.'
    },
    {
      code: 'intervention.assign',
      name: 'Assign Interventions',
      description: 'Allows assigning student interventions to faculty or advisors.'
    },
    {
      code: 'intervention.verify',
      name: 'Verify Intervention Outcomes',
      description: 'Allows verifying completed student interventions.'
    },
    {
      code: 'intervention.close',
      name: 'Close Interventions',
      description: 'Allows formal closure of student intervention cases.'
    },
    {
      code: 'retention.view',
      name: 'View Retention Cases',
      description: 'Allows viewing student retention monitoring cases.'
    },
    {
      code: 'retention.manage',
      name: 'Manage Retention Cases',
      description: 'Allows creating and managing student retention cases.'
    },
    {
      code: 'retention.approve',
      name: 'Approve Retention Decisions',
      description: 'Allows authoritative approval of retention decisions.'
    },
    {
      code: 'progression.view',
      name: 'View Academic Progression Assessments',
      description: 'Allows viewing academic year progression assessments.'
    },
    {
      code: 'progression.assess',
      name: 'Assess Academic Progression',
      description: 'Allows conducting academic progression evaluations.'
    },
    {
      code: 'progression.approve',
      name: 'Approve Academic Progression Decisions',
      description: 'Allows authoritative approval of academic year progression eligibility.'
    },
    {
      code: 'success.analytics',
      name: 'View Student Success Analytics',
      description: 'Allows viewing cohort retention, risk distribution, and progression analytics.'
    },
    {
      code: 'success.export',
      name: 'Export Student Success Data',
      description: 'Allows secure, audit-logged export of student success reports.'
    }
  ]
};
