const fs = require('fs');
const path = require('path');
const p = path.resolve('src/App.tsx');
let code = fs.readFileSync(p, 'utf8');

code = code.replace(
  "import { ResultsTranscriptCertificationWorkspace } from './components/resultsTranscriptCertification/ResultsTranscriptCertificationWorkspace';",
  "import { ResultsTranscriptCertificationWorkspace } from './components/resultsTranscriptCertification/ResultsTranscriptCertificationWorkspace';\nimport { GraduationDegreeAlumniCredentialWorkspace } from './components/graduationDegreeAlumniCredential/GraduationDegreeAlumniCredentialWorkspace';"
);

code = code.replace(
  "<ResultsTranscriptCertificationWorkspace />\n            )}",
  "<ResultsTranscriptCertificationWorkspace />\n            )}\n\n            {(activeRoute === 'graduation_degree_alumni_credential' || activeTab === 'graduation_degree_alumni_credential' || activeRoute === 'nav_graduation_degree_alumni_credential' || activeTab === 'nav_graduation_degree_alumni_credential') && (\n              <GraduationDegreeAlumniCredentialWorkspace />\n            )}"
);

fs.writeFileSync(p, code, 'utf8');
