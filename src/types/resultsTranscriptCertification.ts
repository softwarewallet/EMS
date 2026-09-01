export type AcademicResultLifecycleState = 
  | 'DRAFT'
  | 'CONSOLIDATING'
  | 'VALIDATED'
  | 'APPROVAL_PENDING'
  | 'APPROVED'
  | 'FINALIZED'
  | 'PUBLISHED'
  | 'SUPERSEDED'
  | 'ARCHIVED';

export type TranscriptLifecycleState =
  | 'REQUESTED'
  | 'VALIDATING'
  | 'GENERATED'
  | 'REVIEW'
  | 'APPROVAL_PENDING'
  | 'APPROVED'
  | 'ISSUED'
  | 'REISSUED'
  | 'SUPERSEDED'
  | 'ARCHIVED';

export type CredentialStatus =
  | 'ACTIVE'
  | 'REVOKED'
  | 'SUPERSEDED'
  | 'EXPIRED';

export type CorrectionStatus =
  | 'REQUESTED'
  | 'REVIEW'
  | 'EVIDENCE_VALIDATION'
  | 'APPROVAL_PENDING'
  | 'APPROVED'
  | 'APPLIED'
  | 'REISSUANCE_REQUIRED'
  | 'CLOSED';

export interface AcademicResult {
  resultId: string;
  tenantId: string;
  studentIdRef: string;
  programIdRef: string;
  courseIdRef: string;
  termIdRef: string;
  assessmentResultIdRef: string;
  creditsEarned: number;
  gradePoint: number;
  grade: string;
  isPass: boolean;
  status: AcademicResultLifecycleState;
  createdAt: string;
  updatedAt: string;
}

export interface AcademicRecordVersion {
  recordVersionId: string;
  tenantId: string;
  studentIdRef: string;
  programIdRef: string;
  versionNumber: number;
  previousRecordVersionIdRef?: string;
  totalCreditsEarned: number;
  gpa: number;
  cgpa: number;
  termResults: any[];
  status: 'ACTIVE' | 'SUPERSEDED';
  createdAt: string;
}

export interface Transcript {
  transcriptId: string;
  tenantId: string;
  studentIdRef: string;
  transcriptVersion: number;
  academicRecordVersionIdRef: string;
  contentHash: string;
  status: TranscriptLifecycleState;
  issuedAt?: string;
  issuedByUserIdRef?: string;
  approvedByUserIdRef?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Credential {
  credentialId: string; // tenantId:credentialType:sequence
  tenantId: string;
  studentIdRef: string;
  credentialType: 'DEGREE' | 'DIPLOMA' | 'COMPLETION' | 'ACADEMIC' | 'ENROLLMENT' | 'TRANSCRIPT';
  academicRecordVersionIdRef: string;
  status: CredentialStatus;
  issuedAt: string;
  issuedByUserIdRef: string;
}

export interface AcademicRecordCorrection {
  correctionId: string;
  tenantId: string;
  studentIdRef: string;
  targetEntityIdRef: string;
  targetEntityType: 'RESULT' | 'RECORD' | 'TRANSCRIPT';
  originalValueReference: any;
  correctedValueReference: any;
  reason: string;
  evidenceReference: string;
  requesterUserIdRef: string;
  approverUserIdRef?: string;
  previousRecordVersionIdRef?: string;
  newRecordVersionIdRef?: string;
  status: CorrectionStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AcademicRecordAuditEvent {
  eventId: string;
  tenantId: string;
  campusIdRef: string;
  actorUserIdRef: string;
  action: string;
  entityType: string;
  entityId: string;
  timestamp: string;
  previousHash: string;
  currentHash: string;
}

export interface SimulationScenario {
  id: string;
  name: string;
  description: string;
  status: 'IDLE' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  result?: string;
  metrics?: any;
}
