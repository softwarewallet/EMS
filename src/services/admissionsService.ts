import { FirebaseService } from './firebaseService';
import { AuditService } from './auditService';
import { FamilyService } from './familyService';
import { 
  AdmissionSession, 
  AdmissionEnquiry, 
  AdmissionApplication, 
  AdmissionDocument,
  AdmissionTest,
  AdmissionInterview,
  AdmissionSessionConfig,
  ApplicationStatus,
  AdmissionMeritEntry,
  AdmissionWaitlistEntry
} from '../types/admissions';
import { Guardian, Student } from '../types';

const ADMISSION_SESSIONS_COL = 'admission_sessions';
const ADMISSION_CONFIG_COL = 'admission_configurations';
const ADMISSION_ENQUIRIES_COL = 'admission_enquiries';
const ADMISSION_APPLICATIONS_COL = 'admission_applications';
const ADMISSION_DOCUMENTS_COL = 'admission_documents';
const ADMISSION_TESTS_COL = 'admission_tests';
const ADMISSION_INTERVIEWS_COL = 'admission_interviews';
const ADMISSION_WAITLIST_COL = 'admission_waitlists';
const STUDENTS_COL = 'students';
const GUARDIANS_COL = 'guardians';

export class AdmissionsService {
  // ================== DEFAULT CONFIGURATION ==================
  static getDefaultConfig(): AdmissionSessionConfig {
    return {
      applicationPrefix: 'ADM',
      autoNumbering: true,
      requireEntranceTest: false,
      requireInterview: false,
      requireEligibilityReview: true,
      requireApprovalWorkflow: true,
      meritWeights: {
        entranceTest: 50,
        previousMarks: 30,
        interview: 20
      },
      requiredDocuments: [
        'Birth Certificate',
        'Previous School Certificate',
        'Transfer Certificate',
        'Photograph',
        'Identity Proof',
        'Address Proof'
      ],
      classCapacityLimits: {
        cls_viii: 40,
        cls_ix: 40,
        cls_x: 40
      }
    };
  }

  static async getTenantConfig(tenantId: string): Promise<AdmissionSessionConfig> {
    const config = await FirebaseService.getDocument<AdmissionSessionConfig>(ADMISSION_CONFIG_COL, tenantId);
    return config || this.getDefaultConfig();
  }

  static async saveTenantConfig(
    tenantId: string, 
    config: AdmissionSessionConfig,
    performedBy: { userId: string; email: string; name: string }
  ): Promise<void> {
    await FirebaseService.setDocument(ADMISSION_CONFIG_COL, tenantId, config);
    await AuditService.log({
      tenantId,
      userId: performedBy.userId,
      userEmail: performedBy.email,
      userDisplayName: performedBy.name,
      action: 'ADMISSION_SESSION_UPDATED' as any,
      resource: 'admission_config' as any,
      resourceId: tenantId,
      resourceName: 'Admissions Tenant Configuration',
      newValue: config,
      result: 'SUCCESS'
    });
  }

  // ================== SESSIONS ==================
  static async getSessions(tenantId: string): Promise<AdmissionSession[]> {
    return FirebaseService.getTenantCollection<AdmissionSession>(ADMISSION_SESSIONS_COL, tenantId);
  }

  static async getActiveSession(tenantId: string): Promise<AdmissionSession | null> {
    const sessions = await this.getSessions(tenantId);
    return sessions.find(s => s.status === 'OPEN') || sessions[0] || null;
  }

  static async createSession(
    data: Omit<AdmissionSession, 'id'>,
    performedBy: { userId: string; email: string; name: string }
  ): Promise<AdmissionSession> {
    const id = FirebaseService.generateId('sess');
    const now = new Date().toISOString();
    const newSession: AdmissionSession = { 
      ...data, 
      id,
      createdBy: performedBy.userId,
      createdAt: now,
      updatedAt: now
    };
    await FirebaseService.setDocument(ADMISSION_SESSIONS_COL, id, newSession);
    
    await AuditService.log({
      tenantId: data.tenantId,
      userId: performedBy.userId,
      userEmail: performedBy.email,
      userDisplayName: performedBy.name,
      action: 'ADMISSION_SESSION_CREATED' as any,
      resource: 'admission_session' as any,
      resourceId: id,
      resourceName: data.name,
      newValue: newSession,
      result: 'SUCCESS'
    });
    
    return newSession;
  }

