/**
 * EMS Phase 7.63 — Institutional Asset, Facilities, Infrastructure, Space, Utilities & Physical Resilience Governance Engine
 * Reference-Only Control Plane Types
 */

// 1. Asset Governance Reference & Category
export interface AssetGovernanceReference {
  id: string;
  tenantId: string;
  campusScope: string;
  assetIdRef: string; // Authoritative reference to ERP / CMMS asset ID
  title: string;
  categoryCode: string;
  subCategory?: string;
  facilityIdRef?: string;
  buildingIdRef?: string;
  siteIdRef?: string;
  spaceIdRef?: string;
  ownerDepartmentIdRef: string;
  custodianIdRef: string;
  criticalityTier: AssetCriticalityLevel;
  conditionRating: AssetConditionState;
  lifecycleState: AssetLifecycleState;
  procurementReferenceId?: string;
  contractReferenceId?: string;
  budgetCodeRef?: string;
  costCenterIdRef?: string;
  installationDate?: string;
  expectedUsefulLifeYears?: number;
  residualLifeYearsEstimated?: number;
  status: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
  createdAt: string;
  createdBy: string;
  updatedAt?: string;
}

export interface AssetCategoryGovernance {
  id: string;
  tenantId: string;
  campusScope: string;
  categoryCode: string;
  categoryName: string;
  description: string;
  defaultCriticality: AssetCriticalityLevel;
  mandatoryMaintenancePolicyRef?: string;
  standardInspectionFrequencyMonths: number;
  regulatoryJurisdictionRef?: string;
  depreciationClassRef?: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

// Criticality Levels
export type AssetCriticalityLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' | 'MISSION_CRITICAL';

export interface AssetCriticalityProfile {
  id: string;
  tenantId: string;
  campusScope: string;
  assetGovernanceRefId: string;
  assetIdRef: string;
  operationalImpactScore: number; // 1-100
  safetyImpactScore: number; // 1-100
  financialImpactScore: number; // 1-100
  academicResearchImpactScore: number; // 1-100
  regulatoryImpactScore: number; // 1-100
  recoveryDifficultyScore: number; // 1-100
  dependencyConcentrationScore: number; // 1-100
  calculatedCriticalityTier: AssetCriticalityLevel;
  criticalityJustification: string;
  assessedBy: string;
  assessedAt: string;
  approvedBy?: string;
  approvedAt?: string;
}

// Asset Lifecycle States
export type AssetLifecycleState =
  | 'PLANNED'
  | 'ACQUIRED'
  | 'COMMISSIONED'
  | 'ACTIVE'
  | 'UNDER_MAINTENANCE'
  | 'RESTRICTED'
  | 'DECOMMISSION_PENDING'
  | 'DECOMMISSIONED'
  | 'RETIRED';

export interface AssetLifecycleGovernance {
  id: string;
  tenantId: string;
  campusScope: string;
  assetGovernanceRefId: string;
  assetIdRef: string;
  currentState: AssetLifecycleState;
  previousState?: AssetLifecycleState;
  transitionReason: string;
  proposerId: string;
  approverId?: string;
  transitionDate: string;
  commissioningCertificateRef?: string;
  decommissionAuthorizationRef?: string;
  environmentalDisposalCertificateRef?: string;
  auditLogIdRef?: string;
  status: 'APPROVED' | 'PENDING_APPROVAL' | 'REJECTED';
}

// Condition and Health Observations
export type AssetConditionState = 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'CRITICAL' | 'INSUFFICIENT_DATA';

export interface AssetConditionObservation {
  id: string;
  tenantId: string;
  campusScope: string;
  assetGovernanceRefId: string;
  assetIdRef: string;
  observedCondition: AssetConditionState;
  observationMethod: 'PHYSICAL_INSPECTION' | 'TELEMETRY_SAMPLE' | 'THIRD_PARTY_AUDIT' | 'MAINTENANCE_REPORT';
  inspectorIdRef: string;
  inspectionDate: string;
  defectsIdentifiedCount: number;
  immediateSafetyHazard: boolean;
  notes?: string;
  evidenceReferenceId?: string;
  recordedAt: string;
}

export interface AssetHealthObservation {
  id: string;
  tenantId: string;
  campusScope: string;
  assetGovernanceRefId: string;
  assetIdRef: string;
  vibrationHealthScore?: number; // 0-100
  thermalHealthScore?: number; // 0-100
  efficiencyIndexPercent?: number; // 0-100
  operatingHoursTotal?: number;
  anomalyDetected: boolean;
  healthIndexScore: number; // 0-100
  telemetrySourceRef?: string;
  isTelemetryAvailable: boolean; // false -> display INSUFFICIENT DATA
  observedAt: string;
}

export interface AssetOwnershipReference {
  id: string;
  tenantId: string;
  campusScope: string;
  assetGovernanceRefId: string;
  assetIdRef: string;
  custodianUnitIdRef: string;
  primaryOperatorIdRef?: string;
  delegatedManagerIdRef: string;
  grantIdRef?: string;
  projectFundingRef?: string;
  custodyTransferDate?: string;
  status: 'ACTIVE' | 'TRANSFERRED';
}

// 2. Facility, Building, Site & Space Hierarchy
export type FacilityLifecycleState =
  | 'PLANNED'
  | 'CONSTRUCTION'
  | 'COMMISSIONED'
  | 'OPERATIONAL'
  | 'RESTRICTED'
  | 'RENOVATION'
  | 'DECOMMISSION_PENDING'
  | 'DECOMMISSIONED';

export interface FacilityGovernance {
  id: string;
  tenantId: string;
  campusScope: string;
  facilityIdRef: string;
  facilityName: string;
  facilityType: 'ACADEMIC' | 'LABORATORY' | 'ADMINISTRATIVE' | 'RESIDENTIAL' | 'ATHLETIC' | 'INFRASTRUCTURE' | 'HEALTHCARE';
  lifecycleState: FacilityLifecycleState;
  siteIdRef?: string;
  grossFloorAreaSqm?: number;
  occupancyCapacityMax?: number;
  criticalityTier: AssetCriticalityLevel;
  primaryManagerIdRef: string;
  isMissionCriticalResearchFacility: boolean;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

export interface SiteGovernance {
  id: string;
  tenantId: string;
  campusScope: string;
  siteIdRef: string;
  siteName: string;
  geographicCoordinatesRef?: string;
  campusIdRef: string;
  totalAcreage?: number;
  zoningClassification?: string;
  floodPlainZoneRisk: 'NONE' | 'LOW' | 'MODERATE' | 'HIGH';
  seismicZoneRisk: 'LOW' | 'MODERATE' | 'HIGH';
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

export interface BuildingGovernance {
  id: string;
  tenantId: string;
  campusScope: string;
  buildingIdRef: string;
  buildingName: string;
  siteIdRef: string;
  facilityIdRef: string;
  numberOfFloors: number;
  constructionYear?: number;
  fireSafetyCertificationRef?: string;
  structuralIntegrityRating: AssetConditionState;
  adaAccessibilityCompliancePercent: number;
  primaryEvacuationZoneRef?: string;
  status: 'OPERATIONAL' | 'RESTRICTED' | 'MAINTENANCE';
  createdAt: string;
}

export interface SpaceGovernance {
  id: string;
  tenantId: string;
  campusScope: string;
  spaceIdRef: string;
  spaceName: string;
  spaceCategory: 'CLASSROOM' | 'RESEARCH_LAB' | 'FACULTY_OFFICE' | 'DATA_CENTER' | 'COMMON_AREA' | 'STORAGE' | 'HAZMAT';
  buildingIdRef: string;
  floorNumber: number;
  roomNumber: string;
  areaSqm: number;
  maxDesignCapacity: number;
  isRestrictedAccess: boolean;
  isCriticalSpace: boolean;
  departmentAssignmentIdRef: string;
  accessibilityFeaturesJson?: string;
  status: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'RESTRICTED';
  createdAt: string;
}

export interface SpaceAllocation {
  id: string;
  tenantId: string;
  campusScope: string;
  spaceIdRef: string;
  assignedDepartmentIdRef: string;
  principalInvestigatorIdRef?: string;
  allocatedCapacityCount: number;
  allocationStartDate: string;
  allocationEndDate?: string;
  grantOrProjectFundingRef?: string;
  proposerId: string;
  approverId: string;
  status: 'ACTIVE' | 'TERMINATED';
  approvedAt: string;
}

export interface SpaceUtilizationObservation {
  id: string;
  tenantId: string;
  campusScope: string;
  spaceIdRef: string;
  observationPeriod: string; // e.g. "2026-W34"
  scheduledOccupancyHours: number;
  actualObservedOccupancyHours?: number;
  peakOccupancyHeadcount?: number;
  utilizationRatePercent?: number;
  isUnderutilized: boolean; // utilization < 30%
  isOverCapacity: boolean; // headcount > maxDesignCapacity
  telemetrySource?: string;
  isTelemetryAvailable: boolean; // false -> display INSUFFICIENT DATA
  observedAt: string;
}

// 3. Infrastructure & Utilities
export interface InfrastructureGovernance {
  id: string;
  tenantId: string;
  campusScope: string;
  infrastructureIdRef: string;
  name: string;
  infrastructureType: 'POWER_GRID' | 'CHILLED_WATER' | 'STEAM' | 'FIBER_BACKBONE' | 'SEWAGE' | 'POTABLE_WATER' | 'GAS_DISTRIBUTION';
  redundancyArchitecture: 'N' | 'N+1' | '2N' | '2N+1' | 'NONE';
  criticalityTier: AssetCriticalityLevel;
  primarySubstationOrPlantRef: string;
  dependentFacilitiesRefs: string[];
  singlePointOfFailureIdentified: boolean;
  status: 'OPERATIONAL' | 'DEGRADED' | 'OUTAGE';
  createdAt: string;
}

export interface UtilityGovernance {
  id: string;
  tenantId: string;
  campusScope: string;
  utilityType: 'ELECTRICITY' | 'WATER' | 'NATURAL_GAS' | 'CHILLED_WATER' | 'DIESEL_FUEL' | 'RENEWABLE_SOLAR';
  providerName: string;
  primaryContractIdRef?: string;
  accountNumberRef?: string;
  tariffStructureRef?: string;
  emergencyResilienceTier: 'HIGH' | 'MODERATE' | 'LOW';
  backupGenerationCapacityKw?: number;
  fuelReserveDaysCalculated?: number;
  status: 'ACTIVE' | 'CONSTRAINED';
}

export interface UtilityConsumptionObservation {
  id: string;
  tenantId: string;
  campusScope: string;
  utilityType: 'ELECTRICITY' | 'WATER' | 'NATURAL_GAS' | 'CHILLED_WATER' | 'DIESEL_FUEL' | 'RENEWABLE_SOLAR';
  facilityIdRef?: string;
  buildingIdRef?: string;
  billingPeriod: string; // "2026-07"
  meterIdRef: string;
  consumedQuantity?: number;
  unitOfMeasure: 'KWH' | 'GALLONS' | 'CUBIC_METERS' | 'THERMS' | 'LITERS';
  financialCostEstimatedRef?: number;
  carbonEmissionsKgCO2eEstimated?: number;
  isTelemetryAvailable: boolean;
  recordedAt: string;
}

export interface EnergyEfficiencyObservation {
  id: string;
  tenantId: string;
  campusScope: string;
  buildingIdRef: string;
  energyUseIntensityKwhPerSqm?: number;
  benchmarkStandardEuiTarget?: number;
  efficiencyRating: 'LEED_GOLD_EQUIVALENT' | 'STANDARD' | 'BELOW_TARGET' | 'CRITICAL_INEFFICIENT' | 'INSUFFICIENT_DATA';
  savingsTargetPercent: number;
  recordedAt: string;
}

export interface WaterGovernance {
  id: string;
  tenantId: string;
  campusScope: string;
  facilityIdRef: string;
  potableWaterSupplyStatus: 'NORMAL' | 'BOIL_WATER_ADVISORY' | 'INTERRUPTED';
  greywaterRecyclingInstalled: boolean;
  dailyStorageCapacityGallons?: number;
  emergencySupplyReserveDays: number;
  lastBackflowTestingDateRef?: string;
  status: 'COMPLIANT' | 'WARNING';
}

export interface WasteGovernance {
  id: string;
  tenantId: string;
  campusScope: string;
  facilityIdRef: string;
  wasteStreamType: 'MUNICIPAL' | 'HAZARDOUS_CHEMICAL' | 'BIOHAZARDOUS' | 'ELECTRONIC_EWaste' | 'RECYCLABLE';
  certifiedContractorIdRef: string;
  compliancePermitNumberRef: string;
  lastHazardousRemovalManifestRef?: string;
  spillContainmentAdequacyVerified: boolean;
  status: 'COMPLIANT' | 'ACTION_REQUIRED';
}

// 4. Maintenance Governance & Oversight
export interface MaintenanceGovernance {
  id: string;
  tenantId: string;
  campusScope: string;
  title: string;
  policyClassification: 'PREVENTIVE' | 'CORRECTIVE' | 'PREDICTIVE' | 'STATUTORY_INSPECTION' | 'CONDITION_BASED';
  targetAssetCategory: string;
  mandatoryFrequencyMonths: number;
  governingStandardRef: string;
  minimumVendorCertificationRequired: string;
  proposerId: string;
  approverId: string;
  status: 'ACTIVE' | 'DRAFT' | 'SUPERSEDED';
  createdAt: string;
}

export interface MaintenanceRiskObservation {
  id: string;
  tenantId: string;
  campusScope: string;
  assetGovernanceRefId: string;
  assetIdRef: string;
  deferredMaintenanceBacklogHours: number;
  estimatedDeferredCostRef?: number;
  overdueInspectionDays: number;
  recurringFailureCountLast12Months: number;
  maintenanceRiskScore: number; // 1-100
  riskClassification: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  assessedAt: string;
}

export interface PreventiveMaintenanceGovernance {
  id: string;
  tenantId: string;
  campusScope: string;
  assetGovernanceRefId: string;
  assetIdRef: string;
  scheduleCycle: 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'SEMI_ANNUAL' | 'ANNUAL';
  lastCompletedDateRef?: string;
  nextScheduledDueDate: string;
  isOverdue: boolean;
  slaConformancePercent: number;
  assignedVendorOrTeamIdRef: string;
  status: 'COMPLIANT' | 'OVERDUE' | 'PENDING';
}

export interface CorrectiveMaintenanceGovernance {
  id: string;
  tenantId: string;
  campusScope: string;
  assetGovernanceRefId: string;
  assetIdRef: string;
  workOrderIdRef: string;
  issueSeverity: 'CRITICAL_OUTAGE' | 'DEGRADED_OPERATION' | 'MINOR_DEFECT';
  rootCauseCategory?: string;
  downtimeHoursTotal?: number;
  resolutionVerifiedBy?: string;
  postMaintenanceConditionObservation?: AssetConditionState;
  status: 'OPEN' | 'IN_REPAIR' | 'RESOLVED_VERIFIED';
  openedAt: string;
  resolvedAt?: string;
}

export interface WorkOrderReference {
  id: string;
  tenantId: string;
  campusScope: string;
  workOrderIdRef: string;
  assetIdRef: string;
  facilityIdRef?: string;
  vendorIdRef?: string;
  technicianIdRef?: string;
  category: 'HVAC' | 'ELECTRICAL' | 'PLUMBING' | 'STRUCTURAL' | 'ELEVATOR' | 'SECURITY';
  priority: 'EMERGENCY' | 'HIGH' | 'NORMAL' | 'LOW';
  sourceSystemRef: 'CMMS_SYSTEM' | 'BMS_ALARM' | 'MANUAL_TICKET';
  status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  loggedDate: string;
  completionDate?: string;
}

export interface ServiceLevelGovernance {
  id: string;
  tenantId: string;
  campusScope: string;
  vendorIdRef: string;
  contractIdRef: string;
  serviceCategory: string;
  emergencyResponseTimeHoursTarget: number;
  standardResponseTimeHoursTarget: number;
  firstTimeFixRatePercentTarget: number;
  observedSlaCompliancePercent?: number;
  penaltyClauseRef?: string;
  status: 'COMPLIANT' | 'BREACHED' | 'MONITORED';
}

export interface FacilitiesVendorReference {
  id: string;
  tenantId: string;
  campusScope: string;
  vendorIdRef: string;
  vendorName: string;
  serviceCategory: string;
  contractReferenceId: string;
  insuranceLiabilityCertificateRef: string;
  safetyRatingScore: number;
  status: 'QUALIFIED' | 'PROBATION' | 'RESTRICTED';
}

// 5. Capital Renewal & Lifecycle Replacement
export interface CapitalRenewalGovernance {
  id: string;
  tenantId: string;
  campusScope: string;
  planTitle: string;
  fiscalHorizon: string; // e.g., "FY2026-FY2030"
  totalEstimatedCapitalBudgetRef?: number;
  prioritizedAssetCategoriesJson: string;
  deferredMaintenanceBacklogEstimatedRef?: number;
  facilityConditionIndexAverageCalculated: number; // FCI = Deferred Maint / Replacement Value
  ownerId: string;
  proposerId: string;
  approverId: string;
  status: 'APPROVED' | 'DRAFT' | 'REVIEW';
  createdAt: string;
}

export interface AssetReplacementPlan {
  id: string;
  tenantId: string;
  campusScope: string;
  assetGovernanceRefId: string;
  assetIdRef: string;
  targetReplacementFiscalYear: string;
  estimatedReplacementCostRef: number;
  budgetCodeRef?: string;
  projectIdRef?: string;
  replacementUrgency: 'IMMEDIATE' | 'HIGH' | 'PLANNED_HORIZON' | 'DEFERRED';
  justification: string;
  proposerId: string;
  approverId?: string;
  status: 'APPROVED' | 'PROPOSED' | 'DEFERRED';
  createdAt: string;
}

export interface LifecycleCostObservation {
  id: string;
  tenantId: string;
  campusScope: string;
  assetGovernanceRefId: string;
  assetIdRef: string;
  originalAcquisitionCostRef?: number;
  cumulativeMaintenanceCostRef?: number;
  cumulativeEnergyCostRef?: number;
  totalCostOfOwnershipCalculated: number;
  currentEstimatedReplacementValueRef?: number;
  economicThresholdExceeded: boolean; // maintenance > 60% of replacement value
  observedAt: string;
}

// 6. Physical Security, Environmental Risk & Physical Resilience
export interface PhysicalSecurityGovernance {
  id: string;
  tenantId: string;
  campusScope: string;
  facilityIdRef: string;
  accessControlTier: 'OPEN' | 'BADGE_REQUIRED' | 'BIOMETRIC_OR_DUAL_KEY' | 'ESCORT_ONLY';
  cctvSurveillanceAdequacyVerified: boolean;
  perimeterIntrusionDetectionInstalled: boolean;
  securityGuardCoverageHoursPerWeek: number;
  lastSecurityAuditDateRef?: string;
  vulnerabilitiesCountIdentified: number;
  status: 'COMPLIANT' | 'REMEDIATION_REQUIRED';
}

export interface EnvironmentalRiskObservation {
  id: string;
  tenantId: string;
  campusScope: string;
  facilityIdRef: string;
  buildingIdRef?: string;
  riskType: 'HAZMAT_EXPOSURE' | 'ASBESTOS' | 'RADON' | 'AIR_QUALITY' | 'MOLD' | 'NOISE_POLLUTION';
  severityTier: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  mitigationPlanRef?: string;
  regulatoryReportingRequired: boolean;
  lastEnvironmentalSampleDateRef?: string;
  status: 'MITIGATED' | 'UNDER_OBSERVATION' | 'UNRESOLVED';
  observedAt: string;
}

export interface FacilityResilienceAssessment {
  id: string;
  tenantId: string;
  campusScope: string;
  facilityIdRef: string;
  assessedResilienceRating: 'ROBUST' | 'ADEQUATE' | 'FRAGILE' | 'CRITICAL_RISK';
  powerRedundancyScore: number; // 0-100
  waterRedundancyScore: number; // 0-100
  hvacRedundancyScore: number; // 0-100
  fireSuppressionScore: number; // 0-100
  floodMitigationScore: number; // 0-100
  telecomRedundancyScore: number; // 0-100
  physicalAccessRedundancyScore: number; // 0-100
  estimatedRecoveryTimeHours: number;
  alternateFacilityDesignationRef?: string;
  assessorId: string;
  approverId: string;
  assessedAt: string;
  approvedAt?: string;
}

export interface BusinessContinuityFacilityMapping {
  id: string;
  tenantId: string;
  campusScope: string;
  facilityIdRef: string;
  criticalAcademicOrResearchFunctionTitle: string;
  maximumTolerableDowntimeHours: number;
  designatedBackupFacilityIdRef?: string;
  mobileEquipmentEmergencyPlanRef?: string;
  lastContinuitySimulationDateRef?: string;
  status: 'VALIDATED' | 'GAP_IDENTIFIED';
}

export interface EmergencyFacilityDependency {
  id: string;
  tenantId: string;
  campusScope: string;
  sourceFacilityIdRef: string;
  dependentFacilityIdRef: string;
  dependencyType: 'BACKUP_POWER' | 'CHILLED_WATER' | 'NETWORK_INTERCONNECT' | 'STEAM' | 'SECURITY_DISPATCH';
  isMissionCritical: boolean;
  contingencyProcedureRef?: string;
  status: 'ACTIVE';
}

export interface FacilityIncident {
  id: string;
  tenantId: string;
  campusScope: string;
  incidentIdRef: string;
  facilityIdRef: string;
  buildingIdRef?: string;
  incidentType: 'POWER_OUTAGE' | 'PIPE_BURST' | 'HVAC_BREAKDOWN' | 'FIRE_ALARM' | 'HAZMAT_SPILL' | 'STRUCTURAL_LEAK';
  severity: 'MINOR' | 'MODERATE' | 'MAJOR' | 'CATASTROPHIC';
  affectedSpacesCount: number;
  estimatedDamageCostRef?: number;
  reportedBy: string;
  reportedAt: string;
  resolvedAt?: string;
  status: 'REPORTED' | 'CONTAINED' | 'RESOLVED';
}

// 7. Governance Risks, Controls, Exceptions & Decisions
export interface AssetRisk {
  id: string;
  tenantId: string;
  campusScope: string;
  riskTitle: string;
  riskCategory: 'STRUCTURAL' | 'REGULATORY_SAFETY' | 'SINGLE_POINT_FAILURE' | 'OBSOLESCENCE' | 'FINANCIAL_EXPOSURE';
  assetGovernanceRefId?: string;
  facilityIdRef?: string;
  likelihoodScore: number; // 1-5
  impactScore: number; // 1-5
  totalRiskScore: number; // Likelihood * Impact (1-25)
  riskTier: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  mitigationStrategy: string;
  ownerId: string;
  status: 'OPEN' | 'MITIGATING' | 'ACCEPTED_WITH_COMPENSATION' | 'CLOSED';
  createdAt: string;
}

export interface AssetControl {
  id: string;
  tenantId: string;
  campusScope: string;
  controlCode: string;
  title: string;
  controlType: 'PREVENTIVE' | 'DETECTIVE' | 'CORRECTIVE';
  description: string;
  controlOwnerId: string;
  testingFrequency: 'MONTHLY' | 'QUARTERLY' | 'SEMI_ANNUALLY' | 'ANNUALLY';
  status: 'EFFECTIVE' | 'DEFICIENT' | 'REMEDIATION_REQUIRED';
  createdAt: string;
}

export interface AssetControlTest {
  id: string;
  tenantId: string;
  campusScope: string;
  controlId: string;
  testDate: string;
  testerId: string;
  samplesCheckedCount: number;
  deficienciesFoundCount: number;
  testResult: 'PASS' | 'FAIL';
  evidenceRef: string;
  recordedAt: string;
}

export interface AssetException {
  id: string;
  tenantId: string;
  campusScope: string;
  exceptionType: 'DEFERRED_MAINTENANCE_OVERRIDE' | 'INSPECTION_WAIVER' | 'CRITICALITY_OVERRIDE' | 'UNBACKED_FACILITY_USE';
  targetAssetIdRef?: string;
  targetFacilityIdRef?: string;
  businessRationale: string;
  riskAssessment: string;
  compensatingControl: string;
  proposerId: string;
  approverId: string;
  effectiveDate: string;
  expiryDate: string; // Mandatory non-indefinite
  status: 'ACTIVE' | 'EXPIRED' | 'REVOKED';
  createdAt: string;
}

export interface AssetDecision {
  id: string;
  tenantId: string;
  campusScope: string;
  decisionType: 'ASSET_DECOMMISSION' | 'FACILITY_RESTRICTION' | 'CAPITAL_ALLOCATION' | 'RESILIENCE_PLAN_APPROVAL';
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

// 8. Immutable Audit Trail
export interface AssetAuditEvent {
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
  ipAddressOrOrigin?: string;
}

// 9. Simulation Scenario & Diagnostics
export type AssetSimulationType =
  | 'POWER_OUTAGE'
  | 'WATER_FAILURE'
  | 'HVAC_FAILURE'
  | 'FIRE_EVENT'
  | 'FLOOD_EVENT'
  | 'CRITICAL_ASSET_FAILURE'
  | 'SUPPLIER_FAILURE'
  | 'FACILITY_ACCESS_LOSS'
  | 'UTILITY_DISRUPTION'
  | 'MAJOR_MAINTENANCE_BACKLOG'
  | 'INFRASTRUCTURE_RENEWAL_DELAY'
  | 'SPACE_CAPACITY_SHOCK';

export interface AssetSimulationScenario {
  id: string;
  tenantId: string;
  campusScope: string;
  simulationType: AssetSimulationType;
  scenarioName: string;
  inputParameters: Record<string, any>;
  affectedFacilitiesEstimatedCount: number;
  affectedAssetsEstimatedCount: number;
  estimatedRecoveryTimeHours: number;
  criticalFunctionsDisrupted: string[];
  simulatedDirectCostImpactRef: number;
  resilienceScoreCalculated: number; // 0-100
  mitigationRecommendations: string[];
  isSandboxMode: true;
  bannerNotice: 'SIMULATION ONLY • SANDBOX MODE ACTIVE • ZERO PRODUCTION MUTATION';
  executedBy: string;
  executedAt: string;
}

export interface AssetDiagnosticFinding {
  id: string;
  tenantId: string;
  campusScope: string;
  findingCode: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
  category:
    | 'ORPHAN_REFERENCE'
    | 'EXPIRED_EXCEPTION'
    | 'MISSING_CRITICALITY'
    | 'RESILIENCE_GAP'
    | 'MAINTENANCE_DEFICIT'
    | 'DEPENDENCY_CONCENTRATION'
    | 'CIRCULAR_DEPENDENCY'
    | 'TELEMETRY_GAP'
    | 'SOD_VIOLATION'
    | 'SPACE_ANOMALY';
  entityType: string;
  entityId: string;
  title: string;
  description: string;
  recommendedRemediation: string;
  detectedAt: string;
}
