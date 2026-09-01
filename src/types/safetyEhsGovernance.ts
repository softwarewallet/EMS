/**
 * EMS Phase 7.64 — Institutional Safety, Occupational Health, Environmental Health, Emergency Preparedness & Life-Safety Governance Engine
 * Reference-Only Control Plane Types
 */

// 1. Safety Governance Reference & Policies
export interface SafetyGovernanceReference {
  id: string;
  tenantId: string;
  campusScope: string;
  siteIdRef?: string;
  buildingIdRef?: string;
  facilityIdRef?: string;
  spaceIdRef?: string;
  departmentIdRef: string;
  referenceType: 'FACILITY_SAFETY' | 'LAB_SAFETY' | 'RADIATION_SAFETY' | 'BIO_SAFETY' | 'FIRE_LIFE' | 'OCCUPATIONAL_HEALTH';
  authoritativeSourceRef: string; // e.g. "EHS-SYS-2026-904"
  title: string;
  custodianIdRef: string;
  overallComplianceRating: SafetyComplianceRating;
  isRestrictedArea: boolean;
  requiresSpecialClearance: boolean;
  status: 'ACTIVE' | 'RESTRICTED' | 'SUSPENDED';
  createdAt: string;
  createdBy: string;
  updatedAt?: string;
}

export type SafetyComplianceRating = 'FULLY_COMPLIANT' | 'CONDITIONALLY_COMPLIANT' | 'NON_COMPLIANT' | 'INSUFFICIENT_DATA';

export interface SafetyPolicyGovernance {
  id: string;
  tenantId: string;
  campusScope: string;
  policyCode: string;
  policyTitle: string;
  category: HazardCategory;
  governingStandardRef: string; // e.g., "OSHA-1910", "NFPA-101", "EPA-RCRA"
  mandatoryReviewIntervalMonths: number;
  proposerId: string;
  approverId: string;
  effectiveDate: string;
  reviewDate: string;
  status: 'ACTIVE' | 'DRAFT' | 'SUPERSEDED';
  createdAt: string;
}

export interface SafetyProgramGovernance {
  id: string;
  tenantId: string;
  campusScope: string;
  programCode: string;
  programName: string;
  programLeadIdRef: string;
  targetDepartmentRefs: string[];
  mandatoryTrainingCourseRefs: string[];
  auditFrequencyMonths: number;
  status: 'ACTIVE' | 'UNDER_REVIEW' | 'INACTIVE';
}

export interface SafetyRequirement {
  id: string;
  tenantId: string;
  campusScope: string;
  requirementCode: string;
  title: string;
  hazardCategory: HazardCategory;
  regulatoryJurisdictionRef?: string;
  isMandatoryStatutory: boolean;
  penaltyCategory?: 'IMMEDIATE_CLOSURE' | 'CIVIL_PENALTY' | 'INSTITUTIONAL_NOTICE';
  status: 'ACTIVE' | 'RETIRED';
}

export interface RegulatorySafetyReference {
  id: string;
  tenantId: string;
  campusScope: string;
  regulatorName: string; // e.g. "OSHA", "EPA", "NRC", "State Fire Marshal"
  permitOrLicenseRef: string;
  issuanceDate: string;
  expirationDate: string;
  complianceContactIdRef: string;
  regulatoryFilingRecordRef: string;
  status: 'CURRENT' | 'RENEWAL_PENDING' | 'EXPIRED';
}

export interface WorkplaceGovernance {
  id: string;
  tenantId: string;
  campusScope: string;
  workplaceIdRef: string;
  buildingIdRef: string;
  floorNumber?: number;
  roomNumber?: string;
  workplaceType: 'OFFICE' | 'TEACHING_LAB' | 'RESEARCH_WET_LAB' | 'ENGINEERING_WORKSHOP' | 'VIVARIUM' | 'CENTRAL_PLANT' | 'KITCHEN';
  designOccupancyLimit: number;
  hasHazardousMaterials: boolean;
  assignedSafetyOfficerIdRef: string;
  status: 'ACTIVE' | 'RESTRICTED';
}

