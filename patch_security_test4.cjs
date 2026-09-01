const fs = require('fs');
const path = require('path');
const p = path.resolve('src/services/securityTestService.ts');
let code = fs.readFileSync(p, 'utf8');

// The string was matched, we want to fix it back to category Student Engine.
// Actually the previous script already set category: 'Student Engine'

fs.writeFileSync(p, code, 'utf8');