  static async updateSessionStatus(
    sessionId: string,
    tenantId: string,
    status: AdmissionSession['status'],
    performedBy: { userId: string; email: string; name: string }
  ): Promise<void> {
    const now = new Date().toISOString();
    await FirebaseService.updateDocument(ADMISSION_SESSIONS_COL, sessionId, { status, updatedAt: now });
    await AuditService.log({
      tenantId,
      userId: performedBy.userId,
      userEmail: performedBy.email,
      userDisplayName: performedBy.name,
      action: 'ADMISSION_SESSION_UPDATED' as any,
      resource: 'admission_session' as any,
      resourceId: sessionId,
      resourceName: `Session ${sessionId}`,
      newValue: { status },
      result: 'SUCCESS'
    });
  }

  // ================== ENQUIRIES ==================
  static async getEnquiries(tenantId: string): Promise<AdmissionEnquiry[]> {
    return FirebaseService.getTenantCollection<AdmissionEnquiry>(ADMISSION_ENQUIRIES_COL, tenantId);
  }

  static async createEnquiry(
    data: Omit<AdmissionEnquiry, 'id' | 'createdAt'>,
    performedBy: { userId: string; email: string; name: string }
  ): Promise<AdmissionEnquiry> {
    const id = FirebaseService.generateId('enq');
    const now = new Date().toISOString();
    const count = (await this.getEnquiries(data.tenantId)).length + 1;
    const enquiryNumber = data.enquiryNumber || `ENQ-${new Date().getFullYear()}-${count.toString().padStart(4, '0')}`;
    
    const newEnquiry: AdmissionEnquiry = { 
      ...data, 
      id, 
      enquiryNumber, 
      createdAt: now,
      updatedAt: now
    };
    await FirebaseService.setDocument(ADMISSION_ENQUIRIES_COL, id, newEnquiry);
    
    await AuditService.log({
      tenantId: data.tenantId,
      userId: performedBy.userId,
      userEmail: performedBy.email,
      userDisplayName: performedBy.name,
      action: 'ADMISSION_ENQUIRY_CREATED' as any,
      resource: 'admission_enquiry' as any,
      resourceId: id,
      resourceName: newEnquiry.applicantName,
      newValue: newEnquiry,
      result: 'SUCCESS'
    });
    
    return newEnquiry;
  }

  static async convertEnquiryToApplication(
    enquiryId: string,
    applicationData: Omit<AdmissionApplication, 'id' | 'createdAt' | 'updatedAt'>,
    performedBy: { userId: string; email: string; name: string }
  ): Promise<AdmissionApplication> {
    const enquiry = await FirebaseService.getDocument<AdmissionEnquiry>(ADMISSION_ENQUIRIES_COL, enquiryId);
    if (!enquiry) throw new Error("Enquiry not found");

    const app = await this.createApplication(applicationData, performedBy);
    
    await FirebaseService.updateDocument(ADMISSION_ENQUIRIES_COL, enquiryId, { 
      status: 'CONVERTED', 
      updatedAt: new Date().toISOString() 
    });
    
    await AuditService.log({
      tenantId: enquiry.tenantId,
      userId: performedBy.userId,
      userEmail: performedBy.email,
      userDisplayName: performedBy.name,
      action: 'ADMISSION_ENQUIRY_CONVERTED' as any,
      resource: 'admission_enquiry' as any,
      resourceId: enquiryId,
      resourceName: enquiry.applicantName,
      newValue: { status: 'CONVERTED', applicationId: app.id },
      result: 'SUCCESS'
    });
    
    return app;
  }

