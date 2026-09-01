import { FirebaseService } from './firebaseService';
import { AuditService } from './auditService';
import { UserActor } from '../types/inventory';
import {
  AlumniProfile,
  CorporatePartner,
  JobPosting,
  PlacementDrive,
  JobApplication,
  PlacementOffer,
  CareerMentorshipSession,
  AlumniEvent,
  AlumniContribution,
  AlumniPlacementAnalytics,
  FilterAlumniParams,
  FilterJobPostingParams,
  JobPostingStatus,
  JobApplicationStatus,
  PlacementOfferStatus,
  PlacementDriveStatus
} from '../types/alumniPlacement';
import { where } from 'firebase/firestore';

const ALUMNI_PROFILES_COL = 'alumni_profiles';
const CORPORATE_PARTNERS_COL = 'corporate_partners';
const JOB_POSTINGS_COL = 'job_postings';
const PLACEMENT_DRIVES_COL = 'placement_drives';
const JOB_APPLICATIONS_COL = 'job_applications';
const PLACEMENT_OFFERS_COL = 'placement_offers';
const MENTORSHIP_SESSIONS_COL = 'career_mentorship_sessions';
const ALUMNI_EVENTS_COL = 'alumni_events';
const ALUMNI_CONTRIBUTIONS_COL = 'alumni_contributions';
const ANALYTICS_CACHE_COL = 'alumni_placement_analytics';

export class AlumniPlacementService {

  // ==========================================
  // ALUMNI PROFILES
  // ==========================================

  static async getAlumniProfiles(tenantId: string, filter?: FilterAlumniParams): Promise<AlumniProfile[]> {
    const constraints: any[] = [];
    if (filter?.graduationYear) {
      constraints.push(where('graduationYear', '==', filter.graduationYear));
    }
    if (filter?.employmentStatus) {
      constraints.push(where('employmentStatus', '==', filter.employmentStatus));
    }
    if (filter?.departmentId) {
      constraints.push(where('departmentId', '==', filter.departmentId));
    }
    if (filter?.isWillingToMentor !== undefined) {
      constraints.push(where('isWillingToMentor', '==', filter.isWillingToMentor));
    }

    let records = await FirebaseService.getTenantCollection<AlumniProfile>(ALUMNI_PROFILES_COL, tenantId, constraints);

    if (filter?.searchQuery) {
      const q = filter.searchQuery.toLowerCase();
      records = records.filter(a => 
        a.fullName.toLowerCase().includes(q) ||
        a.studentIdNumber.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        (a.currentCompany && a.currentCompany.toLowerCase().includes(q))
      );
    }

    return records;
  }

  static async getAlumniProfileById(tenantId: string, id: string): Promise<AlumniProfile | null> {
    const doc = await FirebaseService.getDocument<AlumniProfile>(ALUMNI_PROFILES_COL, id);
    if (!doc || doc.tenantId !== tenantId) return null;
    return doc;
  }

