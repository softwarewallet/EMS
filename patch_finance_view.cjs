const fs = require('fs');
const path = require('path');
const p = path.resolve('src/components/testing/SecurityVerificationView.tsx');
let code = fs.readFileSync(p, 'utf8');

if (!code.includes('runPhase112VerificationSuite')) {
  code = code.replace(
    " | '111'>('111')",
    " | '111' | '112'>('112')"
  );

  code = code.replace(
    "} else if (selectedSuite === '111') {\n        results = await SecurityTestService.runPhase111VerificationSuite();",
    "} else if (selectedSuite === '111') {\n        results = await SecurityTestService.runPhase111VerificationSuite();\n      } else if (selectedSuite === '112') {\n        results = await SecurityTestService.runPhase112VerificationSuite();"
  );

  code = code.replace(
    '<option value="111">Institutional HR &amp; Workforce (Phase 11.1)</option>',
    '<option value="111">Institutional HR &amp; Workforce (Phase 11.1)</option>\n            <option value="112">Finance &amp; Student Billing (Phase 11.2)</option>'
  );

  fs.writeFileSync(p, code, 'utf8');
}
