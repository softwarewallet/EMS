const fs = require('fs');
const path = require('path');
const p = path.resolve('src/services/securityTestService.ts');
let code = fs.readFileSync(p, 'utf8');

code = code.replace(
  "status: 'PASS', category: 'Phase 10.4 Student Lifecycle Operations'",
  "status: 'PASSED'"
);
code = code.replace(
  "status: 'FAIL', error: err.message, category: 'Phase 10.4 Student Lifecycle Operations'",
  "status: 'FAILED', error: err.message"
);

fs.writeFileSync(p, code, 'utf8');
