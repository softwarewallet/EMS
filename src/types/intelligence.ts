export type InsightType = 
  | 'PERFORMANCE_TREND'
  | 'PERFORMANCE_IMPROVEMENT'
  | 'PERFORMANCE_DECLINE'
  | 'SUBJECT_STRENGTH'
  | 'SUBJECT_WEAKNESS'
  | 'ATTENDANCE_PERFORMANCE'
  | 'ACADEMIC_RISK'
  | 'CONSISTENT_HIGH_PERFORMANCE'
  | 'INCONSISTENT_PERFORMANCE'
  | 'INTERVENTION_RECOMMENDATION';

export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
export type TrendStatus = 'IMPROVING' | 'STABLE' | 'DECLINING' | 'INSUFFICIENT_DATA';
export type DataSufficiency = 'SUFFICIENT' | 'LIMITED' | 'INSUFFICIENT';

export interface AcademicPerformanceInsight {
  insightId: string;
  tenantId: string;
  campusId?: string;
  academicYearId: string;
  studentId: string;
  studentName: string;
  enrollmentId: string;
  classId: string;
  sectionId: string;
  insightType: InsightType;
  severity: RiskLevel;
  status: 'ACTIVE' | 'RESOLVED' | 'REVIEWED' | 'REQUIRES_RECALCULATION';
  score: number;
  confidence: 'HIGH_DATA_CONFIDENCE' | 'LOW_DATA_CONFIDENCE' | 'INSUFFICIENT_DATA';
  dataSufficiency: DataSufficiency;
  reasonCodes: string[];
  evidence: {
    attendancePercentage?: number;
    averageScore?: number;
    previousScore?: number;
    currentScore?: number;
    absoluteChange?: number;
    percentageChange?: number;
    observationCount?: number;
    trendStatus?: TrendStatus;
    strongSubjects?: string[];
    weakSubjects?: string[];
    correlationCoefficient?: number;
  };
  sourceVersions: {
    marksVersion?: string;
    attendanceVersion?: string;
    gradingPolicyVersion?: string;
    rankingVersion?: string;
  };
  calculationVersion: string;
  policyVersion: string;
  generatedAt: string;
  validUntil?: string;
  createdAt: string;
  updatedAt: string;
}

export type InterventionType = 
  | 'ACADEMIC_SUPPORT'
  | 'SUBJECT_REMEDIATION'
  | 'ATTENDANCE_SUPPORT'
  | 'COUNSELLING_REFERRAL'
  | 'TEACHER_REVIEW'
  | 'PARENT_MEETING'
  | 'ENRICHMENT'
  | 'CUSTOM';

export type InterventionStatus = 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'MONITORING' | 'COMPLETED' | 'CANCELLED' | 'DEFERRED';

export interface InterventionReview {
  reviewId: string;
  reviewDate: string;
  currentPerformance?: number;
  attendancePercentage?: number;
  progressNotes: string;
  outcome: 'IMPROVED' | 'STABLE' | 'NO_IMPROVEMENT' | 'WORSENED' | 'INCONCLUSIVE';
  reviewedBy: string;
}

export interface AcademicIntervention {
  interventionId: string;
  tenantId: string;
  campusId?: string;
  studentId: string;
  studentName: string;
  enrollmentId: string;
  academicYearId: string;
  classId: string;
  sectionId: string;
  triggerInsightId?: string;
  interventionType: InterventionType;
  priority: RiskLevel;
  status: InterventionStatus;
  assignedTo: string; // Authoritative user ID or display name
  targetDate: string;
  actionPlan: string;
  notes?: string;
  reviews?: InterventionReview[];
  outcome?: 'IMPROVED' | 'STABLE' | 'NO_IMPROVEMENT' | 'WORSENED' | 'INCONCLUSIVE';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface IntelligenceRiskPolicy {
  policyId: string;
  tenantId: string;
  name: string;
  version: string;
  status: 'ACTIVE' | 'DRAFT' | 'SUPERSEDED' | 'ARCHIVED';
  weights: {
    lowPerformance: number;
    performanceDecline: number;
    repeatedFailure: number;
    subjectWeakness: number;
    lowAttendance: number;
    volatility: number;
  };
  thresholds: {
    passingPercentage: number;
    minimumAttendance: number;
    declineThreshold: number;
  };
  updatedAt: string;
}