  // ================== APPLICATIONS ==================
  static async getApplications(tenantId: string): Promise<AdmissionApplication[]> {
    return FirebaseService.getTenantCollection<AdmissionApplication>(ADMISSION_APPLICATIONS_COL, tenantId);
  }

  static async getApplicationById(id: string): Promise<AdmissionApplication | null> {
    return FirebaseService.getDocument<AdmissionApplication>(ADMISSION_APPLICATIONS_COL, id);
  }

  static async generateApplicationNumber(tenantId: string): Promise<string> {
    const config = await this.getTenantConfig(tenantId);
    const prefix = config.applicationPrefix || 'ADM';
    const year = new Date().getFullYear();
    const apps = await this.getApplications(tenantId);
    const seq = (apps.length + 1).toString().padStart(6, '0');
    return `${prefix}-${year}-${seq}`;
  }

  static async createApplication(
    data: Omit<AdmissionApplication, 'id' | 'createdAt' | 'updatedAt'>,
    performedBy: { userId: string; email: string; name: string }
  ): Promise<AdmissionApplication> {
    const id = FirebaseService.generateId('app');
    const now = new Date().toISOString();
    
    let applicationNumber = data.applicationNumber;
    if (!applicationNumber || applicationNumber.trim() === '') {
      applicationNumber = await this.generateApplicationNumber(data.tenantId);
    }
    
    const newApp: AdmissionApplication = { 
      ...data, 
      id, 
      applicationNumber, 
      status: data.status || 'SUBMITTED',
      createdAt: now, 
      updatedAt: now,
      submittedAt: now
    };
    
    await FirebaseService.setDocument(ADMISSION_APPLICATIONS_COL, id, newApp);

    // Initialize default documents required
    const config = await this.getTenantConfig(data.tenantId);
    for (const docType of config.requiredDocuments) {
      await this.createDocumentPlaceholder(id, data.tenantId, docType);
    }
    
    await AuditService.log({
      tenantId: data.tenantId,
      userId: performedBy.userId,
      userEmail: performedBy.email,
      userDisplayName: performedBy.name,
      action: 'ADMISSION_APPLICATION_CREATED' as any,
      resource: 'admission_application' as any,
      resourceId: id,
      resourceName: applicationNumber,
      newValue: newApp,
      result: 'SUCCESS'
    });
    
    return newApp;
  }

  static validateStatusTransition(current: ApplicationStatus, target: ApplicationStatus): boolean {
    if (current === target) return true;
    if (target === 'WITHDRAWN' || target === 'CANCELLED') return true;

    const transitions: Record<ApplicationStatus, ApplicationStatus[]> = {
      DRAFT: ['SUBMITTED', 'CANCELLED'],
      SUBMITTED: ['UNDER_REVIEW', 'DOCUMENT_VERIFICATION', 'REJECTED'],
      UNDER_REVIEW: ['DOCUMENT_PENDING', 'DOCUMENT_VERIFICATION', 'ELIGIBILITY_REVIEW', 'REJECTED'],
      DOCUMENT_PENDING: ['DOCUMENT_VERIFICATION', 'UNDER_REVIEW', 'REJECTED'],
      DOCUMENT_VERIFICATION: ['ELIGIBILITY_REVIEW', 'TEST_PENDING', 'INTERVIEW_PENDING', 'READY_FOR_SELECTION', 'REJECTED'],
      ELIGIBILITY_REVIEW: ['TEST_PENDING', 'INTERVIEW_PENDING', 'READY_FOR_SELECTION', 'REJECTED'],
      TEST_PENDING: ['INTERVIEW_PENDING', 'READY_FOR_SELECTION', 'REJECTED'],
      INTERVIEW_PENDING: ['READY_FOR_SELECTION', 'REJECTED'],
      READY_FOR_SELECTION: ['SELECTED', 'WAITLISTED', 'REJECTED'],
      SELECTED: ['APPROVED', 'REJECTED', 'WITHDRAWN'],
      WAITLISTED: ['SELECTED', 'REJECTED', 'EXPIRED', 'CANCELLED'],
      REJECTED: [],
      APPROVED: ['ADMITTED', 'CANCELLED', 'WITHDRAWN'],
      ADMITTED: [],
      WITHDRAWN: [],
      CANCELLED: [],
      EXPIRED: []
    };

    const allowed = transitions[current] || [];
    return allowed.includes(target);
  }

