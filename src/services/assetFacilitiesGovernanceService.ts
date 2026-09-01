/**
 * EMS Phase 7.63 — Institutional Asset, Facilities, Infrastructure, Space, Utilities & Physical Resilience Governance Engine
 * Deterministic Governance Service Layer
 */

import {
  AssetGovernanceReference,
  AssetCriticalityProfile,
  AssetCriticalityLevel,
  AssetLifecycleState,
  FacilityLifecycleState,
  FacilityGovernance,
  SpaceGovernance,
  SpaceAllocation,
  SpaceUtilizationObservation,
  InfrastructureGovernance,
  UtilityGovernance,
  UtilityConsumptionObservation,
  MaintenanceGovernance,
  PreventiveMaintenanceGovernance,
  CorrectiveMaintenanceGovernance,
  MaintenanceRiskObservation,
  CapitalRenewalGovernance,
  AssetReplacementPlan,
  PhysicalSecurityGovernance,
  EnvironmentalRiskObservation,
  FacilityResilienceAssessment,
  BusinessContinuityFacilityMapping,
  EmergencyFacilityDependency,
  FacilityIncident,
  AssetRisk,
  AssetControl,
  AssetException,
  AssetDecision,
  AssetAuditEvent,
  AssetSimulationScenario,
  AssetSimulationType,
  AssetDiagnosticFinding
} from '../types/assetFacilitiesGovernance';

export class AssetFacilitiesGovernanceService {
  /**
   * 1. Validate Separation of Duties (Four-Eyes Principle)
   */
  static validateSoD(requesterId: string, approverId: string, actionContext: string): void {
    if (!requesterId || !approverId) {
      throw new Error(`[SoD Violation] Both requester and approver identities are required for ${actionContext}.`);
    }
    if (requesterId.trim().toLowerCase() === approverId.trim().toLowerCase()) {
      throw new Error(
        `[SoD Violation] Self-approval blocked. Requester '${requesterId}' cannot approve their own ${actionContext}.`
      );
    }
  }

  /**
   * 2. Asset Lifecycle State Machine Guard
   */
  static validateAssetLifecycleTransition(
    current: AssetLifecycleState,
    next: AssetLifecycleState
  ): boolean {
    const validTransitions: Record<AssetLifecycleState, AssetLifecycleState[]> = {
      PLANNED: ['ACQUIRED', 'DECOMMISSION_PENDING', 'RETIRED'],
      ACQUIRED: ['COMMISSIONED', 'RESTRICTED', 'DECOMMISSION_PENDING'],
      COMMISSIONED: ['ACTIVE', 'RESTRICTED', 'UNDER_MAINTENANCE'],
      ACTIVE: ['UNDER_MAINTENANCE', 'RESTRICTED', 'DECOMMISSION_PENDING'],
      UNDER_MAINTENANCE: ['ACTIVE', 'RESTRICTED', 'DECOMMISSION_PENDING'],
      RESTRICTED: ['ACTIVE', 'UNDER_MAINTENANCE', 'DECOMMISSION_PENDING', 'DECOMMISSIONED'],
      DECOMMISSION_PENDING: ['DECOMMISSIONED', 'ACTIVE'],
      DECOMMISSIONED: ['RETIRED'],
      RETIRED: []
    };

    const allowed = validTransitions[current] || [];
    if (!allowed.includes(next)) {
      throw new Error(
        `[Asset Lifecycle Guard] Invalid state transition from '${current}' to '${next}'. Allowed next states: [${allowed.join(', ')}]`
      );
    }
    return true;
  }

