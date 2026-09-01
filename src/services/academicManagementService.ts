import {
  AcademicDiscipline,
  AcademicProgram,
  AcademicProgramVersion,
  AcademicCourse,
  AcademicCourseVersion,
  AcademicCurriculum,
  AcademicCurriculumComponent,
  AcademicCoursePrerequisite,
  AcademicCourseCorequisite,
  AcademicTerm,
  AcademicCalendarEvent,
  AcademicCourseOffering,
  AcademicSection,
  AcademicRule,
  AcademicChangeRequest,
  AcademicAuditEvent
} from '../types/academicManagement';

export class AcademicManagementService {
  private static disciplines: AcademicDiscipline[] = [
    {
      disciplineId: 'disc_cs',
      tenantId: 'tenant_default',
      code: 'CS',
      name: 'Computer Science',
      description: 'Core computing science and software systems discipline.',
      organizationUnitIdRef: 'unit_dept_cs',
      status: 'ACTIVE',
      effectiveFrom: '2024-01-01T00:00:00Z'
    },
    {
      disciplineId: 'disc_eng',
      tenantId: 'tenant_default',
      code: 'ENG',
      name: 'Engineering General',
      description: 'Foundational engineering principles and sciences.',
      organizationUnitIdRef: 'unit_dept_eng',
      status: 'ACTIVE',
      effectiveFrom: '2024-01-01T00:00:00Z'
    }
  ];

  private static programs: AcademicProgram[] = [
    {
      programId: 'prog_bsc_cs',
      tenantId: 'tenant_default',
      campusIdRef: 'campus_main',
      owningOrganizationUnitIdRef: 'unit_dept_cs',
      programCode: 'BSC-CS',
      programName: 'Bachelor of Science in Computer Science',
      programType: 'BACHELOR',
      awardType: 'B.Sc.',
      disciplineIdRef: 'disc_cs',
      duration: 4,
      durationUnit: 'YEARS',
      deliveryMode: 'IN_PERSON',
      status: 'ACTIVE',
      effectiveFrom: '2024-08-01T00:00:00Z',
      currentVersionId: 'prog_v_bsc_cs_1',
      accreditationReference: 'ACCRED-ABET-2024',
      createdAt: '2024-06-01T00:00:00Z',
      updatedAt: '2024-06-01T00:00:00Z',
      createdBy: 'sys_admin',
      updatedBy: 'sys_admin'
    }
  ];

  private static programVersions: AcademicProgramVersion[] = [
    {
      versionId: 'prog_v_bsc_cs_1',
      programId: 'prog_bsc_cs',
      versionNumber: '1.0',
      status: 'ACTIVE',
      totalCreditsRequired: 120,
      minimumGpaRequired: 2.0,
      effectiveFrom: '2024-08-01T00:00:00Z',
      notes: 'Initial ABET accredited curriculum version.',
      createdAt: '2024-06-01T00:00:00Z',
      updatedAt: '2024-06-01T00:00:00Z'
    }
  ];

  private static courses: AcademicCourse[] = [
    {
      courseId: 'crs_cs101',
      tenantId: 'tenant_default',
      courseCode: 'CS101',
      courseTitle: 'Introduction to Programming',
      shortTitle: 'Intro Prog',
      description: 'Fundamental concepts of programming using Python.',
      disciplineIdRef: 'disc_cs',
      owningOrganizationUnitIdRef: 'unit_dept_cs',
      courseType: 'CORE',
      level: '100',
      creditValue: 4,
      contactHours: 60,
      deliveryMode: 'IN_PERSON',
      gradingMode: 'LETTER',
      status: 'ACTIVE',
      currentVersionId: 'crs_v_cs101_1',
      effectiveFrom: '2024-08-01T00:00:00Z'
    },
    {
      courseId: 'crs_cs102',
      tenantId: 'tenant_default',
      courseCode: 'CS102',
      courseTitle: 'Data Structures and Algorithms',
      shortTitle: 'Data Structures',
      description: 'Linear and non-linear data structures and algorithmic analysis.',
      disciplineIdRef: 'disc_cs',
      owningOrganizationUnitIdRef: 'unit_dept_cs',
      courseType: 'CORE',
      level: '200',
      creditValue: 4,
      contactHours: 60,
      deliveryMode: 'IN_PERSON',
      gradingMode: 'LETTER',
      status: 'ACTIVE',
      currentVersionId: 'crs_v_cs102_1',
      effectiveFrom: '2024-08-01T00:00:00Z'
    }
  ];