  static async updateApplicationStatus(
    id: string,
    tenantId: string,
    status: ApplicationStatus,
    performedBy: { userId: string; email: string; name: string },
    additionalFields: Partial<AdmissionApplication> = {}
  ): Promise<void> {
    const prev = await this.getApplicationById(id);
    if (!prev) throw new Error("Application not found");

    if (!this.validateStatusTransition(prev.status, status)) {
      throw new Error(`Invalid status transition from ${prev.status} to ${status}`);
    }
    
    const now = new Date().toISOString();
    const updateData: Partial<AdmissionApplication> = { 
      status, 
      updatedAt: now,
      ...additionalFields 
    };

    if (status === 'ADMITTED') updateData.admittedAt = now;
    
    await FirebaseService.updateDocument(ADMISSION_APPLICATIONS_COL, id, updateData);
    
    await AuditService.log({
      tenantId,
      userId: performedBy.userId,
      userEmail: performedBy.email,
      userDisplayName: performedBy.name,
      action: 'ADMISSION_APPLICATION_UPDATED' as any,
      resource: 'admission_application' as any,
      resourceId: id,
      resourceName: prev.applicationNumber,
      previousValue: { status: prev.status },
      newValue: { status, ...additionalFields },
      result: 'SUCCESS',
      notes: `Status updated from ${prev.status} to ${status}`
    });
  }

  // ================== DOCUMENTS ==================
  static async createDocumentPlaceholder(applicationId: string, tenantId: string, documentType: string): Promise<AdmissionDocument> {
    const docId = FirebaseService.generateId('doc');
    const doc: AdmissionDocument = {
      id: docId,
      applicationId,
      tenantId,
      documentType,
      fileName: `${documentType.replace(/\s+/g, '_')}_Pending`,
      fileUrl: '#',
      status: 'PENDING'
    };
    await FirebaseService.setDocument(ADMISSION_DOCUMENTS_COL, docId, doc);
    return doc;
  }

  static async getDocumentsForApplication(applicationId: string): Promise<AdmissionDocument[]> {
    const allDocs = await FirebaseService.getTenantCollection<AdmissionDocument>(ADMISSION_DOCUMENTS_COL, 'ALL');
    return allDocs.filter(d => d.applicationId === applicationId);
  }

  static async verifyDocument(
    docId: string,
    tenantId: string,
    performedBy: { userId: string; email: string; name: string },
    remarks: string = 'Verified successfully'
  ): Promise<void> {
    const now = new Date().toISOString();
    await FirebaseService.updateDocument(ADMISSION_DOCUMENTS_COL, docId, {
      status: 'VERIFIED',
      verifiedById: performedBy.userId,
      verifiedByName: performedBy.name,
      verifiedAt: now,
      remarks
    });

    await AuditService.log({
      tenantId,
      userId: performedBy.userId,
      userEmail: performedBy.email,
      userDisplayName: performedBy.name,
      action: 'ADMISSION_DOCUMENT_VERIFIED' as any,
      resource: 'admission_document' as any,
      resourceId: docId,
      resourceName: `Doc ${docId}`,
      newValue: { status: 'VERIFIED', remarks },
      result: 'SUCCESS'
    });
  }

