const fs = require('fs');
let code = fs.readFileSync('src/services/admissionsService.ts', 'utf8');

code = code.replace(
  /Promise<{ student: Student; enrollment: Enrollment }>/g,
  `Promise<{ student: Student; enrollment: any }>`
);

code = code.replace(
  /contactInfo: {[\s\S]*?},/g,
  `email: app.applicant.email || '',
      phone: app.applicant.contactNumber || '',
      address: app.applicant.address,`
);

fs.writeFileSync('src/services/admissionsService.ts', code);