  private static courseVersions: AcademicCourseVersion[] = [
    {
      versionId: 'crs_v_cs101_1',
      courseId: 'crs_cs101',
      versionNumber: '1.0',
      status: 'ACTIVE',
      syllabusSummary: 'Variables, loops, functions, basic OOP.',
      learningOutcomes: ['Write modular Python programs', 'Debug syntax and logical errors'],
      effectiveFrom: '2024-08-01T00:00:00Z'
    },
    {
      versionId: 'crs_v_cs102_1',
      courseId: 'crs_cs102',
      versionNumber: '1.0',
      status: 'ACTIVE',
      syllabusSummary: 'Lists, stacks, queues, trees, graphs, sorting.',
      learningOutcomes: ['Analyze time complexity (Big-O)', 'Implement balanced search trees'],
      effectiveFrom: '2024-08-01T00:00:00Z'
    }
  ];

  private static curricula: AcademicCurriculum[] = [
    {
      curriculumId: 'curr_bsc_cs_2024',
      tenantId: 'tenant_default',
      programVersionId: 'prog_v_bsc_cs_1',
      name: 'B.Sc. CS Standard Curriculum 2024',
      academicYear: '2024-2025',
      status: 'ACTIVE',
      createdAt: '2024-06-01T00:00:00Z'
    }
  ];

  private static curriculumComponents: AcademicCurriculumComponent[] = [
    {
      componentId: 'cmp_1',
      curriculumId: 'curr_bsc_cs_2024',
      courseIdRef: 'crs_cs101',
      componentType: 'MANDATORY',
      academicPeriod: 'Year 1, Semester 1',
      credits: 4,
      sequence: 1,
      effectiveFrom: '2024-08-01T00:00:00Z'
    },
    {
      componentId: 'cmp_2',
      curriculumId: 'curr_bsc_cs_2024',
      courseIdRef: 'crs_cs102',
      componentType: 'MANDATORY',
      academicPeriod: 'Year 1, Semester 2',
      credits: 4,
      sequence: 2,
      effectiveFrom: '2024-08-01T00:00:00Z'
    }
  ];

  private static prerequisites: AcademicCoursePrerequisite[] = [
    {
      prerequisiteId: 'prq_1',
      tenantId: 'tenant_default',
      courseId: 'crs_cs102',
      requiredCourseId: 'crs_cs101',
      ruleType: 'COURSE'
    }
  ];

  private static corequisites: AcademicCourseCorequisite[] = [];

  private static terms: AcademicTerm[] = [
    {
      termId: 'term_2024_fall',
      tenantId: 'tenant_default',
      campusId: 'campus_main',
      code: '2024-F',
      name: 'Fall 2024 Semester',
      academicYear: '2024-2025',
      sequence: 1,
      startDate: '2024-08-15',
      endDate: '2024-12-20',
      registrationStart: '2024-07-01',
      registrationEnd: '2024-08-10',
      teachingStart: '2024-08-20',
      teachingEnd: '2024-12-10',
      status: 'ACTIVE'
    }
  ];

  private static calendars: AcademicCalendarEvent[] = [
    {
      eventId: 'cal_1',
      tenantId: 'tenant_default',
      termId: 'term_2024_fall',
      title: 'Fall Classes Begin',
      eventType: 'CLASSES_START',
      startDate: '2024-08-20',
      endDate: '2024-08-20'
    }
  ];

  private static offerings: AcademicCourseOffering[] = [
    {
      offeringId: 'off_cs101_fall',
      tenantId: 'tenant_default',
      courseIdRef: 'crs_cs101',
      courseVersionIdRef: 'crs_v_cs101_1',
      termIdRef: 'term_2024_fall',
      campusIdRef: 'campus_main',
      organizationUnitIdRef: 'unit_dept_cs',
      deliveryMode: 'IN_PERSON',
      capacity: 120,
      status: 'ACTIVE',
      effectiveFrom: '2024-08-15T00:00:00Z'
    }
  ];