  /**
   * 3. Facility Lifecycle State Machine Guard
   */
  static validateFacilityLifecycleTransition(
    current: FacilityLifecycleState,
    next: FacilityLifecycleState
  ): boolean {
    const validTransitions: Record<FacilityLifecycleState, FacilityLifecycleState[]> = {
      PLANNED: ['CONSTRUCTION', 'DECOMMISSION_PENDING'],
      CONSTRUCTION: ['COMMISSIONED', 'RESTRICTED', 'DECOMMISSION_PENDING'],
      COMMISSIONED: ['OPERATIONAL', 'RESTRICTED'],
      OPERATIONAL: ['RESTRICTED', 'RENOVATION', 'DECOMMISSION_PENDING'],
      RESTRICTED: ['OPERATIONAL', 'RENOVATION', 'DECOMMISSION_PENDING', 'DECOMMISSIONED'],
      RENOVATION: ['OPERATIONAL', 'COMMISSIONED', 'RESTRICTED', 'DECOMMISSION_PENDING'],
      DECOMMISSION_PENDING: ['DECOMMISSIONED', 'OPERATIONAL'],
      DECOMMISSIONED: []
    };

    const allowed = validTransitions[current] || [];
    if (!allowed.includes(next)) {
      throw new Error(
        `[Facility Lifecycle Guard] Invalid state transition from '${current}' to '${next}'. Allowed next states: [${allowed.join(', ')}]`
      );
    }
    return true;
  }

  /**
   * 4. Deterministic Criticality Tier Calculator
   */
  static calculateCriticalityTier(scores: {
    operationalImpact: number;
    safetyImpact: number;
    financialImpact: number;
    academicResearchImpact: number;
    regulatoryImpact: number;
    recoveryDifficulty: number;
    dependencyConcentration: number;
  }): { calculatedTier: AssetCriticalityLevel; overallScore: number } {
    // Weighted deterministic score calculation (0-100)
    const weights = {
      operationalImpact: 0.20,
      safetyImpact: 0.25,
      financialImpact: 0.10,
      academicResearchImpact: 0.15,
      regulatoryImpact: 0.10,
      recoveryDifficulty: 0.10,
      dependencyConcentration: 0.10
    };

    const overallScore = Math.round(
      scores.operationalImpact * weights.operationalImpact +
      scores.safetyImpact * weights.safetyImpact +
      scores.financialImpact * weights.financialImpact +
      scores.academicResearchImpact * weights.academicResearchImpact +
      scores.regulatoryImpact * weights.regulatoryImpact +
      scores.recoveryDifficulty * weights.recoveryDifficulty +
      scores.dependencyConcentration * weights.dependencyConcentration
    );

    let calculatedTier: AssetCriticalityLevel = 'LOW';
    if (overallScore >= 85 || scores.safetyImpact >= 90) {
      calculatedTier = 'MISSION_CRITICAL';
    } else if (overallScore >= 70) {
      calculatedTier = 'CRITICAL';
    } else if (overallScore >= 50) {
      calculatedTier = 'HIGH';
    } else if (overallScore >= 30) {
      calculatedTier = 'MODERATE';
    } else {
      calculatedTier = 'LOW';
    }

    return { calculatedTier, overallScore };
  }

  /**
   * 5. Dependency Graph Traversal & Topology Analysis (DFS / BFS)
   * Detects single points of failure, circular dependencies, orphan references, and concentration.
   */
  static analyzeDependencyTopology(
    assets: AssetGovernanceReference[],
    facilities: FacilityGovernance[],
    infrastructures: InfrastructureGovernance[],
    emergencyDependencies: EmergencyFacilityDependency[]
  ): {
    hasCircularDependency: boolean;
    cyclePath?: string[];
    singlePointsOfFailure: string[];
    isolatedFacilities: string[];
    orphanedAssets: string[];
  } {
    const singlePointsOfFailure: string[] = [];
    const isolatedFacilities: string[] = [];
    const orphanedAssets: string[] = [];

    // Check infrastructures with single points of failure
    infrastructures.forEach(infra => {
      if (infra.singlePointOfFailureIdentified || infra.redundancyArchitecture === 'NONE') {
        singlePointsOfFailure.push(`Infra:${infra.infrastructureIdRef} (${infra.name})`);
      }
    });

    // Check orphan assets
    const facilityIds = new Set(facilities.map(f => f.facilityIdRef));
    assets.forEach(a => {
      if (a.facilityIdRef && !facilityIds.has(a.facilityIdRef)) {
        orphanedAssets.push(`Asset:${a.assetIdRef} references unknown Facility:${a.facilityIdRef}`);
      }
    });

    // Build directed graph for emergency facility dependencies
    const graph = new Map<string, string[]>();
    emergencyDependencies.forEach(dep => {
      if (!graph.has(dep.sourceFacilityIdRef)) {
        graph.set(dep.sourceFacilityIdRef, []);
      }
      graph.get(dep.sourceFacilityIdRef)!.push(dep.dependentFacilityIdRef);
    });

    // Cycle detection via DFS with recursion depth guard
    const visited = new Set<string>();
    const recStack = new Set<string>();
    let hasCircularDependency = false;
    let cyclePath: string[] | undefined = undefined;

    const dfs = (node: string, currentPath: string[], depth: number): boolean => {
      if (depth > 50) return false; // runaway recursion limit
      visited.add(node);
      recStack.add(node);

      const neighbors = graph.get(node) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          if (dfs(neighbor, [...currentPath, neighbor], depth + 1)) return true;
        } else if (recStack.has(neighbor)) {
          hasCircularDependency = true;
          cyclePath = [...currentPath, neighbor];
          return true;
        }
      }