  static async rejectDocument(
    docId: string,
    tenantId: string,
    performedBy: { userId: string; email: string; name: string },
    remarks: string
  ): Promise<void> {
    const now = new Date().toISOString();
    await FirebaseService.updateDocument(ADMISSION_DOCUMENTS_COL, docId, {
      status: 'REJECTED',
      verifiedById: performedBy.userId,
      verifiedByName: performedBy.name,
      verifiedAt: now,
      remarks
    });

    await AuditService.log({
      tenantId,
      userId: performedBy.userId,
      userEmail: performedBy.email,
      userDisplayName: performedBy.name,
      action: 'ADMISSION_DOCUMENT_REJECTED' as any,
      resource: 'admission_document' as any,
      resourceId: docId,
      resourceName: `Doc ${docId}`,
      newValue: { status: 'REJECTED', remarks },
      result: 'SUCCESS'
    });
  }

  // ================== TESTS & INTERVIEWS ==================
  static async scheduleTest(
    data: Omit<AdmissionTest, 'id' | 'status'>,
    performedBy: { userId: string; email: string; name: string }
  ): Promise<AdmissionTest> {
    const id = FirebaseService.generateId('tst');
    const test: AdmissionTest = { ...data, id, status: 'SCHEDULED' };
    await FirebaseService.setDocument(ADMISSION_TESTS_COL, id, test);
    
    await this.updateApplicationStatus(data.applicationId, data.tenantId, 'TEST_PENDING', performedBy, { testId: id });
    return test;
  }

  static async submitTestResult(
    testId: string,
    obtainedMarks: number,
    remarks: string,
    performedBy: { userId: string; email: string; name: string }
  ): Promise<void> {
    const test = await FirebaseService.getDocument<AdmissionTest>(ADMISSION_TESTS_COL, testId);
    if (!test) throw new Error("Test not found");

    const passed = obtainedMarks >= (test.maxMarks * 0.4); // 40% passing
    const status = passed ? 'PASSED' : 'FAILED';
    
    await FirebaseService.updateDocument(ADMISSION_TESTS_COL, testId, {
      obtainedMarks,
      status,
      evaluatorId: performedBy.userId,
      evaluatorName: performedBy.name,
      remarks
    });

    await AuditService.log({
      tenantId: test.tenantId,
      userId: performedBy.userId,
      userEmail: performedBy.email,
      userDisplayName: performedBy.name,
      action: 'ADMISSION_TEST_COMPLETED' as any,
      resource: 'admission_test' as any,
      resourceId: testId,
      resourceName: test.testName,
      newValue: { obtainedMarks, status, remarks },
      result: 'SUCCESS'
    });
  }

  static async scheduleInterview(
    data: Omit<AdmissionInterview, 'id' | 'status'>,
    performedBy: { userId: string; email: string; name: string }
  ): Promise<AdmissionInterview> {
    const id = FirebaseService.generateId('int');
    const interview: AdmissionInterview = { ...data, id, status: 'SCHEDULED' };
    await FirebaseService.setDocument(ADMISSION_INTERVIEWS_COL, id, interview);
    
    await this.updateApplicationStatus(data.applicationId, data.tenantId, 'INTERVIEW_PENDING', performedBy, { interviewId: id });
    return interview;
  }

  static async submitInterviewResult(
    interviewId: string,
    score: number,
    recommendation: AdmissionInterview['recommendation'],
    remarks: string,
    performedBy: { userId: string; email: string; name: string }
  ): Promise<void> {
    const intv = await FirebaseService.getDocument<AdmissionInterview>(ADMISSION_INTERVIEWS_COL, interviewId);
    if (!intv) throw new Error("Interview not found");

    await FirebaseService.updateDocument(ADMISSION_INTERVIEWS_COL, interviewId, {
      score,
      recommendation,
      remarks,
      status: 'COMPLETED'
    });

    await AuditService.log({
      tenantId: intv.tenantId,
      userId: performedBy.userId,
      userEmail: performedBy.email,
      userDisplayName: performedBy.name,
      action: 'ADMISSION_INTERVIEW_COMPLETED' as any,
      resource: 'admission_interview' as any,
      resourceId: interviewId,
      resourceName: `Interview ${interviewId}`,
      newValue: { score, recommendation, remarks },
      result: 'SUCCESS'
    });
  }