  private static sections: AcademicSection[] = [
    {
      sectionId: 'sec_cs101_01',
      offeringIdRef: 'off_cs101_fall',
      sectionCode: 'SEC-01',
      campusIdRef: 'campus_main',
      deliveryMode: 'IN_PERSON',
      capacity: 60,
      roomReference: 'Hall A101',
      scheduleReference: 'MWF 09:00 - 10:00',
      status: 'OPEN'
    }
  ];

  private static rules: AcademicRule[] = [
    {
      ruleId: 'rule_1',
      tenantId: 'tenant_default',
      code: 'RULE-MAX-CREDITS',
      title: 'Maximum Semester Credits',
      description: 'Students may not register for more than 18 credits per regular semester without dean approval.',
      ruleCategory: 'CREDIT_LIMIT',
      status: 'ACTIVE'
    }
  ];

  private static changeRequests: AcademicChangeRequest[] = [
    {
      requestId: 'acr_1',
      tenantId: 'tenant_default',
      title: 'Add Advanced AI Course',
      description: 'New elective course offering for Artificial Intelligence.',
      changeType: 'COURSE_CREATION',
      targetEntityId: 'crs_cs301',
      status: 'APPROVED',
      requestedBy: 'prof_smith',
      reviewedBy: 'dean_academic',
      approvedBy: 'vpaa_office',
      createdAt: '2024-07-10T00:00:00Z',
      updatedAt: '2024-07-12T00:00:00Z'
    }
  ];

  private static auditEvents: AcademicAuditEvent[] = [
    {
      eventId: 'aud_1',
      tenantId: 'tenant_default',
      actor: 'sys_admin',
      action: 'CREATE',
      entityType: 'PROGRAM',
      entityId: 'prog_bsc_cs',
      timestamp: '2024-06-01T00:00:00Z',
      previousHash: '0'.repeat(64),
      signatureHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
    }
  ];

  static async getDisciplines() {
    return [...this.disciplines];
  }

  static async createDiscipline(data: Omit<AcademicDiscipline, 'disciplineId'>) {
    const disciplineId = `disc_${Date.now()}`;
    const newDisc: AcademicDiscipline = { ...data, disciplineId };
    this.disciplines.push(newDisc);
    return newDisc;
  }

  static async getPrograms() {
    return [...this.programs];
  }

  static async createProgram(data: Omit<AcademicProgram, 'programId' | 'createdAt' | 'updatedAt'>) {
    const programId = `prog_${Date.now()}`;
    const now = new Date().toISOString();
    const newProg: AcademicProgram = {
      ...data,
      programId,
      createdAt: now,
      updatedAt: now
    };
    this.programs.push(newProg);
    return newProg;
  }

  static async getProgramVersions(programId?: string) {
    if (programId) {
      return this.programVersions.filter(v => v.programId === programId);
    }
    return [...this.programVersions];
  }

  static async createProgramVersion(data: Omit<AcademicProgramVersion, 'versionId' | 'createdAt' | 'updatedAt'>) {
    const versionId = `prog_v_${Date.now()}`;
    const now = new Date().toISOString();
    const newVer: AcademicProgramVersion = {
      ...data,
      versionId,
      createdAt: now,
      updatedAt: now
    };
    this.programVersions.push(newVer);
    return newVer;
  }

  static async getCourses() {
    return [...this.courses];
  }

  static async createCourse(data: Omit<AcademicCourse, 'courseId'>) {
    const courseId = `crs_${Date.now()}`;
    const newCrs: AcademicCourse = { ...data, courseId };
    this.courses.push(newCrs);
    return newCrs;
  }

  static async getCurricula() {
    return [...this.curricula];
  }

  static async getCurriculumComponents(curriculumId?: string) {
    if (curriculumId) {
      return this.curriculumComponents.filter(c => c.curriculumId === curriculumId);
    }
    return [...this.curriculumComponents];
  }

  static async addCurriculumComponent(data: Omit<AcademicCurriculumComponent, 'componentId'>) {
    const componentId = `cmp_${Date.now()}`;
    const newComp: AcademicCurriculumComponent = { ...data, componentId };
    this.curriculumComponents.push(newComp);
    return newComp;
  }

