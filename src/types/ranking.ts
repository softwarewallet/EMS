export type RankingScope = 'STUDENT' | 'SUBJECT' | 'SECTION' | 'CLASS' | 'CAMPUS' | 'INSTITUTION';
export type RankingMethod = 'TOTAL_MARKS' | 'PERCENTAGE' | 'WEIGHTED_SCORE' | 'GRADE_POINT' | 'CUSTOM';
export type TiePolicy = 'COMPETITION' | 'DENSE' | 'ORDINAL';
export type RankingPolicyStatus = 'DRAFT' | 'PENDING_APPROVAL' | 'ACTIVE' | 'SUPERSEDED' | 'ARCHIVED';

export interface RankingPolicy {
  policyId: string;
  tenantId: string;
  campusId?: string;
  academicYearId: string;
  name: string;
  description?: string;
  status: RankingPolicyStatus;
  version: string;
  rankingScope: RankingScope;
  rankingMethod: RankingMethod;
  minimumAttendancePercentage: number;
  tiePolicy: TiePolicy;
  roundingDecimals: number;
  effectiveFrom: string;
  effectiveTo: string;
  createdBy: string;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentRankRecord {
  studentId: string;
  studentName: string;
  enrollmentId: string;
  classId: string;
  sectionId: string;
  totalScore: number;
  maxScore: number;
  percentage: number;
  rank: number;
  eligible: boolean;
  ineligibilityReason?: string;
}

export interface RankingSnapshot {
  snapshotId: string;
  tenantId: string;
  policyId: string;
  policyVersion: string;
  academicYearId: string;
  scope: RankingScope;
  scopeId: string; // e.g. classId or sectionId
  status: 'DRAFT' | 'APPROVED' | 'PUBLISHED' | 'SUPERSEDED';
  records: StudentRankRecord[];
  calculatedAt: string;
  publishedAt?: string;
}
