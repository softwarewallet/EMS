const fs = require('fs');
const path = require('path');
const p = path.resolve('src/modules/index.ts');
let code = fs.readFileSync(p, 'utf8');

if (!code.includes('InstitutionalFinanceOperationsModule')) {
  code = code.replace(
    "import { HumanResourcesWorkforceModule } from './humanResourcesWorkforce/HumanResourcesWorkforceModule';",
    "import { HumanResourcesWorkforceModule } from './humanResourcesWorkforce/HumanResourcesWorkforceModule';\nimport { InstitutionalFinanceOperationsModule } from './institutionalFinanceOperations/InstitutionalFinanceOperationsModule';"
  );
  code = code.replace(
    "ModuleEngine.register(HumanResourcesWorkforceModule);",
    "ModuleEngine.register(HumanResourcesWorkforceModule);\n  } catch (err) {}\n\n  try {\n    ModuleEngine.register(InstitutionalFinanceOperationsModule);"
  );
  fs.writeFileSync(p, code, 'utf8');
}
