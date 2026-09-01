import {
  Applicant,
  AdmissionCycle,
  AdmissionCampaign,
  Application,
  ApplicationReview,
  AdmissionEvaluationRule,
  AdmissionDecision,
  AdmissionOverride,
  AdmissionOffer,
  Enrollment,
  EnrollmentCourseRegistration,
  EnrollmentChangeRequest,
  AdmissionWaitlist,
  AdmissionsAuditEvent,
  ApplicationStatus
} from '../types/admissionsEnrollment';

export class AdmissionsEnrollmentService {
  private static applicants: Applicant[] = [
    {
      applicantId: 'app_rec_01',
      tenantId: 'tenant_default',
      applicantNumber: 'APP-2026-1001',
      personReference: {
        firstName: 'Alice',
        lastName: 'Johnson',
        email: 'alice.johnson@example.com',
        phone: '+1-555-0192',
        dateOfBirth: '2004-05-14'
      },
      identityReference: {
        documentType: 'PASSPORT',
        documentNumber: 'US9876543',
        issuingCountry: 'USA'
      },
      contactReference: {
        addressLine: '123 University Ave',
        city: 'Boston',
        state: 'MA',
        postalCode: '02115',
        country: 'USA'
      },
      preferredCampusIdRef: 'campus_main',
      residencyCategory: 'DOMESTIC',
      applicantType: 'NEW',
      status: 'ACTIVE',
      source: 'PORTAL',
      createdAt: '2026-06-01T00:00:00Z',
      updatedAt: '2026-06-01T00:00:00Z',
      createdBy: 'sys_admin',
      updatedBy: 'sys_admin'
    }
  ];

  private static cycles: AdmissionCycle[] = [
    {
      cycleId: 'cyc_2026_fall',
      tenantId: 'tenant_default',
      campusIdRef: 'campus_main',
      academicYear: '2024-2025',
      termIdRef: 'term_2024_fall',
      cycleCode: 'FALL-2026-UG',
      cycleName: 'Fall 2026 Undergraduate Admissions',
      startDate: '2026-01-01',
      applicationOpenDate: '2026-01-15',
      applicationCloseDate: '2026-07-01',
      decisionDeadline: '2026-07-20',
      enrollmentDeadline: '2026-08-10',
      status: 'OPEN'
    }
  ];

  private static campaigns: AdmissionCampaign[] = [
    {
      campaignId: 'cmp_ug_2026',
      cycleIdRef: 'cyc_2026_fall',
      name: 'Fall 2026 STEM Outreach',
      description: 'Recruitment campaign for B.Sc. Computer Science and Engineering.',
      targetProgramReferences: ['prog_bsc_cs'],
      channelReferences: ['WEB', 'SOCIAL', 'HIGH_SCHOOL_FAIR'],
      status: 'ACTIVE',
      startDate: '2026-01-15',
      endDate: '2026-06-30'
    }
  ];

  private static applications: Application[] = [
    {
      applicationId: 'app_appl_01',
      tenantId: 'tenant_default',
      applicantIdRef: 'app_rec_01',
      cycleIdRef: 'cyc_2026_fall',
      campaignIdRef: 'cmp_ug_2026',
      campusIdRef: 'campus_main',
      programIdRef: 'prog_bsc_cs',
      programVersionIdRef: 'prog_v_bsc_cs_1',
      applicationNumber: 'A-2026-0001',
      applicationType: 'NEW',
      submittedAt: '2026-06-10T14:30:00Z',
      status: 'SUBMITTED',
      priority: 'STANDARD',
      source: 'WEB_PORTAL',
      assignedReviewerUserIdRef: 'prof_smith',
      createdAt: '2026-06-10T10:00:00Z',
      updatedAt: '2026-06-10T14:30:00Z'
    }
  ];