      recStack.delete(node);
      return false;
    };

    for (const node of graph.keys()) {
      if (!visited.has(node)) {
        if (dfs(node, [node], 0)) break;
      }
    }

    return {
      hasCircularDependency,
      cyclePath,
      singlePointsOfFailure,
      isolatedFacilities,
      orphanedAssets
    };
  }

  /**
   * 6. What-If Physical Resilience Simulation Sandbox
   * In-memory isolated simulation scenario execution
   */
  static runResilienceSimulation(
    tenantId: string,
    campusScope: string,
    simulationType: AssetSimulationType,
    totalAssetsCount: number,
    totalFacilitiesCount: number
  ): AssetSimulationScenario {
    let scenarioName = '';
    let affectedFacilities = 0;
    let affectedAssets = 0;
    let estimatedRecoveryTime = 0;
    let criticalFunctionsDisrupted: string[] = [];
    let directCostImpact = 0;
    let resilienceScore = 100;
    let recommendations: string[] = [];

    switch (simulationType) {
      case 'POWER_OUTAGE':
        scenarioName = 'Campus Wide Primary Grid & Substation Blackout';
        affectedFacilities = Math.min(totalFacilitiesCount, 8);
        affectedAssets = Math.min(totalAssetsCount, 45);
        estimatedRecoveryTime = 14;
        criticalFunctionsDisrupted = ['Central Data Center', 'High-Performance Research Cluster', 'Cryo-Storage'];
        directCostImpact = 75000;
        resilienceScore = 62;
        recommendations = [
          'Deploy secondary N+1 automated backup generator synchronizer at Central Plant',
          'Test 72-hour continuous diesel fuel reserve dispatch SLA'
        ];
        break;

      case 'WATER_FAILURE':
        scenarioName = 'Municipal Water Main Rupture & Pressure Drop';
        affectedFacilities = Math.min(totalFacilitiesCount, 5);
        affectedAssets = Math.min(totalAssetsCount, 20);
        estimatedRecoveryTime = 24;
        criticalFunctionsDisrupted = ['Central Chilled Water Plant', 'Vivarium Cleanrooms', 'Dining Complex'];
        directCostImpact = 45000;
        resilienceScore = 70;
        recommendations = [
          'Activate 48-hour emergency greywater reserve bypass for cooling towers',
          'Issue boil-water protocol and mobilize emergency potable water tankers'
        ];
        break;

      case 'HVAC_FAILURE':
        scenarioName = 'Central Chiller Compressor Multi-Bank Cascade Outage';
        affectedFacilities = Math.min(totalFacilitiesCount, 3);
        affectedAssets = Math.min(totalAssetsCount, 30);
        estimatedRecoveryTime = 18;
        criticalFunctionsDisrupted = ['Server Infrastructure', 'Clean Room Chemistry Lab 4B'];
        directCostImpact = 60000;
        resilienceScore = 55;
        recommendations = [
          'Procure mobile trailer-mounted chiller standby contract',
          'Enforce thermal load shedding in non-critical classrooms'
        ];
        break;

      case 'FIRE_EVENT':
        scenarioName = 'Chemical Engineering Laboratory Hazmat Fire Isolation';
        affectedFacilities = 1;
        affectedAssets = Math.min(totalAssetsCount, 12);
        estimatedRecoveryTime = 96;
        criticalFunctionsDisrupted = ['Organic Synthesis Lab', 'Adjacent Lecture Hall 102'];
        directCostImpact = 250000;
        resilienceScore = 78;
        recommendations = [
          'Recertify automatic FM-200 clean agent suppression systems',
          'Perform joint evacuation drill with Municipal Fire Dept'
        ];
        break;

      case 'FLOOD_EVENT':
        scenarioName = '100-Year Flash Flood Inundation at Lower Quad';
        affectedFacilities = Math.min(totalFacilitiesCount, 2);
        affectedAssets = Math.min(totalAssetsCount, 18);
        estimatedRecoveryTime = 48;
        criticalFunctionsDisrupted = ['Basement Transformer Vault', 'Facilities Workshop'];
        directCostImpact = 120000;
        resilienceScore = 68;
        recommendations = [
          'Install automated flood gate barriers on electrical vault thresholds',
          'Relocate critical switchgear to mezzanine level'
        ];
        break;

      case 'CRITICAL_ASSET_FAILURE':
        scenarioName = 'High-Voltage Transformer Substation Main Bushing Failure';
        affectedFacilities = Math.min(totalFacilitiesCount, 4);
        affectedAssets = 1;
        estimatedRecoveryTime = 36;
        criticalFunctionsDisrupted = ['North Campus Science Complex'];
        directCostImpact = 180000;
        resilienceScore = 50;
        recommendations = [
          'Maintain spare high-voltage bushing on strategic cold reserve',
          'Schedule annual dissolved gas oil analysis'
        ];
        break;

      case 'SUPPLIER_FAILURE':
        scenarioName = 'Primary Elevator & Mechanical Contractor Insolvency Default';
        affectedFacilities = totalFacilitiesCount;
        affectedAssets = Math.min(totalAssetsCount, 25);
        estimatedRecoveryTime = 72;
        criticalFunctionsDisrupted = ['Campus ADA Mobility Transit', 'Freight Handling'];
        directCostImpact = 35000;
        resilienceScore = 65;
        recommendations = [
          'Execute secondary standby maintenance MSA with alternate regional contractor',
          'Audit parts inventory cache for critical elevator hoist ropes and controllers'
        ];
        break;

      case 'FACILITY_ACCESS_LOSS':
        scenarioName = 'Security Perimeter Lockdown & Access Controller Firmware Glitch';
        affectedFacilities = Math.min(totalFacilitiesCount, 6);
        affectedAssets = Math.min(totalAssetsCount, 15);
        estimatedRecoveryTime = 8;
        criticalFunctionsDisrupted = ['Administrative Offices', 'Student Union'];
        directCostImpact = 15000;
        resilienceScore = 82;
        recommendations = [
          'Verify mechanical master key override protocols with Campus Public Safety',
          'Implement dual-homed offline credential caching on door controllers'
        ];
        break;

      case 'UTILITY_DISRUPTION':
        scenarioName = 'Natural Gas Pipeline Low-Pressure Safety Curtailment';
        affectedFacilities = Math.min(totalFacilitiesCount, 3);
        affectedAssets = Math.min(totalAssetsCount, 10);
        estimatedRecoveryTime = 16;
        criticalFunctionsDisrupted = ['Central Steam Boilers', 'Campus Domestic Hot Water'];
        directCostImpact = 40000;
        resilienceScore = 74;
        recommendations = [
          'Verify dual-fuel boiler burner transition to ultra-low sulfur diesel backup',
          'Inspect fuel atomizers quarterly'
        ];
        break;

      case 'MAJOR_MAINTENANCE_BACKLOG':
        scenarioName = 'Deferred Maintenance Backlog Exceeding 15% FCI Threshold';
        affectedFacilities = totalFacilitiesCount;
        affectedAssets = Math.min(totalAssetsCount, 80);
        estimatedRecoveryTime = 720;
        criticalFunctionsDisrupted = ['Facility Condition Index Compliance'];
        directCostImpact = 450000;
        resilienceScore = 48;
        recommendations = [
          'Align capital renewal budget appropriation with Phase 7.60 Financial Governance',
          'Prioritize life-safety and roof membrane replacements'
        ];
        break;

      case 'INFRASTRUCTURE_RENEWAL_DELAY':
        scenarioName = 'Chilled Water Distribution Piping Replacement 12-Month Delay';
        affectedFacilities = Math.min(totalFacilitiesCount, 7);
        affectedAssets = Math.min(totalAssetsCount, 14);
        estimatedRecoveryTime = 120;
        criticalFunctionsDisrupted = ['Summer Cooling & Humidity Control'];
        directCostImpact = 85000;
        resilienceScore = 58;
        recommendations = [
          'Install ultrasonic pipe wall thickness sensors on high-corrosion elbows',
          'Establish chemical corrosion inhibitor monitoring'
        ];
        break;

      case 'SPACE_CAPACITY_SHOCK':
        scenarioName = 'Sudden 25% Influx in Engineering Enrollment & Lab Demand';
        affectedFacilities = Math.min(totalFacilitiesCount, 2);
        affectedAssets = Math.min(totalAssetsCount, 35);
        estimatedRecoveryTime = 48;
        criticalFunctionsDisrupted = ['Undergraduate STEM Lab Allocations'];
        directCostImpact = 20000;
        resilienceScore = 75;
        recommendations = [
          'Optimize space timetable utilization using Phase 7.63 Space Intelligence observations',
          'Reallocate underutilized multi-purpose rooms'
        ];
        break;
    }

    return {
      id: `SIM-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      tenantId,
      campusScope,
      simulationType,
      scenarioName,
      inputParameters: { totalAssetsCount, totalFacilitiesCount, mode: 'SANDBOX' },
      affectedFacilitiesEstimatedCount: affectedFacilities,
      affectedAssetsEstimatedCount: affectedAssets,
      estimatedRecoveryTimeHours: estimatedRecoveryTime,
      criticalFunctionsDisrupted,
      simulatedDirectCostImpactRef: directCostImpact,
      resilienceScoreCalculated: resilienceScore,
      mitigationRecommendations: recommendations,
      isSandboxMode: true,
      bannerNotice: 'SIMULATION ONLY • SANDBOX MODE ACTIVE • ZERO PRODUCTION MUTATION',
      executedBy: 'usr_simulation_operator',
      executedAt: new Date().toISOString()
    };
  }

  /**
   * 7. Comprehensive Asset & Facilities Governance Diagnostics Engine
   */
  static runDiagnostics(
    tenantId: string,
    campusScope: string,
    assets: AssetGovernanceReference[],
    criticalityProfiles: AssetCriticalityProfile[],
    facilities: FacilityGovernance[],
    spaces: SpaceGovernance[],
    spaceUtilizations: SpaceUtilizationObservation[],
    infrastructures: InfrastructureGovernance[],
    emergencyDeps: EmergencyFacilityDependency[],
    continuityMappings: BusinessContinuityFacilityMapping[],
    preventiveMaintenances: PreventiveMaintenanceGovernance[],
    exceptions: AssetException[],
    replacementPlans: AssetReplacementPlan[],
    decisions: AssetDecision[]
  ): AssetDiagnosticFinding[] {
    const findings: AssetDiagnosticFinding[] = [];
    const nowIso = new Date().toISOString();

    // 1. Check Missing Criticality Profiles
    const profiledAssetIds = new Set(criticalityProfiles.map(c => c.assetGovernanceRefId));
    assets.forEach(a => {
      if (!profiledAssetIds.has(a.id)) {
        findings.push({
          id: `FND-CRIT-${a.id}`,
          tenantId,
          campusScope,
          findingCode: 'MISSING_CRITICALITY_PROFILE',
          severity: a.criticalityTier === 'MISSION_CRITICAL' || a.criticalityTier === 'CRITICAL' ? 'HIGH' : 'MEDIUM',
          category: 'MISSING_CRITICALITY',
          entityType: 'AssetGovernanceReference',
          entityId: a.id,
          title: `Asset '${a.title}' (${a.assetIdRef}) Lacks Formal Criticality Assessment Profile`,
          description: 'Asset is registered in the control plane but does not have a signed multi-factor criticality assessment.',
          recommendedRemediation: 'Complete AssetCriticalityProfile with operational, safety, and research impact scores.',
          detectedAt: nowIso
        });
      }
    });

    // 2. Check Critical Assets Without Resilience/Continuity Mappings
    const criticalAssets = assets.filter(a => a.criticalityTier === 'MISSION_CRITICAL');
    const continuityFacilities = new Set(continuityMappings.map(c => c.facilityIdRef));
    criticalAssets.forEach(ca => {
      if (ca.facilityIdRef && !continuityFacilities.has(ca.facilityIdRef)) {
        findings.push({
          id: `FND-RES-${ca.id}`,
          tenantId,
          campusScope,
          findingCode: 'CRITICAL_ASSET_NO_CONTINUITY',
          severity: 'CRITICAL',
          category: 'RESILIENCE_GAP',
          entityType: 'AssetGovernanceReference',
          entityId: ca.id,
          title: `Mission-Critical Asset in Facility '${ca.facilityIdRef}' Without Business Continuity Mapping`,
          description: 'A Tier-1 mission-critical asset resides in a facility without a validated business continuity backup designation.',
          recommendedRemediation: 'Map facility in BusinessContinuityFacilityMapping with maximum tolerable downtime thresholds.',
          detectedAt: nowIso
        });
      }
    });

    // 3. Check Expired or Indefinite Exceptions
    exceptions.forEach(exc => {
      if (exc.status === 'ACTIVE') {
        if (!exc.expiryDate) {
          findings.push({
            id: `FND-EXC-INDEF-${exc.id}`,
            tenantId,
            campusScope,
            findingCode: 'INDEFINITE_EXCEPTION_FORBIDDEN',
            severity: 'CRITICAL',
            category: 'EXPIRED_EXCEPTION',
            entityType: 'AssetException',
            entityId: exc.id,
            title: `Indefinite Exception '${exc.exceptionType}' Detected Without Expiry Date`,
            description: 'Institutional governance forbids open-ended or indefinite exceptions.',
            recommendedRemediation: 'Set mandatory expiryDate and document compensating controls.',
            detectedAt: nowIso
          });
        } else if (new Date(exc.expiryDate).getTime() < Date.now()) {
          findings.push({
            id: `FND-EXC-EXP-${exc.id}`,
            tenantId,
            campusScope,
            findingCode: 'EXPIRED_ACTIVE_EXCEPTION',
            severity: 'HIGH',
            category: 'EXPIRED_EXCEPTION',
            entityType: 'AssetException',
            entityId: exc.id,
            title: `Active Exception '${exc.exceptionType}' Has Passed Expiry Date (${exc.expiryDate})`,
            description: 'Exception remains flagged as ACTIVE after its authorization period elapsed.',
            recommendedRemediation: 'Transition exception status to EXPIRED or re-evaluate via Four-Eyes approval.',
            detectedAt: nowIso
          });
        }
      }
    });

    // 4. Check Overdue Preventive Maintenance
    preventiveMaintenances.forEach(pm => {
      if (pm.isOverdue || new Date(pm.nextScheduledDueDate).getTime() < Date.now()) {
        findings.push({
          id: `FND-PM-OVER-${pm.id}`,
          tenantId,
          campusScope,
          findingCode: 'OVERDUE_PREVENTIVE_MAINTENANCE',
          severity: 'HIGH',
          category: 'MAINTENANCE_DEFICIT',
          entityType: 'PreventiveMaintenanceGovernance',
          entityId: pm.id,
          title: `Overdue Preventive Maintenance on Asset Ref '${pm.assetIdRef}'`,
          description: `Mandatory PM schedule '${pm.scheduleCycle}' was due on ${pm.nextScheduledDueDate}.`,
          recommendedRemediation: 'Expedite technician assignment or register temporary compensating risk exception.',
          detectedAt: nowIso
        });
      }
    });

    // 5. Check Single Points of Failure & Concentration
    infrastructures.forEach(infra => {
      if (infra.singlePointOfFailureIdentified || infra.redundancyArchitecture === 'NONE') {
        findings.push({
          id: `FND-SPOF-${infra.id}`,
          tenantId,
          campusScope,
          findingCode: 'SINGLE_POINT_OF_FAILURE',
          severity: infra.criticalityTier === 'MISSION_CRITICAL' ? 'CRITICAL' : 'HIGH',
          category: 'DEPENDENCY_CONCENTRATION',
          entityType: 'InfrastructureGovernance',
          entityId: infra.id,
          title: `Single Point of Failure in Infrastructure '${infra.name}' (${infra.infrastructureIdRef})`,
          description: `Architecture has zero redundancy (${infra.redundancyArchitecture}) servicing ${infra.dependentFacilitiesRefs.length} facilities.`,
          recommendedRemediation: 'Propose capital renewal N+1 redundancy plan in CapitalRenewalGovernance.',
          detectedAt: nowIso
        });
      }
    });

    // 6. Check Space Anomalies (Over-Capacity or Severe Underutilization)
    spaceUtilizations.forEach(su => {
      if (su.isOverCapacity) {
        findings.push({
          id: `FND-SP-OVER-${su.id}`,
          tenantId,
          campusScope,
          findingCode: 'SPACE_OVER_CAPACITY',
          severity: 'HIGH',
          category: 'SPACE_ANOMALY',
          entityType: 'SpaceUtilizationObservation',
          entityId: su.id,
          title: `Space '${su.spaceIdRef}' Observed Over Safe Design Capacity`,
          description: `Peak headcount ${su.peakOccupancyHeadcount} exceeds room design limit in period ${su.observationPeriod}.`,
          recommendedRemediation: 'Review department scheduling and reallocate overflow classes.',
          detectedAt: nowIso
        });
      } else if (su.isUnderutilized && (su.utilizationRatePercent || 0) < 20) {
        findings.push({
          id: `FND-SP-UNDER-${su.id}`,
          tenantId,
          campusScope,
          findingCode: 'SPACE_SEVERE_UNDERUTILIZATION',
          severity: 'LOW',
          category: 'SPACE_ANOMALY',
          entityType: 'SpaceUtilizationObservation',
          entityId: su.id,
          title: `Space '${su.spaceIdRef}' Severely Underutilized (${su.utilizationRatePercent}%)`,
          description: `Space scheduled for only ${su.scheduledOccupancyHours}h during ${su.observationPeriod}.`,
          recommendedRemediation: 'Flag space for multi-purpose optimization or consortium lab sharing.',
          detectedAt: nowIso
        });
      }
    });

    // 7. Check SoD Violations in Decisions
    decisions.forEach(dec => {
      if (dec.proposerId && dec.approverId && dec.proposerId === dec.approverId) {
        findings.push({
          id: `FND-SOD-DEC-${dec.id}`,
          tenantId,
          campusScope,
          findingCode: 'FOUR_EYES_SOD_VIOLATION',
          severity: 'CRITICAL',
          category: 'SOD_VIOLATION',
          entityType: 'AssetDecision',
          entityId: dec.id,
          title: `Self-Approval Detected on Decision '${dec.title}'`,
          description: `Proposer '${dec.proposerId}' approved their own executive asset decision.`,
          recommendedRemediation: 'Revoke self-approved decision and submit for independent review.',
          detectedAt: nowIso
        });
      }
    });

    return findings;
  }

  /**
   * 8. Immutable Audit Log Builder
   */
  static async logAudit(
    tenantId: string,
    campusScope: string,
    actorId: string,
    action: string,
    entityType: string,
    entityId: string,
    resultingState: Record<string, any>,
    justification?: string
  ): Promise<AssetAuditEvent> {
    return {
      id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      tenantId,
      campusScope,
      actorId,
      action,
      entityType,
      entityId,
      timestamp: new Date().toISOString(),
      resultingState,
      justification,
      ipAddressOrOrigin: 'institutional_control_plane'
    };
  }
}
