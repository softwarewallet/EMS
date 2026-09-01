const fs = require('fs');
const path = require('path');
const p = path.resolve('src/modules/index.ts');
let code = fs.readFileSync(p, 'utf8');

code = code.replace(
  "import { InstitutionalLifecycleIntegrationModule } from './institutionalLifecycleIntegration/InstitutionalLifecycleIntegrationModule';",
  "import { InstitutionalLifecycleIntegrationModule } from './institutionalLifecycleIntegration/InstitutionalLifecycleIntegrationModule';\nimport { HumanResourcesWorkforceModule } from './humanResourcesWorkforce/HumanResourcesWorkforceModule';"
);

code = code.replace(
  "ModuleEngine.register(InstitutionalLifecycleIntegrationModule);",
  "ModuleEngine.register(InstitutionalLifecycleIntegrationModule);\n  } catch (err) {}\n\n  try {\n    ModuleEngine.register(HumanResourcesWorkforceModule);"
);

fs.writeFileSync(p, code, 'utf8');