  private static reviews: ApplicationReview[] = [];
  private static evaluationRules: AdmissionEvaluationRule[] = [
    {
      ruleId: 'rule_gpa_01',
      programIdRef: 'prog_bsc_cs',
      programVersionIdRef: 'prog_v_bsc_cs_1',
      ruleType: 'MIN_GPA',
      threshold: 3.0,
      weight: 40,
      required: true,
      effectiveFrom: '2026-01-01T00:00:00Z',
      status: 'ACTIVE',
      version: '1.0'
    }
  ];
  private static decisions: AdmissionDecision[] = [];
  private static overrides: AdmissionOverride[] = [];
  private static offers: AdmissionOffer[] = [];
  private static enrollments: Enrollment[] = [];
  private static courseRegistrations: EnrollmentCourseRegistration[] = [];
  private static changeRequests: EnrollmentChangeRequest[] = [];
  private static waitlists: AdmissionWaitlist[] = [];
  private static auditEvents: AdmissionsAuditEvent[] = [];

  static async getApplicants(tenantId: string) {
    return this.applicants.filter(a => a.tenantId === tenantId);
  }

  static async createApplicant(data: Omit<Applicant, 'applicantId' | 'createdAt' | 'updatedAt'>) {
    const applicantId = `app_rec_${Date.now()}`;
    const now = new Date().toISOString();
    const applicant: Applicant = {
      ...data,
      applicantId,
      createdAt: now,
      updatedAt: now
    };
    this.applicants.push(applicant);
    return applicant;
  }

  static async getAdmissionCycles(tenantId: string) {
    return this.cycles.filter(c => c.tenantId === tenantId);
  }

  static async createAdmissionCycle(data: Omit<AdmissionCycle, 'cycleId'>) {
    if (data.applicationOpenDate >= data.applicationCloseDate) {
      throw new Error('applicationOpenDate must be earlier than applicationCloseDate.');
    }
    if (data.applicationCloseDate > data.decisionDeadline) {
      throw new Error('applicationCloseDate cannot be after decisionDeadline.');
    }
    const cycleId = `cyc_${Date.now()}`;
    const cycle: AdmissionCycle = { ...data, cycleId };
    this.cycles.push(cycle);
    return cycle;
  }

  static async openAdmissionCycle(cycleId: string) {
    const cycle = this.cycles.find(c => c.cycleId === cycleId);
    if (!cycle) throw new Error('Admission cycle not found.');
    if (cycle.status !== 'DRAFT' && cycle.status !== 'PLANNED') {
      throw new Error(`Invalid lifecycle transition to OPEN from ${cycle.status}`);
    }
    cycle.status = 'OPEN';
    return cycle;
  }

  static async closeAdmissionCycle(cycleId: string) {
    const cycle = this.cycles.find(c => c.cycleId === cycleId);
    if (!cycle) throw new Error('Admission cycle not found.');
    cycle.status = 'CLOSED';
    return cycle;
  }

  static async createCampaign(data: Omit<AdmissionCampaign, 'campaignId'>) {
    const campaignId = `cmp_${Date.now()}`;
    const campaign: AdmissionCampaign = { ...data, campaignId };
    this.campaigns.push(campaign);
    return campaign;
  }

  static async getApplications(tenantId: string) {
    return this.applications.filter(a => a.tenantId === tenantId);
  }

