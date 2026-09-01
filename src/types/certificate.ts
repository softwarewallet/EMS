export type CertificateDocumentType =
  | 'TRANSFER_CERTIFICATE'
  | 'SCHOOL_LEAVING_CERTIFICATE'
  | 'BONAFIDE_CERTIFICATE'
  | 'CHARACTER_CERTIFICATE'
  | 'STUDY_CERTIFICATE'
  | 'MIGRATION_CERTIFICATE'
  | 'OTHER';

export type CertificateStatus =
  | 'DRAFT'
  | 'PENDING_VERIFICATION'
  | 'READY_FOR_SIGNATURE'
  | 'SIGNED'
  | 'ISSUED'
  | 'REISSUE_REQUESTED'
  | 'REISSUED'
  | 'CANCELLED';

export interface CertificateStudentSnapshot {
  studentId: string;
  fullName: string;
  firstName: string;
  lastName: string;
  admissionNumber: string;
  studentIdNumber?: string;
  dateOfBirth: string;
  gender: string;
  nationality?: string;
  category?: string;
  religion?: string;
  fatherName?: string;
  motherName?: string;
  guardianName?: string;
  guardianPhone?: string;
  emergencyContact?: string;
  address?: string;
  email?: string;
}

export interface CertificateEnrollmentSnapshot {
  enrollmentId: string;
  academicYearId: string;
  academicYearName: string;
  classId: string;
  className: string;
  sectionId?: string;
  sectionName?: string;
  rollNumber?: string;
  admissionDate?: string;
  lastAttendanceDate?: string;
  totalWorkingDays?: number;
  daysAttended?: number;
  academicResult?: string;
  feeDuesStatus?: string;
  concessionDetails?: string;
}

export interface CertificateExitSnapshot {
  exitRequestId: string;
  exitType: string;
  requestedDate: string;
  proposedLastDate: string;
  effectiveExitDate: string;
  reason: string;
  destinationInstitution?: string;
  destinationCity?: string;
  destinationState?: string;
  destinationCountry?: string;
  conductAndCharacter?: string;
  generalRemarks?: string;
  clearanceCompletedAt?: string;
  exitApprovedAt?: string;
  exitApprovedBy?: string;
}

export interface CertificateInstitutionSnapshot {
  institutionName: string;
  institutionCode?: string;
  affiliationNumber?: string;
  schoolCode?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  logoUrl?: string;
  boardName?: string;
}

export interface CertificateSignatorySnapshot {
  signatoryId?: string;
  name: string;
  designation: string;
  signedAt?: string;
  signatureImageUrl?: string;
}

export interface CertificateSnapshot {
  id: string;
  certificateId: string;
  tenantId: string;
  schemaVersion: string;
  generatedAt: string;
  generatedBy: string;
  studentData: CertificateStudentSnapshot;
  enrollmentData: CertificateEnrollmentSnapshot;
  exitData: CertificateExitSnapshot;
  institutionData: CertificateInstitutionSnapshot;
  signatoryData: CertificateSignatorySnapshot;
}

export interface CertificateFieldConfig {
  fieldKey: string;
  label: string;
  required: boolean;
  hidden: boolean;
  order: number;
  sourcePath: string;
}

export interface CertificateTemplate {
  id: string;
  tenantId: string;
  campusId?: string;
  documentType: CertificateDocumentType;
  name: string;
  code: string;
  version: string;
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
  boardType?: 'CBSE' | 'ICSE' | 'STATE_BOARD' | 'IB' | 'CAMBRIDGE' | 'GENERAL';
  header: {
    title: string;
    subtitle?: string;
    showLogo: boolean;
    logoUrl?: string;
    institutionName?: string;
    affiliationText?: string;
    schoolCodeText?: string;
  };
  fieldsConfig: CertificateFieldConfig[];
  bodyTemplate?: string;
  footer: {
    showQrCode: boolean;
    qrVerificationUrlFormat?: string;
    signatorySlots: Array<{
      slotId: string;
      title: string;
      defaultDesignation: string;
      required: boolean;
    }>;
    declarationText?: string;
    generalRulesNotice?: string;
  };
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CertificateNumberingConfig {
  id: string;
  tenantId: string;
  campusId?: string;
  documentType: CertificateDocumentType;
  prefix: string;
  academicYearFormat: 'YYYY-YY' | 'YYYY' | 'YY-YY' | 'NONE';
  separator: string;
  paddingLength: number;
  currentSequence: number;
  includeCampus: boolean;
  formatPattern: string; // e.g. "{PREFIX}/{YEAR}/{SEQ}" or "{CAMPUS}/{PREFIX}/{YEAR}/{SEQ}"
  reservedNumbers: string[]; // List of numbers that have been assigned or cancelled and can never be reused
  createdAt: string;
  updatedAt: string;
}

export interface AuthorizedSignatory {
  id: string;
  tenantId: string;
  campusId?: string;
  userId?: string;
  name: string;
  designation: string;
  role: string;
  signatureImageUrl?: string;
  isActive: boolean;
  canIssue: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Certificate {
  id: string;
  tenantId: string;
  campusId?: string;
  studentId: string;
  exitRequestId: string;
  enrollmentId: string;
  documentType: CertificateDocumentType;
  certificateNumber: string;
  certificateVersion: number;
  status: CertificateStatus;
  issueDate?: string;
  effectiveExitDate?: string;
  templateId: string;
  templateVersion: string;
  snapshotId: string;
  verificationCode: string;
  verificationUrl?: string;
  qrPayload: string;
  documentHash?: string;
  issuedBy?: string;
  issuedByName?: string;
  issuedByRole?: string;
  verifiedBy?: string;
  verifiedByName?: string;
  verifiedAt?: string;
  signedBy?: string;
  signedByName?: string;
  signatoryDesignation?: string;
  signedAt?: string;
  issuedAt?: string;
  cancelledAt?: string;
  cancelledBy?: string;
  cancellationReason?: string;
  reissueOfCertificateId?: string;
  reissuedCertificateId?: string;
  reissueReason?: string;
  reissueRequestedBy?: string;
  reissueRequestedAt?: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CertificateVerificationResult {
  certificateNumber: string;
  status: 'VALID' | 'CANCELLED' | 'REISSUED' | 'INVALID';
  documentType: string;
  institutionName: string;
  studentNameMasked: string;
  admissionNumberMasked: string;
  issueDate?: string;
  effectiveExitDate?: string;
  verificationTimestamp: string;
  reissuedCertificateNumber?: string;
  cancellationReason?: string;
  isValid: boolean;
}

export interface CertificateEligibilityCheckResult {
  eligible: boolean;
  studentId: string;
  exitRequestId?: string;
  reasons: string[];
  blockingItems?: string[];
  missingFields?: string[];
}
