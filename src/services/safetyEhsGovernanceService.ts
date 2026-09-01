/**
 * EMS Phase 7.64 — Institutional Safety, Occupational Health, Environmental Health, Emergency Preparedness & Life-Safety Governance Engine
 * Deterministic Service Layer
 */

import {
  SafetyGovernanceReference,
  SafetyPolicyGovernance,
  SafetyProgramGovernance,
  SafetyRequirement,
  RegulatorySafetyReference,
  WorkplaceGovernance,
  HazardCategory,
  HazardLifecycleState,
  HazardRegister,
  HazardObservation,
  HazardAssessment,
  SafetyRiskLevel,
  ControlHierarchyType,
  RiskAssessment,
  RiskControl,
  ControlEffectivenessObservation,
  InspectionFindingSeverity,
  FindingLifecycleState,
  SafetyInspection,
  InspectionFinding,
  CorrectiveAction,
  PreventiveAction,
  SafetyException,
  SafetyWaiver,
  IncidentClassificationType,
  IncidentLifecycleState,
  IncidentReference,
  SafetyIncidentClassification,
  IncidentInvestigation,
  RootCauseObservation,
  NearMissObservation,
  SafetyPerformanceIndicator,
  SafetyTrainingGovernance,
  CompetencyRequirement,
  TrainingComplianceObservation,
  PPEGovernance,
  EmergencyScenarioType,
  EmergencyPreparednessGovernance,
  EmergencyPlanReference,
  EmergencyScenario,
  ExerciseLifecycleState,
  EmergencyExercise,
  EmergencyExerciseFinding,
  BusinessContinuitySafetyDependency,
  EvacuationGovernance,
  ShelterGovernance,
  FireLifeSafetyGovernance,
  LaboratorySafetyGovernance,
  BiologicalSafetyGovernance,
  ChemicalSafetyGovernance,
  RadiationSafetyGovernance,
  EnvironmentalHealthGovernance,
  EnvironmentalObservation,
  ExposureObservationReference,
  OccupationalHealthGovernanceReference,
  WorkplaceWellbeingGovernance,
  ContractorSafetyGovernance,
  VisitorSafetyGovernance,
  SafetyCommitteeGovernance,
  SafetyDecision,
  SafetyRisk,
  SafetyControl,
  SafetyControlTest,
  SafetyAuditEvent,
  SafetySimulationScenarioType,
  SafetySimulationScenario,
  SafetyResilienceAssessment,
  SafetyDiagnosticFinding
} from '../types/safetyEhsGovernance';

export class SafetyEhsGovernanceService {
  // Safe bounded calculation helpers
  static clamp(val: number, min: number, max: number): number {
    if (isNaN(val) || !isFinite(val)) return min;
    return Math.max(min, Math.min(max, val));
  }

  /**
   * Deterministically calculates safety risk score and tier
   */
  static calculateDeterministicRiskScore(params: {
    likelihood: number; // 1-5
    severity: number; // 1-5
    exposure?: number; // 1-5
    duration?: number; // 1-5
    population?: number; // 1-5
    regulatory?: number; // 1-5
    detectability?: number; // 1-5 (5 = hard to detect)
    controlEffectiveness?: number; // 1-5 (1 = highly effective, 5 = no control)
  }): { score: number; level: SafetyRiskLevel } {
    const l = SafetyEhsGovernanceService.clamp(params.likelihood, 1, 5);
    const s = SafetyEhsGovernanceService.clamp(params.severity, 1, 5);
    const e = SafetyEhsGovernanceService.clamp(params.exposure || 3, 1, 5);
    const d = SafetyEhsGovernanceService.clamp(params.duration || 3, 1, 5);
    const p = SafetyEhsGovernanceService.clamp(params.population || 3, 1, 5);
    const r = SafetyEhsGovernanceService.clamp(params.regulatory || 3, 1, 5);
    const det = SafetyEhsGovernanceService.clamp(params.detectability || 3, 1, 5);
    const ce = SafetyEhsGovernanceService.clamp(params.controlEffectiveness || 3, 1, 5);

    // Weighted composite algorithm (bounded 1 to 100)
    // Base formula: (Likelihood * Severity * 2.5) + (Exposure * Duration * 0.5) + (Population * Regulatory * 0.5) + (Detectability * ControlGap * 0.5)
    const baseScore = (l * s * 2.5) + (e * d * 0.4) + (p * r * 0.4) + (det * ce * 0.4);
    const score = Math.round(SafetyEhsGovernanceService.clamp(baseScore, 1, 100));

    let level: SafetyRiskLevel = 'LOW';
    if (score >= 80 || s === 5 && l >= 4) {
      level = 'EXTREME';
    } else if (score >= 60 || s === 5 || l === 5) {
      level = 'CRITICAL';
    } else if (score >= 40) {
      level = 'HIGH';
    } else if (score >= 20) {
      level = 'MODERATE';
    } else {
      level = 'LOW';
    }

    return { score, level };
  }