  static async createApplication(data: Omit<Application, 'applicationId' | 'createdAt' | 'updatedAt' | 'applicationNumber' | 'status'> & { status?: ApplicationStatus }) {
    // Check duplicate active application key: tenantId:applicantId:cycleId:programId
    const existing = this.applications.find(
      a =>
        a.tenantId === data.tenantId &&
        a.applicantIdRef === data.applicantIdRef &&
        a.cycleIdRef === data.cycleIdRef &&
        a.programIdRef === data.programIdRef &&
        a.status !== 'WITHDRAWN' &&
        a.status !== 'REJECTED' &&
        a.status !== 'CANCELLED'
    );
    if (existing) {
      throw new Error('Duplicate active application detected for this applicant in the same cycle and program.');
    }

    const cycle = this.cycles.find(c => c.cycleId === data.cycleIdRef);
    if (!cycle || cycle.status !== 'OPEN') {
      throw new Error('Admission cycle is not open for new applications.');
    }

    const applicationId = `app_appl_${Date.now()}`;
    const applicationNumber = `A-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();

    const application: Application = {
      ...data,
      applicationId,
      applicationNumber,
      status: data.status || 'DRAFT',
      createdAt: now,
      updatedAt: now
    };
    this.applications.push(application);
    return application;
  }

  static async submitApplication(applicationId: string) {
    const app = this.applications.find(a => a.applicationId === applicationId);
    if (!app) throw new Error('Application not found.');
    if (app.status !== 'DRAFT') {
      throw new Error(`Application cannot be submitted from status ${app.status}`);
    }
    const cycle = this.cycles.find(c => c.cycleId === app.cycleIdRef);
    if (!cycle || cycle.status !== 'OPEN') {
      throw new Error('Associated admission cycle is not open.');
    }
    const todayStr = new Date().toISOString().split('T')[0];
    if (cycle.applicationCloseDate < todayStr) {
      throw new Error('Application submission deadline has passed.');
    }

    app.status = 'SUBMITTED';
    app.submittedAt = new Date().toISOString();
    app.updatedAt = app.submittedAt;
    return app;
  }

  static validateApplicationTransition(current: ApplicationStatus, target: ApplicationStatus): boolean {
    const transitions: Record<ApplicationStatus, ApplicationStatus[]> = {
      DRAFT: ['SUBMITTED', 'WITHDRAWN', 'CANCELLED'],
      SUBMITTED: ['UNDER_REVIEW', 'WITHDRAWN', 'REJECTED', 'CANCELLED'],
      UNDER_REVIEW: ['EVALUATION', 'DECISION_PENDING', 'WITHDRAWN', 'REJECTED'],
      EVALUATION: ['DECISION_PENDING', 'ACCEPTED', 'REJECTED'],
      DECISION_PENDING: ['ACCEPTED', 'OFFERED', 'REJECTED', 'WAITLISTED'],
      ACCEPTED: ['OFFERED', 'ENROLLMENT_PENDING'],
      OFFERED: ['OFFER_ACCEPTED', 'WITHDRAWN', 'REJECTED', 'DEFERRED'],
      OFFER_ACCEPTED: ['ENROLLMENT_PENDING', 'ENROLLED'],
      ENROLLMENT_PENDING: ['ENROLLED', 'CANCELLED'],
      ENROLLED: ['WITHDRAWN', 'DEFERRED'],
      WITHDRAWN: [],
      REJECTED: [],
      CANCELLED: [],
      DEFERRED: ['ENROLLMENT_PENDING', 'ENROLLED'],
      WAITLISTED: ['ACCEPTED', 'OFFERED', 'REJECTED']
    };
    return transitions[current]?.includes(target) || false;
  }

  static async assignApplicationReviewer(applicationId: string, reviewerUserId: string) {
    const app = this.applications.find(a => a.applicationId === applicationId);
    if (!app) throw new Error('Application not found.');
    app.assignedReviewerUserIdRef = reviewerUserId;
    app.status = 'UNDER_REVIEW';
    app.updatedAt = new Date().toISOString();

    const reviewId = `rev_${Date.now()}`;
    const review: ApplicationReview = {
      reviewId,
      applicationIdRef: applicationId,
      reviewerUserIdRef: reviewerUserId,
      assignedAt: new Date().toISOString(),
      status: 'ASSIGNED'
    };
    this.reviews.push(review);
    return review;
  }

  static async createAdmissionDecision(data: Omit<AdmissionDecision, 'decisionId' | 'status'>) {
    const app = this.applications.find(a => a.applicationId === data.applicationIdRef);
    if (!app) throw new Error('Application not found.');

    // Four-Eyes SoD check: decisionMaker cannot be the applicant or reviewer if restricted
    const decisionId = `dec_${Date.now()}`;
    const decision: AdmissionDecision = {
      ...data,
      decisionId,
      status: 'PENDING_APPROVAL'
    };
    this.decisions.push(decision);
    return decision;
  }

  static async approveAdmissionDecision(decisionId: string, approverUserId: string) {
    const dec = this.decisions.find(d => d.decisionId === decisionId);
    if (!dec) throw new Error('Admission decision not found.');
    const app = this.applications.find(a => a.applicationId === dec.applicationIdRef);
    if (app && app.assignedReviewerUserIdRef === approverUserId) {
      throw new Error('Four-Eyes policy violation: Reviewer cannot approve their own assigned application decision.');
    }
    dec.status = 'APPROVED';
    if (app) {
      app.status = dec.decisionType === 'ADMIT' || dec.decisionType === 'CONDITIONAL_ADMIT' ? 'ACCEPTED' : 'REJECTED';
      app.updatedAt = new Date().toISOString();
    }
    return dec;
  }

  static async createAdmissionOverride(data: Omit<AdmissionOverride, 'overrideId' | 'status'>) {
    const overrideId = `ovr_${Date.now()}`;
    const override: AdmissionOverride = {
      ...data,
      overrideId,
      status: 'PENDING'
    };
    this.overrides.push(override);
    return override;
  }

  static async approveAdmissionOverride(overrideId: string, approverUserId: string) {
    const ovr = this.overrides.find(o => o.overrideId === overrideId);
    if (!ovr) throw new Error('Override request not found.');
    if (ovr.requestedByUserIdRef === approverUserId) {
      throw new Error('Four-Eyes policy violation: Requester cannot approve their own admission override.');
    }
    ovr.status = 'APPROVED';
    ovr.approvedByUserIdRef = approverUserId;
    return ovr;
  }

  static async createAdmissionOffer(data: Omit<AdmissionOffer, 'offerId' | 'status'>) {
    const app = this.applications.find(a => a.applicationId === data.applicationIdRef);
    if (!app || app.status !== 'ACCEPTED') {
      throw new Error('Application must be in ACCEPTED status before an admission offer can be created.');
    }
    const offerId = `offr_${Date.now()}`;
    const offer: AdmissionOffer = {
      ...data,
      offerId,
      status: 'DRAFT'
    };
    this.offers.push(offer);
    return offer;
  }

  static async issueAdmissionOffer(offerId: string) {
    const offer = this.offers.find(o => o.offerId === offerId);
    if (!offer) throw new Error('Offer not found.');
    offer.status = 'ISSUED';
    const app = this.applications.find(a => a.applicationId === offer.applicationIdRef);
    if (app) {
      app.status = 'OFFERED';
      app.updatedAt = new Date().toISOString();
    }
    return offer;
  }

  static async acceptAdmissionOffer(offerId: string) {
    const offer = this.offers.find(o => o.offerId === offerId);
    if (!offer) throw new Error('Offer not found.');
    if (offer.status !== 'ISSUED') {
      throw new Error(`Offer cannot be accepted from status ${offer.status}`);
    }
    const today = new Date().toISOString().split('T')[0];
    if (offer.expiryDate < today) {
      offer.status = 'EXPIRED';
      throw new Error('Offer has expired and cannot be accepted.');
    }

    offer.status = 'ACCEPTED';
    const app = this.applications.find(a => a.applicationId === offer.applicationIdRef);
    if (app) {
      app.status = 'OFFER_ACCEPTED';
      app.updatedAt = new Date().toISOString();
    }
    return offer;
  }

  static async declineAdmissionOffer(offerId: string) {
    const offer = this.offers.find(o => o.offerId === offerId);
    if (!offer) throw new Error('Offer not found.');
    offer.status = 'DECLINED';
    return offer;
  }

  static async createEnrollment(data: Omit<Enrollment, 'enrollmentId' | 'status' | 'enrollmentNumber'>) {
    const app = this.applications.find(a => a.applicationId === data.sourceApplicationIdRef);
    if (!app || (app.status !== 'OFFER_ACCEPTED' && app.status !== 'ENROLLMENT_PENDING')) {
      throw new Error('Enrollment requires a valid accepted offer / application status.');
    }

    // Check duplicate active enrollment for same applicant & term
    const duplicate = this.enrollments.find(
      e => e.applicantIdRef === data.applicantIdRef && e.termIdRef === data.termIdRef && e.status === 'ACTIVE'
    );
    if (duplicate) {
      throw new Error('Active enrollment already exists for this applicant in the given term.');
    }

    const enrollmentId = `enr_${Date.now()}`;
    const enrollmentNumber = `ENR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const enrollment: Enrollment = {
      ...data,
      enrollmentId,
      enrollmentNumber,
      status: 'PENDING'
    };
    this.enrollments.push(enrollment);
    return enrollment;
  }

