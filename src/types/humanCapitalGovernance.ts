export type HCClassification = 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'RESTRICTED' | 'HIGHLY_CONFIDENTIAL';
export type HCStatus = 'DRAFT' | 'REVIEW' | 'APPROVED' | 'ACTIVE' | 'UNDER_REVIEW' | 'SUPERSEDED' | 'ARCHIVED' | 'CLOSED';
export type HCPerformanceCycleStatus = 'DRAFT' | 'OPEN' | 'ACTIVE' | 'REVIEW' | 'CALIBRATION' | 'CLOSED' | 'ARCHIVED';

export interface WorkforceStrategy {
  id: string;
  tenantId: string;
  campusScope: string;
  title: string;
  strategicAlignment: string;
  workforceObjectives: string[];
  capabilityPriorities: string[];
  planningHorizon: string;
  ownerId: string;
  reviewCycle: string;
  status: HCStatus;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

export interface WorkforcePlan {
  id: string;
  tenantId: string;
  campusScope: string;
  strategyId: string;
  title: string;
  currentCapacityRef: string;
  projectedDemandRef: string;
  capabilityGapRefs: string[];
  criticalPositionRefs: string[];
  recruitmentRequirementRefs: string[];
  status: HCStatus;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

export interface WorkforceScenario {
  id: string;
  tenantId: string;
  campusScope: string;
  title: string;
  scenarioType: 'HIRING_FREEZE' | 'EXPANSION' | 'SKILL_SHORTAGE' | 'RETIREMENT_CONCENTRATION' | 'VACANCY_EXPOSURE' | 'RESTRUCTURING';
  parametersJson: string;
  simulatedCapacityGap: number;
  simulatedSkillGap: number;
  simulatedRoleExposure: number;
  createdBy: string;
  createdAt: string;
}

export interface PositionGovernanceRecord {
  id: string;
  tenantId: string;
  campusScope: string;
  positionIdRef: string;
  title: string;
  criticality: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  capabilityRequirements: string[];
  successionRequired: boolean;
  dependencyRisk: string;
  status: HCStatus;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

export interface RoleGovernanceRecord {
  id: string;
  tenantId: string;
  campusScope: string;
  roleIdRef: string;
  roleClassification: string;
  accessSensitivity: HCClassification;
  criticality: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  competencyRequirements: string[];
  successionRequired: boolean;
  status: HCStatus;
  createdBy: string;
  createdAt: string;
}

export interface WorkforceCapacityObservation {
  id: string;
  tenantId: string;
  campusScope: string;
  departmentIdRef: string;
  observedCapacity: number;
  observationDate: string;
  status: 'VERIFIED' | 'UNVERIFIED';
  createdAt: string;
}

export interface WorkforceDemandObservation {
  id: string;
  tenantId: string;
  campusScope: string;
  departmentIdRef: string;
  projectedDemand: number;
  projectionHorizon: string;
  observationDate: string;
  createdAt: string;
}

export interface WorkforceGapAssessment {
  id: string;
  tenantId: string;
  campusScope: string;
  departmentIdRef: string;
  capacityGap: number;
  skillGapCount: number;
  criticalRoleExposure: number;
  assessedAt: string;
  createdAt: string;
}

export interface CompetencyFramework {
  id: string;
  tenantId: string;
  campusScope: string;
  title: string;
  description: string;
  category: 'INSTITUTIONAL' | 'LEADERSHIP' | 'ACADEMIC' | 'TECHNICAL' | 'PROFESSIONAL' | 'BEHAVIORAL';
  version: number;
  status: HCStatus;
  approvedById?: string;
  approvedAt?: string;
  createdBy: string;
  createdAt: string;
}

export interface CompetencyDefinition {
  id: string;
  tenantId: string;
  frameworkId: string;
  name: string;
  description: string;
  proficiencyLevels: string[];
  createdAt: string;
}

export interface SkillDefinition {
  id: string;
  tenantId: string;
  competencyId: string;
  skillName: string;
  category: string;
  createdAt: string;
}

export interface StaffCompetencyReference {
  id: string;
  tenantId: string;
  staffIdRef: string;
  competencyId: string;
  proficiencyLevel: string;
  evidenceRef?: string;
  verifiedById?: string;
  verificationState: 'PENDING' | 'VERIFIED' | 'EXPIRED';
  reviewDate: string;
  createdAt: string;
}

export interface TalentPool {
  id: string;
  tenantId: string;
  campusScope: string;
  name: string;
  description: string;
  category: 'EMERGING_LEADERS' | 'CRITICAL_TECHNICAL' | 'ACADEMIC_LEADERSHIP' | 'SPECIALIST';
  memberStaffIdRefs: string[];
  status: HCStatus;
  createdBy: string;
  createdAt: string;
}

export interface TalentAssessment {
  id: string;
  tenantId: string;
  staffIdRef: string;
  assessorId: string;
  assessmentFramework: string;
  potentialRating: 'HIGH' | 'MEDIUM' | 'LOW';
  performanceRating: 'HIGH' | 'MEDIUM' | 'LOW';
  developmentNeeds: string[];
  reviewDate: string;
  status: 'DRAFT' | 'REVIEWED' | 'APPROVED';
  createdAt: string;
}

export interface CareerPath {
  id: string;
  tenantId: string;
  title: string;
  departmentIdRef: string;
  roleProgression: string[];
  competencyMilestones: string[];
  createdAt: string;
}

export interface CareerDevelopmentPlan {
  id: string;
  tenantId: string;
  staffIdRef: string;
  targetRoleRef: string;
  milestones: string[];
  reviewDate: string;
  status: 'ACTIVE' | 'COMPLETED' | 'SUSPENDED';
  createdAt: string;
}

export interface DevelopmentObjective {
  id: string;
  tenantId: string;
  planId: string;
  objectiveText: string;
  targetDate: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  createdAt: string;
}

export interface TrainingGovernanceRecord {
  id: string;
  tenantId: string;
  campusScope: string;
  title: string;
  trainingType: 'MANDATORY' | 'ROLE_REQUIRED' | 'COMPETENCY' | 'LEADERSHIP' | 'COMPLIANCE';
  externalCourseRef?: string;
  requiredForRoleRefs: string[];
  status: HCStatus;
  createdAt: string;
}

export interface LearningRequirement {
  id: string;
  tenantId: string;
  staffIdRef: string;
  trainingId: string;
  dueDate: string;
  status: 'PENDING' | 'COMPLETED' | 'OVERDUE';
  completionEvidenceRef?: string;
  completedAt?: string;
  createdAt: string;
}

export interface PerformanceCycle {
  id: string;
  tenantId: string;
  campusScope: string;
  title: string;
  startDate: string;
  endDate: string;
  status: HCPerformanceCycleStatus;
  createdBy: string;
  createdAt: string;
}

export interface PerformanceGoal {
  id: string;
  tenantId: string;
  cycleId: string;
  staffIdRef: string;
  objective: string;
  kra: string;
  kpiRef?: string;
  targetValue: number;
  actualValue: number;
  weight: number;
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REVIEWED';
  createdAt: string;
}

export interface PerformanceReview {
  id: string;
  tenantId: string;
  cycleId: string;
  staffIdRef: string;
  reviewerId: string;
  overallRating: number;
  achievementsSummary: string;
  developmentNeeds: string;
  recommendation: string;
  status: 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'CALIBRATION' | 'APPROVED' | 'CLOSED';
  submittedAt?: string;
  approvedById?: string;
  approvedAt?: string;
  createdAt: string;
}

export interface PerformanceCalibration {
  id: string;
  tenantId: string;
  reviewId: string;
  originalRating: number;
  calibratedRating: number;
  rationale: string;
  calibratedById: string;
  approvedById: string;
  approvedAt: string;
  createdAt: string;
}

export interface RecognitionRecord {
  id: string;
  tenantId: string;
  staffIdRef: string;
  awardTitle: string;
  citation: string;
  awardedById: string;
  awardDate: string;
  createdAt: string;
}

export interface SuccessionPlan {
  id: string;
  tenantId: string;
  campusScope: string;
  positionIdRef: string;
  criticalRoleRef: string;
  readinessRating: string;
  reviewDate: string;
  status: HCStatus;
  createdBy: string;
  createdAt: string;
}

export interface SuccessionCandidate {
  id: string;
  tenantId: string;
  planId: string;
  candidateStaffIdRef: string;
  readinessState: 'READY_NOW' | 'READY_1_YEAR' | 'READY_2_YEARS' | 'LONG_TERM';
  developmentGap: string;
  nominatedById: string;
  approvedById?: string;
  status: 'NOMINATED' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

export interface CriticalRole {
  id: string;
  tenantId: string;
  campusScope: string;
  positionIdRef: string;
  title: string;
  vacancyImpact: 'HIGH' | 'CRITICAL' | 'SEVERE';
  hasSuccessor: boolean;
  dependencyRisk: string;
  createdAt: string;
}

export interface KeyPersonDependency {
  id: string;
  tenantId: string;
  campusScope: string;
  staffIdRef: string;
  criticalKnowledgeDomain: string;
  retirementExposureYear?: number;
  mitigationPlan: string;
  status: 'IDENTIFIED' | 'MITIGATING' | 'RESOLVED';
  createdAt: string;
}

export interface PromotionGovernanceRecord {
  id: string;
  tenantId: string;
  staffIdRef: string;
  currentPositionRef: string;
  targetPositionRef: string;
  requesterId: string;
  approverId: string;
  evidenceSummary: string;
  status: 'PROPOSED' | 'APPROVED' | 'REJECTED';
  effectiveDate: string;
  createdAt: string;
}

export interface TenureGovernanceReference {
  id: string;
  tenantId: string;
  staffIdRef: string;
  tenureTrackStartDate: string;
  tenureReviewDeadline: string;
  milestonesVerified: boolean;
  status: 'IN_PROGRESS' | 'GRANTED' | 'DECLINED' | 'UNDER_REVIEW';
  createdAt: string;
}

export interface PerformanceImprovementPlan {
  id: string;
  tenantId: string;
  staffIdRef: string;
  triggerReason: string;
  objectives: string[];
  supportMeasures: string;
  milestones: string[];
  startDate: string;
  reviewDate: string;
  outcome?: 'SUCCESSFUL' | 'UNSUCCESSFUL' | 'EXTENDED';
  status: 'DRAFT' | 'ACTIVE' | 'UNDER_REVIEW' | 'COMPLETED' | 'CLOSED';
  createdBy: string;
  createdAt: string;
}

export interface EmployeeEngagementObservation {
  id: string;
  tenantId: string;
  campusScope: string;
  observationPeriod: string;
  aggregateIndexScore: number;
  keyThemes: string[];
  actionPlanRef?: string;
  createdAt: string;
}

export interface RetentionRisk {
  id: string;
  tenantId: string;
  staffIdRef: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  riskDrivers: string[];
  mitigationPlan: string;
  ownerId: string;
  status: 'IDENTIFIED' | 'MITIGATING' | 'RESOLVED';
  createdAt: string;
}

export interface WorkforceRisk {
  id: string;
  tenantId: string;
  campusScope: string;
  category: 'CAPACITY' | 'CAPABILITY' | 'SUCCESSION' | 'RETENTION' | 'COMPLIANCE' | 'KNOWLEDGE_LOSS' | 'CRITICAL_ROLE' | 'RESTRUCTURING';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  title: string;
  mitigationPlan: string;
  ownerId: string;
  status: 'IDENTIFIED' | 'ASSESSED' | 'MITIGATION_PLANNED' | 'MITIGATING' | 'MONITORED' | 'CLOSED';
  createdAt: string;
}

export interface OrganizationalCapabilityAssessment {
  id: string;
  tenantId: string;
  campusScope: string;
  capabilityDomain: string;
  coverageScore: number;
  gapSummary: string;
  assessedAt: string;
  createdAt: string;
}

export interface WorkforceResilienceAssessment {
  id: string;
  tenantId: string;
  campusScope: string;
  criticalRoleCoverageScore: number;
  successionCoverageScore: number;
  knowledgeTransferScore: number;
  resilienceRating: 'ROBUST' | 'MODERATE' | 'VULNERABLE';
  assessedAt: string;
  createdAt: string;
}

export interface KnowledgeTransferPlan {
  id: string;
  tenantId: string;
  knowledgeOwnerStaffIdRef: string;
  successorStaffIdRef: string;
  criticalKnowledgeDomain: string;
  evidenceRef?: string;
  completionDate?: string;
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'VERIFIED';
  createdAt: string;
}

export interface OffboardingGovernanceRecord {
  id: string;
  tenantId: string;
  staffIdRef: string;
  knowledgeTransferPlanId?: string;
  recordsPreserved: boolean;
  continuityVerified: boolean;
  completedById: string;
  completedAt: string;
  status: 'IN_PROGRESS' | 'COMPLETED';
  createdAt: string;
}

export interface HumanCapitalException {
  id: string;
  tenantId: string;
  reason: string;
  scope: string;
  compensatingControl: string;
  requesterId: string;
  approverId: string;
  expiryDate: string;
  reviewDate: string;
  status: 'ACTIVE' | 'EXPIRED' | 'REVOKED';
  createdAt: string;
}

export interface HumanCapitalAuditEvent {
  id: string;
  tenantId: string;
  campusScope: string;
  actorId: string;
  action: string;
  entityType: string;
  entityId: string;
  timestamp: string;
  previousState?: any;
  resultingState?: any;
  justification?: string;
  correlationId?: string;
}
