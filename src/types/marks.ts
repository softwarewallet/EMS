export type MarksStatus = 
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_VERIFICATION'
  | 'VERIFIED'
  | 'APPROVED'
  | 'LOCKED'
  | 'PUBLISHED'
  | 'CORRECTION_REQUESTED'
  | 'VOIDED';

export type ResultStatus = 
  | 'PASS'
  | 'FAIL'
  | 'ABSENT'
  | 'EXEMPTED'
  | 'WITHHELD'
  | 'INCOMPLETE'
  | 'PENDING'
  | 'PASS_BY_CONDONATION';

export interface AssessmentMark {
  markId: string;
  tenantId: string;
  campusId?: string;
  academicYearId: string;
  examinationId: string;
  componentId: string;
  studentId: string;
  studentName?: string;
  enrollmentId: string;
  classId: string;
  sectionId: string;
  subjectId: string;
  maximumMarks: number;
  passingMarks: number;
  rawMarks?: number;
  graceMarks: number;
  moderationMarks: number;
  obtainedMarks: number; // effective marks
  participationStatus: 'PRESENT' | 'ABSENT' | 'EXCUSED' | 'MEDICAL' | 'EXEMPTED' | 'WITHHELD';
  status: MarksStatus;
  remarks?: string;
  enteredBy: string;
  submittedBy?: string;
  verifiedBy?: string;
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
  verifiedAt?: string;
  approvedAt?: string;
  lockedAt?: string;
}

export interface SubjectResult {
  resultId: string;
  tenantId: string;
  academicYearId: string;
  examinationId: string;
  studentId: string;
  enrollmentId: string;
  subjectId: string;
  subjectName: string;
  totalMaximumMarks: number;
  totalObtainedMarks: number;
  percentage: number;
  grade: string;
  gradePoints?: number;
  resultStatus: ResultStatus;
  gradingPolicyVersion: string;
  calculatedAt: string;
}

export interface GradingPolicy {
  policyId: string;
  tenantId: string;
  academicYearId?: string;
  name: string;
  gradingSystem: 'PERCENTAGE' | 'LETTER_GRADE' | 'GRADE_POINT' | 'CGPA' | 'CUSTOM';
  gradeBands: { minPercentage: number; maxPercentage: number; grade: string; points?: number }[];
  passingPercentage: number;
  roundingRules: 'NONE' | 'NEAREST_INTEGER' | 'ONE_DECIMAL' | 'TWO_DECIMAL';
  status: 'ACTIVE' | 'INACTIVE';
  version: string;
}
