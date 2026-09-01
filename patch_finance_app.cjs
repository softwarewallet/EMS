const fs = require('fs');
const path = require('path');
const p = path.resolve('src/App.tsx');
let code = fs.readFileSync(p, 'utf8');

if (!code.includes('InstitutionalFinanceOperationsWorkspace')) {
  code = code.replace(
    "import { HumanResourcesWorkforceWorkspace } from './components/humanResourcesWorkforce/HumanResourcesWorkforceWorkspace';",
    "import { HumanResourcesWorkforceWorkspace } from './components/humanResourcesWorkforce/HumanResourcesWorkforceWorkspace';\nimport { InstitutionalFinanceOperationsWorkspace } from './components/institutionalFinanceOperations/InstitutionalFinanceOperationsWorkspace';"
  );
  code = code.replace(
    "<HumanResourcesWorkforceWorkspace />\n            )}",
    "<HumanResourcesWorkforceWorkspace />\n            )}\n\n            {(activeRoute === 'institutional_finance_operations' || activeTab === 'institutional_finance_operations' || activeRoute === 'nav_institutional_finance_operations' || activeTab === 'nav_institutional_finance_operations') && (\n              <InstitutionalFinanceOperationsWorkspace />\n            )}"
  );
  fs.writeFileSync(p, code, 'utf8');
}
