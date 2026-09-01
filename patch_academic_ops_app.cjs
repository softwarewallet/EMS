const fs = require('fs');
const path = require('path');
const p = path.resolve('src/App.tsx');
let code = fs.readFileSync(p, 'utf8');

code = code.replace(
  "import { StudentLifecycleWorkspace } from './components/studentLifecycle/StudentLifecycleWorkspace';",
  "import { StudentLifecycleWorkspace } from './components/studentLifecycle/StudentLifecycleWorkspace';\nimport { StudentAcademicOperationsWorkspace } from './components/studentAcademicOperations/StudentAcademicOperationsWorkspace';"
);

code = code.replace(
  "<StudentLifecycleWorkspace />\n            )}",
  "<StudentLifecycleWorkspace />\n            )}\n\n            {(activeRoute === 'student_academic_operations' || activeTab === 'student_academic_operations' || activeRoute === 'nav_student_academic_operations' || activeTab === 'nav_student_academic_operations') && (\n              <StudentAcademicOperationsWorkspace />\n            )}"
);

fs.writeFileSync(p, code, 'utf8');
