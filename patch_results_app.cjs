const fs = require('fs');
const path = require('path');
const p = path.resolve('src/App.tsx');
let code = fs.readFileSync(p, 'utf8');

code = code.replace(
  "import { AssessmentExaminationWorkspace } from './components/assessmentExamination/AssessmentExaminationWorkspace';",
  "import { AssessmentExaminationWorkspace } from './components/assessmentExamination/AssessmentExaminationWorkspace';\nimport { ResultsTranscriptCertificationWorkspace } from './components/resultsTranscriptCertification/ResultsTranscriptCertificationWorkspace';"
);

code = code.replace(
  "<AssessmentExaminationWorkspace />\n            )}",
  "<AssessmentExaminationWorkspace />\n            )}\n\n            {(activeRoute === 'results_transcript_certification' || activeTab === 'results_transcript_certification' || activeRoute === 'nav_results_transcript_certification' || activeTab === 'nav_results_transcript_certification') && (\n              <ResultsTranscriptCertificationWorkspace />\n            )}"
);

fs.writeFileSync(p, code, 'utf8');
