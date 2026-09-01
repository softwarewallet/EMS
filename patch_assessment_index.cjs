const fs = require('fs');
const path = require('path');
const p = path.resolve('src/modules/index.ts');
let code = fs.readFileSync(p, 'utf8');

code = code.replace(
  "import { StudentAcademicOperationsModule } from './studentAcademicOperations/StudentAcademicOperationsModule';",
  "import { StudentAcademicOperationsModule } from './studentAcademicOperations/StudentAcademicOperationsModule';\nimport { AssessmentExaminationModule } from './assessmentExamination/AssessmentExaminationModule';"
);

code = code.replace(
  "ModuleEngine.register(StudentAcademicOperationsModule);",
  "ModuleEngine.register(StudentAcademicOperationsModule);\n  } catch (err) {}\n\n  try {\n    ModuleEngine.register(AssessmentExaminationModule);"
);

fs.writeFileSync(p, code, 'utf8');
