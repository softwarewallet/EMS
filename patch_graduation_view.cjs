const fs = require('fs');
const path = require('path');
const p = path.resolve('src/components/testing/SecurityVerificationView.tsx');
let code = fs.readFileSync(p, 'utf8');

code = code.replace(
  " | '107'>('107')",
  " | '107' | '108'>('108')"
);

code = code.replace(
  "} else if (selectedSuite === '107') {\n        results = await SecurityTestService.runPhase107VerificationSuite();",
  "} else if (selectedSuite === '107') {\n        results = await SecurityTestService.runPhase107VerificationSuite();\n      } else if (selectedSuite === '108') {\n        results = await SecurityTestService.runPhase108VerificationSuite();"
);

code = code.replace(
  '<option value="107">Institutional Results &amp; Certification (Phase 10.7)</option>',
  '<option value="107">Institutional Results &amp; Certification (Phase 10.7)</option>\n            <option value="108">Graduation &amp; Alumni Operations (Phase 10.8)</option>'
);

fs.writeFileSync(p, code, 'utf8');
