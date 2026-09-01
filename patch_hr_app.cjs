const fs = require('fs');
const path = require('path');
const p = path.resolve('src/App.tsx');
let code = fs.readFileSync(p, 'utf8');

code = code.replace(
  "import { InstitutionalLifecycleIntegrationWorkspace } from './components/institutionalLifecycleIntegration/InstitutionalLifecycleIntegrationWorkspace';",
  "import { InstitutionalLifecycleIntegrationWorkspace } from './components/institutionalLifecycleIntegration/InstitutionalLifecycleIntegrationWorkspace';\nimport { HumanResourcesWorkforceWorkspace } from './components/humanResourcesWorkforce/HumanResourcesWorkforceWorkspace';"
);

code = code.replace(
  "<InstitutionalLifecycleIntegrationWorkspace />\n            )}",
  "<InstitutionalLifecycleIntegrationWorkspace />\n            )}\n\n            {(activeRoute === 'human_resources_workforce' || activeTab === 'human_resources_workforce' || activeRoute === 'nav_human_resources_workforce' || activeTab === 'nav_human_resources_workforce') && (\n              <HumanResourcesWorkforceWorkspace />\n            )}"
);

fs.writeFileSync(p, code, 'utf8');
