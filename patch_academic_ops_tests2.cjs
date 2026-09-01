const fs = require('fs');
const path = require('path');
const p = path.resolve('src/services/securityTestService.ts');
let code = fs.readFileSync(p, 'utf8');

code = code.replace(
  /category: cat/g,
  "category: 'Student Engine'"
);

fs.writeFileSync(p, code, 'utf8');
