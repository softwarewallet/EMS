export type ReportCardType = 
  | 'TERM_REPORT'
  | 'MID_TERM_REPORT'
  | 'HALF_YEARLY_REPORT'
  | 'ANNUAL_REPORT'
  | 'PROGRESS_REPORT'
  | 'FINAL_REPORT'
  | 'TRANSFER_REPORT'
  | 'CUSTOM';

export type ReportCardStatus = 
  | 'DRAFT'
  | 'GENERATING'
  | 'GENERATED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'LOCKED'
  | 'PUBLISHED'
  | 'SUPERSEDED'
  | 'VOIDED';

export interface ReportCardSubjectRow {
  subjectId: string;
  subjectName: string;
  maximumMarks: number;
  obtainedMarks: number;
  percentage: number;
  grade: string;
  resultStatus: string;
}

export interface ReportCard {
  reportCardId: string;
  tenantId: string;
  campusId?: string;
  academicYearId: string;
  studentId: string;
  studentName: string;
  enrollmentId: string;
  classId: string;
  sectionId: string;
  reportCardType: ReportCardType;
  templateId: string;
  status: ReportCardStatus;
  calculationVersion: string;
  gradingPolicyId: string;
  gradingPolicyVersion: string;
  attendancePercentage: number;
  attendanceStatus: string;
  subjects: ReportCardSubjectRow[];
  totalMaximumMarks: number;
  totalObtainedMarks: number;
  overallPercentage: number;
  overallGrade: string;
  resultStatus: string;
  verificationCode: string;
  generatedAt: string;
  approvedAt?: string;
  publishedAt?: string;
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AcademicTranscript {
  transcriptId: string;
  tenantId: string;
  studentId: string;
  studentName: string;
  enrollmentId: string;
  academicYears: {
    academicYearId: string;
    className: string;
    sectionName: string;
    subjects: ReportCardSubjectRow[];
    overallPercentage: number;
    overallGrade: string;
    status: string;
  }[];
  status: 'GENERATED' | 'VERIFIED' | 'APPROVED' | 'ISSUED' | 'REVOKED';
  verificationCode: string;
  issuedAt: string;
  createdAt: string;
  updatedAt: string;
}
