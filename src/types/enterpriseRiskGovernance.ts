// Institutional Enterprise Risk Management, Risk Intelligence, GRC Integration & Strategic Risk Governance Engine Types (Phase 7.72)

export type ERMCategory =
  | 'STRATEGIC'
  | 'OPERATIONAL'
  | 'FINANCIAL'
  | 'COMPLIANCE'
  | 'LEGAL'
  | 'REGULATORY'
  | 'CYBERSECURITY'
  | 'PRIVACY'
  | 'DATA'
  | 'ACADEMIC'
  | 'RESEARCH'
  | 'HUMAN_CAPITAL'
  | 'HEALTH_SAFETY'
  | 'ENVIRONMENTAL'
  | 'FACILITIES'
  | 'INFRASTRUCTURE'
  | 'TECHNOLOGY'
  | 'THIRD_PARTY'
  | 'PROCUREMENT'
  | 'CONTRACT'
  | 'REPUTATIONAL'
  | 'STAKEHOLDER'
  | 'INTERNATIONAL'
  | 'BUSINESS_CONTINUITY'
  | 'DISASTER_RECOVERY'
  | 'EMERGENCY'
  | 'PROJECT'
  | 'PROGRAM'
  | 'INNOVATION'
  | 'KNOWLEDGE'
  | 'AI'
  | 'EMERGING'
  | 'OTHER';

export type ERMLifecycleState =
  | 'IDENTIFIED'
  | 'ASSESSMENT'
  | 'TREATMENT_REQUIRED'
  | 'MITIGATION_ACTIVE'
  | 'MONITORING'
  | 'ACCEPTED'
  | 'ESCALATED'
  | 'CLOSED'
  | 'RETIRED';

export type ERMAppetiteState = 'WITHIN_APPETITE' | 'NEAR_TOLERANCE' | 'OUTSIDE_TOLERANCE' | 'CRITICAL_BREACH';

export type ERMKRIState = 'NORMAL' | 'WATCH' | 'WARNING' | 'CRITICAL' | 'INSUFFICIENT_DATA' | 'CALIBRATION_REQUIRED';

export type ERMTreatmentStrategy = 'ACCEPT' | 'MITIGATE' | 'TRANSFER' | 'AVOID' | 'EXPLOIT' | 'SHARE' | 'MONITOR';

export type ERMSimulationScenario =
  | 'REVENUE_SHOCK'
  | 'CYBER_INCIDENT'
  | 'RANSOMWARE_EVENT'
  | 'SUPPLIER_FAILURE'
  | 'CONTRACT_TERMINATION'
  | 'REGULATORY_CHANGE'
  | 'MAJOR_SAFETY_INCIDENT'
  | 'FACILITY_FAILURE'
  | 'CRITICAL_SYSTEM_OUTAGE'
  | 'PANDEMIC_EVENT'
  | 'NATURAL_DISASTER'
  | 'RESEARCH_INTEGRITY_EVENT'
  | 'ENROLLMENT_DECLINE'
  | 'WORKFORCE_SHORTAGE'
  | 'INTERNATIONAL_SANCTIONS_EVENT'
  | 'DATA_BREACH'
  | 'AI_FAILURE'
  | 'REPUTATIONAL_CRISIS'
  | 'LIQUIDITY_STRESS'
  | 'MULTI_RISK_CASCADE';

export interface EnterpriseRiskRecord {
  id: string;
  tenantId: string;
  campusIdRef?: string;
  title: string;
  statement: string;
  cause: string;
  event: string;
  consequence: string;
  category: ERMCategory;
  subcategory: string;
  ownerIdRef: string;
  accountableExecutiveIdRef: string;
  departmentIdRef?: string;
  strategicObjectiveIdRef?: string;
  
  inherentLikelihood: number; // 1-5
  inherentImpact: number; // 1-5
  inherentRiskScore: number; // 1-25
  
  controlEffectiveness: number; // 0-100%
  
  residualLikelihood: number; // 1-5
  residualImpact: number; // 1-5
  residualRiskScore: number; // 1-25
  
  riskVelocity: 'SLOW' | 'MODERATE' | 'RAPID' | 'VERY_RAPID';
  riskExposure: number; // Financial or abstract value
  
  appetiteState: ERMAppetiteState;
  
