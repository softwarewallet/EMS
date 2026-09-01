const fs = require('fs');
const path = require('path');
const p = path.resolve('src/modules/index.ts');
let code = fs.readFileSync(p, 'utf8');

code = code.replace(
  "import { GraduationDegreeAlumniCredentialModule } from './graduationDegreeAlumniCredential/GraduationDegreeAlumniCredentialModule';",
  "import { GraduationDegreeAlumniCredentialModule } from './graduationDegreeAlumniCredential/GraduationDegreeAlumniCredentialModule';\nimport { InstitutionalLifecycleIntegrationModule } from './institutionalLifecycleIntegration/InstitutionalLifecycleIntegrationModule';"
);

code = code.replace(
  "ModuleEngine.register(GraduationDegreeAlumniCredentialModule);",
  "ModuleEngine.register(GraduationDegreeAlumniCredentialModule);\n  } catch (err) {}\n\n  try {\n    ModuleEngine.register(InstitutionalLifecycleIntegrationModule);"
);

fs.writeFileSync(p, code, 'utf8');
