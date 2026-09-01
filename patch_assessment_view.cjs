const fs = require('fs');
const path = require('path');
const p = path.resolve('src/components/testing/SecurityVerificationView.tsx');
let code = fs.readFileSync(p, 'utf8');

code = code.replace(
  " | '105'>('105')",
  " | '105' | '106'>('106')"
);

code = code.replace(
  "} else if (selectedSuite === '105') {\n        results = await SecurityTestService.runPhase105VerificationSuite();",
  "} else if (selectedSuite === '105') {\n        results = await SecurityTestService.runPhase105VerificationSuite();\n      } else if (selectedSuite === '106') {\n        results = await SecurityTestService.runPhase106VerificationSuite();"
);

code = code.replace(
  '<option value="105">Institutional Student Academic Operations (Phase 10.5)</option>',
  '<option value="105">Institutional Student Academic Operations (Phase 10.5)</option>\n            <option value="106">Institutional Assessment &amp; Examination (Phase 10.6)</option>'
);

fs.writeFileSync(p, code, 'utf8');