  /**
   * Enforces Separation of Duties (Four-Eyes Principle)
   */
  static validateFourEyesPrinciple(proposerId: string, approverId: string): { valid: boolean; error?: string } {
    if (!proposerId || !approverId) {
      return { valid: false, error: 'Proposer and Approver actor IDs must both be specified.' };
    }
    if (proposerId.trim().toLowerCase() === approverId.trim().toLowerCase()) {
      return { valid: false, error: 'Separation of Duties Violation: Proposer cannot approve their own safety submission.' };
    }
    return { valid: true };
  }

  /**
   * Validates Hazard Lifecycle State Transitions
   */
  static validateHazardTransition(currentState: HazardLifecycleState, nextState: HazardLifecycleState): { valid: boolean; error?: string } {
    const validTransitions: Record<HazardLifecycleState, HazardLifecycleState[]> = {
      IDENTIFIED: ['ASSESSED', 'RETIRED'],
      ASSESSED: ['CONTROL_PLANNED', 'ACCEPTED', 'RETIRED'],
      CONTROL_PLANNED: ['CONTROL_IMPLEMENTED', 'RETIRED'],
      CONTROL_IMPLEMENTED: ['MONITORED', 'CONTROL_PLANNED'],
      MONITORED: ['ACCEPTED', 'CONTROL_PLANNED', 'CLOSED'],
      ACCEPTED: ['MONITORED', 'CLOSED', 'RETIRED'],
      CLOSED: ['MONITORED', 'RETIRED'],
      RETIRED: []
    };

    const allowed = validTransitions[currentState] || [];
    if (!allowed.includes(nextState)) {
      return {
        valid: false,
        error: `Illegal Hazard Lifecycle State Transition: Cannot transition from ${currentState} to ${nextState}.`
      };
    }
    return { valid: true };
  }

  /**
   * Validates Inspection Finding Lifecycle Transitions
   */
  static validateFindingTransition(currentState: FindingLifecycleState, nextState: FindingLifecycleState, hasEvidence: boolean): { valid: boolean; error?: string } {
    const validTransitions: Record<FindingLifecycleState, FindingLifecycleState[]> = {
      OPEN: ['ASSIGNED', 'CLOSED'],
      ASSIGNED: ['ACTION_IN_PROGRESS', 'CLOSED'],
      ACTION_IN_PROGRESS: ['VERIFICATION_PENDING'],
      VERIFICATION_PENDING: ['VERIFIED', 'ACTION_IN_PROGRESS'],
      VERIFIED: ['CLOSED', 'ACTION_IN_PROGRESS'],
      CLOSED: ['OPEN']
    };

    const allowed = validTransitions[currentState] || [];
    if (!allowed.includes(nextState)) {
      return {
        valid: false,
        error: `Illegal Finding State Transition: Cannot transition from ${currentState} to ${nextState}.`
      };
    }

    if (nextState === 'VERIFIED' && !hasEvidence) {
      return {
        valid: false,
        error: 'Closure Evidence Requirement: Independent verification requires attached evidence reference.'
      };
    }

    return { valid: true };
  }

