const fs = require('fs');
let code = fs.readFileSync('src/services/admissionsService.ts', 'utf8');

code = code.replace(
  /guardianIds,/g,
  `guardians: [], // In the actual model we might just store guardian array or load them`
);

fs.writeFileSync('src/services/admissionsService.ts', code);
