const fs = require('fs');
const path = require('path');
const p = path.resolve('src/App.tsx');
let code = fs.readFileSync(p, 'utf8');

code = code.replace(
  "import { StudentAcademicOperationsWorkspace } from './components/studentAcademicOperations/StudentAcademicOperationsWorkspace';",
  "import { StudentAcademicOperationsWorkspace } from './components/studentAcademicOperations/StudentAcademicOperationsWorkspace';\nimport { AssessmentExaminationWorkspace } from './components/assessmentExamination/AssessmentExaminationWorkspace';"
);

code = code.replace(
  "<StudentAcademicOperationsWorkspace />\n            )}",
  "<StudentAcademicOperationsWorkspace />\n            )}\n\n            {(activeRoute === 'assessment_examination' || activeTab === 'assessment_examination' || activeRoute === 'nav_assessment_examination' || activeTab === 'nav_assessment_examination') && (\n              <AssessmentExaminationWorkspace />\n            )}"
);

fs.writeFileSync(p, code, 'utf8');