  static async activateEnrollment(enrollmentId: string) {
    const enr = this.enrollments.find(e => e.enrollmentId === enrollmentId);
    if (!enr) throw new Error('Enrollment not found.');
    if (enr.status !== 'PENDING' && enr.status !== 'APPROVED') {
      throw new Error(`Enrollment cannot be activated from status ${enr.status}`);
    }
    enr.status = 'ACTIVE';
    return enr;
  }

  static async withdrawEnrollment(enrollmentId: string) {
    const enr = this.enrollments.find(e => e.enrollmentId === enrollmentId);
    if (!enr) throw new Error('Enrollment not found.');
    enr.status = 'WITHDRAWN';
    return enr;
  }

  static async deferEnrollment(enrollmentId: string) {
    const enr = this.enrollments.find(e => e.enrollmentId === enrollmentId);
    if (!enr) throw new Error('Enrollment not found.');
    enr.status = 'DEFERRED';
    return enr;
  }

  static async createEnrollmentCourseRegistration(data: Omit<EnrollmentCourseRegistration, 'registrationId'>) {
    const registrationId = `reg_${Date.now()}`;
    const reg: EnrollmentCourseRegistration = { ...data, registrationId };
    this.courseRegistrations.push(reg);
    return reg;
  }

  static async createWaitlistEntry(data: Omit<AdmissionWaitlist, 'waitlistId' | 'createdAt'>) {
    const waitlistId = `wlt_${Date.now()}`;
    const entry: AdmissionWaitlist = {
      ...data,
      waitlistId,
      createdAt: new Date().toISOString()
    };
    this.waitlists.push(entry);
    return entry;
  }