  // ================== MERIT & WAITLIST ENGINE ==================
  static async calculateMeritList(tenantId: string, classId?: string): Promise<AdmissionMeritEntry[]> {
    const config = await this.getTenantConfig(tenantId);
    const apps = await this.getApplications(tenantId);
    const tests = await FirebaseService.getTenantCollection<AdmissionTest>(ADMISSION_TESTS_COL, tenantId);
    const interviews = await FirebaseService.getTenantCollection<AdmissionInterview>(ADMISSION_INTERVIEWS_COL, tenantId);

    const filtered = apps.filter(a => !classId || a.appliedClassId === classId);
    const weights = config.meritWeights || { entranceTest: 50, previousMarks: 30, interview: 20 };

    const entries: AdmissionMeritEntry[] = filtered.map(a => {
      const test = tests.find(t => t.applicationId === a.id);
      const testPct = test && test.obtainedMarks ? (test.obtainedMarks / test.maxMarks) * 100 : 0;
      
      const prevPct = a.applicant.previousMarksPercentage || 75; // default estimate
      
      const intv = interviews.find(i => i.applicationId === a.id);
      const intvPct = intv && intv.score && intv.maxScore ? (intv.score / intv.maxScore) * 100 : 80;

      const totalWeightedScore = Math.round(
        (testPct * (weights.entranceTest / 100)) +
        (prevPct * (weights.previousMarks / 100)) +
        (intvPct * (weights.interview / 100))
      );

      return {
        applicationId: a.id,
        applicationNumber: a.applicationNumber,
        applicantName: `${a.applicant.firstName} ${a.applicant.lastName}`,
        appliedClassId: a.appliedClassId,
        entranceScore: Math.round(testPct),
        previousMarksScore: Math.round(prevPct),
        interviewScore: Math.round(intvPct),
        totalWeightedScore,
        rank: 0,
        status: a.status
      };
    });

    // Sort descending by total score
    entries.sort((a, b) => b.totalWeightedScore - a.totalWeightedScore);
    entries.forEach((e, idx) => { e.rank = idx + 1; });

    return entries;
  }

  static async getWaitlist(tenantId: string): Promise<AdmissionWaitlistEntry[]> {
    return FirebaseService.getTenantCollection<AdmissionWaitlistEntry>(ADMISSION_WAITLIST_COL, tenantId);
  }

  static async addWaitlistEntry(
    applicationId: string, 
    tenantId: string, 
    performedBy: { userId: string; email: string; name: string }
  ): Promise<AdmissionWaitlistEntry> {
    const app = await this.getApplicationById(applicationId);
    if (!app) throw new Error("Application not found");

    const existing = await this.getWaitlist(tenantId);
    const classEntries = existing.filter(w => w.classId === app.appliedClassId);
    const position = classEntries.length + 1;

    const entryId = FirebaseService.generateId('wtl');
    const newEntry: AdmissionWaitlistEntry = {
      id: entryId,
      tenantId,
      sessionId: app.sessionId,
      applicationId: app.id,
      applicationNumber: app.applicationNumber,
      applicantName: `${app.applicant.firstName} ${app.applicant.lastName}`,
      classId: app.appliedClassId,
      position,
      status: 'ACTIVE',
      createdAt: new Date().toISOString()
    };

    await FirebaseService.setDocument(ADMISSION_WAITLIST_COL, entryId, newEntry);
    await this.updateApplicationStatus(applicationId, tenantId, 'WAITLISTED', performedBy);

    await AuditService.log({
      tenantId,
      userId: performedBy.userId,
      userEmail: performedBy.email,
      userDisplayName: performedBy.name,
      action: 'ADMISSION_WAITLISTED' as any,
      resource: 'admission_application' as any,
      resourceId: applicationId,
      resourceName: app.applicationNumber,
      newValue: { waitlistPosition: position },
      result: 'SUCCESS'
    });

    return newEntry;
  }

