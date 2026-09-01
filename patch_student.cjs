const fs = require('fs');
let code = fs.readFileSync('src/services/admissionsService.ts', 'utf8');

code = code.replace(
  /bloodGroup: 'Unknown' as any/g,
  ""
);

// also fix the enrollment object creation
code = code.replace(
  /const newEnrollment: Enrollment = {[\s\S]*?};/g,
  `// In this architecture, student holds enrollment data
    const newEnrollment = null;
    newStudent.currentAcademicYearId = academicYearId;
    newStudent.currentClassId = classId;
    newStudent.currentSectionId = sectionId;
    newStudent.enrollmentDate = new Date().toISOString();`
);

code = code.replace(
  /await FirebaseService.setDocument\(ENROLLMENTS_COL, enrollmentId, newEnrollment\);/g,
  ``
);

code = code.replace(
  /return { student: newStudent, enrollment: newEnrollment };/g,
  `return { student: newStudent, enrollment: newEnrollment as any };`
);

code = code.replace(
  /status: 'active',/g,
  `status: 'enrolled',`
);

fs.writeFileSync('src/services/admissionsService.ts', code);
