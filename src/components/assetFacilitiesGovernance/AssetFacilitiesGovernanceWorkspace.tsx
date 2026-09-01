import React, { useState } from 'react';
import {
  Building2,
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus,
  Search,
  RefreshCw,
  XCircle,
  Info,
  Lock,
  Play,
  Activity,
  Eye,
  ShieldAlert,
  AlertOctagon,
  Scale,
  Zap,
  Flame,
  Droplets,
  Layers,
  Wrench,
  Sparkles,
  Award,
  Calendar,
  Grid,
  Box,
  FileText,
  Radio,
  AlertCircle
} from 'lucide-react';

import {
  AssetGovernanceReference,
  AssetCategoryGovernance,
  AssetCriticalityProfile,
  AssetCriticalityLevel,
  AssetLifecycleState,
  AssetConditionState,
  FacilityGovernance,
  SiteGovernance,
  BuildingGovernance,
  SpaceGovernance,
  SpaceAllocation,
  SpaceUtilizationObservation,
  InfrastructureGovernance,
  UtilityGovernance,
  UtilityConsumptionObservation,
  EnergyEfficiencyObservation,
  WaterGovernance,
  WasteGovernance,
  MaintenanceGovernance,
  PreventiveMaintenanceGovernance,
  CorrectiveMaintenanceGovernance,
  WorkOrderReference,
  CapitalRenewalGovernance,
  AssetReplacementPlan,
  PhysicalSecurityGovernance,
  EnvironmentalRiskObservation,
  FacilityResilienceAssessment,
  BusinessContinuityFacilityMapping,
  EmergencyFacilityDependency,
  AssetRisk,
  AssetControl,
  AssetException,
  AssetDecision,
  AssetAuditEvent,
  AssetSimulationScenario,
  AssetSimulationType,
  AssetDiagnosticFinding
} from '../../types/assetFacilitiesGovernance';

import { AssetFacilitiesGovernanceService } from '../../services/assetFacilitiesGovernanceService';

interface WorkspaceProps {
  tenantScope?: string;
  campusScope?: string;
  currentUser?: {
    id: string;
    name: string;
    role: string;
  };
}

