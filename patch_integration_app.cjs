const fs = require('fs');
const path = require('path');
const p = path.resolve('src/App.tsx');
let code = fs.readFileSync(p, 'utf8');

code = code.replace(
  "import { GraduationDegreeAlumniCredentialWorkspace } from './components/graduationDegreeAlumniCredential/GraduationDegreeAlumniCredentialWorkspace';",
  "import { GraduationDegreeAlumniCredentialWorkspace } from './components/graduationDegreeAlumniCredential/GraduationDegreeAlumniCredentialWorkspace';\nimport { InstitutionalLifecycleIntegrationWorkspace } from './components/institutionalLifecycleIntegration/InstitutionalLifecycleIntegrationWorkspace';"
);

code = code.replace(
  "<GraduationDegreeAlumniCredentialWorkspace />\n            )}",
  "<GraduationDegreeAlumniCredentialWorkspace />\n            )}\n\n            {(activeRoute === 'institutional_lifecycle_integration' || activeTab === 'institutional_lifecycle_integration' || activeRoute === 'nav_institutional_lifecycle_integration' || activeTab === 'nav_institutional_lifecycle_integration') && (\n              <InstitutionalLifecycleIntegrationWorkspace />\n            )}"
);

fs.writeFileSync(p, code, 'utf8');