// 2. Hazard Governance & Lifecycle
export type HazardCategory =
  | 'FIRE'
  | 'CHEMICAL'
  | 'BIOLOGICAL'
  | 'RADIATION'
  | 'ELECTRICAL'
  | 'MECHANICAL'
  | 'STRUCTURAL'
  | 'ENVIRONMENTAL'
  | 'ERGONOMIC'
  | 'WORKPLACE_VIOLENCE'
  | 'LABORATORY'
  | 'CONSTRUCTION'
  | 'VEHICLE'
  | 'SLIP_TRIP_FALL'
  | 'WATER'
  | 'AIR_QUALITY'
  | 'NOISE'
  | 'THERMAL'
  | 'OTHER';

export type HazardLifecycleState =
  | 'IDENTIFIED'
  | 'ASSESSED'
  | 'CONTROL_PLANNED'
  | 'CONTROL_IMPLEMENTED'
  | 'MONITORED'
  | 'ACCEPTED'
  | 'CLOSED'
  | 'RETIRED';

export interface HazardCategoryGovernance {
  id: string;
  tenantId: string;
  campusScope: string;
  category: HazardCategory;
  description: string;
  defaultHierarchyControl: ControlHierarchyType;
  mandatoryInspectionCycleDays: number;
  requiresExternalCertification: boolean;
}

export interface HazardRegister {
  id: string;
  tenantId: string;
  campusScope: string;
  hazardCode: string;
  title: string;
  category: HazardCategory;
  lifecycleState: HazardLifecycleState;
  locationReference: {
    siteIdRef?: string;
    buildingIdRef?: string;
    facilityIdRef?: string;
    spaceIdRef?: string;
    departmentIdRef: string;
  };
  authoritativeEhsInventoryRef?: string; // Reference-only to chemical/biological inventory
  responsibleOwnerIdRef: string;
  assessedRiskLevel: SafetyRiskLevel;
  hasActiveControls: boolean;
  hasActiveException: boolean;
  status: 'ACTIVE' | 'MITIGATED' | 'CLOSED';
  createdAt: string;
  createdBy: string;
  updatedAt?: string;
}

export interface HazardObservation {
  id: string;
  tenantId: string;
  campusScope: string;
  hazardRegisterId: string;
  observationMethod: 'PHYSICAL_WALKTHROUGH' | 'AIR_SAMPLE' | 'NOISE_DOSIMETRY' | 'SAFETY_AUDIT' | 'EMPLOYEE_REPORT';
  observedCondition: string;
  immediateActionTaken?: string;
  requiresImmediateEvacuation: boolean;
  observerIdRef: string;
  observedAt: string;
}

export interface HazardAssessment {
  id: string;
  tenantId: string;
  campusScope: string;
  hazardRegisterId: string;
  assessorIdRef: string;
  assessmentDate: string;
  exposureProbabilityScore: number; // 1-5
  potentialSeverityScore: number; // 1-5
  frequencyExposureScore: number; // 1-5
  populationAtRiskCountEstimated: number;
  evaluatedRiskLevel: SafetyRiskLevel;
  justificationNotes: string;
  approvedBy?: string;
  approvedAt?: string;
}

// 3. Risk Engine & Controls
export type SafetyRiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' | 'EXTREME';

export type ControlHierarchyType = 'ELIMINATION' | 'SUBSTITUTION' | 'ENGINEERING' | 'ADMINISTRATIVE' | 'PPE';

export interface RiskAssessment {
  id: string;
  tenantId: string;
  campusScope: string;
  hazardIdRef: string;
  facilityIdRef?: string;
  likelihood: number; // 1-5
  severity: number; // 1-5
  exposureScore: number; // 1-5
  durationScore: number; // 1-5
  affectedPopulationScore: number; // 1-5
  regulatorySignificanceScore: number; // 1-5
  detectabilityScore: number; // 1-5
  controlEffectivenessScore: number; // 1-5
  calculatedRiskScore: number; // Deterministic bounded calculation
  riskLevel: SafetyRiskLevel;
  assessedBy: string;
  assessedAt: string;
}