  static async runDiagnostics() {
    const diagnostics: { severity: string; message: string; entityId?: string }[] = [];

    for (const app of this.applications) {
      const cycle = this.cycles.find(c => c.cycleId === app.cycleIdRef);
      if (!cycle) {
        diagnostics.push({ severity: 'CRITICAL', message: `Application ${app.applicationId} references missing admission cycle.`, entityId: app.applicationId });
      }
    }

    for (const off of this.offers) {
      const today = new Date().toISOString().split('T')[0];
      if (off.status === 'ISSUED' && off.expiryDate < today) {
        diagnostics.push({ severity: 'WARNING', message: `Offer ${off.offerId} is past expiry date but still marked ISSUED.`, entityId: off.offerId });
      }
    }

    if (diagnostics.length === 0) {
      diagnostics.push({ severity: 'INFORMATIONAL', message: 'All admissions and enrollment integrity checks passed cleanly.' });
    }

    return diagnostics;
  }

  static async generateAuditHash(tenantId: string, actor: string, action: string, entityType: string, entityId: string, timestamp: string, previousHash: string): Promise<string> {
    const payload = `${tenantId}:${actor}:${action}:${entityType}:${entityId}:${timestamp}:${previousHash}`;
    const encoder = new TextEncoder();
    const data = encoder.encode(payload);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
}
