const fs = require('fs');
const path = require('path');
const p = path.resolve('src/components/testing/SecurityVerificationView.tsx');
let code = fs.readFileSync(p, 'utf8');

code = code.replace(
  " | '108'>('108')",
  " | '108' | '109'>('109')"
);

code = code.replace(
  "} else if (selectedSuite === '108') {\n        results = await SecurityTestService.runPhase108VerificationSuite();",
  "} else if (selectedSuite === '108') {\n        results = await SecurityTestService.runPhase108VerificationSuite();\n      } else if (selectedSuite === '109') {\n        results = await SecurityTestService.runPhase109VerificationSuite();"
);

code = code.replace(
  '<option value="108">Graduation &amp; Alumni Operations (Phase 10.8)</option>',
  '<option value="108">Graduation &amp; Alumni Operations (Phase 10.8)</option>\n            <option value="109">Lifecycle Integration &amp; Assurance (Phase 10.9)</option>'
);

fs.writeFileSync(p, code, 'utf8');