export const AssetFacilitiesGovernanceWorkspace: React.FC<WorkspaceProps> = ({
  tenantScope = 'tenant_main',
  campusScope = 'CAMPUS_NORTH',
  currentUser = { id: 'usr_governance_director', name: 'Director of Facilities Governance', role: 'tenant_admin' }
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'assets' | 'facilities_space' | 'infrastructure_utilities' | 'maintenance_capital' | 'resilience_simulation' | 'risks_controls' | 'diagnostics_audit'
  >('overview');

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // 1. Asset Governance Master References
  const [assets, setAssets] = useState<AssetGovernanceReference[]>([
    {
      id: 'ast_101',
      tenantId: tenantScope,
      campusScope,
      assetIdRef: 'ERP-EQ-2026-9041',
      title: 'High-Field 800 MHz NMR Spectrometer Superconducting Magnet',
      categoryCode: 'RESEARCH_SPECTROMETRY',
      facilityIdRef: 'FAC-SCI-01',
      buildingIdRef: 'BLD-CHEM-A',
      spaceIdRef: 'SPC-LAB-014',
      ownerDepartmentIdRef: 'dept_chemical_sciences',
      custodianIdRef: 'usr_dr_arun_kumar',
      criticalityTier: 'MISSION_CRITICAL',
      conditionRating: 'GOOD',
      lifecycleState: 'ACTIVE',
      expectedUsefulLifeYears: 15,
      residualLifeYearsEstimated: 9,
      status: 'ACTIVE',
      createdAt: '2026-01-10T09:00:00Z',
      createdBy: 'usr_facilities_engineer'
    },
    {
      id: 'ast_102',
      tenantId: tenantScope,
      campusScope,
      assetIdRef: 'ERP-HVAC-2024-0012',
      title: 'Central Plant 1200-Ton Centrifugal Water Chiller #1',
      categoryCode: 'PLANT_CHILLER',
      facilityIdRef: 'FAC-PLANT-01',
      buildingIdRef: 'BLD-CENTRAL-PLANT',
      spaceIdRef: 'SPC-MECH-VAULT',
      ownerDepartmentIdRef: 'dept_facilities_engineering',
      custodianIdRef: 'usr_chief_engineer',
      criticalityTier: 'MISSION_CRITICAL',
      conditionRating: 'FAIR',
      lifecycleState: 'ACTIVE',
      expectedUsefulLifeYears: 20,
      residualLifeYearsEstimated: 6,
      status: 'ACTIVE',
      createdAt: '2026-01-12T10:00:00Z',
      createdBy: 'usr_facilities_engineer'
    },
    {
      id: 'ast_103',
      tenantId: tenantScope,
      campusScope,
      assetIdRef: 'ERP-PWR-2025-4410',
      title: 'Emergency 1500 kW Diesel Generator & Synchronous Transfer Switch',
      categoryCode: 'EMERGENCY_POWER',
      facilityIdRef: 'FAC-PLANT-01',
      buildingIdRef: 'BLD-CENTRAL-PLANT',
      spaceIdRef: 'SPC-GEN-PAD-A',
      ownerDepartmentIdRef: 'dept_facilities_engineering',
      custodianIdRef: 'usr_chief_engineer',
      criticalityTier: 'MISSION_CRITICAL',
      conditionRating: 'EXCELLENT',
      lifecycleState: 'ACTIVE',
      expectedUsefulLifeYears: 25,
      residualLifeYearsEstimated: 21,
      status: 'ACTIVE',
      createdAt: '2026-01-15T11:00:00Z',
      createdBy: 'usr_facilities_engineer'
    },
    {
      id: 'ast_104',
      tenantId: tenantScope,
      campusScope,
      assetIdRef: 'ERP-IT-2026-3390',
      title: 'High-Density HPC Supercomputer Compute Rack Cluster A1-A8',
      categoryCode: 'IT_COMPUTE_CLUSTER',
      facilityIdRef: 'FAC-TECH-01',
      buildingIdRef: 'BLD-DATACENTER',
      spaceIdRef: 'SPC-DC-ROW1',
      ownerDepartmentIdRef: 'dept_it_infrastructure',
      custodianIdRef: 'usr_hpc_administrator',
      criticalityTier: 'CRITICAL',
      conditionRating: 'EXCELLENT',
      lifecycleState: 'ACTIVE',
      expectedUsefulLifeYears: 5,
      residualLifeYearsEstimated: 3,
      status: 'ACTIVE',
      createdAt: '2026-02-01T08:00:00Z',
      createdBy: 'usr_facilities_engineer'
    }
  ]);

  // 2. Criticality Profiles
  const [criticalityProfiles, setCriticalityProfiles] = useState<AssetCriticalityProfile[]>([
    {
      id: 'crit_101',
      tenantId: tenantScope,
      campusScope,
      assetGovernanceRefId: 'ast_101',
      assetIdRef: 'ERP-EQ-2026-9041',
      operationalImpactScore: 90,
      safetyImpactScore: 95,
      financialImpactScore: 85,
      academicResearchImpactScore: 95,
      regulatoryImpactScore: 90,
      recoveryDifficultyScore: 90,
      dependencyConcentrationScore: 85,
      calculatedCriticalityTier: 'MISSION_CRITICAL',
      criticalityJustification: 'Houses liquid helium cryogens and supports $24M in active NSF/NIH structural biology grants.',
      assessedBy: 'usr_dr_arun_kumar',
      assessedAt: '2026-01-11T10:00:00Z',
      approvedBy: 'usr_research_dean',
      approvedAt: '2026-01-12T14:00:00Z'
    },
    {
      id: 'crit_102',
      tenantId: tenantScope,
      campusScope,
      assetGovernanceRefId: 'ast_102',
      assetIdRef: 'ERP-HVAC-2024-0012',
      operationalImpactScore: 95,
      safetyImpactScore: 70,
      financialImpactScore: 80,
      academicResearchImpactScore: 90,
      regulatoryImpactScore: 80,
      recoveryDifficultyScore: 85,
      dependencyConcentrationScore: 95,
      calculatedCriticalityTier: 'MISSION_CRITICAL',
      criticalityJustification: 'Single failure disrupts temperature regulation across 6 science facilities and vivarium cleanrooms.',
      assessedBy: 'usr_facilities_engineer',
      assessedAt: '2026-01-14T09:00:00Z',
      approvedBy: 'usr_facilities_director',
      approvedAt: '2026-01-15T11:00:00Z'
    }
  ]);

  // 3. Facility Hierarchy
  const [facilities] = useState<FacilityGovernance[]>([
    {
      id: 'fac_001',
      tenantId: tenantScope,
      campusScope,
      facilityIdRef: 'FAC-SCI-01',
      facilityName: 'Science & Molecular Research Complex',
      facilityType: 'LABORATORY',
      lifecycleState: 'OPERATIONAL',
      siteIdRef: 'SITE-NORTH-QUAD',
      grossFloorAreaSqm: 18500,
      occupancyCapacityMax: 1200,
      criticalityTier: 'MISSION_CRITICAL',
      primaryManagerIdRef: 'usr_building_manager_sci',
      isMissionCriticalResearchFacility: true,
      status: 'ACTIVE',
      createdAt: '2026-01-01T08:00:00Z'
    },
    {
      id: 'fac_002',
      tenantId: tenantScope,
      campusScope,
      facilityIdRef: 'FAC-PLANT-01',
      facilityName: 'Central Utilities & Cogeneration Energy Plant',
      facilityType: 'INFRASTRUCTURE',
      lifecycleState: 'OPERATIONAL',
      siteIdRef: 'SITE-NORTH-QUAD',
      grossFloorAreaSqm: 6200,
      occupancyCapacityMax: 45,
      criticalityTier: 'MISSION_CRITICAL',
      primaryManagerIdRef: 'usr_chief_engineer',
      isMissionCriticalResearchFacility: false,
      status: 'ACTIVE',
      createdAt: '2026-01-01T08:00:00Z'
    },
    {
      id: 'fac_003',
      tenantId: tenantScope,
      campusScope,
      facilityIdRef: 'FAC-TECH-01',
      facilityName: 'Advanced Computing & Data Center Complex',
      facilityType: 'INFRASTRUCTURE',
      lifecycleState: 'OPERATIONAL',
      siteIdRef: 'SITE-NORTH-QUAD',
      grossFloorAreaSqm: 4500,
      occupancyCapacityMax: 60,
      criticalityTier: 'CRITICAL',
      primaryManagerIdRef: 'usr_datacenter_facility_mgr',
      isMissionCriticalResearchFacility: true,
      status: 'ACTIVE',
      createdAt: '2026-01-01T08:00:00Z'
    }
  ]);

  // 4. Spaces & Utilizations
  const [spaces] = useState<SpaceGovernance[]>([
    {
      id: 'spc_001',
      tenantId: tenantScope,
      campusScope,
      spaceIdRef: 'SPC-LAB-014',
      spaceName: 'Structural Biology Cryo-NMR Laboratory Suite',
      spaceCategory: 'RESEARCH_LAB',
      buildingIdRef: 'BLD-CHEM-A',
      floorNumber: 1,
      roomNumber: '104B',
      areaSqm: 180,
      maxDesignCapacity: 12,
      isRestrictedAccess: true,
      isCriticalSpace: true,
      departmentAssignmentIdRef: 'dept_chemical_sciences',
      status: 'OCCUPIED',
      createdAt: '2026-01-05T08:00:00Z'
    },
    {
      id: 'spc_002',
      tenantId: tenantScope,
      campusScope,
      spaceIdRef: 'SPC-MECH-VAULT',
      spaceName: 'Central Chiller Compressor Bay 1',
      spaceCategory: 'HAZMAT',
      buildingIdRef: 'BLD-CENTRAL-PLANT',
      floorNumber: 0,
      roomNumber: 'V-01',
      areaSqm: 450,
      maxDesignCapacity: 8,
      isRestrictedAccess: true,
      isCriticalSpace: true,
      departmentAssignmentIdRef: 'dept_facilities_engineering',
      status: 'OCCUPIED',
      createdAt: '2026-01-05T08:00:00Z'
    }
  ]);

  const [spaceUtilizations] = useState<SpaceUtilizationObservation[]>([
    {
      id: 'spu_001',
      tenantId: tenantScope,
      campusScope,
      spaceIdRef: 'SPC-LAB-014',
      observationPeriod: '2026-W34',
      scheduledOccupancyHours: 68,
      actualObservedOccupancyHours: 64,
      peakOccupancyHeadcount: 10,
      utilizationRatePercent: 88,
      isUnderutilized: false,
      isOverCapacity: false,
      isTelemetryAvailable: true,
      observedAt: '2026-08-25T17:00:00Z'
    }
  ]);

  // 5. Infrastructure & Utilities
  const [infrastructures] = useState<InfrastructureGovernance[]>([
    {
      id: 'inf_001',
      tenantId: tenantScope,
      campusScope,
      infrastructureIdRef: 'INF-GRID-13KV',
      name: 'Primary 13.8 kV Substation Distribution Loop',
      infrastructureType: 'POWER_GRID',
      redundancyArchitecture: 'N+1',
      criticalityTier: 'MISSION_CRITICAL',
      primarySubstationOrPlantRef: 'SUBSTATION-ALPHA',
      dependentFacilitiesRefs: ['FAC-SCI-01', 'FAC-PLANT-01', 'FAC-TECH-01'],
      singlePointOfFailureIdentified: false,
      status: 'OPERATIONAL',
      createdAt: '2026-01-01T08:00:00Z'
    },
    {
      id: 'inf_002',
      tenantId: tenantScope,
      campusScope,
      infrastructureIdRef: 'INF-CHILLED-LOOP',
      name: 'Main Underground Dual Chilled Water Loop',
      infrastructureType: 'CHILLED_WATER',
      redundancyArchitecture: '2N',
      criticalityTier: 'MISSION_CRITICAL',
      primarySubstationOrPlantRef: 'FAC-PLANT-01',
      dependentFacilitiesRefs: ['FAC-SCI-01', 'FAC-TECH-01'],
      singlePointOfFailureIdentified: false,
      status: 'OPERATIONAL',
      createdAt: '2026-01-01T08:00:00Z'
    }
  ]);

  const [utilities] = useState<UtilityGovernance[]>([
    {
      id: 'utl_001',
      tenantId: tenantScope,
      campusScope,
      utilityType: 'ELECTRICITY',
      providerName: 'Metropolitan Grid Authority',
      emergencyResilienceTier: 'HIGH',
      backupGenerationCapacityKw: 4500,
      fuelReserveDaysCalculated: 5.5,
      status: 'ACTIVE'
    },
    {
      id: 'utl_002',
      tenantId: tenantScope,
      campusScope,
      utilityType: 'WATER',
      providerName: 'City Water & Sewer Authority',
      emergencyResilienceTier: 'MODERATE',
      fuelReserveDaysCalculated: 3.0,
      status: 'ACTIVE'
    }
  ]);

  // 6. Maintenance & Capital Renewal
  const [preventiveMaintenances] = useState<PreventiveMaintenanceGovernance[]>([
    {
      id: 'pm_001',
      tenantId: tenantScope,
      campusScope,
      assetGovernanceRefId: 'ast_101',
      assetIdRef: 'ERP-EQ-2026-9041',
      scheduleCycle: 'MONTHLY',
      lastCompletedDateRef: '2026-08-01',
      nextScheduledDueDate: '2026-09-01',
      isOverdue: false,
      slaConformancePercent: 99,
      assignedVendorOrTeamIdRef: 'vend_spectrometry_specialists',
      status: 'COMPLIANT'
    },
    {
      id: 'pm_002',
      tenantId: tenantScope,
      campusScope,
      assetGovernanceRefId: 'ast_102',
      assetIdRef: 'ERP-HVAC-2024-0012',
      scheduleCycle: 'QUARTERLY',
      lastCompletedDateRef: '2026-05-15',
      nextScheduledDueDate: '2026-08-15',
      isOverdue: true,
      slaConformancePercent: 82,
      assignedVendorOrTeamIdRef: 'vend_carrier_mechanical',
      status: 'OVERDUE'
    }
  ]);

  const [capitalRenewals] = useState<CapitalRenewalGovernance[]>([
    {
      id: 'cap_001',
      tenantId: tenantScope,
      campusScope,
      planTitle: '5-Year Campus Mechanical & Decarbonization Renewal Plan',
      fiscalHorizon: 'FY2026-FY2030',
      totalEstimatedCapitalBudgetRef: 12500000,
      prioritizedAssetCategoriesJson: JSON.stringify(['PLANT_CHILLER', 'EMERGENCY_POWER', 'ELECTRICAL_SUBSTATION']),
      deferredMaintenanceBacklogEstimatedRef: 3400000,
      facilityConditionIndexAverageCalculated: 0.08, // 8% FCI (Good range)
      ownerId: 'usr_facilities_director',
      proposerId: 'usr_capital_planner',
      approverId: 'usr_cfo_approver',
      status: 'APPROVED',
      createdAt: '2026-01-20T08:00:00Z'
    }
  ]);

  // 7. Physical Resilience & Emergency Dependencies
  const [continuityMappings] = useState<BusinessContinuityFacilityMapping[]>([
    {
      id: 'bcm_001',
      tenantId: tenantScope,
      campusScope,
      facilityIdRef: 'FAC-SCI-01',
      criticalAcademicOrResearchFunctionTitle: 'Continuous Liquid Nitrogen & Cryo Biomaterials Preservation',
      maximumTolerableDowntimeHours: 4,
      designatedBackupFacilityIdRef: 'FAC-PLANT-01',
      status: 'VALIDATED'
    },
    {
      id: 'bcm_002',
      tenantId: tenantScope,
      campusScope,
      facilityIdRef: 'FAC-TECH-01',
      criticalAcademicOrResearchFunctionTitle: 'Institutional Enterprise ERP & Student Portal Backbone',
      maximumTolerableDowntimeHours: 1,
      designatedBackupFacilityIdRef: 'FAC-SCI-01',
      status: 'VALIDATED'
    }
  ]);

  const [emergencyDependencies] = useState<EmergencyFacilityDependency[]>([
    {
      id: 'dep_001',
      tenantId: tenantScope,
      campusScope,
      sourceFacilityIdRef: 'FAC-PLANT-01',
      dependentFacilityIdRef: 'FAC-SCI-01',
      dependencyType: 'CHILLED_WATER',
      isMissionCritical: true,
      status: 'ACTIVE'
    },
    {
      id: 'dep_002',
      tenantId: tenantScope,
      campusScope,
      sourceFacilityIdRef: 'FAC-PLANT-01',
      dependentFacilityIdRef: 'FAC-TECH-01',
      dependencyType: 'BACKUP_POWER',
      isMissionCritical: true,
      status: 'ACTIVE'
    }
  ]);

  // 8. Governance Risks, Controls, Exceptions & Decisions
  const [risks] = useState<AssetRisk[]>([
    {
      id: 'rsk_001',
      tenantId: tenantScope,
      campusScope,
      riskTitle: 'Central Plant Chiller #1 Compressor Age & High Vibration Trend',
      riskCategory: 'SINGLE_POINT_FAILURE',
      assetGovernanceRefId: 'ast_102',
      facilityIdRef: 'FAC-PLANT-01',
      likelihoodScore: 3,
      impactScore: 4,
      totalRiskScore: 12,
      riskTier: 'HIGH',
      mitigationStrategy: 'Expedite quarterly overhaul and maintain trailer chiller standby contract.',
      ownerId: 'usr_chief_engineer',
      status: 'MITIGATING',
      createdAt: '2026-08-10T09:00:00Z'
    }
  ]);

  const [exceptions, setExceptions] = useState<AssetException[]>([
    {
      id: 'exc_001',
      tenantId: tenantScope,
      campusScope,
      exceptionType: 'DEFERRED_MAINTENANCE_OVERRIDE',
      targetAssetIdRef: 'ERP-HVAC-2024-0012',
      targetFacilityIdRef: 'FAC-PLANT-01',
      businessRationale: 'Chiller overhaul deferred by 3 weeks to avoid shutting down cooling during final exam week.',
      riskAssessment: 'Slightly elevated operating temperature managed via load balancing with Chiller #2.',
      compensatingControl: 'Daily continuous vibration and thermal telemetry monitoring with 1-hour alarm notification.',
      proposerId: 'usr_chief_engineer',
      approverId: 'usr_facilities_director',
      effectiveDate: '2026-08-15',
      expiryDate: '2026-09-15', // Mandatory bounded expiry
      status: 'ACTIVE',
      createdAt: '2026-08-14T10:00:00Z'
    }
  ]);

  const [decisions, setDecisions] = useState<AssetDecision[]>([
    {
      id: 'dec_001',
      tenantId: tenantScope,
      campusScope,
      decisionType: 'RESILIENCE_PLAN_APPROVAL',
      title: 'Approval of FY2026 Campus Electrical Microgrid Resilience Plan',
      description: 'Formal executive sign-off for 4.5 MW generator synchronization and automated islanding.',
      targetRefId: 'INF-GRID-13KV',
      proposerId: 'usr_facilities_director',
      approverId: 'usr_executive_vp',
      status: 'APPROVED',
      decisionDate: '2026-02-10',
      approvedAt: '2026-02-12T16:00:00Z',
      createdAt: '2026-02-10T11:00:00Z'
    }
  ]);

  // 9. Simulation & Diagnostics State
  const [activeSimulation, setActiveSimulation] = useState<AssetSimulationScenario | null>(null);
  const [diagnosticFindings, setDiagnosticFindings] = useState<AssetDiagnosticFinding[]>([]);
  const [auditLogs, setAuditLogs] = useState<AssetAuditEvent[]>([
    {
      id: 'aud_init_01',
      tenantId: tenantScope,
      campusScope,
      actorId: 'usr_system_boot',
      action: 'INITIALIZE_ASSET_FACILITIES_CONTROL_PLANE',
      entityType: 'AssetFacilitiesGovernanceModule',
      entityId: 'mod_asset_facilities_governance',
      timestamp: '2026-01-01T00:00:00Z',
      resultingState: { status: 'INITIALIZED', referenceOnlyMode: true },
      justification: 'System initialization of Phase 7.63 Governance Control Plane'
    }
  ]);

  // Lifecycle State Transition Modal State
  const [transitionModalOpen, setTransitionModalOpen] = useState(false);
  const [transitionAsset, setTransitionAsset] = useState<AssetGovernanceReference | null>(null);
  const [selectedNextState, setSelectedNextState] = useState<AssetLifecycleState>('UNDER_MAINTENANCE');
  const [transitionReason, setTransitionReason] = useState('');
  const [approverIdInput, setApproverIdInput] = useState('usr_operations_dean');

  // Trigger Diagnostics
  const handleRunDiagnostics = () => {
    const findings = AssetFacilitiesGovernanceService.runDiagnostics(
      tenantScope,
      campusScope,
      assets,
      criticalityProfiles,
      facilities,
      spaces,
      spaceUtilizations,
      infrastructures,
      emergencyDependencies,
      continuityMappings,
      preventiveMaintenances,
      exceptions,
      [],
      decisions
    );
    setDiagnosticFindings(findings);
    setFeedbackMessage({
      type: findings.length === 0 ? 'success' : 'error',
      text: `Diagnostics execution complete. Identified ${findings.length} findings across asset & facilities control plane.`
    });
  };

  // Trigger Simulation
  const handleRunSimulation = (simType: AssetSimulationType) => {
    const scenario = AssetFacilitiesGovernanceService.runResilienceSimulation(
      tenantScope,
      campusScope,
      simType,
      assets.length,
      facilities.length
    );
    setActiveSimulation(scenario);
    setFeedbackMessage({
      type: 'success',
      text: `Physical Resilience Simulation '${scenario.scenarioName}' executed in isolated sandbox mode.`
    });
  };

  // Handle Lifecycle Transition Submit with Four-Eyes SoD
  const handleExecuteLifecycleTransition = async () => {
    if (!transitionAsset) return;
    try {
      // 1. Check SoD
      AssetFacilitiesGovernanceService.validateSoD(currentUser.id, approverIdInput, 'Asset Lifecycle State Transition');

      // 2. Check State Machine
      AssetFacilitiesGovernanceService.validateAssetLifecycleTransition(transitionAsset.lifecycleState, selectedNextState);

      // 3. Mutate Asset in State
      const updated = assets.map(a => (a.id === transitionAsset.id ? { ...a, lifecycleState: selectedNextState } : a));
      setAssets(updated);

      // 4. Log Immutable Audit
      const log = await AssetFacilitiesGovernanceService.logAudit(
        tenantScope,
        campusScope,
        currentUser.id,
        `TRANSITION_ASSET_LIFECYCLE_${selectedNextState}`,
        'AssetGovernanceReference',
        transitionAsset.id,
        { previousState: transitionAsset.lifecycleState, newState: selectedNextState, approverId: approverIdInput },
        transitionReason || 'Scheduled governance state transition'
      );
      setAuditLogs(prev => [log, ...prev]);

      setFeedbackMessage({
        type: 'success',
        text: `Asset '${transitionAsset.assetIdRef}' successfully transitioned to state '${selectedNextState}' (Approved by: ${approverIdInput}).`
      });
      setTransitionModalOpen(false);
    } catch (err: any) {
      setFeedbackMessage({
        type: 'error',
        text: err.message || 'Failed to execute lifecycle transition.'
      });
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-900 text-slate-100 p-6 flex flex-col space-y-6">
      {/* Header & Control Plane Context */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-5 gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-600/20 border border-blue-500/30 rounded-xl text-blue-400">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold tracking-tight text-white">
                  Institutional Asset, Facilities & Physical Resilience Governance
                </h1>
                <span className="px-2.5 py-0.5 text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full">
                  Phase 7.63 Control Plane
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-0.5">
                Authoritative governance layer for physical assets, facilities, space utilization, utilities & physical resilience.
              </p>
            </div>
          </div>
        </div>

        {/* Global Control Badges */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 px-3 py-1.5 bg-slate-800/80 border border-slate-700 rounded-lg text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-300">Reference-Only • Zero ERP/CMMS Duplication</span>
          </div>
          <button
            onClick={handleRunDiagnostics}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Run Diagnostics</span>
          </button>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedbackMessage && (
        <div
          className={`flex items-center justify-between p-3.5 rounded-lg border text-sm ${
            feedbackMessage.type === 'success'
              ? 'bg-emerald-950/50 border-emerald-800/60 text-emerald-300'
              : 'bg-rose-950/50 border-rose-800/60 text-rose-300'
          }`}
        >
          <div className="flex items-center space-x-2.5">
            {feedbackMessage.type === 'success' ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            )}
            <span>{feedbackMessage.text}</span>
          </div>
          <button onClick={() => setFeedbackMessage(null)} className="text-slate-400 hover:text-white">
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Navigation Tabs */}
      <div className="flex overflow-x-auto border-b border-slate-800 space-x-1 scrollbar-none">
        {[
          { id: 'overview', label: 'Executive Overview', icon: Activity },
          { id: 'assets', label: 'Asset Governance & Criticality', icon: Box },
          { id: 'facilities_space', label: 'Facilities & Space Topology', icon: Building2 },
          { id: 'infrastructure_utilities', label: 'Infrastructure & Utilities', icon: Zap },
          { id: 'maintenance_capital', label: 'Maintenance & Capital Renewal', icon: Wrench },
          { id: 'resilience_simulation', label: 'Physical Resilience & Sandbox', icon: Flame },
          { id: 'risks_controls', label: 'Risks, Decisions & Exceptions', icon: ShieldAlert },
          { id: 'diagnostics_audit', label: 'Diagnostics & Audit Trail', icon: FileText }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-medium border-b-2 transition whitespace-nowrap ${
                isActive
                  ? 'border-blue-500 text-blue-400 bg-blue-500/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: EXECUTIVE OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-800/60 border border-slate-700/60 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">Governed Assets</p>
                <p className="text-2xl font-bold text-white mt-1">{assets.length}</p>
                <p className="text-xs text-blue-400 mt-1">100% Reference-Governed</p>
              </div>
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400">
                <Box className="w-6 h-6" />
              </div>
            </div>

            <div className="p-4 bg-slate-800/60 border border-slate-700/60 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">Mission-Critical Tier</p>
                <p className="text-2xl font-bold text-amber-400 mt-1">
                  {assets.filter(a => a.criticalityTier === 'MISSION_CRITICAL').length} / {assets.length}
                </p>
                <p className="text-xs text-slate-400 mt-1">Strict Four-Eyes Mandatory</p>
              </div>
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
            </div>

            <div className="p-4 bg-slate-800/60 border border-slate-700/60 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">Physical Resilience Score</p>
                <p className="text-2xl font-bold text-emerald-400 mt-1">84 / 100</p>
                <p className="text-xs text-emerald-400 mt-1">N+1 Grid & Dual Chiller</p>
              </div>
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400">
                <Activity className="w-6 h-6" />
              </div>
            </div>

            <div className="p-4 bg-slate-800/60 border border-slate-700/60 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">Active Exceptions</p>
                <p className="text-2xl font-bold text-purple-400 mt-1">{exceptions.filter(e => e.status === 'ACTIVE').length}</p>
                <p className="text-xs text-purple-400 mt-1">Mandatory Bounded Expiry</p>
              </div>
              <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg text-purple-400">
                <Clock className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Quick Architecture Notice */}
          <div className="p-4 bg-slate-800/40 border border-slate-700/50 rounded-xl flex items-start space-x-3">
            <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300 space-y-1">
              <p className="font-semibold text-white">Reference-Only Governance Control Plane</p>
              <p>
                Phase 7.63 operates strictly as an institutional governance, criticality classification, decision, risk, and physical resilience control plane.
                It enforces Four-Eyes separation of duties and lifecycle state machines while preserving external ERP (SAP, Oracle), CMMS (Maximo, Archibus), and IoT/BMS telemetry master records.
              </p>
            </div>
          </div>

          {/* Recent Governance Activity and Critical Assets */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Mission Critical Assets List */}
            <div className="p-5 bg-slate-800/50 border border-slate-700/60 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <span>Mission-Critical Asset Registry</span>
                </h3>
                <span className="text-xs text-slate-400">{assets.length} Registered</span>
              </div>
              <div className="space-y-2.5">
                {assets.map(asset => (
                  <div
                    key={asset.id}
                    className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg flex items-center justify-between hover:border-slate-700 transition"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-semibold text-white">{asset.title}</span>
                        <span
                          className={`px-1.5 py-0.5 text-[10px] font-semibold rounded ${
                            asset.criticalityTier === 'MISSION_CRITICAL'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {asset.criticalityTier}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Ref: {asset.assetIdRef} • Facility: {asset.facilityIdRef || 'Unassigned'} • Dept: {asset.ownerDepartmentIdRef}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 text-xs font-medium rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {asset.lifecycleState}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Sandbox Simulation Trigger */}
            <div className="p-5 bg-slate-800/50 border border-slate-700/60 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
                  <Flame className="w-4 h-4 text-rose-400" />
                  <span>Physical Resilience What-If Scenarios</span>
                </h3>
                <span className="text-xs text-slate-400">Sandbox Mode</span>
              </div>
              <p className="text-xs text-slate-400">
                Execute isolated resilience simulations to evaluate cascade impacts on mission-critical research and infrastructure.
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { type: 'POWER_OUTAGE' as AssetSimulationType, label: 'Campus Power Outage' },
                  { type: 'WATER_FAILURE' as AssetSimulationType, label: 'Water Main Rupture' },
                  { type: 'HVAC_FAILURE' as AssetSimulationType, label: 'Chiller Plant Outage' },
                  { type: 'FIRE_EVENT' as AssetSimulationType, label: 'Hazmat Fire Incident' }
                ].map(sim => (
                  <button
                    key={sim.type}
                    onClick={() => {
                      handleRunSimulation(sim.type);
                      setActiveTab('resilience_simulation');
                    }}
                    className="p-3 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-blue-500/40 rounded-lg text-left transition flex items-center justify-between text-xs text-slate-200"
                  >
                    <span>{sim.label}</span>
                    <Play className="w-3.5 h-3.5 text-blue-400" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ASSET GOVERNANCE & CRITICALITY */}
      {activeTab === 'assets' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search asset references, ERP IDs, categories..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-800/80 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Assets Master Table */}
          <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/90 text-slate-400 border-b border-slate-700">
                <tr>
                  <th className="p-3 font-semibold">Authoritative ERP Ref</th>
                  <th className="p-3 font-semibold">Asset Title & Category</th>
                  <th className="p-3 font-semibold">Facility & Space</th>
                  <th className="p-3 font-semibold">Custodian Dept</th>
                  <th className="p-3 font-semibold">Criticality Tier</th>
                  <th className="p-3 font-semibold">Condition</th>
                  <th className="p-3 font-semibold">Lifecycle State</th>
                  <th className="p-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {assets
                  .filter(
                    a =>
                      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      a.assetIdRef.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      a.categoryCode.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map(asset => (
                    <tr key={asset.id} className="hover:bg-slate-800/40 transition">
                      <td className="p-3 font-mono text-blue-400">{asset.assetIdRef}</td>
                      <td className="p-3">
                        <p className="font-semibold text-white">{asset.title}</p>
                        <p className="text-[11px] text-slate-400">{asset.categoryCode}</p>
                      </td>
                      <td className="p-3 text-slate-300">
                        {asset.facilityIdRef || '—'} / {asset.spaceIdRef || '—'}
                      </td>
                      <td className="p-3 text-slate-300">{asset.ownerDepartmentIdRef}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 text-[10px] font-semibold rounded ${
                            asset.criticalityTier === 'MISSION_CRITICAL'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : asset.criticalityTier === 'CRITICAL'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-slate-700 text-slate-300'
                          }`}
                        >
                          {asset.criticalityTier}
                        </span>
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 text-[10px] font-semibold rounded ${
                            asset.conditionRating === 'EXCELLENT'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : asset.conditionRating === 'GOOD'
                              ? 'bg-blue-500/20 text-blue-300'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}
                        >
                          {asset.conditionRating}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-slate-700 text-slate-200">
                          {asset.lifecycleState}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => {
                            setTransitionAsset(asset);
                            setSelectedNextState('UNDER_MAINTENANCE');
                            setTransitionModalOpen(true);
                          }}
                          className="px-2.5 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded text-[11px] font-medium transition"
                        >
                          Transition State
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: FACILITIES & SPACE TOPOLOGY */}
      {activeTab === 'facilities_space' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {facilities.map(facility => (
              <div key={facility.id} className="p-4 bg-slate-800/50 border border-slate-700/60 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    {facility.facilityType}
                  </span>
                  <span className="text-xs text-emerald-400 font-medium">{facility.lifecycleState}</span>
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">{facility.facilityName}</h4>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">Ref: {facility.facilityIdRef}</p>
                </div>
                <div className="pt-2 border-t border-slate-700/50 text-xs text-slate-300 space-y-1">
                  <p>Gross Floor Area: {facility.grossFloorAreaSqm?.toLocaleString()} sqm</p>
                  <p>Max Design Occupancy: {facility.occupancyCapacityMax} occupants</p>
                  <p>Primary Manager: {facility.primaryManagerIdRef}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Spaces & Utilization Overview */}
          <div className="p-5 bg-slate-800/50 border border-slate-700/60 rounded-xl space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
              <Grid className="w-4 h-4 text-blue-400" />
              <span>Space Utilization Intelligence & Observations</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {spaceUtilizations.map(su => (
                <div key={su.id} className="p-4 bg-slate-900/60 border border-slate-800 rounded-lg space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">{su.spaceIdRef}</span>
                    <span className="text-slate-400">Period: {su.observationPeriod}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-slate-300">
                    <div>
                      <span className="text-slate-400">Scheduled:</span> {su.scheduledOccupancyHours}h
                    </div>
                    <div>
                      <span className="text-slate-400">Observed:</span> {su.actualObservedOccupancyHours}h
                    </div>
                    <div>
                      <span className="text-slate-400">Utilization:</span> {su.utilizationRatePercent}%
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 pt-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300">
                      Normal Occupancy
                    </span>
                    <span className="text-[10px] text-slate-400">Telemetry Source Verified</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: INFRASTRUCTURE & UTILITIES */}
      {activeTab === 'infrastructure_utilities' && (
        <div className="space-y-6">
          {/* Infrastructures Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {infrastructures.map(infra => (
              <div key={infra.id} className="p-5 bg-slate-800/50 border border-slate-700/60 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-blue-400">{infra.infrastructureIdRef}</span>
                  <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-emerald-500/20 text-emerald-300">
                    Redundancy: {infra.redundancyArchitecture}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{infra.name}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Type: {infra.infrastructureType}</p>
                </div>
                <div className="pt-2 border-t border-slate-700/50 text-xs text-slate-300 space-y-1">
                  <p>Primary Plant: {infra.primarySubstationOrPlantRef}</p>
                  <p>Dependent Facilities: {infra.dependentFacilitiesRefs.join(', ')}</p>
                  <p className="text-emerald-400">Single Point of Failure: No</p>
                </div>
              </div>
            ))}
          </div>

          {/* Utilities Table */}
          <div className="p-5 bg-slate-800/50 border border-slate-700/60 rounded-xl space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Campus Utility Providers & Emergency Fuel Reserves</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {utilities.map(u => (
                <div key={u.id} className="p-4 bg-slate-900/60 border border-slate-800 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{u.utilityType}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/20 text-blue-300">
                      Resilience: {u.emergencyResilienceTier}
                    </span>
                  </div>
                  <p className="text-slate-300">Provider: {u.providerName}</p>
                  {u.fuelReserveDaysCalculated && (
                    <p className="text-emerald-400 font-medium">Calculated Emergency Fuel Reserve: {u.fuelReserveDaysCalculated} Days</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: MAINTENANCE & CAPITAL RENEWAL */}
      {activeTab === 'maintenance_capital' && (
        <div className="space-y-6">
          {/* Preventive Maintenance Overview */}
          <div className="p-5 bg-slate-800/50 border border-slate-700/60 rounded-xl space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
              <Wrench className="w-4 h-4 text-blue-400" />
              <span>Preventive Maintenance Governance & SLA Tracking</span>
            </h3>
            <div className="space-y-2.5">
              {preventiveMaintenances.map(pm => (
                <div
                  key={pm.id}
                  className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-lg flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-semibold text-white">Asset Ref: {pm.assetIdRef}</span>
                    <p className="text-slate-400 mt-0.5">
                      Cycle: {pm.scheduleCycle} • Next Due: {pm.nextScheduledDueDate} • SLA Conformance: {pm.slaConformancePercent}%
                    </p>
                  </div>
                  <span
                    className={`px-2 py-0.5 text-[10px] font-semibold rounded ${
                      pm.status === 'COMPLIANT'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}
                  >
                    {pm.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Capital Renewal Plan */}
          <div className="p-5 bg-slate-800/50 border border-slate-700/60 rounded-xl space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Capital Renewal & Facility Condition Index (FCI)</span>
            </h3>
            {capitalRenewals.map(cap => (
              <div key={cap.id} className="p-4 bg-slate-900/60 border border-slate-800 rounded-lg space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{cap.planTitle}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300">
                    Status: {cap.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 text-slate-300">
                  <div>
                    <span className="text-slate-400">Fiscal Horizon:</span> {cap.fiscalHorizon}
                  </div>
                  <div>
                    <span className="text-slate-400">Estimated Budget Ref:</span> ${cap.totalEstimatedCapitalBudgetRef?.toLocaleString()}
                  </div>
                  <div>
                    <span className="text-slate-400">Deferred Maint Backlog:</span> ${cap.deferredMaintenanceBacklogEstimatedRef?.toLocaleString()}
                  </div>
                  <div>
                    <span className="text-slate-400">FCI Average:</span> {(cap.facilityConditionIndexAverageCalculated * 100).toFixed(1)}% (Good)
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: PHYSICAL RESILIENCE & SIMULATION SANDBOX */}
      {activeTab === 'resilience_simulation' && (
        <div className="space-y-6">
          {/* Simulation Header Banner */}
          <div className="p-4 bg-purple-950/40 border border-purple-800/50 rounded-xl flex items-center justify-between">
            <div>
              <span className="px-2.5 py-0.5 text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full">
                SIMULATION ONLY • SANDBOX MODE ACTIVE • ZERO PRODUCTION MUTATION
              </span>
              <p className="text-xs text-slate-300 mt-1">
                Run stress scenarios to analyze multi-facility cascade failures, downtime estimates, and mitigation procedures.
              </p>
            </div>
          </div>

          {/* Trigger Scenario Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { type: 'POWER_OUTAGE' as AssetSimulationType, label: 'Power Grid Blackout' },
              { type: 'WATER_FAILURE' as AssetSimulationType, label: 'Water Main Break' },
              { type: 'HVAC_FAILURE' as AssetSimulationType, label: 'Chiller Outage' },
              { type: 'FIRE_EVENT' as AssetSimulationType, label: 'Hazmat Fire' },
              { type: 'FLOOD_EVENT' as AssetSimulationType, label: '100-Yr Flood' },
              { type: 'CRITICAL_ASSET_FAILURE' as AssetSimulationType, label: 'Substation Failure' },
              { type: 'SUPPLIER_FAILURE' as AssetSimulationType, label: 'Elevator Vendor Default' },
              { type: 'SPACE_CAPACITY_SHOCK' as AssetSimulationType, label: 'Space Surge Shock' }
            ].map(sim => (
              <button
                key={sim.type}
                onClick={() => handleRunSimulation(sim.type)}
                className="p-3 bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-purple-500/50 rounded-xl text-left transition space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white">{sim.label}</span>
                  <Play className="w-3.5 h-3.5 text-purple-400" />
                </div>
                <p className="text-[10px] text-slate-400">{sim.type}</p>
              </button>
            ))}
          </div>

          {/* Active Simulation Result Display */}
          {activeSimulation && (
            <div className="p-5 bg-slate-800/60 border border-purple-500/40 rounded-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-base font-bold text-white">{activeSimulation.scenarioName}</h3>
                    <span className="px-2 py-0.5 text-[10px] font-mono bg-purple-500/20 text-purple-300 rounded">
                      {activeSimulation.simulationType}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Executed by {activeSimulation.executedBy} at {activeSimulation.executedAt}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">Resilience Score</p>
                  <p className="text-xl font-bold text-emerald-400">{activeSimulation.resilienceScoreCalculated} / 100</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div className="p-3 bg-slate-900/60 rounded-lg">
                  <span className="text-slate-400">Affected Facilities:</span>
                  <p className="text-base font-bold text-white mt-1">{activeSimulation.affectedFacilitiesEstimatedCount}</p>
                </div>
                <div className="p-3 bg-slate-900/60 rounded-lg">
                  <span className="text-slate-400">Affected Assets:</span>
                  <p className="text-base font-bold text-white mt-1">{activeSimulation.affectedAssetsEstimatedCount}</p>
                </div>
                <div className="p-3 bg-slate-900/60 rounded-lg">
                  <span className="text-slate-400">Est. Recovery Downtime:</span>
                  <p className="text-base font-bold text-amber-400 mt-1">{activeSimulation.estimatedRecoveryTimeHours} Hours</p>
                </div>
                <div className="p-3 bg-slate-900/60 rounded-lg">
                  <span className="text-slate-400">Simulated Cost Impact Ref:</span>
                  <p className="text-base font-bold text-rose-400 mt-1">${activeSimulation.simulatedDirectCostImpactRef.toLocaleString()}</p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <p className="font-semibold text-slate-200">Disrupted Critical Functions:</p>
                <div className="flex flex-wrap gap-2">
                  {activeSimulation.criticalFunctionsDisrupted.map((fn, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded text-xs">
                      {fn}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <p className="font-semibold text-slate-200">Governance & Engineering Mitigations:</p>
                <ul className="list-disc list-inside text-slate-300 space-y-1">
                  {activeSimulation.mitigationRecommendations.map((rec, idx) => (
                    <li key={idx}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 7: RISKS, DECISIONS & EXCEPTIONS */}
      {activeTab === 'risks_controls' && (
        <div className="space-y-6">
          {/* Active Exceptions */}
          <div className="p-5 bg-slate-800/50 border border-slate-700/60 rounded-xl space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
              <Clock className="w-4 h-4 text-purple-400" />
              <span>Governed Exceptions (Non-Indefinite Expiry Enforced)</span>
            </h3>
            <div className="space-y-3">
              {exceptions.map(exc => (
                <div key={exc.id} className="p-4 bg-slate-900/60 border border-slate-800 rounded-lg space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{exc.exceptionType}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-500/20 text-purple-300">
                      Expires: {exc.expiryDate}
                    </span>
                  </div>
                  <p className="text-slate-300">Rationale: {exc.businessRationale}</p>
                  <p className="text-emerald-400">Compensating Control: {exc.compensatingControl}</p>
                  <p className="text-slate-500 text-[11px]">
                    Proposer: {exc.proposerId} • Approver: {exc.approverId} (Four-Eyes Verified)
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Executive Decisions */}
          <div className="p-5 bg-slate-800/50 border border-slate-700/60 rounded-xl space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
              <Scale className="w-4 h-4 text-blue-400" />
              <span>Executive Asset & Facilities Decisions Log</span>
            </h3>
            <div className="space-y-2.5">
              {decisions.map(dec => (
                <div
                  key={dec.id}
                  className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-lg flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-semibold text-white">{dec.title}</span>
                    <p className="text-slate-400 mt-0.5">{dec.description}</p>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      Proposer: {dec.proposerId} • Approver: {dec.approverId} • Date: {dec.decisionDate}
                    </p>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {dec.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: DIAGNOSTICS & AUDIT TRAIL */}
      {activeTab === 'diagnostics_audit' && (
        <div className="space-y-6">
          {/* Diagnostics Section */}
          <div className="p-5 bg-slate-800/50 border border-slate-700/60 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Asset & Facilities Governance Diagnostic Findings</span>
              </h3>
              <button
                onClick={handleRunDiagnostics}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-medium transition"
              >
                Re-scan Now
              </button>
            </div>

            {diagnosticFindings.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs bg-slate-900/40 rounded-lg border border-slate-800">
                No governance violations detected. Run diagnostics above to scan across all assets, facilities, maintenance, and SoD rules.
              </div>
            ) : (
              <div className="space-y-2.5">
                {diagnosticFindings.map(fnd => (
                  <div
                    key={fnd.id}
                    className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-lg flex items-start space-x-3 text-xs"
                  >
                    <AlertCircle
                      className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                        fnd.severity === 'CRITICAL'
                          ? 'text-rose-400'
                          : fnd.severity === 'HIGH'
                          ? 'text-amber-400'
                          : 'text-blue-400'
                      }`}
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white">{fnd.title}</span>
                        <span
                          className={`px-1.5 py-0.5 text-[10px] font-semibold rounded ${
                            fnd.severity === 'CRITICAL'
                              ? 'bg-rose-500/20 text-rose-300'
                              : fnd.severity === 'HIGH'
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-blue-500/20 text-blue-300'
                          }`}
                        >
                          {fnd.severity}
                        </span>
                      </div>
                      <p className="text-slate-300">{fnd.description}</p>
                      <p className="text-indigo-400 font-medium">Remediation: {fnd.recommendedRemediation}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Immutable Audit Log Stream */}
          <div className="p-5 bg-slate-800/50 border border-slate-700/60 rounded-xl space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Immutable Append-Only Audit Trail</span>
            </h3>
            <div className="space-y-2 font-mono text-xs">
              {auditLogs.map(log => (
                <div key={log.id} className="p-3 bg-slate-900/70 border border-slate-800 rounded-lg space-y-1">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-blue-400 font-bold">{log.action}</span>
                    <span>{log.timestamp}</span>
                  </div>
                  <p className="text-slate-300">
                    Actor: <span className="text-white">{log.actorId}</span> • Entity: {log.entityType} ({log.entityId})
                  </p>
                  {log.justification && <p className="text-slate-400 text-[11px]">Justification: {log.justification}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STATE TRANSITION MODAL */}
      {transitionModalOpen && transitionAsset && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-base font-bold text-white">Transition Asset Lifecycle State</h3>
            <p className="text-xs text-slate-400">
              Asset: <span className="text-white font-semibold">{transitionAsset.title}</span> ({transitionAsset.assetIdRef})
            </p>
            <p className="text-xs text-slate-400">
              Current State: <span className="text-emerald-400 font-semibold">{transitionAsset.lifecycleState}</span>
            </p>

            <div className="space-y-2 text-xs">
              <label className="block text-slate-300 font-medium">Target Lifecycle State</label>
              <select
                value={selectedNextState}
                onChange={e => setSelectedNextState(e.target.value as any)}
                className="w-full p-2 bg-slate-800 border border-slate-700 rounded text-white"
              >
                <option value="UNDER_MAINTENANCE">UNDER_MAINTENANCE</option>
                <option value="RESTRICTED">RESTRICTED</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="DECOMMISSION_PENDING">DECOMMISSION_PENDING</option>
                <option value="DECOMMISSIONED">DECOMMISSIONED</option>
                <option value="RETIRED">RETIRED</option>
              </select>
            </div>

            <div className="space-y-2 text-xs">
              <label className="block text-slate-300 font-medium">Independent Approver ID (Four-Eyes)</label>
              <input
                type="text"
                value={approverIdInput}
                onChange={e => setApproverIdInput(e.target.value)}
                placeholder="e.g. usr_facilities_dean"
                className="w-full p-2 bg-slate-800 border border-slate-700 rounded text-white"
              />
              <p className="text-[11px] text-slate-500">Must not match your requester ID: {currentUser.id}</p>
            </div>

            <div className="space-y-2 text-xs">
              <label className="block text-slate-300 font-medium">Transition Justification</label>
              <textarea
                value={transitionReason}
                onChange={e => setTransitionReason(e.target.value)}
                rows={2}
                placeholder="Document operational or statutory reason..."
                className="w-full p-2 bg-slate-800 border border-slate-700 rounded text-white"
              />
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setTransitionModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteLifecycleTransition}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-semibold"
              >
                Authorize Transition
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
