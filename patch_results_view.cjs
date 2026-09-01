const fs = require('fs');
const path = require('path');
const p = path.resolve('src/components/testing/SecurityVerificationView.tsx');
let code = fs.readFileSync(p, 'utf8');

code = code.replace(
  " | '106'>('106')",
  " | '106' | '107'>('107')"
);

code = code.replace(
  "} else if (selectedSuite === '106') {\n        results = await SecurityTestService.runPhase106VerificationSuite();",
  "} else if (selectedSuite === '106') {\n        results = await SecurityTestService.runPhase106VerificationSuite();\n      } else if (selectedSuite === '107') {\n        results = await SecurityTestService.runPhase107VerificationSuite();"
);

code = code.replace(
  '<option value="106">Institutional Assessment &amp; Examination (Phase 10.6)</option>',
  '<option value="106">Institutional Assessment &amp; Examination (Phase 10.6)</option>\n            <option value="107">Institutional Results &amp; Certification (Phase 10.7)</option>'
);

fs.writeFileSync(p, code, 'utf8');
