const fs = require('fs');
const path = require('path');
const p = path.resolve('src/modules/index.ts');
let code = fs.readFileSync(p, 'utf8');

code = code.replace(
  "import { StudentLifecycleModule } from './studentLifecycle/StudentLifecycleModule';",
  "import { StudentLifecycleModule } from './studentLifecycle/StudentLifecycleModule';\nimport { StudentAcademicOperationsModule } from './studentAcademicOperations/StudentAcademicOperationsModule';"
);

code = code.replace(
  "ModuleEngine.register(StudentLifecycleModule);",
  "ModuleEngine.register(StudentLifecycleModule);\n  } catch (err) {}\n\n  try {\n    ModuleEngine.register(StudentAcademicOperationsModule);"
);

fs.writeFileSync(p, code, 'utf8');
