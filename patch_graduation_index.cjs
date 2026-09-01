const fs = require('fs');
const path = require('path');
const p = path.resolve('src/modules/index.ts');
let code = fs.readFileSync(p, 'utf8');

code = code.replace(
  "import { ResultsTranscriptCertificationModule } from './resultsTranscriptCertification/ResultsTranscriptCertificationModule';",
  "import { ResultsTranscriptCertificationModule } from './resultsTranscriptCertification/ResultsTranscriptCertificationModule';\nimport { GraduationDegreeAlumniCredentialModule } from './graduationDegreeAlumniCredential/GraduationDegreeAlumniCredentialModule';"
);

code = code.replace(
  "ModuleEngine.register(ResultsTranscriptCertificationModule);",
  "ModuleEngine.register(ResultsTranscriptCertificationModule);\n  } catch (err) {}\n\n  try {\n    ModuleEngine.register(GraduationDegreeAlumniCredentialModule);"
);

fs.writeFileSync(p, code, 'utf8');
