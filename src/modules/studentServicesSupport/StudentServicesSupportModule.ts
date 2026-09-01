import { UniversalModuleContract } from '../../core/contracts/ModuleContract';

export const StudentServicesSupportModule: UniversalModuleContract = {
  moduleId: 'mod_student_services_support',
  name: 'Institutional Student Services, Case Management, Advising, Wellbeing & Support Operations',
  displayName: 'Student Services & Wellbeing',
  description: 'Authoritative operational module governing student support profiles, cases, advising assignments, appointment scheduling, referrals, success intervention plans, early-warning alerts, accommodations, confidential wellbeing records, crisis safeguarding escalation, Four-Eyes approvals, diagnostics, and SHA-256 audit chaining.',
  category: 'Core',
  status: 'REGISTERED',
  provider: 'CORE',
  version: '11.13.0',
  dependencies: [
    { moduleId: 'mod_institutional_administration', minVersion: '10.1.0' },
    { moduleId: 'mod_academic_management', minVersion: '10.2.0' },
    { moduleId: 'mod_student_lifecycle', minVersion: '10.4.0' },
    { moduleId: 'mod_student_academic_operations', minVersion: '10.5.0' },
    { moduleId: 'mod_human_resources_workforce', minVersion: '11.1.0' },
    { moduleId: 'mod_institutional_finance_operations', minVersion: '11.2.0' },
    { moduleId: 'mod_facilities_space_safety', minVersion: '11.5.0' },
    { moduleId: 'mod_institutional_communications', minVersion: '11.11.0' }
  ],
  configurationSchema: [],
  navigationItems: [
    {
      id: 'nav_student_services_support',
      moduleId: 'mod_student_services_support',
      label: 'Student Services & Advising',
      icon: 'HeartHandshake',
      route: 'student_services_support',
      sortOrder: 22,
      status: 'active',
      requiredPermission: 'student.support.view',
      allowedRoles: [
        'super_admin',
        'platform_admin',
        'student_support_director',
        'academic_advisor',
        'counsellor',
        'accessibility_coordinator',
        'safeguarding_lead',
        'crisis_responder',
        'dean',
        'registrar',
        'faculty_advisor',
        'auditor'
      ],
      targetContext: 'tenant'
    }
  ],
  permissions: [
    {
      code: 'student.support.view',
      name: 'View Student Support Services',
      description: 'Access standard student support registry and services list'
    },
    {
      code: 'student.support.manage',
      name: 'Manage Support Services & Centers',
      description: 'Configure student support centers, service categories, and SLAs'
    },
    {
      code: 'student.support.case.create',
      name: 'Create Support Cases',
      description: 'Open new student support cases and service requests'
    },
    {
      code: 'student.support.case.assign',
      name: 'Assign Support Cases',
      description: 'Assign case workers, participants, and priority levels'
    },
    {
      code: 'student.support.case.resolve',
      name: 'Resolve Support Cases',
      description: 'Transition cases to resolved status with resolution summaries'
    },
    {
      code: 'student.support.case.close',
      name: 'Close Support Cases',
      description: 'Execute Four-Eyes dual-approved case closure'
    },
    {
      code: 'student.support.case.reopen',
      name: 'Reopen Support Cases',
      description: 'Reopen previously closed support cases with formal justification'
    },
    {
      code: 'student.support.case.confidential.view',
      name: 'View Confidential Support Cases',
      description: 'Access confidential and restricted student case notes and attachments'
    },
    {
      code: 'student.support.advising.view',
      name: 'View Advising Records',
      description: 'Inspect academic advising rosters and assignments'
    },
    {
      code: 'student.support.advising.manage',
      name: 'Manage Advising Assignments & Sessions',
      description: 'Assign faculty advisors and log advising session notes'
    },
    {
      code: 'student.support.appointment.manage',
      name: 'Manage Advising Appointments',
      description: 'Schedule, check-in, complete, and cancel advising appointments'
    },
    {
      code: 'student.support.referral.create',
      name: 'Create Service Referrals',
      description: 'Initiate cross-departmental student support referrals'
    },
    {
      code: 'student.support.referral.manage',
      name: 'Manage Service Referrals',
      description: 'Accept, triage, assign, and complete service referrals'
    },
    {
      code: 'student.support.intervention.manage',
      name: 'Manage Student Interventions',
      description: 'Create and monitor student success intervention plans and early alerts'
    },
    {
      code: 'student.support.accommodation.view',
      name: 'View Accommodations',
      description: 'Access student accommodation plans and approved adjustments'
    },
    {
      code: 'student.support.accommodation.manage',
      name: 'Manage Accommodations',
      description: 'Triage and review accessibility adjustment requests and verifications'
    },
    {
      code: 'student.support.accommodation.approve',
      name: 'Approve Accommodations',
      description: 'Execute Four-Eyes approval for accommodation plans and adjustments'
    },
    {
      code: 'student.support.crisis.view',
      name: 'View Crisis & Safeguarding Records',
      description: 'Access restricted crisis incidents and safeguarding records'
    },
    {
      code: 'student.support.crisis.manage',
      name: 'Manage Crisis Incidents',
      description: 'Coordinate emergency crisis responses and stabilization workflows'
    },
    {
      code: 'student.support.crisis.escalate',
      name: 'Escalate Crisis & Safeguarding Concerns',
      description: 'Execute mandatory escalations for critical risk incidents'
    },
    {
      code: 'student.support.followup.manage',
      name: 'Manage Follow-Up Tasks',
      description: 'Create and complete support follow-up actions and SLA tasks'
    },
    {
      code: 'student.support.outcome.manage',
      name: 'Record Support Outcomes',
      description: 'Log formal evidence-based outcomes for closed cases and interventions'
    },
    {
      code: 'student.support.override.approve',
      name: 'Approve Sensitive Overrides',
      description: 'Execute Four-Eyes managerial overrides on sensitive student records'
    },
    {
      code: 'student.support.audit.view',
      name: 'View Student Support Audit Trail',
      description: 'Inspect cryptographic SHA-256 audit events and provenance records'
    }
  ]
};
