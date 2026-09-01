// Phase 7.31 — Institutional Enterprise Risk Management, Campus Incident Command & Business Continuity Governance Types

export type RiskCategory =
  | 'STRATEGIC'
  | 'ACADEMIC_INTEGRITY'
  | 'FINANCIAL_SUSTAINABILITY'
  | 'OPERATIONAL'
  | 'LEGAL_REGULATORY'
  | 'REPUTATIONAL'
  | 'CYBER_INFOSEC'
  | 'CAMPUS_SAFETY_HEALTH'
  | 'ENVIRONMENTAL_DISASTER';

export type RiskSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type RiskStrategy = 'AVOID' | 'MITIGATE' | 'TRANSFER' | 'ACCEPT';

export type RiskStatus =
  | 'DRAFT'
  | 'SUBMITTED_FOR_REVIEW'
  | 'APPROVED'
  | 'ACTIVE_MONITORED'
  | 'MITIGATED'
  | 'ACCEPTED'
  | 'CLOSED'
  | 'ARCHIVED';

export type RiskReviewCadence = 'MONTHLY' | 'QUARTERLY' | 'BIANNUAL' | 'ANNUAL';

export interface InstitutionalRiskItem {
  id: string;
  tenantId: string;
  campusId?: string;
  riskCode: string;
  title: string;
  description: string;
  category: RiskCategory;
  inherentProbability: number; // 1 (Rare) to 5 (Almost Certain)
  inherentImpact: number; // 1 (Insignificant) to 5 (Catastrophic)
  inherentScore: number; // Probability * Impact (1 - 25)
  inherentSeverity: RiskSeverity;
  strategy: RiskStrategy;
  mitigationSummary: string;
  residualProbability: number; // 1 to 5
  residualImpact: number; // 1 to 5
  residualScore: number; // Probability * Impact (1 - 25)
  residualSeverity: RiskSeverity;
  status: RiskStatus;
  riskOwnerId: string;
  riskOwnerName: string;
  riskOwnerDepartment: string;
  reviewCadence: RiskReviewCadence;
  nextReviewDate: string;
  lastReviewedAt?: string;
  lastReviewedBy?: string;
  lastReviewedByName?: string;
  reviewNotes?: string;
  associatedKriIds?: string[];
  associatedPolicyIds?: string[];
  documentRegistryIds?: string[];
  mitigationIds?: string[];
  kriIds?: string[];
  incidentIds?: string[];
  version: number;
  createdBy: string;
  createdByName: string;
  createdByRole?: string;
  approvedBy?: string;
  approvedByName?: string;
  approvedAt?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export type MitigationControlType = 'PREVENTIVE' | 'DETECTIVE' | 'CORRECTIVE';

export type MitigationActionStatus =
  | 'OPEN'
  | 'VERIFIED_EFFECTIVE'
  | 'PLANNED'
  | 'IN_PROGRESS'
  | 'UNDER_VERIFICATION'
  | 'COMPLETED'
  | 'OVERDUE'
  | 'CANCELLED';

export interface RiskMitigationAction {
  id: string;
  tenantId: string;
  campusId?: string;
  riskId: string;
  riskCode: string;
  title: string;
  controlType: MitigationControlType;
  description: string;
  actionOwnerId: string;
  actionOwnerName: string;
  allocatedBudget?: number;
  spentBudget?: number;
  targetCompletionDate: string;
  actualCompletionDate?: string;
  status: MitigationActionStatus;
  progressPercentage: number; // 0 - 100
  verificationNotes?: string;
  verifiedBy?: string;
  verifiedByName?: string;
  verifiedAt?: string;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
}

export type KriStatus = 'NORMAL' | 'WATCH' | 'BREACH';
export type KriDirection = 'LOWER_IS_BETTER' | 'HIGHER_IS_BETTER';

export interface KeyRiskIndicator {
  id: string;
  tenantId: string;
  campusId?: string;
  code: string;
  name: string;
  metricUnit: string;
  targetDirection: KriDirection;
  normalThreshold: number;
  watchThreshold: number;
  breachThreshold: number;
  currentValue: number;
  status: KriStatus;
  lastEvaluatedAt: string;
  responsibleDepartment: string;
  associatedRiskIds: string[];
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export type IncidentType =
  | 'SAFETY_SECURITY'
  | 'MEDICAL_EMERGENCY'
  | 'FACILITY_FAILURE'
  | 'HAZARDOUS_MATERIALS'
  | 'SEVERE_WEATHER'
  | 'CYBER_INCIDENT'
  | 'ACADEMIC_INTEGRITY_BREACH'
  | 'STUDENT_UNREST'
  | 'FIRE_OUTBREAK'
  | 'TRANSPORT_SAFETY';

export type IncidentSeverity =
  | 'LEVEL_1_MINOR'
  | 'LEVEL_2_MODERATE'
  | 'LEVEL_3_MAJOR'
  | 'LEVEL_4_CRITICAL_DISASTER';

export type IncidentStatus =
  | 'REPORTED'
  | 'TRIAGED'
  | 'COMMAND_ACTIVATED'
  | 'CONTAINED'
  | 'RESOLVED'
  | 'CLOSED'
  | 'DE_ESCALATED';

export interface IncidentTimelineEvent {
  id: string;
  timestamp: string;
  authorId?: string;
  authorName?: string;
  action: string;
  notes?: string;
}

export interface PostIncidentReview {
  rootCause: string;
  lessonsLearned: string;
  preventiveActionsProposed: string;
  reviewedBy: string;
  reviewedByName: string;
  reviewedAt: string;
}

export interface CampusIncidentItem {
  id: string;
  tenantId: string;
  campusId: string;
  incidentNumber: string;
  title: string;
  type: IncidentType;
  severity: IncidentSeverity;
  status: IncidentStatus;
  location: string;
  occurredAt: string;
  reportedBy: string;
  reporterName: string;
  reportedByName?: string;
  reportedAt?: string;
  reporterContact?: string;
  reporterRole: string;
  incidentCommanderId?: string;
  incidentCommanderName?: string;
  safetyOfficerId?: string;
  safetyOfficerName?: string;
  publicInfoOfficerId?: string;
  publicInfoOfficerName?: string;
  immediateActionsTaken: string;
  casualtiesReported: number;
  hospitalizationsReported: number;
  propertyDamageEstimated?: number;
  emergencyServicesNotified: boolean;
  emergencyBroadcastTriggered: boolean;
  emergencyBroadcastRef?: string;
  timeline: IncidentTimelineEvent[];
  postIncidentReview?: PostIncidentReview;
  documentRegistryIds?: string[];
  resolvedAt?: string;
  resolvedBy?: string;
  resolvedByName?: string;
  closedAt?: string;
  closedBy?: string;
  closedByName?: string;
  createdAt: string;
  updatedAt: string;
}

export type BcpStatus =
  | 'DRAFT'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'ACTIVE'
  | 'ACTIVE_APPROVED'
  | 'UNDER_REVISION'
  | 'ARCHIVED';

export type BcpProcedurePhase =
  | 'IMMEDIATE_TRIAGE'
  | 'RELOCATION'
  | 'TEMPORARY_OPS'
  | 'FULL_RESTORATION';

export interface BcpStep {
  stepNumber: number;
  phase: BcpProcedurePhase;
  action: string;
  responsibleRole: string;
}

export interface BusinessContinuityPlan {
  id: string;
  tenantId: string;
  campusId?: string;
  code: string;
  name: string;
  criticalFunction: string;
  department: string;
  rtoHours: number; // Recovery Time Objective in hours
  rpoHours: number; // Recovery Point Objective in hours
  alternateOperatingFacility: string;
  remoteWorkCapability: boolean;
  backupSystemDescription: string;
  status: BcpStatus;
  version: number;
  emergencyTeamLeadId: string;
  emergencyTeamLeadName: string;
  secondaryLeadId: string;
  secondaryLeadName: string;
  activationTrigger: string;
  stepByStepProcedures: BcpStep[];
  lastDrillDate?: string;
  lastDrillScore?: number;
  lastTestedAt?: string;
  nextTestDueAt?: string;
  approvedBy?: string;
  approvedByName?: string;
  approvedAt?: string;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
}

export type InspectionType =
  | 'FIRE_SAFETY'
  | 'LAB_HAZARDS'
  | 'ELECTRICAL_SAFETY'
  | 'STRUCTURAL_INTEGRITY'
  | 'FOOD_SANITATION'
  | 'CAMPUS_SECURITY_PATROL';

export type InspectionStatus =
  | 'SCHEDULED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CAR_ISSUED'
  | 'CLOSED';

export type FindingSeverity = 'OBSERVATION' | 'MINOR_NC' | 'MAJOR_NC';

export interface InspectionFinding {
  id: string;
  itemCategory: string;
  observation: string;
  severity: FindingSeverity;
  photoRegistryId?: string;
  capaRequired: boolean;
  capaStatus?: string;
}

export interface SafetyAuditInspection {
  id: string;
  tenantId: string;
  campusId: string;
  inspectionNumber: string;
  inspectionType: InspectionType;
  facilityLocation: string;
  inspectorId: string;
  inspectorName: string;
  inspectionDate: string;
  scheduledDate?: string;
  completedDate?: string;
  overallScore: number; // 0 - 100
  complianceStatus: 'COMPLIANT' | 'NEEDS_IMPROVEMENT' | 'NON_COMPLIANT' | 'NON_COMPLIANT_CRITICAL' | 'PENDING_REVIEW';
  status: InspectionStatus;
  findings: InspectionFinding[];
  capaAssignedTo?: string;
  capaAssignedToName?: string;
  capaDueDate?: string;
  capaCompletedAt?: string;
  reInspectionDate?: string;
  documentRegistryIds?: string[];
  createdAt: string;
  updatedAt: string;
}

export type DrillType =
  | 'FIRE_EVACUATION'
  | 'ACTIVE_THREAT_LOCKDOWN'
  | 'EARTHQUAKE_SHELTER'
  | 'IT_DISASTER_FAILOVER'
  | 'TABLETOP_EXERCISE'
  | 'HAZMAT_CONTAINMENT';

export type DrillStatus = 'SCHEDULED' | 'CONDUCTED' | 'EVALUATED' | 'COMPLETED' | 'CANCELLED';

export interface ContinuitySimulationDrill {
  id: string;
  tenantId: string;
  campusId: string;
  drillCode: string;
  title: string;
  drillType: DrillType;
  bcpPlanId?: string;
  scheduledDate: string;
  conductedAt?: string;
  executedDate?: string;
  coordinatorId?: string;
  coordinatorName?: string;
  participantCount?: number;
  targetedParticipantsCount?: number;
  actualParticipantsCount?: number;
  evacuationTimeSeconds?: number;
  targetEvacuationTimeSeconds?: number;
  targetEvacuationSeconds?: number;
  evaluationRating?: number; // 1 to 5 or percentage
  overallReadinessRating?: 'SATISFACTORY' | 'ACCEPTABLE_WITH_GAPS' | 'UNSATISFACTORY' | string;
  observationsAndGaps?: string;
  identifiedGaps?: string[];
  correctiveActions?: string[];
  evaluatedBy?: string;
  evaluatedByName?: string;
  status: DrillStatus;
  createdAt: string;
  updatedAt: string;
}

export interface InstitutionalRiskAnalytics {
  totalRisks: number;
  criticalRisks: number;
  highRisks: number;
  mediumRisks: number;
  lowRisks: number;
  activeIncidents: number;
  level4Incidents: number;
  kriBreaches: number;
  kriWatch: number;
  activeBcps: number;
  bcpReadinessIndex: number;
  openCapaCount: number;
  averageEvacuationTimeSeconds: number;
  riskHeatmapMatrix: {
    inherent: Record<string, number>;
    residual: Record<string, number>;
  };
  categoryDistribution: Record<string, number>;
}
