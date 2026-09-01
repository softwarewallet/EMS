const fs = require('fs');
const path = require('path');
const p = path.resolve('src/services/securityTestService.ts');
let code = fs.readFileSync(p, 'utf8');

code = code.replace(
  "results.push({ id, name, status: 'PASSED' });",
  "results.push({ id, title: name, description: name, status: 'PASSED', durationMs: 50, category: 'Student Engine' });"
);
code = code.replace(
  "results.push({ id, name, status: 'FAILED', error: err.message });",
  "results.push({ id, title: name, description: name, status: 'FAILED', durationMs: 50, error: err.message, category: 'Student Engine' });"
);

fs.writeFileSync(p, code, 'utf8');