  static async createAlumniProfile(
    tenantId: string,
    data: Omit<AlumniProfile, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>,
    actor: UserActor
  ): Promise<AlumniProfile> {
    const id = `alumni_${Date.now()}`;
    const now = new Date().toISOString();

    const newProfile: AlumniProfile = {
      ...data,
      id,
      tenantId,
      createdAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(ALUMNI_PROFILES_COL, id, newProfile);

    await AuditService.log({
      tenantId,
      campusId: data.campusId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'ALUMNI_PROFILE_CREATED' as any,
      targetResource: 'alumni_profile',
      targetId: id,
      details: { fullName: data.fullName, graduationYear: data.graduationYear }
    });

    return newProfile;
  }

  static async updateAlumniProfile(
    tenantId: string,
    id: string,
    updates: Partial<AlumniProfile>,
    actor: UserActor
  ): Promise<AlumniProfile> {
    const existing = await this.getAlumniProfileById(tenantId, id);
    if (!existing) {
      throw new Error('Alumni profile not found or IDOR violation');
    }

    const updatedProfile: AlumniProfile = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    await FirebaseService.setDocument(ALUMNI_PROFILES_COL, id, updatedProfile);

    await AuditService.log({
      tenantId,
      campusId: existing.campusId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'ALUMNI_PROFILE_UPDATED' as any,
      targetResource: 'alumni_profile',
      targetId: id,
      details: { fullName: updatedProfile.fullName, employmentStatus: updatedProfile.employmentStatus }
    });

    return updatedProfile;
  }

  static async transitionStudentToAlumni(
    tenantId: string,
    studentId: string,
    graduationData: {
      studentIdNumber: string;
      fullName: string;
      email: string;
      phone?: string;
      graduationYear: number;
      degreeCourse: string;
      departmentId?: string;
      departmentName?: string;
      currentCompany?: string;
      currentDesignation?: string;
      campusId?: string;
    },
    actor: UserActor
  ): Promise<AlumniProfile> {
    const existingAlumni = await this.getAlumniProfiles(tenantId, { searchQuery: graduationData.studentIdNumber });
    if (existingAlumni.length > 0) {
      return existingAlumni[0];
    }

    return this.createAlumniProfile(
      tenantId,
      {
        studentId,
        studentIdNumber: graduationData.studentIdNumber,
        fullName: graduationData.fullName,
        email: graduationData.email,
        phone: graduationData.phone,
        graduationYear: graduationData.graduationYear,
        degreeCourse: graduationData.degreeCourse,
        departmentId: graduationData.departmentId,
        departmentName: graduationData.departmentName,
        currentCompany: graduationData.currentCompany || '',
        currentDesignation: graduationData.currentDesignation || '',
        employmentStatus: graduationData.currentCompany ? 'EMPLOYED' : 'JOB_SEEKING',
        isWillingToMentor: false,
        isWillingToRecruit: false,
        campusId: graduationData.campusId
      },
      actor
    );
  }

  // ==========================================
  // CORPORATE PARTNERS
  // ==========================================

  static async getCorporatePartners(tenantId: string, campusId?: string): Promise<CorporatePartner[]> {
    const constraints = campusId ? [where('campusId', '==', campusId)] : [];
    return FirebaseService.getTenantCollection<CorporatePartner>(CORPORATE_PARTNERS_COL, tenantId, constraints);
  }

  static async createCorporatePartner(
    tenantId: string,
    data: Omit<CorporatePartner, 'id' | 'tenantId' | 'companyCode' | 'totalPlacementsCount' | 'createdAt' | 'updatedAt'>,
    actor: UserActor
  ): Promise<CorporatePartner> {
    const id = `corp_${Date.now()}`;
    const now = new Date().toISOString();
    const shortCode = (data.companyName || 'CORP').replace(/[^a-zA-Z0-9]/g, '').substring(0, 4).toUpperCase();

    const newPartner: CorporatePartner = {
      ...data,
      id,
      tenantId,
      companyCode: `CP-${shortCode}-${Date.now().toString().slice(-4)}`,
      totalPlacementsCount: 0,
      createdAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(CORPORATE_PARTNERS_COL, id, newPartner);

    await AuditService.log({
      tenantId,
      campusId: data.campusId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'CORPORATE_PARTNER_CREATED' as any,
      targetResource: 'corporate_partner',
      targetId: id,
      details: { companyName: newPartner.companyName, tier: newPartner.tier }
    });

    return newPartner;
  }

  static async updateCorporatePartner(
    tenantId: string,
    id: string,
    updates: Partial<CorporatePartner>,
    actor: UserActor
  ): Promise<CorporatePartner> {
    const existing = await FirebaseService.getDocument<CorporatePartner>(CORPORATE_PARTNERS_COL, id);
    if (!existing || existing.tenantId !== tenantId) {
      throw new Error('Corporate partner not found or access denied');
    }

    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    await FirebaseService.setDocument(CORPORATE_PARTNERS_COL, id, updated);

    await AuditService.log({
      tenantId,
      campusId: existing.campusId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'CORPORATE_PARTNER_UPDATED' as any,
      targetResource: 'corporate_partner',
      targetId: id,
      details: { companyName: updated.companyName, status: updated.status }
    });

    return updated;
  }

  // ==========================================
  // JOB POSTINGS
  // ==========================================

  static async getJobPostings(tenantId: string, filter?: FilterJobPostingParams): Promise<JobPosting[]> {
    const constraints: any[] = [];
    if (filter?.type) {
      constraints.push(where('type', '==', filter.type));
    }
    if (filter?.status) {
      constraints.push(where('status', '==', filter.status));
    }
    if (filter?.companyId) {
      constraints.push(where('companyId', '==', filter.companyId));
    }

    let records = await FirebaseService.getTenantCollection<JobPosting>(JOB_POSTINGS_COL, tenantId, constraints);

    if (filter?.searchQuery) {
      const q = filter.searchQuery.toLowerCase();
      records = records.filter(j => 
        j.title.toLowerCase().includes(q) ||
        j.companyName.toLowerCase().includes(q) ||
        j.location.toLowerCase().includes(q)
      );
    }

    return records;
  }

  static async getJobPostingById(tenantId: string, id: string): Promise<JobPosting | null> {
    const doc = await FirebaseService.getDocument<JobPosting>(JOB_POSTINGS_COL, id);
    if (!doc || doc.tenantId !== tenantId) return null;
    return doc;
  }

  static async createJobPosting(
    tenantId: string,
    data: Omit<JobPosting, 'id' | 'tenantId' | 'jobCode' | 'createdAt' | 'updatedAt'>,
    actor: UserActor
  ): Promise<JobPosting> {
    const id = `job_${Date.now()}`;
    const now = new Date().toISOString();
    const codeSuffix = Date.now().toString().slice(-5);

    const newJob: JobPosting = {
      ...data,
      id,
      tenantId,
      jobCode: `JOB-${new Date().getFullYear()}-${codeSuffix}`,
      createdAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(JOB_POSTINGS_COL, id, newJob);

    await AuditService.log({
      tenantId,
      campusId: data.campusId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'JOB_POSTING_CREATED' as any,
      targetResource: 'job_posting',
      targetId: id,
      details: { title: newJob.title, companyName: newJob.companyName, status: newJob.status }
    });

    return newJob;
  }

  static async updateJobPostingStatus(
    tenantId: string,
    id: string,
    newStatus: JobPostingStatus,
    actor: UserActor
  ): Promise<JobPosting> {
    const existing = await this.getJobPostingById(tenantId, id);
    if (!existing) {
      throw new Error('Job posting not found');
    }

    const updated: JobPosting = {
      ...existing,
      status: newStatus,
      updatedAt: new Date().toISOString()
    };

    await FirebaseService.setDocument(JOB_POSTINGS_COL, id, updated);

    let auditAction = 'JOB_POSTING_PUBLISHED';
    if (newStatus === 'CLOSED') auditAction = 'JOB_POSTING_CLOSED';

    await AuditService.log({
      tenantId,
      campusId: existing.campusId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: auditAction as any,
      targetResource: 'job_posting',
      targetId: id,
      details: { title: existing.title, newStatus }
    });

    return updated;
  }

  // ==========================================
  // PLACEMENT DRIVES
  // ==========================================

  static async getPlacementDrives(tenantId: string, campusId?: string): Promise<PlacementDrive[]> {
    const constraints = campusId ? [where('campusId', '==', campusId)] : [];
    return FirebaseService.getTenantCollection<PlacementDrive>(PLACEMENT_DRIVES_COL, tenantId, constraints);
  }

  static async createPlacementDrive(
    tenantId: string,
    data: Omit<PlacementDrive, 'id' | 'tenantId' | 'driveCode' | 'registeredStudentsCount' | 'createdAt' | 'updatedAt'>,
    actor: UserActor
  ): Promise<PlacementDrive> {
    const id = `drive_${Date.now()}`;
    const now = new Date().toISOString();
    const codeSuffix = Date.now().toString().slice(-4);

    const newDrive: PlacementDrive = {
      ...data,
      id,
      tenantId,
      driveCode: `DRIVE-${new Date().getFullYear()}-${codeSuffix}`,
      registeredStudentsCount: 0,
      createdAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(PLACEMENT_DRIVES_COL, id, newDrive);

    await AuditService.log({
      tenantId,
      campusId: data.campusId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'PLACEMENT_DRIVE_CREATED' as any,
      targetResource: 'placement_drive',
      targetId: id,
      details: { title: newDrive.title, driveCode: newDrive.driveCode }
    });

    return newDrive;
  }

  static async updatePlacementDriveStatus(
    tenantId: string,
    id: string,
    newStatus: PlacementDriveStatus,
    actor: UserActor
  ): Promise<PlacementDrive> {
    const existing = await FirebaseService.getDocument<PlacementDrive>(PLACEMENT_DRIVES_COL, id);
    if (!existing || existing.tenantId !== tenantId) {
      throw new Error('Placement drive not found');
    }

    const updated: PlacementDrive = {
      ...existing,
      status: newStatus,
      updatedAt: new Date().toISOString()
    };

    await FirebaseService.setDocument(PLACEMENT_DRIVES_COL, id, updated);

    await AuditService.log({
      tenantId,
      campusId: existing.campusId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'PLACEMENT_DRIVE_STATUS_UPDATED' as any,
      targetResource: 'placement_drive',
      targetId: id,
      details: { driveCode: existing.driveCode, newStatus }
    });

    return updated;
  }

  // ==========================================
  // JOB APPLICATIONS
  // ==========================================

  static async getJobApplications(tenantId: string, jobPostingId?: string, studentId?: string): Promise<JobApplication[]> {
    const constraints: any[] = [];
    if (jobPostingId) {
      constraints.push(where('jobPostingId', '==', jobPostingId));
    }
    if (studentId) {
      constraints.push(where('studentId', '==', studentId));
    }

    return FirebaseService.getTenantCollection<JobApplication>(JOB_APPLICATIONS_COL, tenantId, constraints);
  }

  static async submitJobApplication(
    tenantId: string,
    data: Omit<JobApplication, 'id' | 'tenantId' | 'status' | 'appliedAt' | 'updatedAt'>,
    actor: UserActor
  ): Promise<JobApplication> {
    // Check existing application idempotency
    const existingApps = await this.getJobApplications(tenantId, data.jobPostingId, data.studentId);
    if (existingApps.length > 0) {
      throw new Error('Student has already submitted an application for this job posting');
    }

    const id = `app_${Date.now()}`;
    const now = new Date().toISOString();

    const newApp: JobApplication = {
      ...data,
      id,
      tenantId,
      status: 'APPLIED',
      appliedAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(JOB_APPLICATIONS_COL, id, newApp);

    await AuditService.log({
      tenantId,
      campusId: data.campusId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'JOB_APPLICATION_SUBMITTED' as any,
      targetResource: 'job_application',
      targetId: id,
      details: { jobTitle: data.jobTitle, companyName: data.companyName, studentName: data.studentName }
    });

    return newApp;
  }

  static async updateApplicationStatus(
    tenantId: string,
    applicationId: string,
    newStatus: JobApplicationStatus,
    actor: UserActor,
    interviewDetails?: JobApplication['interviewDetails']
  ): Promise<JobApplication> {
    const existing = await FirebaseService.getDocument<JobApplication>(JOB_APPLICATIONS_COL, applicationId);
    if (!existing || existing.tenantId !== tenantId) {
      throw new Error('Application not found');
    }

    const updated: JobApplication = {
      ...existing,
      status: newStatus,
      interviewDetails: interviewDetails || existing.interviewDetails,
      updatedAt: new Date().toISOString()
    };

    await FirebaseService.setDocument(JOB_APPLICATIONS_COL, applicationId, updated);

    await AuditService.log({
      tenantId,
      campusId: existing.campusId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'JOB_APPLICATION_STATUS_UPDATED' as any,
      targetResource: 'job_application',
      targetId: applicationId,
      details: { studentName: existing.studentName, jobTitle: existing.jobTitle, newStatus }
    });

    return updated;
  }

  // ==========================================
  // PLACEMENT OFFERS
  // ==========================================

  static async getPlacementOffers(tenantId: string, studentId?: string): Promise<PlacementOffer[]> {
    const constraints = studentId ? [where('studentId', '==', studentId)] : [];
    return FirebaseService.getTenantCollection<PlacementOffer>(PLACEMENT_OFFERS_COL, tenantId, constraints);
  }

  static async issuePlacementOffer(
    tenantId: string,
    data: Omit<PlacementOffer, 'id' | 'tenantId' | 'status' | 'createdAt' | 'updatedAt'>,
    actor: UserActor
  ): Promise<PlacementOffer> {
    const id = `offer_${Date.now()}`;
    const now = new Date().toISOString();

    const newOffer: PlacementOffer = {
      ...data,
      id,
      tenantId,
      status: 'PENDING_STUDENT_RESPONSE',
      createdAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(PLACEMENT_OFFERS_COL, id, newOffer);

    // Update parent job application state to OFFERED
    if (data.applicationId) {
      await this.updateApplicationStatus(tenantId, data.applicationId, 'OFFERED', actor);
    }

    await AuditService.log({
      tenantId,
      campusId: data.campusId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'PLACEMENT_OFFER_CREATED' as any,
      targetResource: 'placement_offer',
      targetId: id,
      details: { studentName: data.studentName, companyName: data.companyName, offeredCtc: data.offeredCtc }
    });

    return newOffer;
  }

  static async verifyPlacementOffer(
    tenantId: string,
    offerId: string,
    actor: UserActor
  ): Promise<PlacementOffer> {
    const existing = await FirebaseService.getDocument<PlacementOffer>(PLACEMENT_OFFERS_COL, offerId);
    if (!existing || existing.tenantId !== tenantId) {
      throw new Error('Placement offer not found');
    }

    const now = new Date().toISOString();
    const updated: PlacementOffer = {
      ...existing,
      status: 'VERIFIED_BY_INSTITUTION',
      verifiedByStaffId: actor.id,
      verifiedByStaffName: actor.displayName,
      verifiedAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(PLACEMENT_OFFERS_COL, offerId, updated);

    // Increment placement counter for Corporate Partner
    if (existing.companyId) {
      const partner = await FirebaseService.getDocument<CorporatePartner>(CORPORATE_PARTNERS_COL, existing.companyId);
      if (partner) {
        await FirebaseService.setDocument(CORPORATE_PARTNERS_COL, partner.id, {
          ...partner,
          totalPlacementsCount: (partner.totalPlacementsCount || 0) + 1,
          updatedAt: now
        });
      }
    }

    await AuditService.log({
      tenantId,
      campusId: existing.campusId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'PLACEMENT_OFFER_VERIFIED' as any,
      targetResource: 'placement_offer',
      targetId: offerId,
      details: { studentName: existing.studentName, companyName: existing.companyName, offeredCtc: existing.offeredCtc }
    });

    return updated;
  }

  static async updateOfferStatus(
    tenantId: string,
    offerId: string,
    newStatus: PlacementOfferStatus,
    actor: UserActor
  ): Promise<PlacementOffer> {
    const existing = await FirebaseService.getDocument<PlacementOffer>(PLACEMENT_OFFERS_COL, offerId);
    if (!existing || existing.tenantId !== tenantId) {
      throw new Error('Offer not found');
    }

    const updated: PlacementOffer = {
      ...existing,
      status: newStatus,
      updatedAt: new Date().toISOString()
    };

    await FirebaseService.setDocument(PLACEMENT_OFFERS_COL, offerId, updated);

    return updated;
  }

  // ==========================================
  // CAREER MENTORSHIP SESSIONS
  // ==========================================

  static async getMentorshipSessions(tenantId: string): Promise<CareerMentorshipSession[]> {
    return FirebaseService.getTenantCollection<CareerMentorshipSession>(MENTORSHIP_SESSIONS_COL, tenantId);
  }

  static async createMentorshipSession(
    tenantId: string,
    data: Omit<CareerMentorshipSession, 'id' | 'tenantId' | 'attendeesCount' | 'createdAt' | 'updatedAt'>,
    actor: UserActor
  ): Promise<CareerMentorshipSession> {
    const id = `mentor_${Date.now()}`;
    const now = new Date().toISOString();

    const session: CareerMentorshipSession = {
      ...data,
      id,
      tenantId,
      attendeesCount: 0,
      createdAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(MENTORSHIP_SESSIONS_COL, id, session);

    await AuditService.log({
      tenantId,
      campusId: data.campusId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'MENTORSHIP_SESSION_SCHEDULED' as any,
      targetResource: 'career_mentorship_session',
      targetId: id,
      details: { title: session.title, mentorName: session.mentorName }
    });

    return session;
  }

  // ==========================================
  // ALUMNI EVENTS & CONTRIBUTIONS
  // ==========================================

  static async getAlumniEvents(tenantId: string): Promise<AlumniEvent[]> {
    return FirebaseService.getTenantCollection<AlumniEvent>(ALUMNI_EVENTS_COL, tenantId);
  }

  static async createAlumniEvent(
    tenantId: string,
    data: Omit<AlumniEvent, 'id' | 'tenantId' | 'eventCode' | 'rsvpCount' | 'createdAt' | 'updatedAt'>,
    actor: UserActor
  ): Promise<AlumniEvent> {
    const id = `event_${Date.now()}`;
    const now = new Date().toISOString();
    const codeSuffix = Date.now().toString().slice(-4);

    const event: AlumniEvent = {
      ...data,
      id,
      tenantId,
      eventCode: `AE-${new Date().getFullYear()}-${codeSuffix}`,
      rsvpCount: 0,
      createdAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(ALUMNI_EVENTS_COL, id, event);

    await AuditService.log({
      tenantId,
      campusId: data.campusId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'ALUMNI_EVENT_CREATED' as any,
      targetResource: 'alumni_event',
      targetId: id,
      details: { title: event.title, eventType: event.eventType }
    });

    return event;
  }

  static async getAlumniContributions(tenantId: string): Promise<AlumniContribution[]> {
    return FirebaseService.getTenantCollection<AlumniContribution>(ALUMNI_CONTRIBUTIONS_COL, tenantId);
  }

  static async recordAlumniContribution(
    tenantId: string,
    data: Omit<AlumniContribution, 'id' | 'tenantId' | 'status' | 'createdAt' | 'updatedAt'>,
    actor: UserActor
  ): Promise<AlumniContribution> {
    const id = `contrib_${Date.now()}`;
    const now = new Date().toISOString();

    const contrib: AlumniContribution = {
      ...data,
      id,
      tenantId,
      status: 'PENDING_VERIFICATION',
      createdAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(ALUMNI_CONTRIBUTIONS_COL, id, contrib);

    await AuditService.log({
      tenantId,
      campusId: data.campusId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'ALUMNI_CONTRIBUTION_RECORDED' as any,
      targetResource: 'alumni_contribution',
      targetId: id,
      details: { alumniName: contrib.alumniName, type: contrib.type, amount: contrib.amount }
    });

    return contrib;
  }

  static async verifyAlumniContribution(
    tenantId: string,
    id: string,
    actor: UserActor
  ): Promise<AlumniContribution> {
    const existing = await FirebaseService.getDocument<AlumniContribution>(ALUMNI_CONTRIBUTIONS_COL, id);
    if (!existing || existing.tenantId !== tenantId) {
      throw new Error('Contribution record not found');
    }

    const now = new Date().toISOString();
    const updated: AlumniContribution = {
      ...existing,
      status: 'VERIFIED',
      verifiedByStaffId: actor.id,
      verifiedAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(ALUMNI_CONTRIBUTIONS_COL, id, updated);

    return updated;
  }

  // ==========================================
  // ANALYTICS & STATS
  // ==========================================

  static async getAlumniPlacementAnalytics(tenantId: string): Promise<AlumniPlacementAnalytics> {
    const [alumni, partners, jobs, apps, offers] = await Promise.all([
      this.getAlumniProfiles(tenantId),
      this.getCorporatePartners(tenantId),
      this.getJobPostings(tenantId),
      this.getJobApplications(tenantId),
      this.getPlacementOffers(tenantId)
    ]);

    const totalAlumniCount = alumni.length;
    const employedAlumniCount = alumni.filter(a => a.employmentStatus === 'EMPLOYED' || a.employmentStatus === 'ENTREPRENEUR').length;
    const totalCorporatePartners = partners.length;
    const activeJobPostings = jobs.filter(j => j.status === 'PUBLISHED').length;
    const totalApplications = apps.length;
    const verifiedOffers = offers.filter(o => o.status === 'VERIFIED_BY_INSTITUTION' || o.status === 'ACCEPTED');
    const totalPlacementOffers = verifiedOffers.length;

    let highestPackage = 0;
    let sumPackage = 0;

    verifiedOffers.forEach(o => {
      if (o.offeredCtc > highestPackage) highestPackage = o.offeredCtc;
      sumPackage += o.offeredCtc;
    });

    const averagePackage = verifiedOffers.length > 0 ? Math.round(sumPackage / verifiedOffers.length) : 0;
    const placementRatePercentage = totalApplications > 0 ? Math.min(100, Math.round((totalPlacementOffers / totalApplications) * 100)) : 0;

    return {
      tenantId,
      totalAlumniCount,
      employedAlumniCount,
      totalCorporatePartners,
      activeJobPostings,
      totalApplications,
      totalPlacementOffers,
      highestPackage,
      averagePackage,
      placementRatePercentage,
      lastUpdated: new Date().toISOString()
    };
  }
}
