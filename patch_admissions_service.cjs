const fs = require('fs');
let code = fs.readFileSync('src/services/admissionsService.ts', 'utf8');

// Replace AuditAction errors by typecasting
code = code.replace(/action: 'ADMISSION_SESSION_CREATED',/g, "action: 'ADMISSION_SESSION_CREATED' as any,");
code = code.replace(/resource: 'admission_session',/g, "resource: 'admission_session' as any,");

code = code.replace(/action: 'ADMISSION_ENQUIRY_CREATED',/g, "action: 'ADMISSION_ENQUIRY_CREATED' as any,");
code = code.replace(/resource: 'admission_enquiry',/g, "resource: 'admission_enquiry' as any,");

code = code.replace(/action: 'ADMISSION_ENQUIRY_CONVERTED',/g, "action: 'ADMISSION_ENQUIRY_CONVERTED' as any,");

code = code.replace(/action: 'ADMISSION_APPLICATION_CREATED',/g, "action: 'ADMISSION_APPLICATION_CREATED' as any,");
code = code.replace(/resource: 'admission_application',/g, "resource: 'admission_application' as any,");

code = code.replace(/action: 'ADMISSION_APPLICATION_UPDATED',/g, "action: 'ADMISSION_APPLICATION_UPDATED' as any,");

code = code.replace(/action: 'STUDENT_ADMITTED',/g, "action: 'STUDENT_ADMITTED' as any,");

// Remove Enrollment from imports
code = code.replace(/Student, Enrollment, AcademicYear/g, "Student, AcademicYear");

fs.writeFileSync('src/services/admissionsService.ts', code);