  // ================== DUPLICATE DETECTION ==================
  static async detectDuplicateStudents(
    tenantId: string,
    applicant: { firstName: string; lastName: string; dateOfBirth: string },
    guardians: { contactNumber: string }[]
  ): Promise<{ isDuplicate: boolean; matches: Student[] }> {
    const allStudents = await FirebaseService.getTenantCollection<Student>(STUDENTS_COL, tenantId);
    
    const matches = allStudents.filter(s => {
      const nameMatch = s.firstName.toLowerCase() === applicant.firstName.toLowerCase() &&
                        s.lastName.toLowerCase() === applicant.lastName.toLowerCase() &&
                        s.dateOfBirth === applicant.dateOfBirth;
      
      const phoneMatch = s.phone && guardians.some(g => g.contactNumber && s.phone === g.contactNumber);
      
      return nameMatch || phoneMatch;
    });

    return {
      isDuplicate: matches.length > 0,
      matches
    };
  }

  // ================== CAPACITY & FINAL ADMISSION ==================
  static async admitStudent(
    applicationId: string,
    academicYearId: string,
    classId: string,
    sectionId: string,
    campusId: string,
    overrideCapacity: boolean,
    performedBy: { userId: string; email: string; name: string }
  ): Promise<{ student: Student; enrollment: any }> {
    const app = await this.getApplicationById(applicationId);
    if (!app) throw new Error("Application not found");
    if (app.status !== 'APPROVED') {
      throw new Error(`Application status is ${app.status}. Must be APPROVED before final admission.`);
    }

    // 1. Capacity Check
    const allStudents = await FirebaseService.getTenantCollection<Student>(STUDENTS_COL, app.tenantId);
    const currentClassStudents = allStudents.filter(s => s.currentClassId === classId && s.status === 'enrolled');
    const config = await this.getTenantConfig(app.tenantId);
    const capacityLimit = config.classCapacityLimits[classId] || 40;

    if (currentClassStudents.length >= capacityLimit) {
      if (!overrideCapacity) {
        throw new Error(`Class capacity limit reached (${currentClassStudents.length}/${capacityLimit}). Override required by authorized administrator.`);
      } else {
        await AuditService.log({
          tenantId: app.tenantId,
          userId: performedBy.userId,
          userEmail: performedBy.email,
          userDisplayName: performedBy.name,
          action: 'ADMISSION_APPLICATION_UPDATED' as any,
          resource: 'admission_application' as any,
          resourceId: applicationId,
          resourceName: app.applicationNumber,
          newValue: { capacityOverride: true, limit: capacityLimit, current: currentClassStudents.length },
          result: 'SUCCESS',
          notes: `Authorized capacity limit override executed.`
        });
      }
    }
    
    // 2. Create Family & Guardians via authoritative FamilyService
    let familyId: string | undefined;
    try {
      const family = await FamilyService.createFamily({
        tenantId: app.tenantId,
        familyName: `${app.applicant.lastName || 'Applicant'} Family`,
        primaryAddress: app.applicant.address,
        primaryEmail: app.applicant.email || app.guardians[0]?.email || ''
      }, performedBy);
      familyId = family.id;
    } catch (e) {
      console.error('Error creating family during admission:', e);
    }

    const createdGuardians: any[] = [];
    for (const g of app.guardians) {
      try {
        const spaceIdx = g.name.indexOf(' ');
        const firstName = spaceIdx !== -1 ? g.name.substring(0, spaceIdx) : g.name;
        const lastName = spaceIdx !== -1 ? g.name.substring(spaceIdx + 1) : '';

        const newGuardian = await FamilyService.createGuardian({
          tenantId: app.tenantId,
          familyId,
          firstName,
          lastName,
          relationship: g.relationship,
          email: g.email || '',
          phone: g.contactNumber,
          isPrimaryContact: g.isPrimaryContact
        }, performedBy, true); // bypassDuplicateCheck = true during admission flow

        createdGuardians.push(newGuardian);
      } catch (e) {
        console.error('Error creating guardian during admission:', e);
      }
    }
    
    // 3. Create Student
    const studentId = FirebaseService.generateId('stu');
    const admissionNumber = `STU-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();

    const newStudent: Student = {
      id: studentId,
      tenantId: app.tenantId,
      campusId: campusId || app.campusId || 'cam_main',
      studentIdNumber: admissionNumber,
      firstName: app.applicant.firstName,
      lastName: app.applicant.lastName,
      dateOfBirth: app.applicant.dateOfBirth,
      gender: app.applicant.gender as any,
      enrollmentDate: now,
      currentAcademicYearId: academicYearId,
      currentClassId: classId,
      currentSectionId: sectionId,
      email: app.applicant.email || '',
      phone: app.applicant.contactNumber || '',
      address: app.applicant.address,
      personalInfo: {
        firstName: app.applicant.firstName,
        lastName: app.applicant.lastName,
        dateOfBirth: app.applicant.dateOfBirth,
        gender: app.applicant.gender as any,
      },
      guardians: [],
      status: 'enrolled',
      createdAt: now,
      updatedAt: now
    };
    
    await FirebaseService.setDocument(STUDENTS_COL, studentId, newStudent);

    // Link Student ↔ Guardians using FamilyService relationships
    for (const cg of createdGuardians) {
      try {
        await FamilyService.linkStudentAndGuardian({
          tenantId: app.tenantId,
          studentId,
          guardianId: cg.id,
          relationshipType: (cg.relationship?.toUpperCase() || 'OTHER') as any,
          isPrimary: cg.isPrimaryContact || false,
          isEmergencyContact: cg.isPrimaryContact || false,
          canReceiveCommunications: true,
          canAccessPortal: false,
          canViewAcademicInformation: true,
          canViewAttendance: true,
          canViewExaminationResults: true,
          canViewDocuments: false,
          canAuthorizeActions: false,
          financialResponsibility: cg.isPrimaryContact ? 'PRIMARY' : 'NONE'
        }, performedBy);
      } catch (e) {
        console.error('Error linking guardian to student during admission:', e);
      }
    }

    // 4. Create Student Enrollment Record
    const enrollmentId = FirebaseService.generateId('enr');
    const enrollmentRecord = {
      id: enrollmentId,
      studentId,
      tenantId: app.tenantId,
      academicYearId,
      classId,
      sectionId,
      enrollmentDate: now,
      status: 'ACTIVE'
    };
    await FirebaseService.setDocument('enrollments', enrollmentId, enrollmentRecord);
    
    // 5. Update Application as ADMITTED
    await this.updateApplicationStatus(applicationId, app.tenantId, 'ADMITTED', performedBy, {
      linkedStudentId: studentId,
      admittedAt: now
    });
    
    // 6. Audit Logs
    await AuditService.log({
      tenantId: app.tenantId,
      userId: performedBy.userId,
      userEmail: performedBy.email,
      userDisplayName: performedBy.name,
      action: 'STUDENT_ADMITTED' as any,
      resource: 'student',
      resourceId: studentId,
      resourceName: `${newStudent.firstName} ${newStudent.lastName}`,
      newValue: { studentId, applicationId, admissionNumber, classId, sectionId },
      result: 'SUCCESS'
    });

    await AuditService.log({
      tenantId: app.tenantId,
      userId: performedBy.userId,
      userEmail: performedBy.email,
      userDisplayName: performedBy.name,
      action: 'STUDENT_ENROLLMENT_CREATED' as any,
      resource: 'enrollment' as any,
      resourceId: enrollmentId,
      resourceName: `Enrollment for ${newStudent.firstName}`,
      newValue: enrollmentRecord,
      result: 'SUCCESS'
    });
    
    return { student: newStudent, enrollment: enrollmentRecord };
  }
}