  static validateCurriculum(curriculumId: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    const comps = this.curriculumComponents.filter(c => c.curriculumId === curriculumId);
    if (comps.length === 0) {
      errors.push('Curriculum contains no components or courses.');
    }
    const seenCourses = new Set<string>();
    for (const comp of comps) {
      if (seenCourses.has(comp.courseIdRef)) {
        errors.push(`Duplicate placement of course ${comp.courseIdRef} in curriculum.`);
      }
      seenCourses.add(comp.courseIdRef);
    }
    return { valid: errors.length === 0, errors };
  }

  static async getPrerequisites() {
    return [...this.prerequisites];
  }

  static async addPrerequisite(data: Omit<AcademicCoursePrerequisite, 'prerequisiteId'>) {
    if (this.detectPrerequisiteCycle(data.courseId, data.requiredCourseId)) {
      throw new Error('Circular prerequisite chain detected and rejected.');
    }
    const prerequisiteId = `prq_${Date.now()}`;
    const newPrq: AcademicCoursePrerequisite = { ...data, prerequisiteId };
    this.prerequisites.push(newPrq);
    return newPrq;
  }

  static detectPrerequisiteCycle(startCourseId: string, targetRequiredId: string): boolean {
    if (startCourseId === targetRequiredId) return true;
    const visited = new Set<string>();
    const queue = [targetRequiredId];

    while (queue.length > 0) {
      const curr = queue.shift()!;
      if (curr === startCourseId) return true;
      if (visited.has(curr)) continue;
      visited.add(curr);

      const nextPrqs = this.prerequisites.filter(p => p.courseId === curr);
      for (const p of nextPrqs) {
        queue.push(p.requiredCourseId);
      }
    }
    return false;
  }

  static async getTerms() {
    return [...this.terms];
  }

  static async createTerm(data: Omit<AcademicTerm, 'termId'>) {
    const termId = `term_${Date.now()}`;
    const newTerm: AcademicTerm = { ...data, termId };
    this.terms.push(newTerm);
    return newTerm;
  }

  static async getOfferings() {
    return [...this.offerings];
  }

  static async createOffering(data: Omit<AcademicCourseOffering, 'offeringId'>) {
    const offeringId = `off_${Date.now()}`;
    const newOff: AcademicCourseOffering = { ...data, offeringId };
    this.offerings.push(newOff);
    return newOff;
  }

  static async getSections() {
    return [...this.sections];
  }

  static async createSection(data: Omit<AcademicSection, 'sectionId'>) {
    const sectionId = `sec_${Date.now()}`;
    const newSec: AcademicSection = { ...data, sectionId };
    this.sections.push(newSec);
    return newSec;
  }

  static async getChangeRequests() {
    return [...this.changeRequests];
  }

  static async createChangeRequest(data: Omit<AcademicChangeRequest, 'requestId' | 'createdAt' | 'updatedAt'>) {
    const requestId = `acr_${Date.now()}`;
    const now = new Date().toISOString();
    const req: AcademicChangeRequest = {
      ...data,
      requestId,
      createdAt: now,
      updatedAt: now
    };
    this.changeRequests.push(req);
    return req;
  }

  static async approveChangeRequest(requestId: string, approverUserId: string) {
    const req = this.changeRequests.find(r => r.requestId === requestId);
    if (!req) throw new Error('Change request not found.');
    if (req.requestedBy === approverUserId) {
      throw new Error('Four-Eyes policy violation: Requester cannot approve their own change request.');
    }
    req.status = 'APPROVED';
    req.approvedBy = approverUserId;
    req.updatedAt = new Date().toISOString();
    return req;
  }

