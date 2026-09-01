const fs = require('fs');
const path = require('path');
const p = path.resolve('src/modules/index.ts');
let code = fs.readFileSync(p, 'utf8');

code = code.replace(
  "import { AssessmentExaminationModule } from './assessmentExamination/AssessmentExaminationModule';",
  "import { AssessmentExaminationModule } from './assessmentExamination/AssessmentExaminationModule';\nimport { ResultsTranscriptCertificationModule } from './resultsTranscriptCertification/ResultsTranscriptCertificationModule';"
);

code = code.replace(
  "ModuleEngine.register(AssessmentExaminationModule);",
  "ModuleEngine.register(AssessmentExaminationModule);\n  } catch (err) {}\n\n  try {\n    ModuleEngine.register(ResultsTranscriptCertificationModule);"
);

fs.writeFileSync(p, code, 'utf8');