  /**
   * Validates Exercise Lifecycle Transitions
   */
  static validateExerciseTransition(currentState: ExerciseLifecycleState, nextState: ExerciseLifecycleState): { valid: boolean; error?: string } {
    const validTransitions: Record<ExerciseLifecycleState, ExerciseLifecycleState[]> = {
      PLANNED: ['SCHEDULED'],
      SCHEDULED: ['EXECUTED', 'PLANNED'],
      EXECUTED: ['EVALUATED'],
      EVALUATED: ['CORRECTIVE_ACTION', 'CLOSED'],
      CORRECTIVE_ACTION: ['CLOSED'],
      CLOSED: []
    };

    const allowed = validTransitions[currentState] || [];
    if (!allowed.includes(nextState)) {
      return {
        valid: false,
        error: `Illegal Exercise State Transition: Cannot transition from ${currentState} to ${nextState}.`
      };
    }
    return { valid: true };
  }

  /**
   * Bounded DFS Graph Traversal for Safety Dependencies and Cycle Detection
   */
  static analyzeSafetyTopologyDependencies(nodes: {
    hazards: HazardRegister[];
    facilities: SafetyGovernanceReference[];
    emergencyPlans: EmergencyPlanReference[];
    controls: RiskControl[];
  }): {
    cyclesDetected: boolean;
    cyclePaths: string[][];
    orphanHazardsCount: number;
    uncontrolledCriticalHazardsCount: number;
    facilitiesWithoutSafetyPlansCount: number;
  } {
    const adjacency = new Map<string, string[]>();

    // Build directed graph: Hazard -> Facility -> EmergencyPlan -> Control
    for (const h of nodes.hazards) {
      const hNode = `HAZARD_${h.id}`;
      if (!adjacency.has(hNode)) adjacency.set(hNode, []);
      if (h.locationReference.facilityIdRef) {
        const fNode = `FACILITY_${h.locationReference.facilityIdRef}`;
        adjacency.get(hNode)!.push(fNode);
      }
    }

    for (const f of nodes.facilities) {
      const fNode = `FACILITY_${f.id}`;
      if (!adjacency.has(fNode)) adjacency.set(fNode, []);
      for (const p of nodes.emergencyPlans) {
        if (p.targetFacilityRefs.includes(f.id) || p.targetFacilityRefs.includes(f.facilityIdRef || '')) {
          adjacency.get(fNode)!.push(`PLAN_${p.id}`);
        }
      }
    }

    for (const p of nodes.emergencyPlans) {
      const pNode = `PLAN_${p.id}`;
      if (!adjacency.has(pNode)) adjacency.set(pNode, []);
      for (const c of nodes.controls) {
        adjacency.get(pNode)!.push(`CONTROL_${c.id}`);
      }
    }

    // Cycle detection via DFS with recursion limit
    const visited = new Set<string>();
    const recStack = new Set<string>();
    const cyclePaths: string[][] = [];

    const dfs = (node: string, path: string[], depth: number): boolean => {
      if (depth > 20) return false; // Traversal depth guard
      visited.add(node);
      recStack.add(node);
      path.push(node);

      const neighbors = adjacency.get(node) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          if (dfs(neighbor, [...path], depth + 1)) return true;
        } else if (recStack.has(neighbor)) {
          cyclePaths.push([...path, neighbor]);
          return true;
        }
      }