  static async runDiagnostics() {
    const diagnostics: { severity: string; message: string; entityId?: string }[] = [];

    const progCodes = new Map<string, string>();
    for (const p of this.programs) {
      if (progCodes.has(p.programCode)) {
        diagnostics.push({ severity: 'HIGH', message: `Duplicate program code found: ${p.programCode}`, entityId: p.programId });
      }
      progCodes.set(p.programCode, p.programId);
    }

    const crsCodes = new Map<string, string>();
    for (const c of this.courses) {
      if (crsCodes.has(c.courseCode)) {
        diagnostics.push({ severity: 'HIGH', message: `Duplicate course code found: ${c.courseCode}`, entityId: c.courseId });
      }
      crsCodes.set(c.courseCode, c.courseId);
    }

    for (const o of this.offerings) {
      const crs = this.courses.find(c => c.courseId === o.courseIdRef);
      if (!crs || crs.status !== 'ACTIVE') {
        diagnostics.push({ severity: 'CRITICAL', message: `Course offering ${o.offeringId} references inactive or missing course.`, entityId: o.offeringId });
      }
    }

    if (diagnostics.length === 0) {
      diagnostics.push({ severity: 'INFORMATIONAL', message: 'All academic integrity checks passed cleanly.' });
    }

    return diagnostics;
  }

  static async generateAuditHash(tenantId: string, actor: string, action: string, entityType: string, entityId: string, timestamp: string, previousHash: string): Promise<string> {
    const payload = `${tenantId}:${actor}:${action}:${entityType}:${entityId}:${timestamp}:${previousHash}`;
    const encoder = new TextEncoder();
    const data = encoder.encode(payload);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  }
}

// Comprehensive flexible stub implementations
export class ExaminationService {
  static async getExaminations(...args: any[]) { return []; }
  static async getSchedules(...args: any[]) { return []; }
  static async getMarks(...args: any[]) { return []; }
  static async saveExamination(...args: any[]) { return args[0]; }
  static async saveSchedule(...args: any[]) { return args[0]; }
  static async saveMarks(...args: any[]) { return args[0]; }
}

export class TeacherService {
  static async getTeachers(...args: any[]) { return []; }
  static async saveTeacher(...args: any[]) { return args[0]; }
}

export class AssignmentService {
  static async getAssignments(...args: any[]) { return []; }
  static async getSubmissions(...args: any[]) { return []; }
  static async saveAssignment(...args: any[]) { return args[0]; }
  static async gradeSubmission(...args: any[]) { return args[0]; }
}

export class AssessmentService {
  static async getAssessments(...args: any[]) { return []; }
  static async getResults(...args: any[]) { return []; }
  static async saveAssessment(...args: any[]) { return args[0]; }
  static async recordResults(...args: any[]) { return args[0]; }
}

export class GradingService {
  static getGradingScales(...args: any[]) { return []; }
  static getGradingScheme(...args: any[]) { return []; }
  static calculateGrade(...args: any[]): { grade: string; gradePoint: number } { return { grade: 'A', gradePoint: 4.0 }; }
}

export class LessonPlanService {
  static async getLessonPlans(...args: any[]) { return []; }
  static async saveLessonPlan(...args: any[]) { return args[0]; }
  static async updateStatus(...args: any[]) { return true; }
}

export class ReportCardService {
  static async getReportCards(...args: any[]) { return []; }
  static async generateBatchReportCards(...args: any[]) { return []; }
  static async updateStatus(...args: any[]) { return true; }
}

export class PromotionService {
  static async getPromotions(...args: any[]) { return []; }
  static async getPromotionBatches(...args: any[]) { return []; }
  static async getPromotionPolicy(...args: any[]) { return {}; }
  static async savePromotionPolicy(...args: any[]) { return args[0]; }
  static async closeAcademicYearCheck(...args: any[]) { return true; }
  static async openAcademicYearCheck(...args: any[]) { return true; }
  static async executePromotionBatch(...args: any[]) { return true; }
  static async reassignSection(...args: any[]) { return true; }
}

export class TeacherAssignmentService {
  static async getTeacherAssignments(...args: any[]) { return []; }
  static async getAssignments(...args: any[]) { return []; }
  static async assignTeacher(...args: any[]) { return args[0]; }
  static async removeAssignment(...args: any[]) { return true; }
}

export class TimetableService {
  static getTimetables(...args: any[]) { return []; }
  static getEntries(...args: any[]) { return []; }
  static detectConflicts(...args: any[]): any[] { return []; }
  static saveEntry(...args: any[]) { return args[0]; }
  static deleteEntry(...args: any[]) { return true; }
}
