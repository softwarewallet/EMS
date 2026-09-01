const fs = require('fs');
const path = require('path');
const p = path.resolve('src/components/testing/SecurityVerificationView.tsx');
let code = fs.readFileSync(p, 'utf8');

code = code.replace(
  " | '104'>('104')",
  " | '104' | '105'>('105')"
);

code = code.replace(
  "} else if (selectedSuite === '104') {\n        results = await SecurityTestService.runPhase104VerificationSuite();",
  "} else if (selectedSuite === '104') {\n        results = await SecurityTestService.runPhase104VerificationSuite();\n      } else if (selectedSuite === '105') {\n        results = await SecurityTestService.runPhase105VerificationSuite();"
);

code = code.replace(
  '<option value="104">Institutional Student Lifecycle Operations (Phase 10.4)</option>',
  '<option value="104">Institutional Student Lifecycle Operations (Phase 10.4)</option>\n            <option value="105">Institutional Student Academic Operations (Phase 10.5)</option>'
);

fs.writeFileSync(p, code, 'utf8');