      recStack.delete(node);
      return false;
    };

    for (const key of adjacency.keys()) {
      if (!visited.has(key)) {
        dfs(key, [], 0);
      }
    }

    // Calculate gap metrics
    const orphanHazardsCount = nodes.hazards.filter(h => !h.locationReference.facilityIdRef && !h.locationReference.buildingIdRef).length;
    const uncontrolledCriticalHazardsCount = nodes.hazards.filter(h => (h.assessedRiskLevel === 'CRITICAL' || h.assessedRiskLevel === 'EXTREME') && !h.hasActiveControls).length;
    const facilitiesWithoutSafetyPlansCount = nodes.facilities.filter(f => {
      return !nodes.emergencyPlans.some(p => p.targetFacilityRefs.includes(f.id) || p.targetFacilityRefs.includes(f.facilityIdRef || ''));
    }).length;

    return {
      cyclesDetected: cyclePaths.length > 0,
      cyclePaths,
      orphanHazardsCount,
      uncontrolledCriticalHazardsCount,
      facilitiesWithoutSafetyPlansCount
    };
  }

  /**
   * Deterministic Resilience Assessment Calculator
   */
  static calculateSafetyResilience(params: {
    emergencyResponseCapability: number; // 0-100
    criticalHazardExposure: number; // 0-100 (lower is better exposure)
    controlRedundancy: number; // 0-100
    emergencyResourceAvailability: number; // 0-100
    evacuationReadiness: number; // 0-100
    criticalPersonDependency: number; // 0-100 (lower is better)
    facilityDependency: number; // 0-100
    communicationReadiness: number; // 0-100
    recoveryCapability: number; // 0-100
  }): {
    overallRating: 'STRONG' | 'ADEQUATE' | 'VULNERABLE' | 'SEVERELY_EXPOSED';
    compositeScore: number;
  } {
    const erc = SafetyEhsGovernanceService.clamp(params.emergencyResponseCapability, 0, 100);
    const che = SafetyEhsGovernanceService.clamp(params.criticalHazardExposure, 0, 100);
    const cr = SafetyEhsGovernanceService.clamp(params.controlRedundancy, 0, 100);
    const era = SafetyEhsGovernanceService.clamp(params.emergencyResourceAvailability, 0, 100);
    const er = SafetyEhsGovernanceService.clamp(params.evacuationReadiness, 0, 100);
    const cpd = SafetyEhsGovernanceService.clamp(params.criticalPersonDependency, 0, 100);
    const fd = SafetyEhsGovernanceService.clamp(params.facilityDependency, 0, 100);
    const comm = SafetyEhsGovernanceService.clamp(params.communicationReadiness, 0, 100);
    const rec = SafetyEhsGovernanceService.clamp(params.recoveryCapability, 0, 100);

    // Composite positive vs drag factors
    const positiveScore = (erc * 0.20) + (cr * 0.15) + (era * 0.15) + (er * 0.20) + (comm * 0.15) + (rec * 0.15);
    const dragScore = ((che * 0.5) + (cpd * 0.3) + (fd * 0.2)) * 0.3;
    const compositeScore = Math.round(SafetyEhsGovernanceService.clamp(positiveScore - dragScore, 0, 100));

    let overallRating: 'STRONG' | 'ADEQUATE' | 'VULNERABLE' | 'SEVERELY_EXPOSED' = 'STRONG';
    if (compositeScore >= 80) {
      overallRating = 'STRONG';
    } else if (compositeScore >= 60) {
      overallRating = 'ADEQUATE';
    } else if (compositeScore >= 40) {
      overallRating = 'VULNERABLE';
    } else {
      overallRating = 'SEVERELY_EXPOSED';
    }

    return { overallRating, compositeScore };
  }

  /**
   * What-If Safety Simulation Sandbox (Zero Production Mutation)
   */
  static runIsolatedSafetySimulation(
    scenarioType: SafetySimulationScenarioType,
    params: {
      tenantId: string;
      campusScope: string;
      buildingCount: number;
      estimatedPopulation: number;
      hazardousChemicalPresent: boolean;
      suppressionSystemFunctional: boolean;
      evacuationDelayMinutes: number;
      executedBy: string;
    }
  ): SafetySimulationScenario {
    let affectedFacilities = Math.min(10, Math.max(1, params.buildingCount));
    let affectedPopulation = Math.max(0, params.estimatedPopulation);
    let evacuationTime = 5 + params.evacuationDelayMinutes;
    let directCost = 50000;
    let resilienceScore = 85;
    const triggeredHazards: string[] = [];
    const recommendations: string[] = [];

    switch (scenarioType) {
      case 'MAJOR_FIRE':
        triggeredHazards.push('FIRE', 'SMOKE_INHALATION', 'STRUCTURAL_COLLAPSE');
        if (!params.suppressionSystemFunctional) {
          resilienceScore -= 35;
          evacuationTime += 15;
          directCost += 450000;
          recommendations.push('Immediate automated fire suppression redundancy overhaul required.');
        } else {
          resilienceScore -= 10;
          directCost += 80000;
        }
        break;

      case 'CHEMICAL_RELEASE':
        triggeredHazards.push('CHEMICAL', 'AIR_QUALITY', 'WATER_CONTAMINATION');
        if (params.hazardousChemicalPresent) {
          resilienceScore -= 30;
          directCost += 280000;
          recommendations.push('Establish secondary scrubbing systems and hazmat perimeter isolation protocols.');
        }
        break;

      case 'BIOLOGICAL_RELEASE':
        triggeredHazards.push('BIOLOGICAL', 'AIR_QUALITY');
        resilienceScore -= 25;
        directCost += 220000;
        recommendations.push('Upgrade HVAC negative-pressure isolation dampers in Biosafety Level 2/3 suites.');
        break;

      case 'RADIATION_EVENT':
        triggeredHazards.push('RADIATION');
        resilienceScore -= 20;
        directCost += 310000;
        recommendations.push('Mandate quarterly radiation dosimeter calibration and automated interlock verifications.');
        break;

      case 'FLOOD':
        triggeredHazards.push('WATER', 'ELECTRICAL', 'STRUCTURAL');
        resilienceScore -= 20;
        directCost += 190000;
        recommendations.push('Elevate sub-grade electrical switchgear and install redundant sump telemetry.');
        break;

      case 'EARTHQUAKE':
        triggeredHazards.push('STRUCTURAL', 'GAS_LEAK', 'FIRE');
        resilienceScore -= 30;
        directCost += 600000;
        recommendations.push('Conduct structural seismic tie-down audits for heavy laboratory apparatus.');
        break;

      case 'MASS_CASUALTY':
        triggeredHazards.push('MASS_CASUALTY', 'WORKPLACE_VIOLENCE');
        resilienceScore -= 40;
        directCost += 350000;
        recommendations.push('Expand triage readiness kits and cross-train auxiliary building marshals.');
        break;

      case 'POWER_FAILURE':
        triggeredHazards.push('ELECTRICAL', 'THERMAL', 'LIFE_SAFETY');
        if (!params.suppressionSystemFunctional) {
          resilienceScore -= 25;
        }
        directCost += 75000;
        recommendations.push('Deploy dual-feed emergency generator transfer switches for ultra-low temperature freezers.');
        break;

      case 'EVACUATION_FAILURE':
        triggeredHazards.push('SLIP_TRIP_FALL', 'CRUSH_HAZARD');
        resilienceScore -= 35;
        evacuationTime += 20;
        recommendations.push('Remove stairwell bottleneck obstructions and reconfigure secondary egress routes.');
        break;

      case 'SHELTER_IN_PLACE_FAILURE':
        triggeredHazards.push('ENVIRONMENTAL', 'SECURITY');
        resilienceScore -= 30;
        recommendations.push('Ensure positive pressure HVAC shutdown overrides in designated shelter rooms.');
        break;

      case 'CRITICAL_CONTROL_FAILURE':
        triggeredHazards.push('MECHANICAL', 'FIRE');
        resilienceScore -= 28;
        recommendations.push('Establish weekly physical control health checklists alongside automated telemetry.');
        break;

      case 'EMERGENCY_COMMUNICATION_FAILURE':
        triggeredHazards.push('COMMUNICATION_BREAKDOWN');
        resilienceScore -= 30;
        evacuationTime += 12;
        recommendations.push('Implement satellite paging failovers for all campus emergency wardens.');
        break;
    }

    resilienceScore = Math.max(10, Math.min(100, resilienceScore));

    return {
      id: `SIM-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      tenantId: params.tenantId,
      campusScope: params.campusScope,
      scenarioType,
      scenarioName: `What-If Simulation: ${scenarioType.replace(/_/g, ' ')}`,
      inputParameters: params,
      affectedFacilitiesEstimatedCount: affectedFacilities,
      affectedPopulationEstimatedCount: affectedPopulation,
      estimatedEvacuationTimeMinutes: evacuationTime,
      criticalHazardsTriggered: triggeredHazards,
      simulatedDirectSafetyCostRef: directCost,
      safetyResilienceScoreCalculated: resilienceScore,
      mitigationRecommendations: recommendations,
      isSandboxMode: true,
      bannerNotice: 'SIMULATION ONLY • SANDBOX MODE ACTIVE • ZERO PRODUCTION MUTATION',
      executedBy: params.executedBy,
      executedAt: new Date().toISOString()
    };
  }

  /**
   * Diagnostic Engine: Scans records for institutional safety risks, anomalies, gaps, and SoD breaches
   */
  static runSafetyDiagnostics(records: {
    hazards: HazardRegister[];
    assessments: RiskAssessment[];
    controls: RiskControl[];
    inspections: SafetyInspection[];
    findings: InspectionFinding[];
    correctiveActions: CorrectiveAction[];
    exceptions: SafetyException[];
    emergencyPlans: EmergencyPlanReference[];
    fireLifeSafeties: FireLifeSafetyGovernance[];
    trainings: TrainingComplianceObservation[];
    contractors: ContractorSafetyGovernance[];
    environmentals: EnvironmentalHealthGovernance[];
    decisions: SafetyDecision[];
  }): SafetyDiagnosticFinding[] {
    const findings: SafetyDiagnosticFinding[] = [];
    const now = new Date();

    // 1. Orphan Hazard References (Missing Location)
    for (const h of records.hazards) {
      if (!h.locationReference.facilityIdRef && !h.locationReference.buildingIdRef) {
        findings.push({
          id: `DIAG-ORPHAN-${h.id}`,
          tenantId: h.tenantId,
          campusScope: h.campusScope,
          findingCode: 'ORPHAN_HAZARD',
          severity: 'HIGH',
          category: 'ORPHAN_HAZARD',
          entityType: 'HazardRegister',
          entityId: h.id,
          title: `Orphan Hazard: ${h.hazardCode}`,
          description: `Hazard ${h.title} has no mapped facility or building location reference.`,
          recommendedRemediation: 'Assign an authoritative facilityIdRef or buildingIdRef.',
          detectedAt: now.toISOString()
        });
      }
    }

    // 2. Uncontrolled Critical Hazards
    for (const h of records.hazards) {
      if ((h.assessedRiskLevel === 'CRITICAL' || h.assessedRiskLevel === 'EXTREME') && !h.hasActiveControls && !h.hasActiveException) {
        findings.push({
          id: `DIAG-UNCTRL-${h.id}`,
          tenantId: h.tenantId,
          campusScope: h.campusScope,
          findingCode: 'UNCONTROLLED_CRITICAL_HAZARD',
          severity: 'CRITICAL',
          category: 'UNCONTROLLED_HAZARD',
          entityType: 'HazardRegister',
          entityId: h.id,
          title: `Uncontrolled Critical Hazard: ${h.hazardCode}`,
          description: `Hazard ${h.title} is evaluated at ${h.assessedRiskLevel} risk without active controls or authorized exceptions.`,
          recommendedRemediation: 'Implement mandatory engineering/administrative controls immediately.',
          detectedAt: now.toISOString()
        });
      }
    }

    // 3. Expired Safety Exceptions
    for (const ex of records.exceptions) {
      if (new Date(ex.expiryDate) < now && ex.status === 'ACTIVE') {
        findings.push({
          id: `DIAG-EXP-EXC-${ex.id}`,
          tenantId: ex.tenantId,
          campusScope: ex.campusScope,
          findingCode: 'EXPIRED_SAFETY_EXCEPTION',
          severity: 'HIGH',
          category: 'EXPIRED_EXCEPTION',
          entityType: 'SafetyException',
          entityId: ex.id,
          title: `Expired Safety Exception: ${ex.exceptionCode}`,
          description: `Temporary safety exception expired on ${ex.expiryDate} and requires immediate re-assessment.`,
          recommendedRemediation: 'Revoke exception and re-verify primary safety control implementation.',
          detectedAt: now.toISOString()
        });
      }
    }

    // 4. Overdue Findings & CAPA
    for (const f of records.findings) {
      if (new Date(f.dueDate) < now && f.lifecycleState !== 'CLOSED' && f.lifecycleState !== 'VERIFIED') {
        findings.push({
          id: `DIAG-OVERDUE-FND-${f.id}`,
          tenantId: f.tenantId,
          campusScope: f.campusScope,
          findingCode: 'OVERDUE_FINDING',
          severity: f.severity === 'CRITICAL' || f.severity === 'IMMINENT_DANGER' ? 'CRITICAL' : 'HIGH',
          category: 'OVERDUE_CAPA',
          entityType: 'InspectionFinding',
          entityId: f.id,
          title: `Overdue Inspection Finding: ${f.findingTitle}`,
          description: `Inspection finding of severity ${f.severity} was due on ${f.dueDate}.`,
          recommendedRemediation: 'Escalate to responsible safety officer and execute remediation.',
          detectedAt: now.toISOString()
        });
      }
    }

    // 5. Overdue Corrective Actions
    for (const ca of records.correctiveActions) {
      if (new Date(ca.dueDate) < now && ca.status !== 'RESOLVED_VERIFIED') {
        findings.push({
          id: `DIAG-OVERDUE-CA-${ca.id}`,
          tenantId: ca.tenantId,
          campusScope: ca.campusScope,
          findingCode: 'OVERDUE_CORRECTIVE_ACTION',
          severity: ca.priority === 'URGENT' || ca.priority === 'HIGH' ? 'CRITICAL' : 'HIGH',
          category: 'OVERDUE_CAPA',
          entityType: 'CorrectiveAction',
          entityId: ca.id,
          title: `Overdue CAPA: ${ca.actionCode}`,
          description: `Corrective action ${ca.title} has passed due date ${ca.dueDate} without verified resolution.`,
          recommendedRemediation: 'Require immediate progress log and schedule verification walkthrough.',
          detectedAt: now.toISOString()
        });
      }
    }

    // 6. Fire & Life Safety Breaches
    for (const fl of records.fireLifeSafeties) {
      if (fl.hasBlockedExitFindings || !fl.isFireSuppressionActive || fl.complianceRating === 'NON_COMPLIANT') {
        findings.push({
          id: `DIAG-FLS-${fl.id}`,
          tenantId: fl.tenantId,
          campusScope: fl.campusScope,
          findingCode: 'LIFE_SAFETY_DEFICIT',
          severity: 'CRITICAL',
          category: 'LIFE_SAFETY_DEFICIT',
          entityType: 'FireLifeSafetyGovernance',
          entityId: fl.id,
          title: `Fire & Life Safety Deficit in Building ${fl.buildingIdRef}`,
          description: `Building has active life-safety non-compliance or inactive fire suppression.`,
          recommendedRemediation: 'Dispatch emergency facilities marshal to clear egress or certify suppression.',
          detectedAt: now.toISOString()
        });
      }
    }

    // 7. Telemetry Gaps / Insufficient Data
    for (const env of records.environmentals) {
      if (!env.isTelemetryAvailable || env.airQualityStatus === 'INSUFFICIENT_DATA') {
        findings.push({
          id: `DIAG-TEL-GAP-${env.id}`,
          tenantId: env.tenantId,
          campusScope: env.campusScope,
          findingCode: 'ENVIRONMENTAL_TELEMETRY_GAP',
          severity: 'MEDIUM',
          category: 'TELEMETRY_GAP',
          entityType: 'EnvironmentalHealthGovernance',
          entityId: env.id,
          title: `Environmental Telemetry Gap for Facility ${env.facilityIdRef}`,
          description: 'Authoritative environmental monitoring feed is currently unavailable (INSUFFICIENT DATA).',
          recommendedRemediation: 'Establish direct authoritative sensor gateway connection.',
          detectedAt: now.toISOString()
        });
      }
    }

    // 8. SoD Violations in Decisions
    for (const d of records.decisions) {
      if (d.proposerId && d.approverId && d.proposerId.toLowerCase() === d.approverId.toLowerCase()) {
        findings.push({
          id: `DIAG-SOD-${d.id}`,
          tenantId: d.tenantId,
          campusScope: d.campusScope,
          findingCode: 'SOD_SELF_APPROVAL_VIOLATION',
          severity: 'CRITICAL',
          category: 'SOD_VIOLATION',
          entityType: 'SafetyDecision',
          entityId: d.id,
          title: `Four-Eyes SoD Violation: ${d.title}`,
          description: `Decision was proposed and approved by identical actor (${d.proposerId}).`,
          recommendedRemediation: 'Revoke approval and submit to independent executive safety approver.',
          detectedAt: now.toISOString()
        });
      }
    }

    return findings;
  }
}
