import { PermissionDefinition, Role, ScopeType, User } from '../types';

export const ALL_PERMISSIONS: PermissionDefinition[] = [
  // Core & Platform
  { id: 'perm_platform_admin', code: 'platform.admin', name: 'Platform Super Admin', category: 'core', description: 'Full unconstrained platform-wide access across all tenants and infrastructure', applicableScopes: ['platform'] },
  { id: 'perm_platform_ops', code: 'platform.operations', name: 'Platform Operations', category: 'core', description: 'Operations and institution onboarding management', applicableScopes: ['platform'] },
  { id: 'perm_platform_support', code: 'platform.support', name: 'Platform Support', category: 'core', description: 'Customer and tenant support operations', applicableScopes: ['platform'] },
  { id: 'perm_platform_sec', code: 'platform.security', name: 'Platform Security', category: 'security', description: 'Platform security configuration and audit management', applicableScopes: ['platform'] },
  { id: 'perm_platform_tech', code: 'platform.tech', name: 'Platform Technical Maintenance', category: 'core', description: 'System maintenance and platform infrastructure', applicableScopes: ['platform'] },
  { id: 'perm_tenant_view', code: 'tenant.view', name: 'View Institution', category: 'core', description: 'View tenant details, campuses, and settings', applicableScopes: ['platform', 'institution'] },
  { id: 'perm_tenant_manage', code: 'tenant.manage', name: 'Manage Institution & Campus', category: 'core', description: 'Create/edit campuses, buildings, classrooms, and branding', applicableScopes: ['platform', 'institution'] },
  { id: 'perm_module_manage', code: 'module.manage', name: 'Manage Modules', category: 'core', description: 'Enable or disable functional modules for the institution', applicableScopes: ['platform', 'institution'] },
  { id: 'perm_audit_view', code: 'audit.view', name: 'View Audit Logs', category: 'security', description: 'Access immutable security and activity audit logs', applicableScopes: ['platform', 'institution'] },

  // User & Access Control
  { id: 'perm_user_view', code: 'user.view', name: 'View Users', category: 'core', description: 'View directory of staff, teachers, and system users', applicableScopes: ['platform', 'institution', 'campus'] },
  { id: 'perm_user_create', code: 'user.create', name: 'Create Users', category: 'core', description: 'Provision staff, teacher, and administrator accounts', applicableScopes: ['platform', 'institution'] },
  { id: 'perm_user_edit', code: 'user.edit', name: 'Edit Users', category: 'core', description: 'Update user profiles, departments, and credentials', applicableScopes: ['platform', 'institution'] },
  { id: 'perm_user_disable', code: 'user.disable', name: 'Suspend/Disable Users', category: 'security', description: 'Deactivate or suspend user accounts', applicableScopes: ['platform', 'institution'] },
  { id: 'perm_role_manage', code: 'role.manage', name: 'Manage Roles & Permissions', category: 'security', description: 'Assign roles with granular scope constraints and configure custom roles', applicableScopes: ['platform', 'institution'] },

  // Student Module
  { id: 'perm_student_view', code: 'student.view', name: 'View Students', category: 'student', description: 'View student directory, enrollment records, and basic details', applicableScopes: ['institution', 'campus', 'class', 'section'] },
  { id: 'perm_student_create', code: 'student.create', name: 'Enroll Students', category: 'student', description: 'Register and enroll new students with guardian profiles', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_student_edit', code: 'student.edit', name: 'Edit Student Profiles', category: 'student', description: 'Update student demographics, contacts, and guardian details', applicableScopes: ['institution', 'campus', 'class'] },
  { id: 'perm_student_delete', code: 'student.delete', name: 'Archive/Delete Students', category: 'student', description: 'Delete or archive student records', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_student_status_change', code: 'student.status.change', name: 'Change Student Status', category: 'student', description: 'Authorize status transitions (Active, On Leave, Inactive)', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_student_transfer', code: 'student.transfer', name: 'Transfer Student', category: 'student', description: 'Execute student transfer lifecycle process', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_student_withdraw', code: 'student.withdraw', name: 'Withdraw Student', category: 'student', description: 'Process official student withdrawal', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_student_graduate', code: 'student.graduate', name: 'Graduate Student', category: 'student', description: 'Graduate students and transition to alumni status', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_student_export', code: 'student.export', name: 'Export Student Roster', category: 'student', description: 'Export student records to CSV or Excel', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_student_doc_view', code: 'student.document.view', name: 'View Student Documents', category: 'student', description: 'View student certificates, photos, and records', applicableScopes: ['institution', 'campus', 'class'] },
  { id: 'perm_student_doc_manage', code: 'student.document.manage', name: 'Manage Student Documents', category: 'student', description: 'Upload, verify, or remove student documents', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_student_guardian_view', code: 'student.guardian.view', name: 'View Guardians', category: 'student', description: 'Access parent and guardian contact profiles', applicableScopes: ['institution', 'campus', 'class', 'section'] },
  { id: 'perm_student_guardian_manage', code: 'student.guardian.manage', name: 'Manage Guardians', category: 'student', description: 'Link or update student guardian relationships', applicableScopes: ['institution', 'campus'] },

  // Exit & Clearance Management
  { id: 'perm_exit_view', code: 'exit.view', name: 'View Exits', category: 'student_exit', description: 'Can view exit and withdrawal requests, clearances, and dashboards.', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_exit_create', code: 'exit.create', name: 'Create Exit Request', category: 'student_exit', description: 'Can initiate or request student transfers and withdrawals.', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_exit_edit', code: 'exit.edit', name: 'Edit Exit Request', category: 'student_exit', description: 'Can edit draft or active exit details.', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_exit_submit', code: 'exit.submit', name: 'Submit Exit Request', category: 'student_exit', description: 'Can submit draft exit requests for review.', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_exit_review', code: 'exit.review', name: 'Review Exit Request', category: 'student_exit', description: 'Can review active workflows and initiate clearance.', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_exit_approve', code: 'exit.approve', name: 'Approve Exit', category: 'student_exit', description: 'Can grant final administrative approval for exits.', applicableScopes: ['institution'] },
  { id: 'perm_exit_reject', code: 'exit.reject', name: 'Reject Exit', category: 'student_exit', description: 'Can reject student transfer or withdrawal requests.', applicableScopes: ['institution'] },
  { id: 'perm_exit_complete', code: 'exit.complete', name: 'Complete Exit', category: 'student_exit', description: 'Can execute final student status transition.', applicableScopes: ['institution'] },
  { id: 'perm_exit_cancel', code: 'exit.cancel', name: 'Cancel Exit Request', category: 'student_exit', description: 'Can cancel active or draft exit requests.', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_exit_export', code: 'exit.export', name: 'Export Exit Data', category: 'student_exit', description: 'Can export exit logs and clearance reports.', applicableScopes: ['institution'] },
  { id: 'perm_clearance_view', code: 'clearance.view', name: 'View Clearance', category: 'student_exit', description: 'Can view student clearance cases and individual item logs.', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_clearance_manage', code: 'clearance.manage', name: 'Manage Clearance Case', category: 'student_exit', description: 'Can assign owners or update departments.', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_clearance_clear', code: 'clearance.clear', name: 'Clear Department', category: 'student_exit', description: 'Can mark a specific department clearance item as cleared.', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_clearance_block', code: 'clearance.block', name: 'Block Clearance', category: 'student_exit', description: 'Can place a blocking hold on student clearance.', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_clearance_waive', code: 'clearance.waive', name: 'Waive Clearance hold', category: 'student_exit', description: 'Can waive department clearance holds with authorized administrative override.', applicableScopes: ['institution'] },
  { id: 'perm_clearance_config', code: 'clearance.configure', name: 'Configure Exit Policy', category: 'student_exit', description: 'Can modify tenant-wide required clearance departments and policies.', applicableScopes: ['institution'] },

  // Transfer Certificate & Exit Documentation (Phase 6.4B)
  { id: 'perm_cert_view', code: 'certificate.view', name: 'View Certificates', category: 'certificate', description: 'Can view certificate records, queues, and document registries.', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_cert_create', code: 'certificate.create', name: 'Generate Certificate Draft', category: 'certificate', description: 'Can prepare and generate draft transfer and exit certificates.', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_cert_edit', code: 'certificate.edit', name: 'Edit Certificate Draft', category: 'certificate', description: 'Can modify draft certificate parameters before verification.', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_cert_preview', code: 'certificate.preview', name: 'Preview Certificate', category: 'certificate', description: 'Can generate and preview watermarked draft certificates.', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_cert_verify', code: 'certificate.verify', name: 'Verify Certificate', category: 'certificate', description: 'Can review and verify certificate snapshot details against records.', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_cert_issue', code: 'certificate.issue', name: 'Issue Certificate', category: 'certificate', description: 'Can sign and officially issue formal transfer certificates.', applicableScopes: ['institution'] },
  { id: 'perm_cert_download', code: 'certificate.download', name: 'Download Certificate', category: 'certificate', description: 'Can download or print official issued certificates.', applicableScopes: ['institution', 'campus', 'child', 'student'] },
  { id: 'perm_cert_reissue', code: 'certificate.reissue', name: 'Reissue Certificate', category: 'certificate', description: 'Can request or execute official certificate reissue.', applicableScopes: ['institution'] },
  { id: 'perm_cert_cancel', code: 'certificate.cancel', name: 'Cancel Certificate', category: 'certificate', description: 'Can cancel or revoke an issued certificate with permanent number reservation.', applicableScopes: ['institution'] },
  { id: 'perm_cert_export', code: 'certificate.export', name: 'Export Certificate Register', category: 'certificate', description: 'Can export certificate registers to CSV or Excel.', applicableScopes: ['institution'] },
  { id: 'perm_cert_template_view', code: 'certificate.template.view', name: 'View Certificate Templates', category: 'certificate', description: 'Can view available certificate templates and versions.', applicableScopes: ['institution'] },
  { id: 'perm_cert_template_create', code: 'certificate.template.create', name: 'Create Certificate Template', category: 'certificate', description: 'Can design and create new certificate templates.', applicableScopes: ['institution'] },
  { id: 'perm_cert_template_edit', code: 'certificate.template.edit', name: 'Edit Certificate Template', category: 'certificate', description: 'Can modify draft certificate templates.', applicableScopes: ['institution'] },
  { id: 'perm_cert_template_activate', code: 'certificate.template.activate', name: 'Activate Certificate Template', category: 'certificate', description: 'Can publish and activate certificate templates for the institution.', applicableScopes: ['institution'] },
  { id: 'perm_cert_numbering_manage', code: 'certificate.numbering.manage', name: 'Manage Certificate Numbering', category: 'certificate', description: 'Can configure sequential certificate numbering formats and patterns.', applicableScopes: ['institution'] },
  { id: 'perm_cert_signatory_manage', code: 'certificate.signatory.manage', name: 'Manage Signatories', category: 'certificate', description: 'Can configure authorized institutional signatories.', applicableScopes: ['institution'] },
  { id: 'perm_cert_verify_public', code: 'certificate.verify.public', name: 'Public Certificate Verification', category: 'certificate', description: 'Can query public certificate verification endpoints.', applicableScopes: ['institution'] },

  { id: 'perm_student_view_own', code: 'student.view_own', name: 'View Own Student Profile', category: 'student', description: 'Self-service portal access for students and their parents/guardians', applicableScopes: ['institution'] },
  { id: 'perm_student_sensitive_view', code: 'student.sensitive.view', name: 'View All Restricted Student Data', category: 'student', description: 'Access both medical and national identity restricted student information', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_student_medical_view', code: 'student.medical.view', name: 'View Restricted Medical Info', category: 'student', description: 'View student health, medical conditions, and special needs support notes', applicableScopes: ['institution', 'campus', 'class'] },
  { id: 'perm_student_identity_view', code: 'student.identity.view', name: 'View National Identity Info', category: 'student', description: 'View national identification numbers (SSN/Aadhaar/Government ID)', applicableScopes: ['institution', 'campus'] },
  
  // Family & Guardian Management
  { id: 'perm_family_view', code: 'family.view', name: 'View Family Households', category: 'student', description: 'View family grouping records and household details', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_family_create', code: 'family.create', name: 'Create Family Households', category: 'student', description: 'Create new family household groupings', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_family_edit', code: 'family.edit', name: 'Edit Family Households', category: 'student', description: 'Update family records, primary address, and contacts', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_family_export', code: 'family.export', name: 'Export Family Data', category: 'student', description: 'Export family household records to CSV or Excel', applicableScopes: ['institution'] },
  { id: 'perm_guardian_view', code: 'guardian.view', name: 'View Guardians Directory', category: 'student', description: 'Access parent/guardian independent directories', applicableScopes: ['institution', 'campus', 'class'] },
  { id: 'perm_guardian_create', code: 'guardian.create', name: 'Create Guardian Records', category: 'student', description: 'Create authoritative guardian identity records', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_guardian_edit', code: 'guardian.edit', name: 'Edit Guardian Records', category: 'student', description: 'Update guardian master profiles, phone, email, and occupation', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_guardian_link', code: 'guardian.link', name: 'Link Student & Guardian', category: 'student', description: 'Create student-guardian relationships', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_guardian_unlink', code: 'guardian.unlink', name: 'Unlink Student & Guardian', category: 'student', description: 'Remove student-guardian relationship linkages', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_guardian_relationship_view', code: 'guardian.relationship.view', name: 'View Relationships', category: 'student', description: 'View student-guardian relationship attributes', applicableScopes: ['institution', 'campus', 'class'] },
  { id: 'perm_guardian_relationship_manage', code: 'guardian.relationship.manage', name: 'Manage Relationships', category: 'student', description: 'Manage relationship permissions, communications, and emergency flags', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_guardian_portal_view', code: 'guardian.portal.view', name: 'View Portal Setup', category: 'student', description: 'View portal account activation status for guardians', applicableScopes: ['institution'] },
  { id: 'perm_guardian_portal_manage', code: 'guardian.portal.manage', name: 'Manage Portal Status', category: 'student', description: 'Enable, disable, or suspend guardian portal access', applicableScopes: ['institution'] },
  { id: 'perm_guardian_comm_view', code: 'guardian.communication.view', name: 'View Communication Preferences', category: 'student', description: 'View communication preferences for parent channels', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_guardian_comm_manage', code: 'guardian.communication.manage', name: 'Manage Communication Preferences', category: 'student', description: 'Edit communication options and contact preferences', applicableScopes: ['institution', 'campus'] },

  // Admissions Module
  { id: 'perm_admission_view', code: 'admission.view', name: 'View Admissions', category: 'admissions', description: 'View admission sessions, enquiries, and applications', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_admission_create', code: 'admission.create', name: 'Create Admissions Enquiry/App', category: 'admissions', description: 'Register new admission leads and applications', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_admission_edit', code: 'admission.edit', name: 'Edit Applications', category: 'admissions', description: 'Update application data and applicant records', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_admission_submit', code: 'admission.submit', name: 'Submit Application', category: 'admissions', description: 'Submit draft application for review', applicableScopes: ['institution'] },
  { id: 'perm_admission_verify', code: 'admission.verify', name: 'Verify Documents', category: 'admissions', description: 'Verify uploaded certificates and identity proofs', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_admission_doc_view', code: 'admission.document.view', name: 'View Admission Documents', category: 'admissions', description: 'Inspect uploaded applicant documents', applicableScopes: ['institution'] },
  { id: 'perm_admission_doc_verify', code: 'admission.document.verify', name: 'Verify Documents', category: 'admissions', description: 'Mark documents as verified or rejected', applicableScopes: ['institution'] },
  { id: 'perm_admission_test_view', code: 'admission.test.view', name: 'View Entrance Tests', category: 'admissions', description: 'View entrance exam rosters and scores', applicableScopes: ['institution'] },
  { id: 'perm_admission_test_manage', code: 'admission.test.manage', name: 'Manage Entrance Tests', category: 'admissions', description: 'Schedule and record scores for entrance exams', applicableScopes: ['institution'] },
  { id: 'perm_admission_int_view', code: 'admission.interview.view', name: 'View Admission Interviews', category: 'admissions', description: 'View interview schedules and panels', applicableScopes: ['institution'] },
  { id: 'perm_admission_int_manage', code: 'admission.interview.manage', name: 'Manage Interviews', category: 'admissions', description: 'Conduct and score applicant interviews', applicableScopes: ['institution'] },
  { id: 'perm_admission_select', code: 'admission.select', name: 'Select/Shortlist Applicants', category: 'admissions', description: 'Mark applicants as Selected or Shortlisted', applicableScopes: ['institution'] },
  { id: 'perm_admission_waitlist', code: 'admission.waitlist', name: 'Waitlist Applicants', category: 'admissions', description: 'Move applications to waiting list', applicableScopes: ['institution'] },
  { id: 'perm_admission_approve', code: 'admission.approve', name: 'Approve Admission', category: 'admissions', description: 'Grant final approval for admission offer', applicableScopes: ['institution'] },
  { id: 'perm_admission_admit', code: 'admission.admit', name: 'Admit & Generate Student', category: 'admissions', description: 'Admit applicant and convert into active Student record', applicableScopes: ['institution'] },
  { id: 'perm_admission_reject', code: 'admission.reject', name: 'Reject Application', category: 'admissions', description: 'Decline application', applicableScopes: ['institution'] },
  { id: 'perm_admission_config', code: 'admission.configure', name: 'Configure Admission Sessions', category: 'admissions', description: 'Manage sessions, seat matrix, and fee structures', applicableScopes: ['institution'] },
  { id: 'perm_admission_report', code: 'admission.report.view', name: 'View Admission Analytics', category: 'admissions', description: 'Access admission conversion funnel and reports', applicableScopes: ['institution'] },

  // Academic Module
  { id: 'perm_academic_view', code: 'academic.view', name: 'View Academic Structure', category: 'academic', description: 'View academic calendar, classes, sections, and subjects', applicableScopes: ['institution', 'campus', 'class', 'subject'] },
  { id: 'perm_academic_manage', code: 'academic.manage', name: 'Manage Academic Structure', category: 'academic', description: 'Configure academic years, terms, classes, sections, and curriculum subjects', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_teacher_view', code: 'teacher.view', name: 'View Teachers', category: 'academic', description: 'View faculty directory and teacher profiles', applicableScopes: ['institution', 'campus', 'class'] },
  { id: 'perm_teacher_create', code: 'teacher.create', name: 'Create Teacher Profile', category: 'academic', description: 'Create new faculty profiles', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_teacher_edit', code: 'teacher.edit', name: 'Edit Teacher Profile', category: 'academic', description: 'Update faculty details', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_teacher_assign', code: 'teacher.assign', name: 'Assign Teacher', category: 'academic', description: 'Allocate teachers to classes and subjects', applicableScopes: ['institution', 'campus', 'class'] },
  { id: 'perm_timetable_view', code: 'timetable.view', name: 'View Timetable', category: 'academic', description: 'View period timetables', applicableScopes: ['institution', 'campus', 'class', 'section'] },
  { id: 'perm_timetable_create', code: 'timetable.create', name: 'Create Timetable', category: 'academic', description: 'Build schedule slots', applicableScopes: ['institution', 'campus', 'class'] },
  { id: 'perm_timetable_edit', code: 'timetable.edit', name: 'Edit Timetable', category: 'academic', description: 'Modify period schedules', applicableScopes: ['institution', 'campus', 'class'] },
  { id: 'perm_timetable_delete', code: 'timetable.delete', name: 'Delete Timetable', category: 'academic', description: 'Remove timetable entries', applicableScopes: ['institution', 'campus', 'class'] },
  { id: 'perm_lesson_plan_view', code: 'lesson_plan.view', name: 'View Lesson Plans', category: 'academic', description: 'View unit syllabus and teaching plans', applicableScopes: ['institution', 'campus', 'class', 'subject'] },
  { id: 'perm_lesson_plan_create', code: 'lesson_plan.create', name: 'Create Lesson Plan', category: 'academic', description: 'Author unit lesson plans', applicableScopes: ['institution', 'class', 'subject'] },
  { id: 'perm_lesson_plan_edit', code: 'lesson_plan.edit', name: 'Edit Lesson Plan', category: 'academic', description: 'Update lesson contents', applicableScopes: ['institution', 'class', 'subject'] },
  { id: 'perm_lesson_plan_publish', code: 'lesson_plan.publish', name: 'Publish Lesson Plan', category: 'academic', description: 'Mark lesson plans as completed/published', applicableScopes: ['institution', 'class', 'subject'] },
  { id: 'perm_assignment_view', code: 'assignment.view', name: 'View Assignments', category: 'academic', description: 'View homework assignments', applicableScopes: ['institution', 'campus', 'class', 'section', 'subject'] },
  { id: 'perm_assignment_create', code: 'assignment.create', name: 'Create Assignment', category: 'academic', description: 'Draft homework assignments', applicableScopes: ['institution', 'class', 'subject'] },
  { id: 'perm_assignment_edit', code: 'assignment.edit', name: 'Edit Assignment', category: 'academic', description: 'Modify assignment details', applicableScopes: ['institution', 'class', 'subject'] },
  { id: 'perm_assignment_publish', code: 'assignment.publish', name: 'Publish Assignment', category: 'academic', description: 'Release assignments to students', applicableScopes: ['institution', 'class', 'subject'] },
  { id: 'perm_assignment_review', code: 'assignment.review', name: 'Review & Grade Submissions', category: 'academic', description: 'Evaluate homework submissions', applicableScopes: ['institution', 'class', 'subject'] },
  { id: 'perm_assessment_view', code: 'assessment.view', name: 'View Assessments', category: 'academic', description: 'View class tests and quizzes', applicableScopes: ['institution', 'campus', 'class', 'section', 'subject'] },
  { id: 'perm_assessment_create', code: 'assessment.create', name: 'Create Assessment', category: 'academic', description: 'Schedule class tests and evaluations', applicableScopes: ['institution', 'class', 'subject'] },
  { id: 'perm_assessment_edit', code: 'assessment.edit', name: 'Edit Assessment', category: 'academic', description: 'Update assessment scores', applicableScopes: ['institution', 'class', 'subject'] },
  { id: 'perm_exam_view', code: 'exam.view', name: 'View Examinations', category: 'academic', description: 'View exam schedules and datesheets', applicableScopes: ['institution', 'campus', 'class', 'section'] },
  { id: 'perm_exam_create', code: 'exam.create', name: 'Create Examination', category: 'academic', description: 'Set up examination terms', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_exam_edit', code: 'exam.edit', name: 'Edit Examination', category: 'academic', description: 'Update exam metadata', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_exam_schedule', code: 'exam.schedule', name: 'Schedule Exam Papers', category: 'academic', description: 'Assign dates, timings, and rooms to exam subjects', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_exam_approve', code: 'exam.approve', name: 'Approve Exam Schedule', category: 'academic', description: 'Sign off on datesheets', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_exam_publish', code: 'exam.publish', name: 'Publish Exam Datesheet', category: 'academic', description: 'Publish datesheet to portal', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_marks_view', code: 'marks.view', name: 'View Marks', category: 'academic', description: 'View student scores and mark sheets', applicableScopes: ['institution', 'campus', 'class', 'section', 'subject'] },
  { id: 'perm_marks_enter', code: 'marks.enter', name: 'Enter Marks', category: 'academic', description: 'Input draft marks', applicableScopes: ['institution', 'class', 'section', 'subject'] },
  { id: 'perm_marks_edit', code: 'marks.edit', name: 'Edit Marks', category: 'academic', description: 'Modify draft marks', applicableScopes: ['institution', 'class', 'section', 'subject'] },
  { id: 'perm_marks_submit', code: 'marks.submit', name: 'Submit Marks', category: 'academic', description: 'Submit marks for verification', applicableScopes: ['institution', 'class', 'section', 'subject'] },
  { id: 'perm_marks_verify', code: 'marks.verify', name: 'Verify Marks', category: 'academic', description: 'Verify submitted mark rosters', applicableScopes: ['institution', 'campus', 'class'] },
  { id: 'perm_marks_approve', code: 'marks.approve', name: 'Approve Marks', category: 'academic', description: 'Approve final mark ledger', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_marks_publish', code: 'marks.publish', name: 'Publish Marks', category: 'academic', description: 'Release marks to portals', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_report_card_view', code: 'report_card.view', name: 'View Report Cards', category: 'academic', description: 'Access report cards', applicableScopes: ['institution', 'campus', 'class', 'section'] },
  { id: 'perm_report_card_generate', code: 'report_card.generate', name: 'Generate Report Cards', category: 'academic', description: 'Generate transcripts', applicableScopes: ['institution', 'campus', 'class'] },
  { id: 'perm_report_card_verify', code: 'report_card.verify', name: 'Verify Report Cards', category: 'academic', description: 'Verify transcripts', applicableScopes: ['institution', 'campus', 'class'] },
  { id: 'perm_report_card_approve', code: 'report_card.approve', name: 'Approve Report Cards', category: 'academic', description: 'Approve report cards', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_report_card_publish', code: 'report_card.publish', name: 'Publish Report Cards', category: 'academic', description: 'Publish report cards to portal', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_promotion_view', code: 'promotion.view', name: 'View Promotion Records', category: 'academic', description: 'View promotion rosters', applicableScopes: ['institution', 'campus', 'class'] },
  { id: 'perm_promotion_execute', code: 'promotion.execute', name: 'Execute Promotion', category: 'academic', description: 'Promote or retain students', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_academic_analytics_view', code: 'academic_analytics.view', name: 'View Academic Analytics', category: 'academic', description: 'View pass rates and performance charts', applicableScopes: ['institution', 'campus', 'class'] },

  // Attendance Module (Phase 7.1 Daily Attendance Engine)
  { id: 'perm_attendance_view', code: 'attendance.view', name: 'View Attendance', category: 'attendance', description: 'View daily attendance rosters and sessions', applicableScopes: ['institution', 'campus', 'class', 'section'] },
  { id: 'perm_attendance_mark', code: 'attendance.mark', name: 'Mark Attendance', category: 'attendance', description: 'Take and save student attendance rosters', applicableScopes: ['institution', 'campus', 'class', 'section'] },
  { id: 'perm_attendance_edit', code: 'attendance.edit', name: 'Edit Attendance Drafts', category: 'attendance', description: 'Modify draft or open attendance logs', applicableScopes: ['institution', 'campus', 'class', 'section'] },
  { id: 'perm_attendance_submit', code: 'attendance.submit', name: 'Submit Attendance', category: 'attendance', description: 'Officially submit classroom attendance roll call', applicableScopes: ['institution', 'campus', 'class', 'section'] },
  { id: 'perm_attendance_lock', code: 'attendance.lock', name: 'Lock Attendance Session', category: 'attendance', description: 'Lock attendance sessions against normal modification', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_attendance_unlock', code: 'attendance.unlock', name: 'Unlock Attendance Session', category: 'attendance', description: 'Unlock attendance sessions with administrative justification', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_attendance_correct', code: 'attendance.correct', name: 'Correct Attendance Records', category: 'attendance', description: 'Execute auditable attendance corrections on past/locked records', applicableScopes: ['institution', 'campus', 'class'] },
  { id: 'perm_attendance_reports', code: 'attendance.reports', name: 'View Attendance Reports', category: 'attendance', description: 'Access daily registers, truancy, and low attendance analytics', applicableScopes: ['institution', 'campus', 'class'] },
  { id: 'perm_attendance_export', code: 'attendance.export', name: 'Export Attendance Data', category: 'attendance', description: 'Export attendance registers and analytics to CSV/Excel', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_attendance_config', code: 'attendance.config', name: 'Configure Attendance Policy', category: 'attendance', description: 'Configure late thresholds, grace periods, locking, and alerts', applicableScopes: ['institution'] },
  { id: 'perm_attendance_view_own', code: 'attendance.view_own', name: 'View Own Attendance', category: 'attendance', description: 'View self or dependent ward attendance', applicableScopes: ['institution', 'student', 'child'] },
  { id: 'perm_attendance_staff_manage', code: 'attendance.staff_manage', name: 'Manage Staff Attendance', category: 'attendance', description: 'Manage staff biometric and daily attendance', applicableScopes: ['institution', 'campus'] },

  // Finance Module
  { id: 'perm_finance_view', code: 'finance.view', name: 'View Finance', category: 'finance', description: 'View financial summaries and fee rosters', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_finance_manage', code: 'finance.manage', name: 'Manage Finance & Structure', category: 'finance', description: 'Configure fee structures and accounts', applicableScopes: ['institution'] },
  { id: 'perm_finance_fee_collect', code: 'finance.fee.collect', name: 'Collect Fees', category: 'finance', description: 'Issue receipts and collect student fees', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_finance_fee_admin', code: 'finance.fee.admin', name: 'Fee Administration', category: 'finance', description: 'Manage fee concessions and adjustments', applicableScopes: ['institution'] },
  { id: 'perm_finance_audit', code: 'finance.audit', name: 'Finance Audit', category: 'finance', description: 'Audit financial ledgers and transactions', applicableScopes: ['institution'] },

  // HR Module (Phase 7.17 Staff, HR & Workforce Governance)
  { id: 'perm_hr_view', code: 'hr.view', name: 'View HR Records', category: 'hr', description: 'View staff directory, employment profiles, and department rosters', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_hr_manage', code: 'hr.manage', name: 'Manage HR & Staffing', category: 'hr', description: 'Manage staff onboarding and lifecycle records', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_hr_create', code: 'hr.create', name: 'Create Staff Profiles', category: 'hr', description: 'Onboard and provision new staff identity records', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_hr_update', code: 'hr.update', name: 'Update Staff Profiles', category: 'hr', description: 'Modify employee master data, designations, and contacts', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_hr_manage_staff', code: 'hr.manage_staff', name: 'Manage Staff Lifecycle', category: 'hr', description: 'Authorize status transitions, transfers, promotions, and exits', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_hr_manage_assignments', code: 'hr.manage_assignments', name: 'Manage Staff Assignments', category: 'hr', description: 'Allocate teaching periods, class teacher roles, and institutional duties', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_hr_manage_leave', code: 'hr.manage_leave', name: 'Manage Leave Policies', category: 'hr', description: 'Configure leave types, annual quotas, and carry forward rules', applicableScopes: ['institution'] },
  { id: 'perm_hr_approve_leave', code: 'hr.approve_leave', name: 'Approve Leave Requests', category: 'hr', description: 'Review and approve/reject leave applications with anti-self-approval enforcement', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_hr_manage_documents', code: 'hr.manage_documents', name: 'Manage Staff Documents', category: 'hr', description: 'Upload and organize contracts, qualification proofs, and identity records', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_hr_verify_documents', code: 'hr.verify_documents', name: 'Verify Staff Documents', category: 'hr', description: 'Sign off verification stamps on submitted qualifications and credentials', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_hr_manage_training', code: 'hr.manage_training', name: 'Manage Professional Development', category: 'hr', description: 'Schedule training programs, assign staff courses, and log certifications', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_hr_manage_compliance', code: 'hr.manage_compliance', name: 'Monitor Compliance & Authorizations', category: 'hr', description: 'Track background checks, expiry alerts, and mandatory compliance standards', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_hr_manage_performance', code: 'hr.manage_performance', name: 'Manage Appraisals & Performance', category: 'hr', description: 'Run appraisal cycles, manager reviews, objectives, and finalize ratings', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_hr_manage_cases', code: 'hr.manage_cases', name: 'Manage HR & Workplace Cases', category: 'hr', description: 'Log and investigate confidential grievances, policy violations, and disciplinary cases', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_hr_manage_exit', code: 'hr.manage_exit', name: 'Manage Staff Offboarding & Clearance', category: 'hr', description: 'Coordinate multi-department asset signoffs, handovers, and exit completion', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_hr_export', code: 'hr.export', name: 'Export Workforce Data', category: 'hr', description: 'Export staff rosters, leave ledgers, workload reports, and analytics to CSV', applicableScopes: ['institution'] },
  { id: 'perm_payroll_admin', code: 'payroll.admin', name: 'Payroll Administration', category: 'hr', description: 'Process salary slips and payroll', applicableScopes: ['institution'] },
  { id: 'perm_leave_admin', code: 'leave.admin', name: 'Leave Administration', category: 'hr', description: 'Approve and manage staff leaves', applicableScopes: ['institution'] },

  // Library Module
  { id: 'perm_library_view', code: 'library.view', name: 'View Library', category: 'library', description: 'View catalog and issue history', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_library_manage', code: 'library.manage', name: 'Manage Library', category: 'library', description: 'Catalog books and issue/return media', applicableScopes: ['institution', 'campus'] },

  // Transport Module
  { id: 'perm_transport_view', code: 'transport.view', name: 'View Transport', category: 'transport', description: 'View bus routes and vehicle rosters', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_transport_manage', code: 'transport.manage', name: 'Manage Transport', category: 'transport', description: 'Configure routes, drivers, and allocations', applicableScopes: ['institution', 'campus'] },

  // Hostel Module
  { id: 'perm_hostel_view', code: 'hostel.view', name: 'View Hostel', category: 'hostel', description: 'View room allocations and attendance', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_hostel_manage', code: 'hostel.manage', name: 'Manage Hostel', category: 'hostel', description: 'Manage rooms, wardens, and mess rosters', applicableScopes: ['institution', 'campus'] },

  // IT & Smart Classroom Module
  { id: 'perm_it_view', code: 'it.view', name: 'View IT Infrastructure', category: 'it', description: 'View devices and smart classroom status', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_it_manage', code: 'it.manage', name: 'Manage IT Assets', category: 'it', description: 'Configure networks and smart board hardware', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_cctv_view', code: 'cctv.view', name: 'View CCTV Feeds', category: 'it', description: 'Access live camera monitors', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_cctv_manage', code: 'cctv.manage', name: 'Manage CCTV System', category: 'it', description: 'Configure cameras and NVR recording', applicableScopes: ['institution', 'campus'] },

  // Digital Education / LMS Module
  { id: 'perm_lms_view', code: 'lms.view', name: 'View Digital Learning', category: 'digital_education', description: 'Access digital courses and media', applicableScopes: ['institution', 'class', 'section'] },
  { id: 'perm_lms_manage', code: 'lms.manage', name: 'Manage LMS Platform', category: 'digital_education', description: 'Manage e-learning platforms and courses', applicableScopes: ['institution'] },
  { id: 'perm_lms_content_create', code: 'lms.content.create', name: 'Create LMS Content', category: 'digital_education', description: 'Author video lectures and quizzes', applicableScopes: ['institution', 'class'] },

  // Government Module
  { id: 'perm_gov_analytics_view', code: 'gov.analytics.view', name: 'View Government Analytics', category: 'government', description: 'Access state/district educational reports', applicableScopes: ['national', 'state', 'district'] },
  { id: 'perm_gov_inspection_manage', code: 'gov.inspection.manage', name: 'Manage District Inspection', category: 'government', description: 'Conduct compliance audits and school inspections', applicableScopes: ['district'] },
  { id: 'perm_gov_compliance_view', code: 'gov.compliance.view', name: 'View Compliance Reports', category: 'government', description: 'Review RTE and board compliance data', applicableScopes: ['national', 'state', 'district'] },

  // Student Support Module (Phase 7.26)
  { id: 'perm_student_support_view', code: 'student_support.view', name: 'View Student Support', category: 'student_support', description: 'View student support cases and welfares', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_student_support_create', code: 'student_support.create', name: 'Create Support Cases', category: 'student_support', description: 'Log and create student support cases', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_student_support_update', code: 'student_support.update', name: 'Update Support Cases', category: 'student_support', description: 'Modify active student support case logs', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_student_support_assign', code: 'student_support.assign', name: 'Assign Support Staff', category: 'student_support', description: 'Assign caseworkers and team members to support plans', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_student_support_manage_cases', code: 'student_support.manage_cases', name: 'Manage Support Cases', category: 'student_support', description: 'Full coordination and lifecycle management of student cases', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_student_support_manage_counseling', code: 'student_support.manage_counseling', name: 'Manage Counseling', category: 'student_support', description: 'Access counseling referrals and session logs', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_student_support_manage_welfare', code: 'student_support.manage_welfare', name: 'Manage Student Welfare', category: 'student_support', description: 'Manage and coordinate student welfare interventions', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_student_support_manage_grievances', code: 'student_support.manage_grievances', name: 'Manage Grievances', category: 'student_support', description: 'Log, investigate, and approve student/guardian grievances', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_student_support_manage_safeguarding', code: 'student_support.manage_safeguarding', name: 'Manage Safeguarding', category: 'student_support', description: 'Designated Safeguarding Officer (DSO) case management', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_student_support_escalate', code: 'student_support.escalate', name: 'Escalate Cases', category: 'student_support', description: 'Trigger manual escalation for high-priority support cases', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_student_support_manage_consent', code: 'student_support.manage_consent', name: 'Manage Consent', category: 'student_support', description: 'Authorize and track student/guardian consent statuses', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_student_support_record_disclosure', code: 'student_support.record_disclosure', name: 'Record Disclosure', category: 'student_support', description: 'Log formal external case disclosures', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_student_support_review', code: 'student_support.review', name: 'Review Support Cases', category: 'student_support', description: 'Perform formal support reviews and update action plans', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_student_support_close', code: 'student_support.close', name: 'Close Support Cases', category: 'student_support', description: 'Mark active support cases as resolved and closed', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_student_support_view_confidential', code: 'student_support.view_confidential', name: 'View Confidential Cases', category: 'student_support', description: 'Read-access to confidential support layers', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_student_support_view_restricted', code: 'student_support.view_restricted', name: 'View Restricted Cases', category: 'student_support', description: 'Read-access to restricted support layers', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_student_support_view_safeguarding', code: 'student_support.view_safeguarding', name: 'View Safeguarding Cases', category: 'student_support', description: 'Read-access to highly restricted safeguarding records', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_student_support_export', code: 'student_support.export', name: 'Export Support Records', category: 'student_support', description: 'Export case reports and analytics and logs to CSV/Excel', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_student_support_view_audit', code: 'student_support.view_audit', name: 'View Support Audit Logs', category: 'student_support', description: 'Access audit trails for student support records', applicableScopes: ['institution', 'campus'] },

  // Phase 7.30 Institutional Communication & Stakeholder Relations Permissions
  { id: 'perm_communication_view', code: 'communication.view', name: 'View Institutional Communications', category: 'communication', description: 'View circulars, notices, campaigns, and stakeholder inquiry threads', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_communication_create', code: 'communication.create', name: 'Create Communications', category: 'communication', description: 'Draft institutional circulars, notices, and message campaigns', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_communication_manage', code: 'communication.manage', name: 'Manage Communications', category: 'communication', description: 'Modify, configure, and schedule institutional communications', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_communication_review', code: 'communication.review', name: 'Review Communications', category: 'communication', description: 'Editorial review and administrative inspection of drafts', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_communication_approve', code: 'communication.approve', name: 'Approve Communications', category: 'communication', description: 'Authoritative sign-off and publication authorization', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_communication_emergency', code: 'communication.emergency', name: 'Emergency Broadcast Override', category: 'communication', description: 'Instant emergency multi-channel broadcast trigger', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_communication_stakeholder', code: 'communication.stakeholder', name: 'Manage Stakeholder Inquiries', category: 'communication', description: 'Handle parent, student, and community inquiries/grievances', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_communication_acknowledge', code: 'communication.acknowledge', name: 'Manage Acknowledgements & Waivers', category: 'communication', description: 'Track digital sign-offs and issue administrative waivers', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_communication_analytics', code: 'communication.analytics', name: 'View Delivery & SLA Analytics', category: 'communication', description: 'View channel success rates, latency, and SLA reports', applicableScopes: ['institution', 'campus'] },

  // Phase 7.31 Institutional Enterprise Risk & Incident Command Permissions
  { id: 'perm_risk_view', code: 'risk.view', name: 'View Enterprise Risk & Incidents', category: 'governance', description: 'View institutional risk registers, heatmaps, incidents, and continuity plans', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_risk_create', code: 'risk.create', name: 'Create Risk Items & Log Incidents', category: 'governance', description: 'Draft risk register items, log campus incidents, and propose mitigation actions', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_risk_manage', code: 'risk.manage', name: 'Manage Risk Registers & Controls', category: 'governance', description: 'Update risk mitigation progress, KRIs, BCPs, and safety findings', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_risk_review', code: 'risk.review', name: 'Review Risk & Continuity Plans', category: 'governance', description: 'Perform formal risk reviews, BCP evaluations, and safety inspection reviews', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_risk_approve', code: 'risk.approve', name: 'Approve Risk & Mitigation Plans', category: 'governance', description: 'Authoritative executive approval of risk registers, BCPs, and CAR closures', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_risk_incident_command', code: 'risk.incident_command', name: 'Campus Incident Command Lead', category: 'governance', description: 'Activate incident command system, assign response roles, and manage crisis operations', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_risk_safety_audit', code: 'risk.safety_audit', name: 'Conduct Safety Audits & Inspections', category: 'governance', description: 'Execute campus safety inspections, log hazard findings, and issue CAR notices', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_risk_drills', code: 'risk.drills', name: 'Coordinate Continuity & Safety Drills', category: 'governance', description: 'Schedule, conduct, and score emergency evacuations and continuity simulations', applicableScopes: ['institution', 'campus'] },
  { id: 'perm_risk_analytics', code: 'risk.analytics', name: 'View Risk Heatmaps & Analytics', category: 'governance', description: 'Access 5x5 dynamic risk heatmaps, threat exposure indices, and BCP readiness metrics', applicableScopes: ['institution', 'campus'] }
];

// Helper to filter all permissions by matching codes
const p = (...codes: string[]) => ALL_PERMISSIONS.filter(perm => codes.includes(perm.code)).map(perm => perm.code);

// Complete 72 System Master Roles
export const SYSTEM_ROLES: Role[] = [
  // ==================== A. PLATFORM ROLES (1-7) ====================
  {
    id: 'role_PLATFORM_SUPER_ADMIN',
    code: 'PLATFORM_SUPER_ADMIN',
    name: 'Platform Super Administrator',
    description: 'Complete EduTech-SMS platform administration with unconstrained access across all tenants, institutions, security, and infrastructure.',
    isSystemRole: true,
    status: 'SYSTEM',
    category: 'PLATFORM',
    applicableScopes: ['platform'],
    permissions: ALL_PERMISSIONS.map(p => p.code)
  },
  {
    id: 'role_PLATFORM_ADMIN',
    code: 'PLATFORM_ADMIN',
    name: 'Platform Administrator',
    description: 'Day-to-day platform administration, institution onboarding, and system module management.',
    isSystemRole: true,
    status: 'SYSTEM',
    category: 'PLATFORM',
    applicableScopes: ['platform'],
    permissions: p(
      'platform.admin', 'platform.operations', 'tenant.view', 'tenant.manage', 'module.manage',
      'user.view', 'user.create', 'user.edit', 'user.disable', 'role.manage', 'audit.view', 'academic_analytics.view'
    )
  },
  {
    id: 'role_PLATFORM_OPERATIONS_MANAGER',
    code: 'PLATFORM_OPERATIONS_MANAGER',
    name: 'Platform Operations Manager',
    description: 'Institution provisioning and operational management across multi-tenant environments.',
    isSystemRole: true,
    status: 'SYSTEM',
    category: 'PLATFORM',
    applicableScopes: ['platform'],
    permissions: p('platform.operations', 'tenant.view', 'tenant.manage', 'module.manage', 'user.view', 'audit.view')
  },
  {
    id: 'role_PLATFORM_SUPPORT_ADMIN',
    code: 'PLATFORM_SUPPORT_ADMIN',
    name: 'Platform Support Administrator',
    description: 'Customer and institution support management without unrestricted security permissions.',
    isSystemRole: true,
    status: 'SYSTEM',
    category: 'PLATFORM',
    applicableScopes: ['platform'],
    permissions: p('platform.support', 'tenant.view', 'user.view', 'student.view', 'academic.view')
  },
  {
    id: 'role_PLATFORM_SECURITY_ADMIN',
    code: 'PLATFORM_SECURITY_ADMIN',
    name: 'Platform Security Administrator',
    description: 'Monitors audit logs, RBAC policy configurations, authentication security, and compliance events.',
    isSystemRole: true,
    status: 'SYSTEM',
    category: 'PLATFORM',
    applicableScopes: ['platform'],
    permissions: p('platform.security', 'audit.view', 'role.manage', 'user.view', 'user.disable', 'tenant.view')
  },
  {
    id: 'role_PLATFORM_AUDITOR',
    code: 'PLATFORM_AUDITOR',
    name: 'Platform Auditor',
    description: 'Read-only platform auditing and security event inspector.',
    isSystemRole: true,
    status: 'SYSTEM',
    category: 'PLATFORM',
    applicableScopes: ['platform'],
    permissions: p('audit.view', 'tenant.view', 'user.view', 'academic_analytics.view')
  },
  {
    id: 'role_PLATFORM_TECH_ADMIN',
    code: 'PLATFORM_TECH_ADMIN',
    name: 'Platform Technical Administrator',
    description: 'Technical system maintenance, database, and infrastructure administration.',
    isSystemRole: true,
    status: 'SYSTEM',
    category: 'PLATFORM',
    applicableScopes: ['platform'],
    permissions: p('platform.tech', 'platform.admin', 'tenant.view', 'module.manage', 'audit.view')
  },

  // ==================== B. INSTITUTION MANAGEMENT ROLES (8-18) ====================
  {
    id: 'role_INSTITUTION_OWNER',
    code: 'INSTITUTION_OWNER',
    name: 'Institution Owner / Chairman',
    description: 'Overall institution ownership, financial governance, and executive oversight.',
    isSystemRole: true,
    status: 'SYSTEM',
    category: 'INSTITUTION',
    applicableScopes: ['institution'],
    permissions: ALL_PERMISSIONS.map(p => p.code).filter(c => !c.startsWith('platform.') && c !== 'cctv.view')
  },
  {
    id: 'role_INSTITUTION_ADMIN',
    code: 'INSTITUTION_ADMIN',
    name: 'Institution Administrator',
    description: 'Operational manager for institution tenant setup, campus settings, and user provisioning.',
    isSystemRole: true,
    status: 'SYSTEM',
    category: 'INSTITUTION',
    applicableScopes: ['institution', 'campus'],
    permissions: p(
      'tenant.view', 'tenant.manage', 'module.manage', 'audit.view',
      'user.view', 'user.create', 'user.edit', 'user.disable', 'role.manage',
      'student.view', 'student.create', 'student.edit', 'student.sensitive.view', 'student.medical.view', 'student.identity.view', 'academic.view', 'academic.manage',
      'teacher.view', 'teacher.create', 'teacher.edit', 'teacher.assign',
      'attendance.view', 'attendance.mark', 'attendance.edit', 'attendance.submit', 'attendance.lock', 'attendance.unlock', 'attendance.correct', 'attendance.reports', 'attendance.export', 'attendance.config', 'attendance.staff_manage',
      'admission.view', 'admission.create', 'admission.edit', 'admission.configure',
      'timetable.view', 'timetable.create', 'timetable.edit', 'exam.view', 'exam.create', 'exam.schedule',
      'marks.view', 'report_card.view', 'promotion.view', 'promotion.execute', 'academic_analytics.view',
      'exit.view', 'exit.create', 'exit.edit', 'exit.submit', 'exit.review', 'exit.approve', 'exit.reject', 'exit.complete', 'exit.cancel', 'exit.export',
      'clearance.view', 'clearance.manage', 'clearance.clear', 'clearance.block', 'clearance.waive', 'clearance.configure',
      'certificate.view', 'certificate.create', 'certificate.edit', 'certificate.preview', 'certificate.verify', 'certificate.issue', 'certificate.download', 'certificate.reissue', 'certificate.cancel', 'certificate.export',
      'certificate.template.view', 'certificate.template.create', 'certificate.template.edit', 'certificate.template.activate', 'certificate.numbering.manage', 'certificate.signatory.manage', 'certificate.verify.public'
    )
  },
  {
    id: 'role_PRINCIPAL',
    code: 'PRINCIPAL',
    name: 'Principal / Director',
    description: 'Overall academic and institutional leadership with final sign-off and approval authority.',
    isSystemRole: true,
    status: 'SYSTEM',
    category: 'INSTITUTION',
    applicableScopes: ['institution', 'campus'],
    permissions: p(
      'tenant.view', 'tenant.manage', 'module.manage', 'audit.view', 'user.view', 'user.create', 'user.edit', 'role.manage',
      'student.view', 'student.create', 'student.edit', 'student.delete', 'student.sensitive.view', 'student.medical.view', 'student.identity.view', 'academic.view', 'academic.manage',
      'teacher.view', 'teacher.create', 'teacher.edit', 'teacher.assign',
      'attendance.view', 'attendance.mark', 'attendance.edit', 'attendance.submit', 'attendance.lock', 'attendance.unlock', 'attendance.correct', 'attendance.reports', 'attendance.export', 'attendance.config', 'attendance.staff_manage',
      'admission.view', 'admission.create', 'admission.edit', 'admission.verify', 'admission.select', 'admission.approve', 'admission.admit', 'admission.reject', 'admission.configure', 'admission.report.view',
      'timetable.view', 'timetable.create', 'timetable.edit', 'timetable.delete',
      'lesson_plan.view', 'lesson_plan.create', 'lesson_plan.edit', 'lesson_plan.publish',
      'assignment.view', 'assignment.create', 'assignment.edit', 'assignment.publish', 'assignment.review',
      'assessment.view', 'assessment.create', 'assessment.edit',
      'exam.view', 'exam.create', 'exam.edit', 'exam.schedule', 'exam.approve', 'exam.publish',
      'marks.view', 'marks.enter', 'marks.edit', 'marks.submit', 'marks.verify', 'marks.approve', 'marks.publish',
      'report_card.view', 'report_card.generate', 'report_card.verify', 'report_card.approve', 'report_card.publish',
      'promotion.view', 'promotion.execute', 'academic_analytics.view',
      'exit.view', 'exit.create', 'exit.edit', 'exit.submit', 'exit.review', 'exit.approve', 'exit.reject', 'exit.complete', 'exit.cancel', 'exit.export',
      'clearance.view', 'clearance.manage', 'clearance.clear', 'clearance.block', 'clearance.waive', 'clearance.configure',
      'certificate.view', 'certificate.create', 'certificate.edit', 'certificate.preview', 'certificate.verify', 'certificate.issue', 'certificate.download', 'certificate.reissue', 'certificate.cancel', 'certificate.export',
      'certificate.template.view', 'certificate.template.create', 'certificate.template.edit', 'certificate.template.activate', 'certificate.numbering.manage', 'certificate.signatory.manage', 'certificate.verify.public'
    )
  },
  {
    id: 'role_VICE_PRINCIPAL',
    code: 'VICE_PRINCIPAL',
    name: 'Vice Principal',
    description: 'Institutional and academic management assisting Principal authority.',
    isSystemRole: true,
    status: 'SYSTEM',
    category: 'INSTITUTION',
    applicableScopes: ['institution', 'campus'],
    permissions: p(
      'tenant.view', 'user.view', 'user.create', 'user.edit',
      'student.view', 'student.create', 'student.edit', 'student.sensitive.view', 'student.medical.view', 'student.identity.view', 'academic.view', 'academic.manage',
      'teacher.view', 'teacher.assign', 'attendance.view', 'attendance.mark',
      'admission.view', 'admission.create', 'admission.verify', 'admission.select', 'admission.report.view',
      'timetable.view', 'timetable.create', 'timetable.edit',
      'lesson_plan.view', 'assignment.view', 'assessment.view',
      'exam.view', 'exam.create', 'exam.schedule', 'marks.view', 'marks.verify', 'marks.approve',
      'report_card.view', 'report_card.generate', 'report_card.verify', 'report_card.approve',
      'promotion.view', 'academic_analytics.view',
      'exit.view', 'exit.review', 'exit.cancel', 'clearance.view', 'clearance.clear', 'clearance.block'
    )
  },
  {
    id: 'role_CAMPUS_ADMIN',
    code: 'CAMPUS_ADMIN',
    name: 'Campus Administrator',
    description: 'Campus-specific administrative and physical structure operations.',
    isSystemRole: true,
    status: 'SYSTEM',
    category: 'INSTITUTION',
    applicableScopes: ['campus'],
    permissions: p(
      'tenant.view', 'user.view', 'student.view', 'student.create', 'student.edit',
      'academic.view', 'attendance.view', 'attendance.mark', 'attendance.staff_manage',
      'admission.view', 'admission.create', 'timetable.view', 'exam.view'
    )
  },
  {
    id: 'role_ACADEMIC_COORDINATOR',
    code: 'ACADEMIC_COORDINATOR',
    name: 'Academic Coordinator',
    description: 'Academic planning, curriculum structure, teacher allocations, and mark verification.',
    isSystemRole: true,
    status: 'SYSTEM',
    category: 'INSTITUTION',
    applicableScopes: ['institution', 'campus'],
    permissions: p(
      'tenant.view', 'student.view', 'student.create', 'student.edit', 'academic.view', 'academic.manage',
      'teacher.view', 'teacher.assign', 'attendance.view', 'attendance.mark', 'attendance.edit', 'attendance.submit', 'attendance.correct', 'attendance.reports',
      'timetable.view', 'timetable.create', 'timetable.edit',
      'lesson_plan.view', 'lesson_plan.publish', 'assignment.view', 'assignment.review',
      'assessment.view', 'assessment.create', 'assessment.edit',
      'exam.view', 'exam.create', 'exam.schedule', 'marks.view', 'marks.verify',
      'report_card.view', 'report_card.generate', 'report_card.verify', 'promotion.view', 'academic_analytics.view',
      'exit.view', 'exit.review', 'clearance.view', 'clearance.clear', 'clearance.block'
    )
  },
  {
    id: 'role_EXAMINATION_COORDINATOR',
    code: 'EXAMINATION_COORDINATOR',
    name: 'Examination Coordinator',
    description: 'Authorizes exam datesheets, hall rosters, mark verification, and report card releases.',
    isSystemRole: true,
    status: 'SYSTEM',
    category: 'INSTITUTION',
    applicableScopes: ['institution', 'campus'],
    permissions: p(
      'exam.view', 'exam.create', 'exam.edit', 'exam.schedule', 'exam.approve', 'exam.publish',
      'marks.view', 'marks.verify', 'marks.approve', 'marks.publish',
      'report_card.view', 'report_card.generate', 'report_card.verify', 'report_card.approve', 'academic_analytics.view'
    )
  },
  {
    id: 'role_ADMISSION_COORDINATOR',
    code: 'ADMISSION_COORDINATOR',
    name: 'Admission Coordinator',
    description: 'Admissions management, document verification, entrance tests, interviews, and candidate shortlisting.',
    isSystemRole: true,
    status: 'SYSTEM',
    category: 'INSTITUTION',
    applicableScopes: ['institution', 'campus'],
    permissions: p(
      'admission.view', 'admission.create', 'admission.edit', 'admission.verify',
      'admission.document.view', 'admission.document.verify',
      'admission.test.view', 'admission.test.manage', 'admission.interview.view', 'admission.interview.manage',
      'admission.select', 'admission.waitlist', 'admission.report.view', 'student.view'
    )
  },
  {
    id: 'role_ADMISSION_OFFICER',
    code: 'ADMISSION_OFFICER',
    name: 'Admission Officer',
    description: 'Application processing, enquiry logging, document inspection, and student profile verification.',
    isSystemRole: true,
    status: 'SYSTEM',
    category: 'INSTITUTION',
    applicableScopes: ['institution', 'campus'],
    permissions: p(
      'admission.view', 'admission.create', 'admission.edit', 'admission.submit', 'admission.verify',
      'admission.document.view', 'admission.document.verify', 'admission.test.view', 'admission.interview.view', 'student.view'
    )
  },
  {
    id: 'role_FRONT_OFFICE',
    code: 'FRONT_OFFICE',
    name: 'Front Office / Receptionist',
    description: 'Enquiries, desk management, guest logs, basic student/parent interaction.',
    isSystemRole: true,
    status: 'SYSTEM',
    category: 'INSTITUTION',
    applicableScopes: ['campus'],
    permissions: p('admission.view', 'admission.create', 'student.view', 'user.view', 'attendance.view')
  },
  {
    id: 'role_REGISTRAR_OFFICER',
    code: 'REGISTRAR_OFFICER',
    name: 'Records / Registrar Officer',
    description: 'Official student cumulative records, enrollment verification, transcripts, and archival.',
    isSystemRole: true,
    status: 'SYSTEM',
    category: 'INSTITUTION',
    applicableScopes: ['institution'],
    permissions: p(
      'student.view', 'student.create', 'student.edit', 'student.delete', 'student.identity.view', 'student.sensitive.view', 'academic.view', 'attendance.view', 'attendance.reports', 'attendance.export', 'attendance.correct', 'report_card.view', 'promotion.view',
      'exit.view', 'exit.create', 'exit.edit', 'exit.submit', 'exit.review', 'exit.approve', 'exit.complete', 'exit.cancel', 'exit.export',
      'clearance.view', 'clearance.manage', 'clearance.clear', 'clearance.block',
      'certificate.view', 'certificate.create', 'certificate.edit', 'certificate.preview', 'certificate.verify', 'certificate.issue', 'certificate.download', 'certificate.reissue', 'certificate.cancel', 'certificate.export'
    )
  },

  // ==================== C. TEACHING ROLES (19-26) ====================
  {
    id: 'role_TEACHER',
    code: 'TEACHER',
    name: 'Teacher / Faculty',
    description: 'Instruction delivery, daily attendance, lesson planning, homework issuance, continuous assessments, and mark entry.',
    isSystemRole: true,
    status: 'SYSTEM',
    category: 'ACADEMIC',
    applicableScopes: ['institution', 'campus', 'class', 'section', 'subject'],
    permissions: p(
      'student.view', 'academic.view', 'teacher.view', 'attendance.view', 'attendance.mark', 'attendance.edit', 'attendance.submit', 'timetable.view',
      'lesson_plan.view', 'lesson_plan.create', 'lesson_plan.edit', 'lesson_plan.publish',
      'assignment.view', 'assignment.create', 'assignment.edit', 'assignment.publish', 'assignment.review',
      'assessment.view', 'assessment.create', 'assessment.edit',
      'exam.view', 'marks.view', 'marks.enter', 'marks.edit', 'marks.submit', 'report_card.view'
    )
  },
  {
    id: 'role_SENIOR_TEACHER',
    code: 'SENIOR_TEACHER',
    name: 'Senior Teacher',
    description: 'Senior teaching faculty with curriculum oversight and department peer guidance.',
    isSystemRole: true,
    status: 'SYSTEM',
    category: 'ACADEMIC',
    applicableScopes: ['institution', 'campus', 'class', 'section', 'subject'],
    permissions: p(
      'student.view', 'academic.view', 'teacher.view', 'attendance.view', 'attendance.mark', 'attendance.edit', 'attendance.submit', 'timetable.view',
      'lesson_plan.view', 'lesson_plan.create', 'lesson_plan.edit', 'lesson_plan.publish',
      'assignment.view', 'assignment.create', 'assignment.edit', 'assignment.publish', 'assignment.review',
      'assessment.view', 'assessment.create', 'assessment.edit',
      'exam.view', 'marks.view', 'marks.enter', 'marks.edit', 'marks.submit', 'marks.verify', 'report_card.view'
    )
  },
  {
    id: 'role_HEAD_TEACHER',
    code: 'HEAD_TEACHER',
    name: 'Head Teacher / HOD',
    description: 'Departmental leadership, subject curriculum management, and teacher mark verification.',
    isSystemRole: true,
    status: 'SYSTEM',
    category: 'ACADEMIC',
    applicableScopes: ['institution', 'campus', 'subject'],
    permissions: p(
      'student.view', 'academic.view', 'academic.manage', 'teacher.view', 'teacher.assign',
      'attendance.view', 'attendance.mark', 'attendance.edit', 'attendance.submit', 'attendance.reports', 'timetable.view', 'timetable.create',
      'lesson_plan.view', 'lesson_plan.create', 'lesson_plan.edit', 'lesson_plan.publish',
      'assignment.view', 'assignment.create', 'assignment.edit', 'assignment.publish', 'assignment.review',
      'assessment.view', 'assessment.create', 'assessment.edit',
      'exam.view', 'marks.view', 'marks.enter', 'marks.edit', 'marks.submit', 'marks.verify', 'report_card.view', 'academic_analytics.view'
    )
  },
  {
    id: 'role_SUBJECT_COORDINATOR',
    code: 'SUBJECT_COORDINATOR',
    name: 'Subject Coordinator',
    description: 'Subject-level syllabus alignment, question paper setting, and grading consistency.',
    isSystemRole: true,
    status: 'SYSTEM',
    category: 'ACADEMIC',
    applicableScopes: ['institution', 'class', 'subject'],
    permissions: p(
      'student.view', 'academic.view', 'teacher.view', 'timetable.view',
      'lesson_plan.view', 'lesson_plan.create', 'lesson_plan.edit', 'lesson_plan.publish',
      'assignment.view', 'assignment.create', 'assignment.edit', 'assignment.publish', 'assignment.review',
      'assessment.view', 'assessment.create', 'assessment.edit',
      'exam.view', 'marks.view', 'marks.enter', 'marks.edit', 'marks.submit', 'marks.verify'
    )
  },
  {
    id: 'role_CLASS_TEACHER',
    code: 'CLASS_TEACHER',
    name: 'Class Teacher / Class Coordinator',
    description: 'Responsible for a specific class cohort, attendance monitoring, report card remarks, and parent communication.',
    isSystemRole: true,
    status: 'SYSTEM',
    category: 'ACADEMIC',
    applicableScopes: ['academic_year', 'class', 'section'],
    permissions: p(
      'student.view', 'student.edit', 'academic.view', 'attendance.view', 'attendance.mark', 'attendance.edit', 'attendance.submit', 'attendance.correct', 'attendance.reports',
      'timetable.view', 'lesson_plan.view', 'assignment.view', 'assessment.view',
      'exam.view', 'marks.view', 'report_card.view', 'report_card.verify', 'academic_analytics.view'
    )
  },
  {
    id: 'role_SPECIAL_EDUCATOR',
    code: 'SPECIAL_EDUCATOR',
    name: 'Special Educator',
    description: 'Individualized education planning (IEP) and specialized learning support.',
    isSystemRole: true,
    status: 'SYSTEM',
    category: 'ACADEMIC',
    applicableScopes: ['institution', 'student'],
    permissions: p('student.view', 'academic.view', 'lesson_plan.view', 'lesson_plan.create', 'assignment.view', 'assessment.view')
  },
  {
    id: 'role_COUNSELLOR',
    code: 'COUNSELLOR',
    name: 'Student Counsellor',
    description: 'Student counselling, behavioral support, and confidential wellbeing tracking.',
    isSystemRole: true,
    status: 'SYSTEM',
    category: 'ACADEMIC',
    applicableScopes: ['institution', 'student'],
    permissions: p('student.view', 'attendance.view')
  },
  {
    id: 'role_SUBSTITUTE_TEACHER',
    code: 'SUBSTITUTE_TEACHER',
    name: 'Substitute Teacher',
    description: 'Temporary classroom instruction and attendance marking.',
    isSystemRole: true,
    status: 'SYSTEM',
    category: 'ACADEMIC',
    applicableScopes: ['class', 'section', 'subject'],
    permissions: p('student.view', 'academic.view', 'attendance.mark', 'timetable.view', 'lesson_plan.view', 'assignment.view')
  },

  // ==================== D. STUDENT / PARENT / ALUMNI ROLES (27-29) ====================
  {
    id: 'role_STUDENT',
    code: 'STUDENT',
    name: 'Student',
    description: 'Student portal access to view own timetable, homework assignments, assessments, published exam results, and report cards.',
    isSystemRole: true,
    status: 'SYSTEM',
    category: 'STUDENT',
    applicableScopes: ['student'],
    permissions: p(
      'student.view_own', 'academic.view', 'attendance.view_own', 'timetable.view',
      'lesson_plan.view', 'assignment.view', 'assessment.view', 'exam.view', 'marks.view', 'report_card.view', 'lms.view',
      'exit.view', 'certificate.view', 'certificate.download'
    )
  },
  {
    id: 'role_PARENT_GUARDIAN',
    code: 'PARENT_GUARDIAN',
    name: 'Parent / Guardian',
    description: 'Guardian portal access to monitor linked children, attendance, timetable, assignments, fees, and published report cards.',
    isSystemRole: true,
    status: 'SYSTEM',
    category: 'PARENT',
    applicableScopes: ['child'],
    permissions: p(
      'student.view_own', 'academic.view', 'attendance.view_own', 'timetable.view',
      'assignment.view', 'assessment.view', 'exam.view', 'marks.view', 'report_card.view', 'finance.view',
      'exit.view', 'exit.create', 'exit.submit', 'exit.cancel', 'certificate.view', 'certificate.download'
    )
  },
  {
    id: 'role_ALUMNI',
    code: 'ALUMNI',
    name: 'Alumni',
    description: 'Former student portal access for historical academic transcripts and alumni networking.',
    isSystemRole: true,
    status: 'SYSTEM',
    category: 'STUDENT',
    applicableScopes: ['student'],
    permissions: p('student.view_own', 'report_card.view', 'certificate.view', 'certificate.download')
  },

  // ==================== E. FINANCE ROLES (30-34) ====================
  {
    id: 'role_FINANCE_MANAGER',
    code: 'FINANCE_MANAGER',
    name: 'Finance Manager',
    description: 'Institutional financial oversight, fee policy, budget planning, and ledger reconciliation.',
    isSystemRole: true,
    status: 'SYSTEM',
    category: 'FINANCE',
    applicableScopes: ['institution'],
    permissions: p('finance.view', 'finance.manage', 'finance.fee.collect', 'finance.fee.admin', 'finance.audit', 'tenant.view', 'student.view', 'exit.view', 'clearance.view', 'clearance.clear', 'clearance.block')
  },
  {
    id: 'role_ACCOUNTANT',
    code: 'ACCOUNTANT',
    name: 'Accountant / Bursar',
    description: 'Fee collection, receipt issuance, ledger entry, and student fee status tracking.',
    isSystemRole: true,
    status: 'SYSTEM',
    category: 'FINANCE',
    applicableScopes: ['institution', 'campus'],
    permissions: p('finance.view', 'finance.fee.collect', 'finance.fee.admin', 'tenant.view', 'student.view', 'academic.view', 'exit.view', 'clearance.view', 'clearance.clear', 'clearance.block')
  },
  {
    id: 'role_FEE_ADMINISTRATOR',
    code: 'FEE_ADMINISTRATOR',
    name: 'Fee Administrator',
    description: 'Fee structure setup, scholarship concessions, and installment plans.',
    isSystemRole: true,
    status: 'SYSTEM',
    category: 'FINANCE',
    applicableScopes: ['institution'],
    permissions: p('finance.view', 'finance.manage', 'finance.fee.admin', 'student.view')
  },
  {
    id: 'role_CASHIER',
    code: 'CASHIER',
    name: 'Cashier',
    description: 'Front-counter fee collection and daily payment receipts.',
    isSystemRole: true,
    status: 'SYSTEM',
    category: 'FINANCE',
    applicableScopes: ['campus'],
    permissions: p('finance.view', 'finance.fee.collect', 'student.view')
  },
  {
    id: 'role_FINANCE_AUDITOR',
    code: 'FINANCE_AUDITOR',
    name: 'Finance Auditor',
    description: 'Read-only financial audit and accounting compliance review.',
    isSystemRole: true,
    status: 'SYSTEM',
    category: 'FINANCE',
    applicableScopes: ['institution'],
    permissions: p('finance.view', 'finance.audit', 'audit.view')
  },

  // ==================== F. HR ROLES (35-39) ====================
  {
    id: 'role_HR_MANAGER',
    code: 'HR_MANAGER',
    name: 'HR Manager',
    description: 'Human resources management, staff recruitment, employment records, and policy compliance.',
    isSystemRole: true,
    status: 'SYSTEM',
    category: 'HR',
    applicableScopes: ['institution'],
    permissions: p('hr.view', 'hr.manage', 'payroll.admin', 'leave.admin', 'teacher.view', 'teacher.create', 'teacher.edit', 'attendance.staff_manage', 'user.view', 'user.create', 'user.edit')
  },
  {
    id: 'role_HR_OFFICER',
    code: 'HR_OFFICER',
    name: 'HR Officer',
    description: 'Staff record maintenance, document verification, and leave processing.',
    isSystemRole: true,
    status: 'SYSTEM',
    category: 'HR',
    applicableScopes: ['institution'],
    permissions: p('hr.view', 'leave.admin', 'teacher.view', 'attendance.staff_manage', 'user.view')
  },
  {
    id: 'role_PAYROLL_ADMINISTRATOR',
    code: 'PAYROLL_ADMINISTRATOR',
    name: 'Payroll Administrator',
    description: 'Staff salary calculation, tax deductions, and payroll slip distribution.',
    isSystemRole: true,
    status: 'SYSTEM',
    category: 'HR',
    applicableScopes: ['institution'],
    permissions: p('hr.view', 'payroll.admin', 'teacher.view')
  },
  {
    id: 'role_LEAVE_ADMINISTRATOR',
    code: 'LEAVE_ADMINISTRATOR',
    name: 'Leave Administrator',
    description: 'Staff leave quotas, substitute teacher requests, and attendance logs.',
    isSystemRole: true,
    status: 'SYSTEM',
    category: 'HR',
    applicableScopes: ['institution'],
    permissions: p('hr.view', 'leave.admin', 'attendance.staff_manage', 'teacher.view')
  },
  {
    id: 'role_STAFF_COORDINATOR',
    code: 'STAFF_COORDINATOR',
    name: 'Staff Coordinator',
    description: 'Staff duty rosters, non-teaching staff management, and campus welfare.',
    isSystemRole: true,
    status: 'SYSTEM',
    category: 'HR',
    applicableScopes: ['campus'],
    permissions: p('hr.view', 'teacher.view', 'attendance.staff_manage')
  },

  // ==================== G. LIBRARY ROLES (40-41) ====================
  {
    id: 'role_LIBRARIAN',
    code: 'LIBRARIAN',
    name: 'Librarian',
    description: 'Library cataloging, book issuance, inventory, and media circulation.',
    isSystemRole: true,
    status: 'SYSTEM',
    category: 'LIBRARY',
    applicableScopes: ['institution', 'campus'],
    permissions: p('library.view', 'library.manage', 'student.view', 'user.view', 'exit.view', 'clearance.view', 'clearance.clear', 'clearance.block')
  },
  {
    id: 'role_ASSISTANT_LIBRARIAN',
    code: 'ASSISTANT_LIBRARIAN',
    name: 'Assistant Librarian',
    description: 'Book desk issue/returns, catalog maintenance, and shelf arrangement.',
    isSystemRole: true,
    status: 'SYSTEM',
    category: 'LIBRARY',
    applicableScopes: ['campus'],
    permissions: p('library.view', 'student.view')
  },

  // ==================== H. TRANSPORT ROLES (42-45) ====================
  {
    id: 'role_TRANSPORT_MANAGER',
    code: 'TRANSPORT_MANAGER',
    name: 'Transport Manager',
    description: 'Transport fleet management, route planning, driver allocations, and vehicle maintenance.',
    isSystemRole: true,
    status: 'SYSTEM',
    category: 'TRANSPORT',
    applicableScopes: ['institution', 'campus'],
    permissions: p('transport.view', 'transport.manage', 'student.view')
  },
  {
    id: 'role_TRANSPORT_COORDINATOR',
    code: 'TRANSPORT_COORDINATOR',
    name: 'Transport Coordinator',
    description: 'Daily bus route tracking, student pickup/drop allocation, and parent alerts.',
    isSystemRole: true,
    status: 'SYSTEM',
    category: 'TRANSPORT',
    applicableScopes: ['campus'],
    permissions: p('transport.view', 'transport.manage', 'student.view')
  },
  {
    id: 'role_DRIVER',
    code: 'DRIVER',
    name: 'Driver',
    description: 'Bus driver route schedule and vehicle checklist.',
    isSystemRole: true,
    status: 'SYSTEM',
    category: 'TRANSPORT',
    applicableScopes: ['campus'],
    permissions: p('transport.view')
  },
  {
    id: 'role_TRANSPORT_ATTENDANT',
    code: 'TRANSPORT_ATTENDANT',
    name: 'Transport Attendant',
    description: 'Bus attendant for student boarding and route safety.',
    isSystemRole: true,
    status: 'SYSTEM',
    category: 'TRANSPORT',
    applicableScopes: ['campus'],
    permissions: p('transport.view', 'student.view')
  },

  // ==================== I. HOSTEL ROLES (46-48) ====================
  {
    id: 'role_HOSTEL_ADMIN',
    code: 'HOSTEL_ADMIN',
    name: 'Hostel Administrator',
    description: 'Hostel facility management, room capacity allocation, and warden management.',
    isSystemRole: true,
    status: 'SYSTEM',
    category: 'HOSTEL',
    applicableScopes: ['institution', 'campus'],
    permissions: p('hostel.view', 'hostel.manage', 'student.view')
  },
  {
    id: 'role_HOSTEL_WARDEN',
    code: 'HOSTEL_WARDEN',
    name: 'Hostel Warden',
    description: 'Hostel block discipline, student night roll call, mess oversight, and leave passes.',
    isSystemRole: true,
    status: 'SYSTEM',
    category: 'HOSTEL',
    applicableScopes: ['campus'],
    permissions: p('hostel.view', 'hostel.manage', 'student.view', 'attendance.mark')
  },
  {
    id: 'role_HOSTEL_SUPERVISOR',
    code: 'HOSTEL_SUPERVISOR',
    name: 'Hostel Supervisor',
    description: 'Hostel maintenance, mess inspection, and student room upkeep.',
    isSystemRole: true,
    status: 'SYSTEM',
    category: 'HOSTEL',
    applicableScopes: ['campus'],
    permissions: p('hostel.view')
  },

  // ==================== J. IT / SMART CLASSROOM ROLES (49-55) ====================
  {
    id: 'role_IT_ADMIN',
    code: 'IT_ADMIN',
    name: 'IT Administrator',
    description: 'Campus IT infrastructure, server maintenance, smart board setups, and user accounts.',
    isSystemRole: true,
    status: 'SYSTEM',
    category: 'IT',
    applicableScopes: ['institution', 'campus'],
    permissions: p('it.view', 'it.manage', 'user.view', 'user.create', 'user.edit', 'module.manage')
  },
  {
    id: 'role_IT_SUPPORT',
    code: 'IT_SUPPORT',
    name: 'IT Support Officer',
    description: 'Helpdesk ticketing, hardware troubleshooting, and classroom projector support.',
    isSystemRole: true,
    status: 'SYSTEM',
    category: 'IT',
    applicableScopes: ['campus'],
    permissions: p('it.view', 'it.manage', 'user.view')
  },
  {
    id: 'role_DEVICE_MANAGER',
    code: 'DEVICE_MANAGER',
    name: 'Device Manager',
    description: 'Student tablet and computer lab hardware inventory management.',
    isSystemRole: true,
    status: 'SYSTEM',
    category: 'IT',
    applicableScopes: ['campus'],
    permissions: p('it.view', 'it.manage')
  },
  {
    id: 'role_SMART_CLASSROOM_ADMIN',
    code: 'SMART_CLASSROOM_ADMIN',
    name: 'Smart Classroom Administrator',
    description: 'Digital teaching board software, projector networks, and interactive panel management.',
    isSystemRole: true,
    status: 'SYSTEM',
    category: 'IT',
    applicableScopes: ['institution', 'campus'],
    permissions: p('it.view', 'it.manage', 'lms.view')
  },
  {
    id: 'role_SMART_CLASSROOM_OPERATOR',
    code: 'SMART_CLASSROOM_OPERATOR',
    name: 'Smart Classroom Operator',
    description: 'On-site technical operator for smart board media delivery during classes.',
    isSystemRole: true,
    status: 'SYSTEM',
    category: 'IT',
    applicableScopes: ['campus'],
    permissions: p('it.view')
  },
  {
    id: 'role_CCTV_ADMIN',
    code: 'CCTV_ADMIN',
    name: 'CCTV Administrator',
    description: 'Surveillance camera infrastructure, recording servers, and access security policy.',
    isSystemRole: true,
    status: 'SYSTEM',
    category: 'IT',
    applicableScopes: ['campus'],
    permissions: p('cctv.view', 'cctv.manage', 'it.view')
  },
  {
    id: 'role_CCTV_OPERATOR',
    code: 'CCTV_OPERATOR',
    name: 'CCTV Operator',
    description: 'Live security monitoring and gate perimeter observation.',
    isSystemRole: true,
    status: 'SYSTEM',
    category: 'IT',
    applicableScopes: ['campus'],
    permissions: p('cctv.view')
  },

  // ==================== K. DIGITAL EDUCATION / LMS ROLES (56-60) ====================
  {
    id: 'role_LMS_ADMIN',
    code: 'LMS_ADMIN',
    name: 'LMS Administrator',
    description: 'Digital education platform administration, e-course structures, and online learning modules.',
    isSystemRole: true,
    status: 'SYSTEM',
    category: 'DIGITAL_EDUCATION',
    applicableScopes: ['institution'],
    permissions: p('lms.view', 'lms.manage', 'lms.content.create', 'academic.view')
  },
  {
    id: 'role_CONTENT_ADMIN',
    code: 'CONTENT_ADMIN',
    name: 'Content Administrator',
    description: 'Review and approval of digital curriculum content and multimedia e-books.',
    isSystemRole: true,
    status: 'SYSTEM',
    category: 'DIGITAL_EDUCATION',
    applicableScopes: ['institution'],
    permissions: p('lms.view', 'lms.manage', 'lms.content.create')
  },
  {
    id: 'role_CONTENT_CREATOR',
    code: 'CONTENT_CREATOR',
    name: 'Content Creator',
    description: 'Authoring digital lectures, interactive quizzes, and e-learning resources.',
    isSystemRole: true,
    status: 'SYSTEM',
    category: 'DIGITAL_EDUCATION',
    applicableScopes: ['class', 'subject'],
    permissions: p('lms.view', 'lms.content.create', 'lesson_plan.view')
  },
  {
    id: 'role_COURSE_COORDINATOR',
    code: 'COURSE_COORDINATOR',
    name: 'Course Coordinator',
    description: 'E-learning course scheduling, online assessment rosters, and student engagement.',
    isSystemRole: true,
    status: 'SYSTEM',
    category: 'DIGITAL_EDUCATION',
    applicableScopes: ['class', 'subject'],
    permissions: p('lms.view', 'lms.content.create', 'academic.view')
  },
  {
    id: 'role_DIGITAL_LEARNING_COORDINATOR',
    code: 'DIGITAL_LEARNING_COORDINATOR',
    name: 'Digital Learning Coordinator',
    description: 'Integration of hybrid classroom tech, online exams, and digital literacy programs.',
    isSystemRole: true,
    status: 'SYSTEM',
    category: 'DIGITAL_EDUCATION',
    applicableScopes: ['institution'],
    permissions: p('lms.view', 'lms.manage', 'academic.view')
  },

  // ==================== L. GOVERNMENT ROLES (61-72) ====================
  {
    id: 'role_NATIONAL_EDUCATION_ADMIN',
    code: 'NATIONAL_EDUCATION_ADMIN',
    name: 'National Education Administrator',
    description: 'Ministry of Education national portal administrator for nationwide institutional analytics.',
    isSystemRole: true,
    status: 'SYSTEM',
    category: 'GOVERNMENT',
    applicableScopes: ['country', 'national'],
    permissions: p('gov.analytics.view', 'gov.compliance.view', 'audit.view', 'tenant.view', 'academic_analytics.view')
  },
  {
    id: 'role_NATIONAL_EDUCATION_ANALYST',
    code: 'NATIONAL_EDUCATION_ANALYST',
    name: 'National Education Analyst',
    description: 'National educational statistics, literacy metrics, and cross-state performance analysis.',
    isSystemRole: true,
    status: 'SYSTEM',
    category: 'GOVERNMENT',
    applicableScopes: ['country', 'national'],
    permissions: p('gov.analytics.view', 'academic_analytics.view')
  },
  {
    id: 'role_NATIONAL_POLICY_ADMIN',
    code: 'NATIONAL_POLICY_ADMIN',
    name: 'National Policy Administrator',
    description: 'National curriculum policy compliance and standard framework monitoring.',
    isSystemRole: true,
    status: 'SYSTEM',
    category: 'GOVERNMENT',
    applicableScopes: ['country', 'national'],
    permissions: p('gov.analytics.view', 'gov.compliance.view')
  },
  {
    id: 'role_NATIONAL_COMPLIANCE_OFFICER',
    code: 'NATIONAL_COMPLIANCE_OFFICER',
    name: 'National Compliance Officer',
    description: 'Right to Education (RTE) national compliance inspector and institutional auditing.',
    isSystemRole: true,
    status: 'SYSTEM',
    category: 'GOVERNMENT',
    applicableScopes: ['country', 'national'],
    permissions: p('gov.compliance.view', 'audit.view', 'tenant.view')
  },
  {
    id: 'role_NATIONAL_AUDITOR',
    code: 'NATIONAL_AUDITOR',
    name: 'National Auditor',
    description: 'Independent national education system auditor.',
    isSystemRole: true,
    status: 'SYSTEM',
    category: 'GOVERNMENT',
    applicableScopes: ['country', 'national'],
    permissions: p('gov.analytics.view', 'audit.view')
  },
  {
    id: 'role_STATE_EDUCATION_ADMIN',
    code: 'STATE_EDUCATION_ADMIN',
    name: 'State Education Administrator',
    description: 'State Department of Education administrative oversight over all districts and schools.',
    isSystemRole: true,
    status: 'SYSTEM',
    category: 'GOVERNMENT',
    applicableScopes: ['state'],
    permissions: p('gov.analytics.view', 'gov.compliance.view', 'tenant.view', 'academic_analytics.view')
  },
  {
    id: 'role_STATE_EDUCATION_ANALYST',
    code: 'STATE_EDUCATION_ANALYST',
    name: 'State Education Analyst',
    description: 'Statewide student achievement metrics and district comparisons.',
    isSystemRole: true,
    status: 'SYSTEM',
    category: 'GOVERNMENT',
    applicableScopes: ['state'],
    permissions: p('gov.analytics.view', 'academic_analytics.view')
  },
  {
    id: 'role_STATE_COMPLIANCE_OFFICER',
    code: 'STATE_COMPLIANCE_OFFICER',
    name: 'State Compliance Officer',
    description: 'State board accreditation and school safety compliance auditor.',
    isSystemRole: true,
    status: 'SYSTEM',
    category: 'GOVERNMENT',
    applicableScopes: ['state'],
    permissions: p('gov.compliance.view', 'tenant.view')
  },
  {
    id: 'role_DISTRICT_EDUCATION_ADMIN',
    code: 'DISTRICT_EDUCATION_ADMIN',
    name: 'District Education Administrator',
    description: 'District Education Office (DEO) head supervising all district schools.',
    isSystemRole: true,
    status: 'SYSTEM',
    category: 'GOVERNMENT',
    applicableScopes: ['district'],
    permissions: p('gov.analytics.view', 'gov.inspection.manage', 'gov.compliance.view', 'tenant.view', 'academic_analytics.view')
  },
  {
    id: 'role_DISTRICT_EDUCATION_OFFICER',
    code: 'DISTRICT_EDUCATION_OFFICER',
    name: 'District Education Officer (DEO)',
    description: 'District educational operations, school inspections, and RTE quota verification.',
    isSystemRole: true,
    status: 'SYSTEM',
    category: 'GOVERNMENT',
    applicableScopes: ['district'],
    permissions: p('gov.analytics.view', 'gov.inspection.manage', 'gov.compliance.view', 'tenant.view')
  },
  {
    id: 'role_DISTRICT_EDUCATION_ANALYST',
    code: 'DISTRICT_EDUCATION_ANALYST',
    name: 'District Education Analyst',
    description: 'District level exam pass rate and enrollment analytics.',
    isSystemRole: true,
    status: 'SYSTEM',
    category: 'GOVERNMENT',
    applicableScopes: ['district'],
    permissions: p('gov.analytics.view', 'academic_analytics.view')
  },
  {
    id: 'role_DISTRICT_INSPECTOR',
    code: 'DISTRICT_INSPECTOR',
    name: 'District Inspector',
    description: 'On-site school inspection officer conducting physical audits and academic checks.',
    isSystemRole: true,
    status: 'SYSTEM',
    category: 'GOVERNMENT',
    applicableScopes: ['district'],
    permissions: p('gov.inspection.manage', 'gov.analytics.view', 'tenant.view', 'audit.view')
  }
];

// Alias Mapping to ensure existing legacy role codes like super_admin, principal, teacher match seamlessly
export const ROLE_ALIASES: Record<string, string> = {
  'super_admin': 'PLATFORM_SUPER_ADMIN',
  'platform_admin': 'PLATFORM_ADMIN',
  'security_admin': 'PLATFORM_SECURITY_ADMIN',
  'institution_owner': 'INSTITUTION_OWNER',
  'institution_admin': 'INSTITUTION_ADMIN',
  'principal': 'PRINCIPAL',
  'vice_principal': 'VICE_PRINCIPAL',
  'academic_coordinator': 'ACADEMIC_COORDINATOR',
  'exam_coordinator': 'EXAMINATION_COORDINATOR',
  'admission_coordinator': 'ADMISSION_COORDINATOR',
  'admission_officer': 'ADMISSION_OFFICER',
  'front_office': 'FRONT_OFFICE',
  'registrar_officer': 'REGISTRAR_OFFICER',
  'teacher': 'TEACHER',
  'senior_teacher': 'SENIOR_TEACHER',
  'class_coordinator': 'CLASS_TEACHER',
  'student': 'STUDENT',
  'parent': 'PARENT_GUARDIAN',
  'accountant': 'ACCOUNTANT',
  'hr_manager': 'HR_MANAGER',
  'govt_admin': 'DISTRICT_INSPECTOR'
};

export function hasPermission(
  userPermissions: string[],
  requiredPermission: string
): boolean {
  if (userPermissions.includes('platform.admin')) return true;
  return userPermissions.includes(requiredPermission);
}

export function getEffectivePermissions(
  user: User | null,
  tenantId?: string,
  enabledModules?: string[]
): string[] {
  if (!user || !user.roleAssignments) return [];
  const permissionsSet = new Set<string>();

  for (const assignment of user.roleAssignments) {
    if (tenantId && assignment.tenantId !== 'ALL' && assignment.tenantId !== tenantId) {
      continue;
    }
    
    // Find matching role template
    const roleCode = assignment.roleCode || '';
    const resolvedCode = ROLE_ALIASES[roleCode] || roleCode;
    
    const role = SYSTEM_ROLES.find(
      r => (resolvedCode && r.code === resolvedCode) || 
           r.id === assignment.roleId || 
           (r.code && resolvedCode && r.code.toUpperCase() === resolvedCode.toUpperCase())
    );

    if (role) {
      for (const permCode of role.permissions) {
        permissionsSet.add(permCode);
      }
    }
  }

  // Unrestricted Platform Super Admin check
  if (user.isPlatformSuperAdmin) {
    ALL_PERMISSIONS.forEach(p => permissionsSet.add(p.code));
  }

  return Array.from(permissionsSet);
}