  treatmentStrategy: ERMTreatmentStrategy;
  monitoringFrequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'SEMI_ANNUAL' | 'ANNUAL';
  
  status: ERMLifecycleState;
  lastReviewedAt: string;
  nextReviewAt: string;
  
  sourceSystemRef?: string;
  sourceRecordIdRef?: string;
  provenanceHash?: string;
}

export interface EnterpriseRiskAppetiteFramework {
  id: string;
  tenantId: string;
  category: ERMCategory;
  appetiteStatement: string;
  toleranceStatement: string;
  riskCapacityThreshold: number;
  escalationThreshold: number;
  approvedByIdRef: string;
  lastUpdated: string;
}

export interface EnterpriseKRI {
  id: string;
  tenantId: string;
  campusIdRef?: string;
  riskIdRef: string;
  name: string;
  definition: string;
  ownerIdRef: string;
  measurementFrequency: string;
  baseline: number;
  target: number;
  warningThreshold: number;
  criticalThreshold: number;
  currentObservation: number;
  trend: 'IMPROVING' | 'STABLE' | 'DEGRADING';
  directionality: 'POSITIVE' | 'NEGATIVE';
  status: ERMKRIState;
  calculationBasis: string;
  lastVerifiedAt: string;
}

export interface RiskControlMapping {
  id: string;
  tenantId: string;
  riskIdRef: string;
  controlIdRef: string;
  sourceDomain: string; // e.g., 'CYBER', 'FINANCE', 'SAFETY'
  mappingType: 'PREVENTATIVE' | 'DETECTIVE' | 'CORRECTIVE' | 'DIRECTIVE';
  effectivenessScore: number; // 0-100
  lastTestedAt?: string;
}

export interface RiskMitigationPlan {
  id: string;
  tenantId: string;
  riskIdRef: string;
  title: string;
  description: string;
  ownerIdRef: string;
  targetDate: string;
  expectedResidualScore: number;
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE' | 'CANCELLED';
  progressPercentage: number;
}

export interface RiskDependencyGraph {
  id: string;
  tenantId: string;
  sourceRiskIdRef: string;
  targetRiskIdRef: string;
  dependencyType: 'COMPOUNDS' | 'TRIGGERS' | 'MITIGATES';
  impactMultiplier: number;
}

export interface EmergingRiskObservation {
  id: string;
  tenantId: string;
  title: string;
  description: string;
  category: ERMCategory;
  source: string;
  confidence: 'LOW' | 'MEDIUM' | 'HIGH';
  observedAt: string;
  analystIdRef: string;
  reviewStatus: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'WATCHLIST';
}

export interface RiskAcceptanceRecord {
  id: string;
  tenantId: string;
  riskIdRef: string;
  requesterIdRef: string;
  approverIdRef: string;
  rationale: string;
  compensatingControls: string;
  expiryDate: string;
  fourEyesVerified: boolean;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED';
  createdAt: string;
}

export interface ExecutiveRiskDecision {
  id: string;
  tenantId: string;
  riskIdRef?: string;
  title: string;
  proposal: string;
  riskImplications: string;
  financialImplications: string;
  strategicImplications: string;
  requesterIdRef: string;
  approverIdRef: string;
  status: 'PROPOSED' | 'APPROVED' | 'REJECTED' | 'CONDITIONALLY_APPROVED';
  decisionNotes?: string;
  fourEyesVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ERMDiagnosticFinding {
  id: string;
  tenantId: string;
  campusId?: string;
  category: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  title: string;
  description: string;
  remediationRecommendation: string;
}

export interface ERMSimulationResult {
  scenario: ERMSimulationScenario;
  scenarioName: string;
  description: string;
  affectedRiskCount: number;
  maxCascadingDepth: number;
  appetiteBreaches: number;
  estimatedFinancialExposure: number;
  criticalVulnerabilities: string[];
}

export interface EnterpriseRiskAuditEvent {
  id: string;
  tenantId: string;
  campusId?: string;
  actorId: string;
  action: string;
  entityType: string;
  entityId: string;
  timestamp: string;
  outcome: 'SUCCESS' | 'FAILURE' | 'DENIED';
  reason: string;
  previousHash?: string;
  currentHash: string;
  provenance: string;
}
