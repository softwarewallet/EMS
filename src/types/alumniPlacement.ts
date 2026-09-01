import { UserActor } from './inventory';

export type AlumniEmploymentStatus = 
  | 'EMPLOYED'
  | 'HIGHER_STUDIES'
  | 'ENTREPRENEUR'
  | 'JOB_SEEKING'
  | 'OTHER';

export type CorporatePartnerTier = 
  | 'TIER_1'
  | 'TIER_2'
  | 'TIER_3'
  | 'PRIME';

export type CorporatePartnerStatus = 
  | 'ACTIVE'
  | 'INACTIVE'
  | 'BLACKLISTED'
  | 'PROSPECTIVE';

export type MouStatus = 
  | 'ACTIVE'
  | 'PENDING'
  | 'EXPIRED'
  | 'NONE';

export type JobPostingType = 
  | 'FULL_TIME'
  | 'INTERNSHIP'
  | 'CONTRACT'
  | 'FULL_TIME_PLUS_INTERNSHIP';

export type JobPostingStatus = 
  | 'DRAFT'
  | 'PENDING_APPROVAL'
  | 'PUBLISHED'
  | 'CLOSED'
  | 'ARCHIVED';

export type PlacementDriveStatus = 
  | 'PLANNED'
  | 'REGISTRATION_OPEN'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export type JobApplicationStatus = 
  | 'APPLIED'
  | 'SHORTLISTED'
  | 'INTERVIEW_SCHEDULED'
  | 'OFFERED'
  | 'REJECTED'
  | 'WITHDRAWN';

export type PlacementOfferStatus = 
  | 'PENDING_STUDENT_RESPONSE'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'VERIFIED_BY_INSTITUTION';

export type MentorshipSessionStatus = 
  | 'SCHEDULED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export type AlumniEventType = 
  | 'REUNION'
  | 'NETWORKING'
  | 'GUEST_LECTURE'
  | 'CHAPTER_MEET'
  | 'FUNDRAISER';

export type AlumniEventStatus = 
  | 'PLANNED'
  | 'PUBLISHED'
  | 'COMPLETED'
  | 'CANCELLED';

export type AlumniContributionType = 
  | 'FINANCIAL_DONATION'
  | 'EQUIPMENT_SPONSORSHIP'
  | 'SCHOLARSHIP_FUND'
  | 'GUEST_LECTURING'
  | 'OTHER';

export type AlumniContributionStatus = 
  | 'PENDING_VERIFICATION'
  | 'VERIFIED'
  | 'REJECTED';

// Authoritative Entities

export interface AlumniProfile {
  id: string;
  tenantId: string;
  campusId?: string;
  studentId: string;
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
  industry?: string;
  location?: string;
  linkedInUrl?: string;
  employmentStatus: AlumniEmploymentStatus;
  isWillingToMentor: boolean;
  isWillingToRecruit: boolean;
  bioNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CorporatePartner {
  id: string;
  tenantId: string;
  campusId?: string;
  companyName: string;
  companyCode: string;
  industry: string;
  website?: string;
  tier: CorporatePartnerTier;
  primaryContactName: string;
  primaryContactEmail: string;
  primaryContactPhone?: string;
  status: CorporatePartnerStatus;
  mouStatus: MouStatus;
  mouExpiryDate?: string;
  totalPlacementsCount: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface JobPostingEligibility {
  minCgpa?: number;
  allowedDepartments?: string[];
  allowedGraduationYears?: number[];
  maxBacklogs?: number;
}

export interface JobPostingPackage {
  currency: string;
  baseCtc: number; // Annual package in standard currency units (e.g. USD / INR)
  maxCtc?: number;
  stipendMonthly?: number; // For internships
}

export interface JobPosting {
  id: string;
  tenantId: string;
  campusId?: string;
  companyId: string;
  companyName: string;
  title: string;
  jobCode: string;
  type: JobPostingType;
  location: string;
  eligibility: JobPostingEligibility;
  packageDetails: JobPostingPackage;
  applicationDeadline: string;
  status: JobPostingStatus;
  description: string;
  requiredSkills?: string[];
  vacanciesCount?: number;
  placementDriveId?: string;
  createdById: string;
  createdByName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlacementDrive {
  id: string;
  tenantId: string;
  campusId?: string;
  title: string;
  driveCode: string;
  companyIds: string[];
  companyNames?: string[];
  jobPostingIds: string[];
  startDate: string;
  endDate: string;
  venueLocation: string;
  coordinatorStaffId: string;
  coordinatorName: string;
  status: PlacementDriveStatus;
  registeredStudentsCount: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface JobApplication {
  id: string;
  tenantId: string;
  campusId?: string;
  jobPostingId: string;
  jobTitle: string;
  companyId: string;
  companyName: string;
  studentId: string;
  studentName: string;
  studentRollNumber: string;
  departmentId?: string;
  departmentName?: string;
  graduationYear: number;
  cgpa: number;
  resumeDocumentId?: string;
  resumeUrl?: string;
  status: JobApplicationStatus;
  interviewDetails?: {
    roundName: string;
    scheduledAt: string;
    venueOrLink: string;
    interviewerNotes?: string;
  };
  appliedAt: string;
  updatedAt: string;
}

export interface PlacementOffer {
  id: string;
  tenantId: string;
  campusId?: string;
  applicationId: string;
  jobPostingId: string;
  studentId: string;
  studentName: string;
  companyId: string;
  companyName: string;
  offeredRole: string;
  offeredCtc: number;
  currency: string;
  offerLetterDocumentId?: string;
  offerDate: string;
  joiningDate: string;
  status: PlacementOfferStatus;
  verifiedByStaffId?: string;
  verifiedByStaffName?: string;
  verifiedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CareerMentorshipSession {
  id: string;
  tenantId: string;
  campusId?: string;
  title: string;
  alumniOrMentorId: string;
  mentorName: string;
  mentorDesignation: string;
  topic: string;
  targetAudience: string;
  scheduledAt: string;
  durationMinutes: number;
  meetingLinkOrVenue: string;
  status: MentorshipSessionStatus;
  attendeesCount: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AlumniEvent {
  id: string;
  tenantId: string;
  campusId?: string;
  title: string;
  eventCode: string;
  eventType: AlumniEventType;
  eventDate: string;
  venueOrLink: string;
  description: string;
  status: AlumniEventStatus;
  rsvpCount: number;
  createdById: string;
  createdByName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AlumniContribution {
  id: string;
  tenantId: string;
  campusId?: string;
  alumniProfileId: string;
  alumniName: string;
  type: AlumniContributionType;
  amount?: number;
  currency?: string;
  description: string;
  dateRecorded: string;
  receiptReference?: string;
  status: AlumniContributionStatus;
  verifiedByStaffId?: string;
  verifiedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AlumniPlacementAnalytics {
  tenantId: string;
  totalAlumniCount: number;
  employedAlumniCount: number;
  totalCorporatePartners: number;
  activeJobPostings: number;
  totalApplications: number;
  totalPlacementOffers: number;
  highestPackage: number;
  averagePackage: number;
  placementRatePercentage: number;
  lastUpdated: string;
}

export interface FilterAlumniParams {
  graduationYear?: number;
  employmentStatus?: AlumniEmploymentStatus;
  departmentId?: string;
  isWillingToMentor?: boolean;
  searchQuery?: string;
}

export interface FilterJobPostingParams {
  type?: JobPostingType;
  status?: JobPostingStatus;
  companyId?: string;
  searchQuery?: string;
}
