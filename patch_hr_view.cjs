const fs = require('fs');
const path = require('path');
const p = path.resolve('src/components/testing/SecurityVerificationView.tsx');
let code = fs.readFileSync(p, 'utf8');

code = code.replace(
  " | '109'>('109')",
  " | '109' | '111'>('111')"
);

code = code.replace(
  "} else if (selectedSuite === '109') {\n        results = await SecurityTestService.runPhase109VerificationSuite();",
  "} else if (selectedSuite === '109') {\n        results = await SecurityTestService.runPhase109VerificationSuite();\n      } else if (selectedSuite === '111') {\n        results = await SecurityTestService.runPhase111VerificationSuite();"
);

code = code.replace(
  '<option value="109">Lifecycle Integration &amp; Assurance (Phase 10.9)</option>',
  '<option value="109">Lifecycle Integration &amp; Assurance (Phase 10.9)</option>\n            <option value="111">Institutional HR &amp; Workforce (Phase 11.1)</option>'
);

fs.writeFileSync(p, code, 'utf8');