export interface RiskControl {
  id: string;
  tenantId: string;
  campusScope: string;
  controlCode: string;
  title: string;
  hazardRegisterIdRef: string;
  controlHierarchy: ControlHierarchyType;
  description: string;
  implementationState: 'PROPOSED' | 'IMPLEMENTED' | 'MAINTAINED' | 'DEFICIENT' | 'RETIRED';
  verificationStatus: 'VERIFIED' | 'PENDING_VERIFICATION' | 'FAILED_VERIFICATION';
  controlOwnerIdRef: string;
  lastVerificationDateRef?: string;
  nextVerificationDueDate: string;
  isOverdueForVerification: boolean;
  expiryDate?: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface ControlEffectivenessObservation {
  id: string;
  tenantId: string;
  campusScope: string;
  controlIdRef: string;
  verifierIdRef: string;
  verifiedAt: string;
  isEffective: boolean;
  observedDeficiencyNotes?: string;
  evidenceReferenceRef: string;
}

// 4. Inspection & Findings
export type InspectionFindingSeverity = 'MINOR' | 'MODERATE' | 'SERIOUS' | 'CRITICAL' | 'IMMINENT_DANGER';

export type FindingLifecycleState =
  | 'OPEN'
  | 'ASSIGNED'
  | 'ACTION_IN_PROGRESS'
  | 'VERIFICATION_PENDING'
  | 'VERIFIED'
  | 'CLOSED';

export interface SafetyInspection {
  id: string;
  tenantId: string;
  campusScope: string;
  inspectionCode: string;
  title: string;
  facilityIdRef: string;
  buildingIdRef?: string;
  spaceIdRef?: string;
  inspectionType: 'ROUTINE_WALKTHROUGH' | 'LAB_ANNUAL' | 'FIRE_LIFE_SAFETY' | 'OSHA_COMPLIANCE' | 'SPECIAL_EVENT';
  leadInspectorIdRef: string;
  scheduledDate: string;
  completedDate?: string;
  findingsCount: number;
  criticalFindingsCount: number;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE';
}

export interface InspectionFinding {
  id: string;
  tenantId: string;
  campusScope: string;
  inspectionIdRef: string;
  hazardCategory: HazardCategory;
  findingTitle: string;
  description: string;
  severity: InspectionFindingSeverity;
  lifecycleState: FindingLifecycleState;
  responsibleOwnerIdRef: string;
  dueDate: string;
  isOverdue: boolean;
  evidenceReferenceRef?: string;
  correctiveActionPlanRef?: string;
  verifiedByIdRef?: string;
  verifiedAt?: string;
  closedAt?: string;
}

// 5. Corrective & Preventive Actions (CAPA)
export interface CorrectiveAction {
  id: string;
  tenantId: string;
  campusScope: string;
  actionCode: string;
  findingIdRef?: string;
  incidentIdRef?: string;
  actionType: 'CORRECTIVE' | 'PREVENTIVE';
  title: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  actionOwnerIdRef: string;
  dueDate: string;
  isOverdue: boolean;
  evidenceAttachmentRef?: string;
  independentVerifierIdRef?: string;
  verifiedAt?: string;
  status: 'ASSIGNED' | 'IN_PROGRESS' | 'VERIFICATION_PENDING' | 'RESOLVED_VERIFIED' | 'REJECTED';
  createdAt: string;
}

export interface PreventiveAction {
  id: string;
  tenantId: string;
  campusScope: string;
  title: string;
  systemicHazardCategory: HazardCategory;
  rootCauseReferenceRef: string;
  targetImplementationDate: string;
  assignedCustodianIdRef: string;
  status: 'PLANNED' | 'IMPLEMENTED' | 'EVALUATING';
}

// 6. Safety Exceptions & Waivers
export interface SafetyException {
  id: string;
  tenantId: string;
  campusScope: string;
  exceptionCode: string;
  exceptionType: 'TEMPORARY_CONTROL_DEVIATION' | 'PPE_ALTERNATIVE' | 'INSPECTION_DEFERRAL' | 'OCCUPANCY_VARIANCE';
  hazardIdRef: string;
  businessRationale: string;
  riskAssessmentSummary: string;
  compensatingControl: string;
  proposerId: string;
  approverId: string;
  effectiveDate: string;
  expiryDate: string; // Mandatory bounded expiry - no indefinite exceptions allowed
  status: 'ACTIVE' | 'EXPIRED' | 'REVOKED';
  createdAt: string;
}

export interface SafetyWaiver {
  id: string;
  tenantId: string;
  campusScope: string;
  waiverTitle: string;
  facilityIdRef: string;
  justification: string;
  compensatingSafeguards: string[];
  proposerId: string;
  approverId: string;
  validUntil: string;
  status: 'ACTIVE' | 'EXPIRED';
}

// 7. Incident Governance
export type IncidentClassificationType =
  | 'NEAR_MISS'
  | 'FIRST_AID'
  | 'MEDICAL_TREATMENT'
  | 'LOST_TIME_INJURY'
  | 'FIRE_EVENT'
  | 'CHEMICAL_SPILL'
  | 'BIOHAZARD_RELEASE'
  | 'RADIATION_ANOMALY'
  | 'ENVIRONMENTAL_RELEASE'
  | 'EQUIPMENT_SAFETY_FAILURE';

export type IncidentLifecycleState =
  | 'REPORTED'
  | 'TRIAGED'
  | 'INVESTIGATION'
  | 'ACTION_PLAN'
  | 'VERIFICATION'
  | 'CLOSED';

export interface IncidentReference {
  id: string;
  tenantId: string;
  campusScope: string;
  authoritativeIncidentIdRef: string; // CMMS/Incident System Reference
  incidentTitle: string;
  classification: IncidentClassificationType;
  lifecycleState: IncidentLifecycleState;
  facilityIdRef: string;
  buildingIdRef?: string;
  spaceIdRef?: string;
  occurredAt: string;
  reportedAt: string;
  severityRating: 'MINOR' | 'MODERATE' | 'MAJOR' | 'CATASTROPHIC';
  requiresRegulatoryReporting: boolean;
  regulatoryAgencyNotifiedRef?: string;
  investigationLeadIdRef?: string;
  status: 'OPEN' | 'INVESTIGATING' | 'ACTIONS_PENDING' | 'CLOSED';
}

export interface SafetyIncidentClassification {
  id: string;
  tenantId: string;
  campusScope: string;
  incidentRefId: string;
  oshaRecordable: boolean;
  environmentalSpillThresholdExceeded: boolean;
  lostWorkdaysEstimated?: number;
  classifiedBy: string;
  classifiedAt: string;
}

export interface IncidentInvestigation {
  id: string;
  tenantId: string;
  campusScope: string;
  incidentRefId: string;
  leadInvestigatorIdRef: string;
  investigationStatus: 'IN_PROGRESS' | 'COMPLETED' | 'AWAITING_APPROVAL';
  findingsSummary: string;
  contributingFactors: string[];
  rootCauseCategory: string;
  proposerId: string;
  approverId?: string;
  approvedAt?: string;
}

export interface RootCauseObservation {
  id: string;
  tenantId: string;
  campusScope: string;
  incidentRefId: string;
  primaryRootCause: string;
  methodologyUsed: '5_WHYS' | 'FISHBONE' | 'FAULT_TREE' | 'TAPROOT';
  recordedBy: string;
  recordedAt: string;
}

export interface NearMissObservation {
  id: string;
  tenantId: string;
  campusScope: string;
  nearMissCode: string;
  hazardCategory: HazardCategory;
  description: string;
  potentialSeverityIfUnchecked: SafetyRiskLevel;
  correctiveSafeguardApplied: string;
  reportedBy: string;
  reportedAt: string;
}

export interface SafetyPerformanceIndicator {
  id: string;
  tenantId: string;
  campusScope: string;
  period: string; // e.g. "2026-Q3"
  totalRecordableIncidentRate?: number;
  lostTimeInjuryFrequencyRate?: number;
  nearMissReportingCount: number;
  inspectionCompletionRatePercent: number;
  openHighFindingsCount: number;
  isTelemetryAvailable: boolean;
  calculatedAt: string;
}

// 8. Training & Competency Governance
export interface SafetyTrainingGovernance {
  id: string;
  tenantId: string;
  campusScope: string;
  courseCode: string;
  courseTitle: string;
  hazardCategory: HazardCategory;
  validityPeriodMonths: number;
  isMandatoryForLabAccess: boolean;
  isMandatoryForContractors: boolean;
  status: 'ACTIVE' | 'SUPERSEDED';
}

export interface CompetencyRequirement {
  id: string;
  tenantId: string;
  campusScope: string;
  roleOrProfileRef: string;
  requiredCourseCodes: string[];
  refresherIntervalMonths: number;
}

export interface TrainingComplianceObservation {
  id: string;
  tenantId: string;
  campusScope: string;
  departmentIdRef: string;
  totalPersonnelAssignedCount: number;
  compliantPersonnelCount: number;
  compliancePercentage: number;
  expiredCertificationsCount: number;
  isTelemetryAvailable: boolean; // false -> display INSUFFICIENT DATA
  observedAt: string;
}

export interface PPEGovernance {
  id: string;
  tenantId: string;
  campusScope: string;
  hazardCategory: HazardCategory;
  requiredPpeStandards: string[]; // e.g., ["ANSI-Z87.1", "NFPA-70E", "EN-374"]
  mandatoryDesignatedAreas: string[];
  inspectionCycleDays: number;
  status: 'ENFORCED' | 'UNDER_REVIEW';
}

// 9. Emergency Preparedness & Exercises
export type EmergencyScenarioType =
  | 'FIRE'
  | 'EARTHQUAKE'
  | 'FLOOD'
  | 'SEVERE_WEATHER'
  | 'CHEMICAL_RELEASE'
  | 'BIOLOGICAL_RELEASE'
  | 'RADIATION_EVENT'
  | 'MASS_CASUALTY'
  | 'ACTIVE_THREAT'
  | 'POWER_FAILURE'
  | 'WATER_FAILURE'
  | 'HVAC_FAILURE'
  | 'HAZMAT_EVENT'
  | 'CAMPUS_EVACUATION'
  | 'SHELTER_IN_PLACE'
  | 'OTHER';

export interface EmergencyPreparednessGovernance {
  id: string;
  tenantId: string;
  campusScope: string;
  facilityIdRef: string;
  emergencyPlanRefId: string;
  designatedIncidentCommanderIdRef: string;
  alternateCommanderIdRef: string;
  primaryAssemblyAreaRef: string;
  secondaryAssemblyAreaRef: string;
  lastExerciseDateRef?: string;
  nextScheduledExerciseDate: string;
  readinessRating: 'READY' | 'CONDITIONAL' | 'DEFICIENT';
  status: 'ACTIVE' | 'UNDER_REVISION';
}

export interface EmergencyPlanReference {
  id: string;
  tenantId: string;
  campusScope: string;
  planCode: string;
  planTitle: string;
  scenarioType: EmergencyScenarioType;
  targetFacilityRefs: string[];
  proposerId: string;
  approverId: string;
  approvalDate: string;
  mandatoryAnnualReviewDueDate: string;
  status: 'APPROVED' | 'DRAFT' | 'REVIEW';
}

export interface EmergencyScenario {
  id: string;
  tenantId: string;
  campusScope: string;
  scenarioCode: string;
  scenarioType: EmergencyScenarioType;
  title: string;
  description: string;
  assumedCasualtyTier: 'NONE' | 'LOW' | 'MODERATE' | 'MASS';
  requiredResponseUnits: string[];
}

export type ExerciseLifecycleState =
  | 'PLANNED'
  | 'SCHEDULED'
  | 'EXECUTED'
  | 'EVALUATED'
  | 'CORRECTIVE_ACTION'
  | 'CLOSED';

export interface EmergencyExercise {
  id: string;
  tenantId: string;
  campusScope: string;
  exerciseCode: string;
  exerciseTitle: string;
  scenarioType: EmergencyScenarioType;
  lifecycleState: ExerciseLifecycleState;
  participatingUnits: string[];
  scheduledDate: string;
  completedDate?: string;
  evacuationTimeMinutesObserved?: number;
  targetEvacuationTimeMinutes: number;
  objectivesMetCount: number;
  totalObjectivesCount: number;
  leadEvaluatorIdRef: string;
  proposerId: string;
  approverId?: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'EVALUATED';
}

export interface EmergencyExerciseFinding {
  id: string;
  tenantId: string;
  campusScope: string;
  exerciseIdRef: string;
  findingDescription: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  recommendedImprovement: string;
  assignedActionOwnerIdRef?: string;
  status: 'OPEN' | 'ADDRESSED';
}

export interface BusinessContinuitySafetyDependency {
  id: string;
  tenantId: string;
  campusScope: string;
  sourceFacilityIdRef: string;
  alternateFacilityIdRef: string;
  criticalFunction: string;
  maximumTolerableSafetyDowntimeHours: number;
  status: 'VALIDATED' | 'GAP_IDENTIFIED';
}

export interface EvacuationGovernance {
  id: string;
  tenantId: string;
  campusScope: string;
  buildingIdRef: string;
  primaryRouteMapRef: string;
  secondaryRouteMapRef: string;
  adaEvacuationRefugeAreaRef: string;
  evacuationWardenIdRefs: string[];
  lastClearanceDrillDateRef?: string;
  status: 'VERIFIED' | 'NEEDS_UPDATE';
}

export interface ShelterGovernance {
  id: string;
  tenantId: string;
  campusScope: string;
  buildingIdRef: string;
  shelterCategory: 'TORNADO_SEVERE_WEATHER' | 'HAZMAT_SEAL' | 'ACTIVE_SECURITY_LOCKDOWN';
  designatedSpaceIdRef: string;
  capacityMax: number;
  emergencySuppliesVerifiedDateRef?: string;
  status: 'READY' | 'RESTRICTED';
}

// 10. Fire, Laboratory & Specialized Safety
export interface FireLifeSafetyGovernance {
  id: string;
  tenantId: string;
  campusScope: string;
  buildingIdRef: string;
  sprinklerSystemCertifiedDateRef?: string;
  fireAlarmInspectionDateRef?: string;
  fireExtinguisherInspectionDateRef?: string;
  emergencyLightingBatteryTestedDateRef?: string;
  fireDoorsIntegrityVerifiedDateRef?: string;
  isFireSuppressionActive: boolean;
  hasBlockedExitFindings: boolean;
  complianceRating: SafetyComplianceRating;
  status: 'COMPLIANT' | 'WARNING' | 'BREACH';
}

export interface LaboratorySafetyGovernance {
  id: string;
  tenantId: string;
  campusScope: string;
  spaceIdRef: string;
  buildingIdRef: string;
  labName: string;
  biosafetyLevel?: 'BSL_1' | 'BSL_2' | 'BSL_3' | 'BSL_4';
  chemicalHygienePlanRef: string;
  fumeHoodCertificationDateRef?: string;
  eyewashShowerTestedWeekly: boolean;
  principalInvestigatorIdRef: string;
  labSafetyOfficerIdRef: string;
  hasHazardousInventory: boolean;
  complianceRating: SafetyComplianceRating;
  status: 'OPERATIONAL' | 'RESTRICTED' | 'SUSPENDED';
}

export interface BiologicalSafetyGovernance {
  id: string;
  tenantId: string;
  campusScope: string;
  labRefId: string;
  institutionalBiosafetyCommitteeApprovalRef: string;
  biohazardAgentCategory: string;
  autoclaveValidationDateRef?: string;
  medicalSurveillanceRequired: boolean;
  status: 'AUTHORIZED' | 'PENDING_REAUTHORIZATION';
}

export interface ChemicalSafetyGovernance {
  id: string;
  tenantId: string;
  campusScope: string;
  labRefId: string;
  chemicalInventoryReferenceId: string; // Authoritative reference to ChemTracker
  flammableStorageLimitsCompliant: boolean;
  hazardousWasteStorageDays: number; // Must not exceed 90 days
  secondaryContainmentAdequacyVerified: boolean;
  status: 'COMPLIANT' | 'ACTION_REQUIRED';
}

export interface RadiationSafetyGovernance {
  id: string;
  tenantId: string;
  campusScope: string;
  spaceIdRef: string;
  radiationSafetyCommitteePermitRef: string;
  authorizedRadiationOfficerIdRef: string;
  dosimetryBadgeMonitoringActive: boolean;
  quarterlyWipeTestDateRef?: string;
  status: 'AUTHORIZED' | 'SUSPENDED';
}

// 11. Environmental Health & Sensitive Occupational Health
export interface EnvironmentalHealthGovernance {
  id: string;
  tenantId: string;
  campusScope: string;
  facilityIdRef: string;
  airQualityStatus: 'NORMAL' | 'ELEVATED_CO2' | 'PARTICULATE_ALERT' | 'INSUFFICIENT_DATA';
  waterQualityTestedDateRef?: string;
  hazardousWasteManifestRef?: string;
  noiseExposureClassification: 'SAFE' | 'HEARING_PROTECTION_REQUIRED' | 'HAZARDOUS';
  indoorEnvironmentalQualityScore?: number; // 0-100
  isTelemetryAvailable: boolean; // false -> display INSUFFICIENT DATA
  status: 'COMPLIANT' | 'OBSERVATION_REQUIRED';
}

export interface EnvironmentalObservation {
  id: string;
  tenantId: string;
  campusScope: string;
  parameterName: 'PM2_5' | 'CO2' | 'VOC' | 'RADON' | 'LEAD_WATER' | 'LEGIONELLA';
  measuredValue?: number;
  unitOfMeasure: string;
  regulatoryThresholdMax: number;
  isThresholdExceeded: boolean;
  isTelemetryAvailable: boolean;
  recordedAt: string;
}

export interface ExposureObservationReference {
  id: string;
  tenantId: string;
  campusScope: string;
  hazardRegisterIdRef: string;
  occupationalHealthRecordIdRef: string; // Reference only! Zero clinical PII/diagnosis stored
  monitoringType: 'PERSONAL_DOSIMETRY' | 'BIO_MONITORING_CLEARANCE' | 'NOISE_DOSIMETRY';
  clearanceStatus: 'CLEARED' | 'CONDITIONAL_ACCOMMODATION' | 'RESTRICTED';
  assessedDate: string;
}

export interface OccupationalHealthGovernanceReference {
  id: string;
  tenantId: string;
  campusScope: string;
  employeeIdRef: string; // Reference to HR
  occupationalHealthRecordIdRef: string; // Reference to external Occupational Health System
  fitnessForDutyStatus: 'FIT' | 'FIT_WITH_RESTRICTIONS' | 'UNFIT' | 'INSUFFICIENT_DATA';
  requiredSurveillanceProgram: string;
  nextSurveillanceDueDate: string;
  lastClearanceDateRef?: string;
  status: 'CLEARED' | 'OVERDUE' | 'RESTRICTED';
}

export interface WorkplaceWellbeingGovernance {
  id: string;
  tenantId: string;
  campusScope: string;
  departmentIdRef: string;
  ergonomicAssessmentsCompletedCount: number;
  openErgonomicRequestsCount: number;
  indoorLightingAcousticRating: 'OPTIMAL' | 'ACCEPTABLE' | 'NEEDS_IMPROVEMENT';
  status: 'ACTIVE';
}

// 12. Contractor & Visitor Safety
export interface ContractorSafetyGovernance {
  id: string;
  tenantId: string;
  campusScope: string;
  contractorVendorIdRef: string; // Reference to Phase 7.61/7.62
  vendorName: string;
  siteSafetyInductionCertified: boolean;
  insuranceLiabilityCertificateRef: string;
  highRiskWorkPermitRef?: string; // e.g., Confined Space, Hot Work, Roof Access
  safetyViolationCount: number;
  clearanceStatus: 'AUTHORIZED' | 'PROBATION' | 'BARRED';
}

export interface VisitorSafetyGovernance {
  id: string;
  tenantId: string;
  campusScope: string;
  facilityIdRef: string;
  visitorProtocolTier: 'STANDARD' | 'LAB_ESCORT_ONLY' | 'HIGH_HAZARD_RESTRICTED';
  safetyBriefingAcknowledgmentRequired: boolean;
  status: 'ACTIVE';
}

export interface SafetyCommitteeGovernance {
  id: string;
  tenantId: string;
  campusScope: string;
  committeeName: string; // e.g. "Institutional EHS Executive Committee", "IBC", "RSC"
  chairpersonIdRef: string;
  meetingFrequency: 'MONTHLY' | 'QUARTERLY';
  lastMeetingDateRef?: string;
  openSafetyActionItemsCount: number;
  status: 'ACTIVE';
}

// 13. Governance Risks, Controls, Decisions & Audit Trail
export interface SafetyDecision {
  id: string;
  tenantId: string;
  campusScope: string;
  decisionType: 'HAZARD_ACCEPTANCE' | 'FACILITY_SAFETY_SUSPENSION' | 'EMERGENCY_PLAN_APPROVAL' | 'SAFETY_POLICY_CHANGE';
  title: string;
  description: string;
  targetRefId: string;
  proposerId: string;
  approverId: string;
  status: 'PROPOSED' | 'APPROVED' | 'REJECTED';
  decisionDate: string;
  approvedAt?: string;
  createdAt: string;
}

export interface SafetyRisk {
  id: string;
  tenantId: string;
  campusScope: string;
  riskTitle: string;
  hazardCategory: HazardCategory;
  likelihood: number; // 1-5
  impact: number; // 1-5
  totalRiskScore: number; // Likelihood * Impact
  riskTier: SafetyRiskLevel;
  mitigationStrategy: string;
  ownerId: string;
  status: 'OPEN' | 'MITIGATING' | 'ACCEPTED_WITH_COMPENSATION' | 'CLOSED';
  createdAt: string;
}

export interface SafetyControl {
  id: string;
  tenantId: string;
  campusScope: string;
  controlCode: string;
  title: string;
  controlType: ControlHierarchyType;
  description: string;
  controlOwnerId: string;
  status: 'EFFECTIVE' | 'DEFICIENT' | 'REMEDIATION_REQUIRED';
  createdAt: string;
}

export interface SafetyControlTest {
  id: string;
  tenantId: string;
  campusScope: string;
  controlId: string;
  testDate: string;
  testerId: string;
  testResult: 'PASS' | 'FAIL';
  evidenceRef: string;
  recordedAt: string;
}

export interface SafetyAuditEvent {
  id: string;
  tenantId: string;
  campusScope: string;
  actorId: string;
  action: string;
  entityType: string;
  entityId: string;
  timestamp: string;
  resultingState: Record<string, any>;
  justification?: string;
  evidenceRef?: string;
  ipAddressOrOrigin?: string;
}

// 14. Simulation Scenario, Resilience & Diagnostics
export type SafetySimulationScenarioType =
  | 'MAJOR_FIRE'
  | 'CHEMICAL_RELEASE'
  | 'BIOLOGICAL_RELEASE'
  | 'RADIATION_EVENT'
  | 'FLOOD'
  | 'EARTHQUAKE'
  | 'MASS_CASUALTY'
  | 'POWER_FAILURE'
  | 'EVACUATION_FAILURE'
  | 'SHELTER_IN_PLACE_FAILURE'
  | 'CRITICAL_CONTROL_FAILURE'
  | 'EMERGENCY_COMMUNICATION_FAILURE';

export interface SafetySimulationScenario {
  id: string;
  tenantId: string;
  campusScope: string;
  scenarioType: SafetySimulationScenarioType;
  scenarioName: string;
  inputParameters: Record<string, any>;
  affectedFacilitiesEstimatedCount: number;
  affectedPopulationEstimatedCount: number;
  estimatedEvacuationTimeMinutes: number;
  criticalHazardsTriggered: string[];
  simulatedDirectSafetyCostRef: number;
  safetyResilienceScoreCalculated: number; // 0-100
  mitigationRecommendations: string[];
  isSandboxMode: true;
  bannerNotice: 'SIMULATION ONLY • SANDBOX MODE ACTIVE • ZERO PRODUCTION MUTATION';
  executedBy: string;
  executedAt: string;
}

export interface SafetyResilienceAssessment {
  id: string;
  tenantId: string;
  campusScope: string;
  facilityIdRef: string;
  overallRating: 'STRONG' | 'ADEQUATE' | 'VULNERABLE' | 'SEVERELY_EXPOSED';
  emergencyResponseCapabilityScore: number; // 0-100
  criticalHazardExposureScore: number; // 0-100
  controlRedundancyScore: number; // 0-100
  emergencyResourceAvailabilityScore: number; // 0-100
  evacuationReadinessScore: number; // 0-100
  criticalPersonDependencyScore: number; // 0-100
  facilityDependencyScore: number; // 0-100
  communicationReadinessScore: number; // 0-100
  recoveryCapabilityScore: number; // 0-100
  assessedBy: string;
  approvedBy: string;
  assessedAt: string;
}

export interface SafetyDiagnosticFinding {
  id: string;
  tenantId: string;
  campusScope: string;
  findingCode: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
  category:
    | 'ORPHAN_HAZARD'
    | 'MISSING_ASSESSMENT'
    | 'UNCONTROLLED_HAZARD'
    | 'EXPIRED_EXCEPTION'
    | 'OVERDUE_INSPECTION'
    | 'OVERDUE_CAPA'
    | 'MISSING_EMERGENCY_PLAN'
    | 'TELEMETRY_GAP'
    | 'SOD_VIOLATION'
    | 'CONTRACTOR_GAP'
    | 'CIRCULAR_DEPENDENCY'
    | 'LIFE_SAFETY_DEFICIT';
  entityType: string;
  entityId: string;
  title: string;
  description: string;
  recommendedRemediation: string;
  detectedAt: string;
}
