const fs = require('fs');
let code = fs.readFileSync('src/services/admissionsService.ts', 'utf8');

code = code.replace(
  /const newStudent: Student = {/g,
  `const newStudent: Student = {
      dateOfBirth: app.applicant.dateOfBirth,
      gender: app.applicant.gender as any,
      enrollmentDate: new Date().toISOString(),
      currentAcademicYearId: academicYearId,
      currentClassId: classId,
      currentSectionId: sectionId,
      updatedAt: new Date().toISOString(),`
);

fs.writeFileSync('src/services/admissionsService.ts', code);
