const fs = require('fs');
const path = require('path');
const p = path.resolve('src/modules/institutionalLifecycleIntegration/InstitutionalLifecycleIntegrationModule.ts');
let code = fs.readFileSync(p, 'utf8');

code = code.replace(
  "dependencies: [\n    'mod_institutional_administration',\n    'mod_academic_management',\n    'mod_admissions_enrollment',\n    'mod_student_lifecycle',\n    'mod_student_academic_operations',\n    'mod_assessment_examination',\n    'mod_results_transcript_certification',\n    'mod_graduation_degree_alumni_credential'\n  ]",
  "dependencies: [\n    { moduleId: 'mod_institutional_administration', type: 'required', minVersion: '10.1.0' },\n    { moduleId: 'mod_academic_management', type: 'required', minVersion: '10.2.0' },\n    { moduleId: 'mod_admissions_enrollment', type: 'required', minVersion: '10.3.0' },\n    { moduleId: 'mod_student_lifecycle', type: 'required', minVersion: '10.4.0' },\n    { moduleId: 'mod_student_academic_operations', type: 'required', minVersion: '10.5.0' },\n    { moduleId: 'mod_assessment_examination', type: 'required', minVersion: '10.6.0' },\n    { moduleId: 'mod_results_transcript_certification', type: 'required', minVersion: '10.7.0' },\n    { moduleId: 'mod_graduation_degree_alumni_credential', type: 'required', minVersion: '10.8.0' }\n  ]"
);

fs.writeFileSync(p, code, 'utf8');
