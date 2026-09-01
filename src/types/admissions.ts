export interface AdmissionSessionConfig {
  applicationPrefix: string;
  autoNumbering: boolean;
  requireEntranceTest: boolean;
  requireInterview: boolean;
  requireEligibilityReview: boolean;
  requireApprovalWorkflow: boolean;
  meritWeights: {
    entranceTest: number;
    previousMarks: number;
    interview: number;
  };
  requiredDocuments: string[];
  classCapacityLimits: Record<string, number>; // classId -> max capacity
}

export interface AdmissionSession {
  id: string;
  tenantId: string;
  name: string; // e.g. "2027-28 Admissions"
  academicYearId: string;
  startDate: string;
  endDate: string;
  status: 'DRAFT' | 'OPEN' | 'CLOSED' | 'ARCHIVED';
  availableClassIds: string[];
  configuration?: Partial<AdmissionSessionConfig>;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdmissionEnquiry {
  id: string;
  tenantId: string;
  sessionId: string;
  enquiryNumber: string;
  applicantName: string;
  guardianName: string;
  contactNumber: string;
  email?: string;
  interestedClassId: string;
  academicYearId?: string;
  source: 'Walk-in' | 'Phone' | 'Website' | 'Referral' | 'Existing Parent' | 'Advertisement' | 'Other';
  remarks: string;
  assignedStaffId?: string;
  status: 'NEW' | 'CONTACTED' | 'FOLLOW_UP' | 'CONVERTED' | 'NOT_INTERESTED' | 'CLOSED';
  createdAt: string;
  updatedAt?: string;
}

export type ApplicationStatus = 
  | 'DRAFT' 
  | 'SUBMITTED' 
  | 'UNDER_REVIEW' 
  | 'DOCUMENT_PENDING' 
  | 'DOCUMENT_VERIFICATION' 
  | 'ELIGIBILITY_REVIEW' 
  | 'TEST_PENDING' 
  | 'INTERVIEW_PENDING' 
  | 'READY_FOR_SELECTION' 
  | 'SELECTED' 
  | 'WAITLISTED' 
  | 'REJECTED' 
  | 'APPROVED' 
  | 'ADMITTED' 
  | 'WITHDRAWN' 
  | 'CANCELLED'
  | 'EXPIRED';

export interface AdmissionApplicant {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  photoUrl?: string;
  contactNumber?: string;
  email?: string;
  address: string;
  previousInstitution?: string;
  previousClass?: string;
  previousMarksPercentage?: number;
}

export interface AdmissionGuardianRef {
  id?: string;
  name: string;
  relationship: 'father' | 'mother' | 'guardian' | 'other';
  contactNumber: string;
  email?: string;
  occupation?: string;
  isPrimaryContact: boolean;
}

export interface AdmissionApplication {
  id: string;
  tenantId: string;
  sessionId: string;
  applicationNumber: string;
  
  applicant: AdmissionApplicant;
  guardians: AdmissionGuardianRef[];

  appliedClassId: string;
  preferredSectionId?: string;
  campusId?: string;
  
  source: string;
  status: ApplicationStatus;
  
  assignedOfficerId?: string;
  remarks: string;
  
  // Workflow attributes & scores
  testId?: string;
  interviewId?: string;
  eligibilityPassed?: boolean;
  eligibilityRemarks?: string;
  
  calculatedMeritScore?: number;
  meritRank?: number;
  
  selectionDecision?: {
    decision: 'SELECTED' | 'WAITLISTED' | 'REJECTED';
    date: string;
    byId: string;
    byName?: string;
    remarks: string;
  };
  
  approvalDecision?: {
    decision: 'APPROVED' | 'REJECTED';
    date: string;
    byId: string;
    byName?: string;
    remarks: string;
  };

  // Capacity override log if over seat limit
  capacityOverride?: {
    overriddenBy: string;
    overriddenAt: string;
    reason: string;
  };
  
  // Link to created/linked student record upon admission
  linkedStudentId?: string;

  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
  admittedAt?: string;
}

export interface AdmissionDocument {
  id: string;
  applicationId: string;
  tenantId: string;
  documentType: string;
  fileName: string;
  fileUrl: string;
  status: 'PENDING' | 'UPLOADED' | 'UNDER_REVIEW' | 'VERIFIED' | 'REJECTED';
  verifiedById?: string;
  verifiedByName?: string;
  verifiedAt?: string;
  remarks?: string;
}

export interface AdmissionTest {
  id: string;
  applicationId: string;
  tenantId: string;
  testName: string;
  testDate: string;
  maxMarks: number;
  obtainedMarks?: number;
  status: 'SCHEDULED' | 'COMPLETED' | 'PASSED' | 'FAILED';
  evaluatorId?: string;
  evaluatorName?: string;
  remarks?: string;
}

export interface AdmissionInterview {
  id: string;
  applicationId: string;
  tenantId: string;
  interviewDate: string;
  timeSlot?: string;
  interviewerIds: string[];
  interviewerNames?: string[];
  score?: number;
  maxScore?: number;
  recommendation?: 'RECOMMENDED' | 'NOT_RECOMMENDED' | 'WAITLIST' | 'FURTHER_REVIEW';
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  remarks?: string;
}

export interface AdmissionMeritEntry {
  applicationId: string;
  applicationNumber: string;
  applicantName: string;
  appliedClassId: string;
  entranceScore: number;
  previousMarksScore: number;
  interviewScore: number;
  totalWeightedScore: number;
  rank: number;
  status: ApplicationStatus;
}

export interface AdmissionWaitlistEntry {
  id: string;
  tenantId: string;
  sessionId: string;
  applicationId: string;
  applicationNumber: string;
  applicantName: string;
  classId: string;
  position: number;
  status: 'ACTIVE' | 'OFFERED' | 'CONVERTED' | 'EXPIRED' | 'CANCELLED';
  createdAt: string;
  offeredAt?: string;
}

export interface AdmissionReportFilter {
  sessionId?: string;
  classId?: string;
  status?: ApplicationStatus;
  startDate?: string;
  endDate?: string;
}
