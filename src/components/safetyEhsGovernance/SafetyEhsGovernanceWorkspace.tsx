import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Flame,
  Activity,
  CheckCircle2,
  XCircle,
  FileText,
  Search,
  Plus,
  Zap,
  Play,
  Building2,
  Users,
  HardHat,
  Sliders,
  Sparkles,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Award,
  BookOpen,
  HelpCircle,
  Clock,
  Radio,
  FileSpreadsheet,
  AlertCircle,
  Bell,
  Eye,
  Check,
  Shield,
  Layers,
  Thermometer,
  Wind,
  Droplets,
  Radiation,
  Beaker,
  HeartPulse,
  Truck,
  Building,
  RotateCcw
} from 'lucide-react';

import {
  SafetyGovernanceReference,
  HazardRegister,
  HazardObservation,
  RiskAssessment,
  RiskControl,
  SafetyInspection,
  InspectionFinding,
  CorrectiveAction,
  SafetyException,
  IncidentReference,
  EmergencyPreparednessGovernance,
  EmergencyPlanReference,
  EmergencyExercise,
  FireLifeSafetyGovernance,
  LaboratorySafetyGovernance,
  EnvironmentalHealthGovernance,
  TrainingComplianceObservation,
  ContractorSafetyGovernance,
  SafetyDecision,
  SafetySimulationScenario,
  SafetySimulationScenarioType,
  SafetyResilienceAssessment,
  SafetyDiagnosticFinding,
  HazardCategory,
  SafetyRiskLevel,
  HazardLifecycleState
} from '../../types/safetyEhsGovernance';

import { SafetyEhsGovernanceService } from '../../services/safetyEhsGovernanceService';
import { useAuth } from '../../context/AuthContext';

export const SafetyEhsGovernanceWorkspace: React.FC = () => {
  const { user } = useAuth();
  const currentTenantId = user?.tenantId || 'tenant-main';
  const currentActorId = user?.id || 'actor-ehs-lead';

  // Active Workspace Navigation View (13 Views)
  type WorkspaceView =
    | 'COMMAND'
    | 'HAZARD_REGISTRY'
    | 'RISK_CONTROLS'
    | 'INSPECTIONS'
    | 'FINDINGS_CAPA'
    | 'INCIDENTS'
    | 'EMERGENCY'
    | 'FIRE_LIFESAFETY'
    | 'LAB_SAFETY'
    | 'ENVIRONMENTAL'
    | 'TRAINING_CONTRACTORS'
    | 'RESILIENCE_SIM'
    | 'DIAGNOSTICS_AUDIT';

  const [activeView, setActiveView] = useState<WorkspaceView>('COMMAND');
  const [campusFilter, setCampusFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Mock State Seeded with Institutional Safety Data
  const [hazards, setHazards] = useState<HazardRegister[]>([
    {
      id: 'HAZ-001',
      tenantId: currentTenantId,
      campusScope: 'North Campus',
      hazardCode: 'HZ-CHEM-401',
      title: 'Flammable Solvent Storage in Chemistry Annex',
      category: 'CHEMICAL',
      lifecycleState: 'MONITORED',
      locationReference: {
        facilityIdRef: 'FAC-CHEM-01',
        buildingIdRef: 'BLD-SCI-A',
        spaceIdRef: 'RM-402',
        departmentIdRef: 'DEP-CHEM'
      },
      authoritativeEhsInventoryRef: 'CHEM-INV-8821',
      responsibleOwnerIdRef: 'usr-prof-williams',
      assessedRiskLevel: 'HIGH',
      hasActiveControls: true,
      hasActiveException: false,
      status: 'ACTIVE',
      createdAt: '2026-02-10T10:00:00Z',
      createdBy: 'usr-ehs-officer'
    },
    {
      id: 'HAZ-002',
      tenantId: currentTenantId,
      campusScope: 'Downtown Health Sciences',
      hazardCode: 'HZ-BIO-209',
      title: 'Biosafety Level 3 Viral Culture Storage Unit',
      category: 'BIOLOGICAL',
      lifecycleState: 'MONITORED',
      locationReference: {
        facilityIdRef: 'FAC-BIO-02',
        buildingIdRef: 'BLD-MED-B',
        spaceIdRef: 'LAB-BSL3-01',
        departmentIdRef: 'DEP-VIROL'
      },
      authoritativeEhsInventoryRef: 'BIO-SAMP-9904',
      responsibleOwnerIdRef: 'usr-dr-martinez',
      assessedRiskLevel: 'CRITICAL',
      hasActiveControls: true,
      hasActiveException: false,
      status: 'ACTIVE',
      createdAt: '2026-01-15T08:30:00Z',
      createdBy: 'usr-ehs-officer'
    },
    {
      id: 'HAZ-003',
      tenantId: currentTenantId,
      campusScope: 'North Campus',
      hazardCode: 'HZ-FIRE-104',
      title: 'High-Voltage Switchgear Room Thermal Overload',
      category: 'FIRE',
      lifecycleState: 'CONTROL_PLANNED',
      locationReference: {
        facilityIdRef: 'FAC-ENG-03',
        buildingIdRef: 'BLD-CENTRAL-PLANT',
        spaceIdRef: 'ELEC-VAULT-1',
        departmentIdRef: 'DEP-FACILITIES'
      },
      authoritativeEhsInventoryRef: 'ELEC-SWG-302',
      responsibleOwnerIdRef: 'usr-fac-engineer',
      assessedRiskLevel: 'CRITICAL',
      hasActiveControls: false,
      hasActiveException: false,
      status: 'ACTIVE',
      createdAt: '2026-03-01T14:00:00Z',
      createdBy: 'usr-ehs-officer'
    },
    {
      id: 'HAZ-004',
      tenantId: currentTenantId,
      campusScope: 'South Innovation Campus',
      hazardCode: 'HZ-RAD-101',
      title: 'Gamma Irradiator Research Unit',
      category: 'RADIATION',
      lifecycleState: 'MONITORED',
      locationReference: {
        facilityIdRef: 'FAC-RAD-01',
        buildingIdRef: 'BLD-PHYS-C',
        spaceIdRef: 'RM-BASE-04',
        departmentIdRef: 'DEP-PHYS'
      },
      authoritativeEhsInventoryRef: 'NRC-LIC-4491',
      responsibleOwnerIdRef: 'usr-rad-officer',
      assessedRiskLevel: 'HIGH',
      hasActiveControls: true,
      hasActiveException: false,
      status: 'ACTIVE',
      createdAt: '2026-02-01T09:00:00Z',
      createdBy: 'usr-ehs-officer'
    },
    {
      id: 'HAZ-005',
      tenantId: currentTenantId,
      campusScope: 'North Campus',
      hazardCode: 'HZ-ENV-301',
      title: 'Underground Fuel Oil Storage Tank Sump',
      category: 'ENVIRONMENTAL',
      lifecycleState: 'IDENTIFIED',
      locationReference: {
        facilityIdRef: 'FAC-UTIL-01',
        departmentIdRef: 'DEP-FACILITIES'
      },
      responsibleOwnerIdRef: 'usr-fac-engineer',
      assessedRiskLevel: 'MODERATE',
      hasActiveControls: false,
      hasActiveException: false,
      status: 'ACTIVE',
      createdAt: '2026-03-10T11:00:00Z',
      createdBy: 'usr-ehs-officer'
    }
  ]);

  const [inspections, setInspections] = useState<SafetyInspection[]>([
    {
      id: 'INSP-101',
      tenantId: currentTenantId,
      campusScope: 'North Campus',
      inspectionCode: 'INSP-2026-Q1-CHEM',
      title: 'Chemistry Laboratory Annual Safety Audit',
      facilityIdRef: 'FAC-CHEM-01',
      buildingIdRef: 'BLD-SCI-A',
      inspectionType: 'LAB_ANNUAL',
      leadInspectorIdRef: 'usr-inspector-clark',
      scheduledDate: '2026-03-15',
      completedDate: '2026-03-15',
      findingsCount: 3,
      criticalFindingsCount: 1,
      status: 'COMPLETED'
    },
    {
      id: 'INSP-102',
      tenantId: currentTenantId,
      campusScope: 'Downtown Health Sciences',
      inspectionCode: 'INSP-2026-FLS-MED',
      title: 'Medical Sciences Fire & Egress Inspection',
      facilityIdRef: 'FAC-BIO-02',
      buildingIdRef: 'BLD-MED-B',
      inspectionType: 'FIRE_LIFE_SAFETY',
      leadInspectorIdRef: 'usr-inspector-davis',
      scheduledDate: '2026-03-20',
      findingsCount: 2,
      criticalFindingsCount: 0,
      status: 'COMPLETED'
    },
    {
      id: 'INSP-103',
      tenantId: currentTenantId,
      campusScope: 'North Campus',
      inspectionCode: 'INSP-2026-PLANT-ELEC',
      title: 'Central Plant High-Voltage & Arc Flash Audit',
      facilityIdRef: 'FAC-ENG-03',
      buildingIdRef: 'BLD-CENTRAL-PLANT',
      inspectionType: 'ROUTINE_WALKTHROUGH',
      leadInspectorIdRef: 'usr-inspector-clark',
      scheduledDate: '2026-02-28',
      findingsCount: 1,
      criticalFindingsCount: 1,
      status: 'OVERDUE'
    }
  ]);

  const [findings, setFindings] = useState<InspectionFinding[]>([
    {
      id: 'FND-001',
      tenantId: currentTenantId,
      campusScope: 'North Campus',
      inspectionIdRef: 'INSP-101',
      hazardCategory: 'CHEMICAL',
      findingTitle: 'Fume Hood Face Velocity Below Minimum Statutory Threshold (60 FPM)',
      description: 'Fume hood #4 in Room 402 measured 45 FPM during face velocity audit.',
      severity: 'CRITICAL',
      lifecycleState: 'ACTION_IN_PROGRESS',
      responsibleOwnerIdRef: 'usr-prof-williams',
      dueDate: '2026-03-25',
      isOverdue: false,
      evidenceReferenceRef: 'DOC-CALIB-881'
    },
    {
      id: 'FND-002',
      tenantId: currentTenantId,
      campusScope: 'North Campus',
      inspectionIdRef: 'INSP-101',
      hazardCategory: 'FIRE',
      findingTitle: 'Secondary Egress Corridors Obstructed by Surplus Equipment',
      description: 'Stairwell B landing contains 3 pallets of outdated lab equipment narrowing egress path to 28 inches.',
      severity: 'SERIOUS',
      lifecycleState: 'OPEN',
      responsibleOwnerIdRef: 'usr-fac-engineer',
      dueDate: '2026-03-18',
      isOverdue: true
    },
    {
      id: 'FND-003',
      tenantId: currentTenantId,
      campusScope: 'Downtown Health Sciences',
      inspectionIdRef: 'INSP-102',
      hazardCategory: 'BIOLOGICAL',
      findingTitle: 'Eyewash Station Log Missing Weekly Flush Record',
      description: 'Room 204 eyewash inspection tag last stamped 4 weeks ago.',
      severity: 'MODERATE',
      lifecycleState: 'VERIFIED',
      responsibleOwnerIdRef: 'usr-dr-martinez',
      dueDate: '2026-03-22',
      isOverdue: false,
      evidenceReferenceRef: 'EVID-FLUSH-LOG-44',
      verifiedByIdRef: 'usr-inspector-davis',
      verifiedAt: '2026-03-22T15:00:00Z'
    }
  ]);

  const [correctiveActions, setCorrectiveActions] = useState<CorrectiveAction[]>([
    {
      id: 'CA-001',
      tenantId: currentTenantId,
      campusScope: 'North Campus',
      actionCode: 'CAPA-2026-044',
      findingIdRef: 'FND-001',
      actionType: 'CORRECTIVE',
      title: 'Recalibrate Exhaust Blower VFD & Replace HEPA Pre-Filters',
      description: 'Dispatch mechanical contractor to adjust damper actuators and balance flow.',
      priority: 'URGENT',
      actionOwnerIdRef: 'usr-fac-engineer',
      dueDate: '2026-03-25',
      isOverdue: false,
      status: 'IN_PROGRESS',
      createdAt: '2026-03-16T10:00:00Z'
    },
    {
      id: 'CA-002',
      tenantId: currentTenantId,
      campusScope: 'North Campus',
      actionCode: 'CAPA-2026-045',
      findingIdRef: 'FND-002',
      actionType: 'CORRECTIVE',
      title: 'Clear Stairwell B Egress Corridor and Relocate Pallets to Surplus Warehouse',
      description: 'Move pallets immediately to maintain 44-inch minimum clear passage.',
      priority: 'HIGH',
      actionOwnerIdRef: 'usr-fac-engineer',
      dueDate: '2026-03-18',
      isOverdue: true,
      status: 'ASSIGNED',
      createdAt: '2026-03-16T11:00:00Z'
    }
  ]);

  const [incidents, setIncidents] = useState<IncidentReference[]>([
    {
      id: 'INC-001',
      tenantId: currentTenantId,
      campusScope: 'North Campus',
      authoritativeIncidentIdRef: 'INC-SYS-9941',
      incidentTitle: 'Minor Acid Splash During Solution Decanting in Chem Lab 301',
      classification: 'FIRST_AID',
      lifecycleState: 'INVESTIGATION',
      facilityIdRef: 'FAC-CHEM-01',
      buildingIdRef: 'BLD-SCI-A',
      occurredAt: '2026-03-12T14:20:00Z',
      reportedAt: '2026-03-12T14:35:00Z',
      severityRating: 'MINOR',
      requiresRegulatoryReporting: false,
      investigationLeadIdRef: 'usr-ehs-officer',
      status: 'INVESTIGATING'
    },
    {
      id: 'INC-002',
      tenantId: currentTenantId,
      campusScope: 'Downtown Health Sciences',
      authoritativeIncidentIdRef: 'INC-SYS-9910',
      incidentTitle: 'Near Miss: Centrifuge Rotor Unbalance Interlock Activation',
      classification: 'NEAR_MISS',
      lifecycleState: 'CLOSED',
      facilityIdRef: 'FAC-BIO-02',
      buildingIdRef: 'BLD-MED-B',
      occurredAt: '2026-02-24T16:00:00Z',
      reportedAt: '2026-02-24T16:15:00Z',
      severityRating: 'MINOR',
      requiresRegulatoryReporting: false,
      investigationLeadIdRef: 'usr-dr-martinez',
      status: 'CLOSED'
    }
  ]);

  const [emergencyPlans, setEmergencyPlans] = useState<EmergencyPlanReference[]>([
    {
      id: 'PLAN-001',
      tenantId: currentTenantId,
      campusScope: 'North Campus',
      planCode: 'EAP-NC-FIRE-01',
      planTitle: 'North Campus Main Sciences Complex Fire & Hazard Evacuation Plan',
      scenarioType: 'FIRE',
      targetFacilityRefs: ['FAC-CHEM-01', 'FAC-ENG-03'],
      proposerId: 'usr-ehs-officer',
      approverId: 'usr-dean-safety',
      approvalDate: '2026-01-10',
      mandatoryAnnualReviewDueDate: '2027-01-10',
      status: 'APPROVED'
    },
    {
      id: 'PLAN-002',
      tenantId: currentTenantId,
      campusScope: 'Downtown Health Sciences',
      planCode: 'EAP-DOWNTOWN-BIO-02',
      planTitle: 'Downtown Biohazard Containment & Shelter-in-Place Protocol',
      scenarioType: 'BIOLOGICAL_RELEASE',
      targetFacilityRefs: ['FAC-BIO-02'],
      proposerId: 'usr-dr-martinez',
      approverId: 'usr-provost-vp',
      approvalDate: '2026-02-01',
      mandatoryAnnualReviewDueDate: '2027-02-01',
      status: 'APPROVED'
    }
  ]);

  const [fireLifeSafeties, setFireLifeSafeties] = useState<FireLifeSafetyGovernance[]>([
    {
      id: 'FLS-01',
      tenantId: currentTenantId,
      campusScope: 'North Campus',
      buildingIdRef: 'BLD-SCI-A',
      sprinklerSystemCertifiedDateRef: '2026-01-05',
      fireAlarmInspectionDateRef: '2026-02-12',
      fireExtinguisherInspectionDateRef: '2026-03-01',
      emergencyLightingBatteryTestedDateRef: '2026-01-20',
      fireDoorsIntegrityVerifiedDateRef: '2026-02-10',
      isFireSuppressionActive: true,
      hasBlockedExitFindings: true,
      complianceRating: 'CONDITIONALLY_COMPLIANT',
      status: 'WARNING'
    },
    {
      id: 'FLS-02',
      tenantId: currentTenantId,
      campusScope: 'Downtown Health Sciences',
      buildingIdRef: 'BLD-MED-B',
      sprinklerSystemCertifiedDateRef: '2026-02-18',
      fireAlarmInspectionDateRef: '2026-02-18',
      fireExtinguisherInspectionDateRef: '2026-02-18',
      emergencyLightingBatteryTestedDateRef: '2026-02-18',
      fireDoorsIntegrityVerifiedDateRef: '2026-02-18',
      isFireSuppressionActive: true,
      hasBlockedExitFindings: false,
      complianceRating: 'FULLY_COMPLIANT',
      status: 'COMPLIANT'
    }
  ]);

  const [environmentals, setEnvironmentals] = useState<EnvironmentalHealthGovernance[]>([
    {
      id: 'ENV-01',
      tenantId: currentTenantId,
      campusScope: 'North Campus',
      facilityIdRef: 'FAC-CHEM-01',
      airQualityStatus: 'NORMAL',
      waterQualityTestedDateRef: '2026-02-10',
      hazardousWasteManifestRef: 'EPA-MAN-2026-091',
      noiseExposureClassification: 'SAFE',
      indoorEnvironmentalQualityScore: 92,
      isTelemetryAvailable: true,
      status: 'COMPLIANT'
    },
    {
      id: 'ENV-02',
      tenantId: currentTenantId,
      campusScope: 'South Innovation Campus',
      facilityIdRef: 'FAC-RAD-01',
      airQualityStatus: 'INSUFFICIENT_DATA',
      waterQualityTestedDateRef: undefined,
      hazardousWasteManifestRef: undefined,
      noiseExposureClassification: 'SAFE',
      indoorEnvironmentalQualityScore: undefined,
      isTelemetryAvailable: false,
      status: 'OBSERVATION_REQUIRED'
    }
  ]);

  const [exceptions, setExceptions] = useState<SafetyException[]>([
    {
      id: 'EXC-001',
      tenantId: currentTenantId,
      campusScope: 'North Campus',
      exceptionCode: 'EXC-2026-08',
      exceptionType: 'TEMPORARY_CONTROL_DEVIATION',
      hazardIdRef: 'HAZ-001',
      businessRationale: 'Temporary solvent decanting during central supply replenishment.',
      riskAssessmentSummary: 'Restricted to certified technicians with organic vapor respirators and spark-proof fans.',
      compensatingControl: 'Continuous portable VOC detector and dedicated fire watcher stationed.',
      proposerId: 'usr-prof-williams',
      approverId: 'usr-dean-safety',
      effectiveDate: '2026-03-01',
      expiryDate: '2026-04-01',
      status: 'ACTIVE',
      createdAt: '2026-03-01T09:00:00Z'
    }
  ]);

  const [decisions, setDecisions] = useState<SafetyDecision[]>([
    {
      id: 'DEC-001',
      tenantId: currentTenantId,
      campusScope: 'North Campus',
      decisionType: 'HAZARD_ACCEPTANCE',
      title: 'Conditional Approval for Chemistry Annex Solvent Modernization Plan',
      description: 'Accepted residual risk under mandatory engineering ventilation upgrades.',
      targetRefId: 'HAZ-001',
      proposerId: 'usr-ehs-officer',
      approverId: 'usr-dean-safety',
      status: 'APPROVED',
      decisionDate: '2026-02-15',
      approvedAt: '2026-02-16T10:00:00Z',
      createdAt: '2026-02-15T14:00:00Z'
    }
  ]);

  // Simulation Sandbox State
  const [activeSimulation, setActiveSimulation] = useState<SafetySimulationScenario | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [selectedSimType, setSelectedSimType] = useState<SafetySimulationScenarioType>('MAJOR_FIRE');

  // Diagnostics Scan State
  const [diagnosticFindings, setDiagnosticFindings] = useState<SafetyDiagnosticFinding[]>([]);
  const [hasRunDiagnostics, setHasRunDiagnostics] = useState<boolean>(false);

  // New Hazard Creation Modal State
  const [showAddHazardModal, setShowAddHazardModal] = useState<boolean>(false);
  const [newHazardForm, setNewHazardForm] = useState<{
    hazardCode: string;
    title: string;
    category: HazardCategory;
    campusScope: string;
    facilityIdRef: string;
    buildingIdRef: string;
    departmentIdRef: string;
    responsibleOwnerIdRef: string;
    likelihood: number;
    severity: number;
  }>({
    hazardCode: 'HZ-NEW-' + Math.floor(Math.random() * 1000),
    title: '',
    category: 'CHEMICAL',
    campusScope: 'North Campus',
    facilityIdRef: 'FAC-SCI-01',
    buildingIdRef: 'BLD-SCI-A',
    departmentIdRef: 'DEP-SCI',
    responsibleOwnerIdRef: 'usr-faculty-lead',
    likelihood: 3,
    severity: 3
  });

  // Filtered lists based on search and campus
  const filteredHazards = useMemo(() => {
    return hazards.filter(h => {
      const matchCampus = campusFilter === 'ALL' || h.campusScope === campusFilter;
      const matchSearch = searchTerm === '' ||
        h.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.hazardCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.category.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCampus && matchSearch;
    });
  }, [hazards, campusFilter, searchTerm]);

  // Computed Governance Metrics
  const metrics = useMemo(() => {
    const criticalHazards = hazards.filter(h => h.assessedRiskLevel === 'CRITICAL' || h.assessedRiskLevel === 'EXTREME').length;
    const uncontrolledHazards = hazards.filter(h => !h.hasActiveControls && !h.hasActiveException).length;
    const overdueFindings = findings.filter(f => f.isOverdue || (new Date(f.dueDate) < new Date() && f.lifecycleState !== 'CLOSED' && f.lifecycleState !== 'VERIFIED')).length;
    const overdueCapa = correctiveActions.filter(ca => ca.isOverdue || (new Date(ca.dueDate) < new Date() && ca.status !== 'RESOLVED_VERIFIED')).length;
    const activeExceptionsCount = exceptions.filter(e => e.status === 'ACTIVE').length;
    const flsBreaches = fireLifeSafeties.filter(f => f.status === 'WARNING' || f.status === 'BREACH').length;

    const resilienceCalc = SafetyEhsGovernanceService.calculateSafetyResilience({
      emergencyResponseCapability: 82,
      criticalHazardExposure: criticalHazards * 15,
      controlRedundancy: 78,
      emergencyResourceAvailability: 85,
      evacuationReadiness: flsBreaches > 0 ? 65 : 90,
      criticalPersonDependency: 25,
      facilityDependency: 30,
      communicationReadiness: 88,
      recoveryCapability: 75
    });

    return {
      criticalHazards,
      uncontrolledHazards,
      overdueFindings,
      overdueCapa,
      activeExceptionsCount,
      flsBreaches,
      resilienceRating: resilienceCalc.overallRating,
      resilienceScore: resilienceCalc.compositeScore
    };
  }, [hazards, findings, correctiveActions, exceptions, fireLifeSafeties]);

  // Run Diagnostics Handler
  const handleRunDiagnostics = () => {
    const res = SafetyEhsGovernanceService.runSafetyDiagnostics({
      hazards,
      assessments: [],
      controls: [],
      inspections,
      findings,
      correctiveActions,
      exceptions,
      emergencyPlans,
      fireLifeSafeties,
      trainings: [],
      contractors: [],
      environmentals,
      decisions
    });
    setDiagnosticFindings(res);
    setHasRunDiagnostics(true);
    setNotification({
      message: `Diagnostic Engine complete: ${res.length} governance findings identified.`,
      type: res.length > 0 ? 'info' : 'success'
    });
  };

  // Run Simulation Handler
  const handleExecuteSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const sim = SafetyEhsGovernanceService.runIsolatedSafetySimulation(selectedSimType, {
        tenantId: currentTenantId,
        campusScope: campusFilter === 'ALL' ? 'North Campus' : campusFilter,
        buildingCount: 3,
        estimatedPopulation: 650,
        hazardousChemicalPresent: true,
        suppressionSystemFunctional: true,
        evacuationDelayMinutes: 4,
        executedBy: currentActorId
      });
      setActiveSimulation(sim);
      setIsSimulating(false);
      setNotification({
        message: `Simulation "${selectedSimType}" completed in isolated memory sandbox.`,
        type: 'success'
      });
    }, 400);
  };

  // Submit New Hazard Handler with deterministic scoring
  const handleCreateHazard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHazardForm.title.trim()) {
      setNotification({ message: 'Hazard title is required.', type: 'error' });
      return;
    }

    const { score, level } = SafetyEhsGovernanceService.calculateDeterministicRiskScore({
      likelihood: newHazardForm.likelihood,
      severity: newHazardForm.severity
    });

    const newH: HazardRegister = {
      id: `HAZ-${Date.now()}`,
      tenantId: currentTenantId,
      campusScope: newHazardForm.campusScope,
      hazardCode: newHazardForm.hazardCode,
      title: newHazardForm.title,
      category: newHazardForm.category,
      lifecycleState: 'IDENTIFIED',
      locationReference: {
        facilityIdRef: newHazardForm.facilityIdRef,
        buildingIdRef: newHazardForm.buildingIdRef,
        departmentIdRef: newHazardForm.departmentIdRef
      },
      responsibleOwnerIdRef: newHazardForm.responsibleOwnerIdRef,
      assessedRiskLevel: level,
      hasActiveControls: false,
      hasActiveException: false,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      createdBy: currentActorId
    };

    setHazards([newH, ...hazards]);
    setShowAddHazardModal(false);
    setNotification({
      message: `Hazard ${newH.hazardCode} logged with deterministic risk tier ${level} (score ${score}).`,
      type: 'success'
    });
  };

  return (
    <div id="safety-governance-root" className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-6 font-sans">
      {/* Header Bar */}
      <div id="safety-header" className="flex flex-col lg:flex-row lg:items-center lg:justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-600/20 border border-rose-500/40 rounded-xl text-rose-400">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-white">Institutional Safety & Life-Safety Governance</h1>
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-rose-950 text-rose-300 border border-rose-800">
                  Phase 7.64
                </span>
                <span className="px-2.5 py-0.5 text-xs font-mono rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  mod_safety_ehs_governance
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-0.5">
                Authoritative EHS, Occupational Safety, Life-Safety Compliance &amp; Emergency Preparedness Control Plane
              </p>
            </div>
          </div>
        </div>

        {/* Global Action & Campus Filter Bar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs">
            <span className="text-slate-400 mr-2">Campus Scope:</span>
            <select
              value={campusFilter}
              onChange={(e) => setCampusFilter(e.target.value)}
              className="bg-transparent text-slate-200 font-medium focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900">All Campuses</option>
              <option value="North Campus" className="bg-slate-900">North Campus</option>
              <option value="Downtown Health Sciences" className="bg-slate-900">Downtown Health Sciences</option>
              <option value="South Innovation Campus" className="bg-slate-900">South Innovation Campus</option>
            </select>
          </div>

          <button
            id="btn-run-diagnostics"
            onClick={handleRunDiagnostics}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-medium transition"
          >
            <Activity className="w-3.5 h-3.5" />
            Run Safety Diagnostics
          </button>

          <button
            id="btn-new-hazard"
            onClick={() => setShowAddHazardModal(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold shadow-sm transition"
          >
            <Plus className="w-3.5 h-3.5" />
            Log Hazard Observation
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className={`mt-4 p-3 rounded-lg border text-xs flex items-center justify-between transition-all ${
          notification.type === 'success'
            ? 'bg-emerald-950/80 border-emerald-800 text-emerald-300'
            : notification.type === 'error'
            ? 'bg-rose-950/80 border-rose-800 text-rose-300'
            : 'bg-blue-950/80 border-blue-800 text-blue-300'
        }`}>
          <div className="flex items-center gap-2">
            {notification.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            {notification.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400" />}
            {notification.type === 'info' && <Zap className="w-4 h-4 text-blue-400" />}
            <span>{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-white text-sm font-bold">×</button>
        </div>
      )}

      {/* Executive Key Performance & Risk Banner */}
      <div id="safety-kpi-banner" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Critical Hazards</span>
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="text-xl font-bold text-rose-400 mt-1">{metrics.criticalHazards}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">High/Extreme Risk Tier</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Uncontrolled</span>
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-amber-400 mt-1">{metrics.uncontrolledHazards}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">No Active Controls</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Overdue Findings</span>
            <Clock className="w-3.5 h-3.5 text-orange-400" />
          </div>
          <div className="text-xl font-bold text-orange-400 mt-1">{metrics.overdueFindings}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Inspection Breaches</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Overdue CAPA</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-yellow-400" />
          </div>
          <div className="text-xl font-bold text-yellow-400 mt-1">{metrics.overdueCapa}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Corrective Action Gaps</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Life-Safety Warning</span>
            <Flame className="w-3.5 h-3.5 text-red-400" />
          </div>
          <div className="text-xl font-bold text-red-400 mt-1">{metrics.flsBreaches}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Egress / Suppression Deficits</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Resilience Rating</span>
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-lg font-bold text-emerald-400 mt-1 flex items-center gap-1.5">
            {metrics.resilienceRating}
            <span className="text-xs font-normal text-slate-400">({metrics.resilienceScore}/100)</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Preparedness Assurance</div>
        </div>
      </div>

      {/* View Navigation Tabs (13 Comprehensive Views) */}
      <div id="safety-nav-tabs" className="flex items-center gap-1.5 mt-5 pb-2 overflow-x-auto border-b border-slate-800 text-xs scrollbar-thin">
        {[
          { id: 'COMMAND', label: '1. Executive Command', icon: Sparkles },
          { id: 'HAZARD_REGISTRY', label: '2. Hazard Registry', icon: AlertTriangle },
          { id: 'RISK_CONTROLS', label: '3. Risk & Controls', icon: Sliders },
          { id: 'INSPECTIONS', label: '4. Inspections', icon: FileSpreadsheet },
          { id: 'FINDINGS_CAPA', label: '5. Findings & CAPA', icon: CheckCircle2 },
          { id: 'INCIDENTS', label: '6. Incident Governance', icon: ShieldAlert },
          { id: 'EMERGENCY', label: '7. Emergency Preparedness', icon: Bell },
          { id: 'FIRE_LIFESAFETY', label: '8. Fire & Life Safety', icon: Flame },
          { id: 'LAB_SAFETY', label: '9. Lab & High-Hazard', icon: Beaker },
          { id: 'ENVIRONMENTAL', label: '10. Environmental Health', icon: Wind },
          { id: 'TRAINING_CONTRACTORS', label: '11. Training & Contractors', icon: HardHat },
          { id: 'RESILIENCE_SIM', label: '12. Resilience & Simulation', icon: Play },
          { id: 'DIAGNOSTICS_AUDIT', label: '13. Diagnostics & Audit', icon: Activity }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeView === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id as WorkspaceView)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium whitespace-nowrap transition ${
                isActive
                  ? 'bg-rose-600/20 text-rose-300 border border-rose-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main View Render Area */}
      <div id="safety-view-content" className="mt-5">
        {/* VIEW 1: EXECUTIVE COMMAND */}
        {activeView === 'COMMAND' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Left 2 Cols: Executive Posture */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                      <Shield className="w-4 h-4 text-rose-400" />
                      Institutional Safety Posture &amp; Control Plane Integrity
                    </h3>
                    <span className="text-[11px] text-slate-400">Reference-Only Governance Architecture</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                    <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
                      <div className="text-xs text-slate-400">Hazard Catalog Coverage</div>
                      <div className="text-lg font-bold text-white mt-1">100% Governed</div>
                      <p className="text-[11px] text-slate-500 mt-1">5 Active Registers across 19 Statutory Hazard Classes</p>
                    </div>
                    <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
                      <div className="text-xs text-slate-400">Life-Safety Compliance</div>
                      <div className="text-lg font-bold text-amber-400 mt-1">1 Warning</div>
                      <p className="text-[11px] text-slate-500 mt-1">Stairwell B obstruction in Chemistry Annex</p>
                    </div>
                    <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
                      <div className="text-xs text-slate-400">Emergency Readiness</div>
                      <div className="text-lg font-bold text-emerald-400 mt-1">Operational</div>
                      <p className="text-[11px] text-slate-500 mt-1">2 Approved Multi-Hazard Plans in effect</p>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-rose-950/30 border border-rose-800/40 rounded-lg">
                    <div className="text-xs font-semibold text-rose-300 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4" />
                      Authoritative System Boundary Notice
                    </div>
                    <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                      This control plane maintains strict reference-only linkages. Chemical inventories are referenced via ChemTracker IDs, occupational health clearances via encrypted health references, and fire alarms via building automation keys. Zero clinical health or duplicate master inventory records are stored locally.
                    </p>
                  </div>
                </div>

                {/* Priority Operational Gaps */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    Immediate Action Queue (Critical Hazards &amp; Overdue CAPA)
                  </h3>
                  <div className="space-y-2.5">
                    {findings.filter(f => f.isOverdue || f.severity === 'CRITICAL').map((f) => (
                      <div key={f.id} className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 flex items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              f.severity === 'CRITICAL' ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                            }`}>
                              {f.severity}
                            </span>
                            <span className="text-xs font-semibold text-white">{f.findingTitle}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-1">{f.description}</p>
                        </div>
                        <div className="text-right whitespace-nowrap">
                          <span className="text-[10px] text-rose-400 block font-medium">Due: {f.dueDate}</span>
                          <span className="text-[10px] text-slate-500">{f.lifecycleState}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Col: High-Hazard Special Oversight & Environmental Status */}
              <div className="space-y-4">
                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                    <Beaker className="w-4 h-4 text-purple-400" />
                    Specialized Safety Classifications
                  </h3>
                  <div className="space-y-3 mt-4 text-xs">
                    <div className="flex justify-between items-center p-2 bg-slate-950 rounded border border-slate-800">
                      <span className="text-slate-300">Biosafety (BSL-3/BSL-2)</span>
                      <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded text-[10px]">Active IBC Permit</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-slate-950 rounded border border-slate-800">
                      <span className="text-slate-300">Radiation Irradiator (RSC)</span>
                      <span className="px-2 py-0.5 bg-blue-950 text-blue-300 border border-blue-800 rounded text-[10px]">NRC Lic-4491 Active</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-slate-950 rounded border border-slate-800">
                      <span className="text-slate-300">Fume Hood Certifications</span>
                      <span className="px-2 py-0.5 bg-amber-950 text-amber-300 border border-amber-800 rounded text-[10px]">1 Recalibration Req</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-slate-950 rounded border border-slate-800">
                      <span className="text-slate-300">Hazardous Waste (&lt;90 Day Limit)</span>
                      <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded text-[10px]">Compliant (Day 42)</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                    <Wind className="w-4 h-4 text-teal-400" />
                    Environmental Sensor Gateways
                  </h3>
                  <div className="space-y-3 mt-4 text-xs">
                    <div className="p-2.5 bg-slate-950 rounded border border-slate-800">
                      <div className="flex justify-between text-slate-300 font-medium">
                        <span>North Campus Chemistry Annex</span>
                        <span className="text-emerald-400">Normal (92 IEQ)</span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1">Air: PM2.5 (8 µg/m³), CO2 (540 ppm), VOC (Low)</div>
                    </div>
                    <div className="p-2.5 bg-slate-950 rounded border border-slate-800">
                      <div className="flex justify-between text-slate-300 font-medium">
                        <span>South Innovation Campus Rad Lab</span>
                        <span className="text-slate-500 font-mono">INSUFFICIENT DATA</span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1">Authoritative gateway offline. Sensor readings truthful &amp; uninvented.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: HAZARD REGISTRY */}
        {activeView === 'HAZARD_REGISTRY' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search hazard title, code, category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
              </div>
              <div className="text-xs text-slate-400">
                Displaying {filteredHazards.length} of {hazards.length} Hazards
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/80">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 font-medium">
                  <tr>
                    <th className="p-3">Hazard Code</th>
                    <th className="p-3">Title &amp; Category</th>
                    <th className="p-3">Location Ref</th>
                    <th className="p-3">Risk Level</th>
                    <th className="p-3">Lifecycle State</th>
                    <th className="p-3">Controls / Exception</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredHazards.map((h) => (
                    <tr key={h.id} className="hover:bg-slate-800/40 transition">
                      <td className="p-3 font-mono font-bold text-rose-400">{h.hazardCode}</td>
                      <td className="p-3">
                        <div className="font-semibold text-white">{h.title}</div>
                        <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded mr-2">{h.category}</span>
                        {h.authoritativeEhsInventoryRef && (
                          <span className="text-[10px] font-mono text-purple-400">Ref: {h.authoritativeEhsInventoryRef}</span>
                        )}
                      </td>
                      <td className="p-3 text-slate-300">
                        <div>{h.campusScope}</div>
                        <div className="text-[10px] text-slate-500">{h.locationReference.buildingIdRef || h.locationReference.facilityIdRef || 'Orphan Ref'}</div>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          h.assessedRiskLevel === 'CRITICAL' || h.assessedRiskLevel === 'EXTREME'
                            ? 'bg-rose-950 text-rose-300 border border-rose-800'
                            : h.assessedRiskLevel === 'HIGH'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        }`}>
                          {h.assessedRiskLevel}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded text-[10px] font-mono">
                          {h.lifecycleState}
                        </span>
                      </td>
                      <td className="p-3">
                        {h.hasActiveControls ? (
                          <span className="text-emerald-400 text-[11px] flex items-center gap-1">
                            <Check className="w-3 h-3" /> Controls Active
                          </span>
                        ) : h.hasActiveException ? (
                          <span className="text-amber-400 text-[11px] flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Governed Exception
                          </span>
                        ) : (
                          <span className="text-rose-400 text-[11px] flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> Uncontrolled
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => setNotification({ message: `Hazard ${h.hazardCode} selected for deep audit inspection.`, type: 'info' })}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] transition"
                        >
                          Audit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW 3: RISK & CONTROLS */}
        {activeView === 'RISK_CONTROLS' && (
          <div className="space-y-5">
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-2">
                <Sliders className="w-4 h-4 text-rose-400" />
                Hierarchy of Controls Governance Matrix
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Prioritizing Elimination, Substitution, and Engineering over Administrative and PPE.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                {[
                  { rank: '1. Elimination', color: 'border-emerald-600 bg-emerald-950/30', desc: 'Physically remove the hazard from workflow' },
                  { rank: '2. Substitution', color: 'border-teal-600 bg-teal-950/30', desc: 'Replace hazard with safer alternative material' },
                  { rank: '3. Engineering', color: 'border-blue-600 bg-blue-950/30', desc: 'Isolate personnel with fume hoods, interlocks & dampers' },
                  { rank: '4. Administrative', color: 'border-amber-600 bg-amber-950/30', desc: 'SOPs, mandatory training, and signage' },
                  { rank: '5. PPE Safeguards', color: 'border-rose-600 bg-rose-950/30', desc: 'Respirators, safety goggles, cryo gloves' }
                ].map((tier, idx) => (
                  <div key={idx} className={`p-3 rounded-lg border ${tier.color} text-xs`}>
                    <div className="font-bold text-white">{tier.rank}</div>
                    <p className="text-[11px] text-slate-300 mt-1">{tier.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Governed Exceptions & Waivers (With Four-Eyes & Bounded Expiry) */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-semibold text-white">Active Safety Exceptions &amp; Variances</h3>
                  <p className="text-xs text-slate-400">Strictly bounded expiries — zero indefinite exceptions allowed under SoD.</p>
                </div>
                <span className="px-2 py-0.5 bg-amber-950 text-amber-300 border border-amber-800 rounded text-xs font-mono">
                  {exceptions.length} Active
                </span>
              </div>
              <div className="space-y-3 mt-4">
                {exceptions.map((ex) => (
                  <div key={ex.id} className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-lg text-xs space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-amber-400 font-mono">{ex.exceptionCode}</span>
                      <span className="text-slate-400 text-[11px]">Expires: {ex.expiryDate}</span>
                    </div>
                    <div className="font-semibold text-white">{ex.businessRationale}</div>
                    <div className="p-2 bg-slate-900 rounded border border-slate-800 text-[11px] text-slate-300">
                      <strong className="text-slate-200">Compensating Safeguard:</strong> {ex.compensatingControl}
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500 pt-1">
                      <span>Proposer: {ex.proposerId}</span>
                      <span>Approver (Four-Eyes Verified): {ex.approverId}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 4: INSPECTIONS */}
        {activeView === 'INSPECTIONS' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              <div>
                <h3 className="text-sm font-semibold text-white">Safety Inspections &amp; Statutory Audits</h3>
                <p className="text-xs text-slate-400">Scheduled institutional walkthroughs, lab audits, and fire-life safety inspections.</p>
              </div>
              <button
                onClick={() => setNotification({ message: 'New inspection scheduled and assigned.', type: 'success' })}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded text-xs font-medium"
              >
                Schedule Inspection
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {inspections.map((insp) => (
                <div key={insp.id} className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-xs space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-mono font-bold text-rose-400">{insp.inspectionCode}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      insp.status === 'COMPLETED' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300 border border-rose-800'
                    }`}>
                      {insp.status}
                    </span>
                  </div>
                  <div className="font-semibold text-white text-sm">{insp.title}</div>
                  <div className="text-slate-400 space-y-1 text-[11px]">
                    <div>Type: {insp.inspectionType}</div>
                    <div>Facility: {insp.facilityIdRef} ({insp.campusScope})</div>
                    <div>Date: {insp.completedDate || insp.scheduledDate}</div>
                    <div>Lead Inspector: {insp.leadInspectorIdRef}</div>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-800 text-[11px]">
                    <span>Total Findings: <strong>{insp.findingsCount}</strong></span>
                    <span className="text-rose-400 font-medium">Critical: {insp.criticalFindingsCount}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 5: FINDINGS & CAPA */}
        {activeView === 'FINDINGS_CAPA' && (
          <div className="space-y-5">
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Corrective &amp; Preventive Action (CAPA) Lifecycle Engine
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-3">Action Code</th>
                      <th className="p-3">Title &amp; Target Finding</th>
                      <th className="p-3">Priority</th>
                      <th className="p-3">Owner</th>
                      <th className="p-3">Due Date</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Verification</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {correctiveActions.map((ca) => (
                      <tr key={ca.id} className="hover:bg-slate-800/40 transition">
                        <td className="p-3 font-mono font-bold text-rose-400">{ca.actionCode}</td>
                        <td className="p-3">
                          <div className="font-semibold text-white">{ca.title}</div>
                          <div className="text-[10px] text-slate-400">{ca.description}</div>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            ca.priority === 'URGENT' ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                          }`}>
                            {ca.priority}
                          </span>
                        </td>
                        <td className="p-3 text-slate-300">{ca.actionOwnerIdRef}</td>
                        <td className="p-3">
                          <span className={ca.isOverdue ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                            {ca.dueDate} {ca.isOverdue && '(OVERDUE)'}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded text-[10px] font-mono">
                            {ca.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => {
                              const res = SafetyEhsGovernanceService.validateFindingTransition('ACTION_IN_PROGRESS', 'VERIFIED', true);
                              if (res.valid) {
                                setNotification({ message: `CAPA ${ca.actionCode} independent verification approved.`, type: 'success' });
                              }
                            }}
                            className="px-2.5 py-1 bg-emerald-700/30 hover:bg-emerald-700/50 text-emerald-300 border border-emerald-600/40 rounded text-[11px]"
                          >
                            Verify &amp; Close
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 6: INCIDENTS */}
        {activeView === 'INCIDENTS' && (
          <div className="space-y-4">
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-white">Institutional Incident Governance &amp; Near-Miss Register</h3>
                  <p className="text-xs text-slate-400">Reference-only linkage to CMMS and external regulatory reporting.</p>
                </div>
                <button
                  onClick={() => setNotification({ message: 'Near miss report initialized.', type: 'info' })}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs"
                >
                  Report Near Miss
                </button>
              </div>

              <div className="space-y-3">
                {incidents.map((inc) => (
                  <div key={inc.id} className="p-4 bg-slate-950/80 border border-slate-800 rounded-lg text-xs space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-rose-400">{inc.authoritativeIncidentIdRef}</span>
                        <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded text-[10px] font-mono">
                          {inc.classification}
                        </span>
                      </div>
                      <span className="text-slate-500 text-[11px]">{inc.occurredAt}</span>
                    </div>
                    <div className="text-sm font-semibold text-white">{inc.incidentTitle}</div>
                    <div className="flex flex-wrap items-center gap-4 text-slate-400 text-[11px]">
                      <span>Location: {inc.facilityIdRef} ({inc.campusScope})</span>
                      <span>Severity: <strong>{inc.severityRating}</strong></span>
                      <span>Regulatory Reporting: {inc.requiresRegulatoryReporting ? 'Required' : 'Exempt'}</span>
                      <span>Lifecycle: <strong className="text-slate-300">{inc.lifecycleState}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 7: EMERGENCY PREPAREDNESS */}
        {activeView === 'EMERGENCY' && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {emergencyPlans.map((p) => (
                <div key={p.id} className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 text-xs space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-mono font-bold text-rose-400">{p.planCode}</span>
                    <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded text-[10px]">
                      {p.status}
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-white">{p.planTitle}</div>
                  <div className="text-slate-400 space-y-1 text-[11px]">
                    <div>Scenario: <strong>{p.scenarioType}</strong></div>
                    <div>Target Facilities: {p.targetFacilityRefs.join(', ')}</div>
                    <div>Annual Review Due: {p.mandatoryAnnualReviewDueDate}</div>
                  </div>
                  <div className="pt-2 border-t border-slate-800 flex justify-between text-[10px] text-slate-500">
                    <span>Proposer: {p.proposerId}</span>
                    <span>Approver: {p.approverId}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 8: FIRE & LIFE SAFETY */}
        {activeView === 'FIRE_LIFESAFETY' && (
          <div className="space-y-4">
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Flame className="w-4 h-4 text-red-400" />
                Fire Protection, Alarm &amp; Emergency Egress Assurance
              </h3>
              <div className="space-y-3">
                {fireLifeSafeties.map((fl) => (
                  <div key={fl.id} className="p-4 bg-slate-950/80 border border-slate-800 rounded-lg text-xs space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-white text-sm">Building: {fl.buildingIdRef} ({fl.campusScope})</span>
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-semibold ${
                        fl.status === 'COMPLIANT' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}>
                        {fl.complianceRating}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-400 mt-2">
                      <div>Sprinklers: <strong className="text-slate-200">{fl.sprinklerSystemCertifiedDateRef}</strong></div>
                      <div>Fire Alarms: <strong className="text-slate-200">{fl.fireAlarmInspectionDateRef}</strong></div>
                      <div>Extinguishers: <strong className="text-slate-200">{fl.fireExtinguisherInspectionDateRef}</strong></div>
                      <div>Emergency Lights: <strong className="text-slate-200">{fl.emergencyLightingBatteryTestedDateRef}</strong></div>
                    </div>
                    {fl.hasBlockedExitFindings && (
                      <div className="p-2 bg-rose-950/40 border border-rose-800/40 rounded text-rose-300 text-[11px] flex items-center gap-2 mt-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        Active finding: Obstructed secondary egress stairs reported in building log.
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 9: LAB & HIGH-HAZARD */}
        {activeView === 'LAB_SAFETY' && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 text-xs space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Beaker className="w-4 h-4 text-purple-400" />
              Laboratory, Biohazard &amp; Radiation High-Hazard Governance
            </h3>
            <p className="text-slate-400">
              Institutional oversight for Biosafety Levels 1-4, IBC protocols, chemical hygiene plans, and NRC radiation licenses.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                <div className="font-bold text-white text-sm">Biosafety Level 3 Virology Suite (LAB-BSL3-01)</div>
                <div className="text-[11px] text-slate-400">IBC Approval Ref: IBC-2026-VIR-09</div>
                <div className="text-[11px] text-emerald-400">Negative Pressure Differential: Verified Active</div>
                <div className="text-[11px] text-slate-400">Medical Surveillance: Mandated for all cleared staff</div>
              </div>
              <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                <div className="font-bold text-white text-sm">Gamma Irradiator Facility (RM-BASE-04)</div>
                <div className="text-[11px] text-slate-400">NRC License Ref: NRC-LIC-4491</div>
                <div className="text-[11px] text-emerald-400">Quarterly Wipe Test: Pass (02/01/2026)</div>
                <div className="text-[11px] text-slate-400">Dosimetry Badge Monitoring: 100% Active</div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 10: ENVIRONMENTAL HEALTH */}
        {activeView === 'ENVIRONMENTAL' && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 text-xs space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Wind className="w-4 h-4 text-teal-400" />
              Environmental Health, Air Quality &amp; Hazardous Waste Manifests
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {environmentals.map((env) => (
                <div key={env.id} className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white">Facility: {env.facilityIdRef}</span>
                    <span className="text-[11px] text-slate-400">{env.campusScope}</span>
                  </div>
                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Air Quality Status:</span>
                      <span className={env.isTelemetryAvailable ? 'text-emerald-400 font-semibold' : 'text-slate-500 font-mono'}>
                        {env.airQualityStatus}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Hazardous Waste Manifest:</span>
                      <span className="text-slate-200 font-mono">{env.hazardousWasteManifestRef || 'INSUFFICIENT DATA'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Noise Exposure Class:</span>
                      <span className="text-slate-200">{env.noiseExposureClassification}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 11: TRAINING & CONTRACTORS */}
        {activeView === 'TRAINING_CONTRACTORS' && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 text-xs space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <HardHat className="w-4 h-4 text-yellow-400" />
              Safety Competency &amp; Contractor High-Risk Work Authorization
            </h3>
            <p className="text-slate-400">
              Integrating with Phase 7.59 Human Capital and Phase 7.61 Procurement for vendor safety qualifications and high-risk work permits.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                <div className="font-bold text-white text-sm">Contractor: Apex Industrial HVAC Services</div>
                <div className="text-[11px] text-slate-400">Vendor Ref: VEND-4491 (Insured to $10M)</div>
                <div className="text-[11px] text-emerald-400">Site Safety Induction: Certified (12 Technicians)</div>
                <div className="text-[11px] text-amber-400">Active High-Risk Permit: Confined Space &amp; Hot Work (Switchgear Room)</div>
              </div>
              <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                <div className="font-bold text-white text-sm">Mandatory Lab Safety Training (EHS-101)</div>
                <div className="text-[11px] text-slate-400">Assigned Personnel: 450</div>
                <div className="text-[11px] text-emerald-400">Compliance Rate: 98.2% Active</div>
                <div className="text-[11px] text-slate-400">Refresher Interval: Annual (365 Days)</div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 12: RESILIENCE & SIMULATION SANDBOX */}
        {activeView === 'RESILIENCE_SIM' && (
          <div className="space-y-5">
            <div className="bg-rose-950/40 border border-rose-600/60 rounded-xl p-4 text-center">
              <span className="text-xs font-mono font-bold tracking-widest text-rose-300">
                SIMULATION ONLY • SANDBOX MODE ACTIVE • ZERO PRODUCTION MUTATION
              </span>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 text-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-sm font-semibold text-white">Multi-Hazard What-If Simulation Engine</h3>
                  <p className="text-slate-400 text-xs">Execute stress-testing scenarios across emergency response, chemical dispersion, and life-safety failures.</p>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={selectedSimType}
                    onChange={(e) => setSelectedSimType(e.target.value as SafetySimulationScenarioType)}
                    className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200"
                  >
                    <option value="MAJOR_FIRE">MAJOR_FIRE</option>
                    <option value="CHEMICAL_RELEASE">CHEMICAL_RELEASE</option>
                    <option value="BIOLOGICAL_RELEASE">BIOLOGICAL_RELEASE</option>
                    <option value="RADIATION_EVENT">RADIATION_EVENT</option>
                    <option value="FLOOD">FLOOD</option>
                    <option value="EARTHQUAKE">EARTHQUAKE</option>
                    <option value="MASS_CASUALTY">MASS_CASUALTY</option>
                    <option value="POWER_FAILURE">POWER_FAILURE</option>
                    <option value="EVACUATION_FAILURE">EVACUATION_FAILURE</option>
                    <option value="SHELTER_IN_PLACE_FAILURE">SHELTER_IN_PLACE_FAILURE</option>
                    <option value="CRITICAL_CONTROL_FAILURE">CRITICAL_CONTROL_FAILURE</option>
                    <option value="EMERGENCY_COMMUNICATION_FAILURE">EMERGENCY_COMMUNICATION_FAILURE</option>
                  </select>

                  <button
                    id="btn-execute-simulation"
                    disabled={isSimulating}
                    onClick={handleExecuteSimulation}
                    className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-semibold rounded-lg flex items-center gap-2"
                  >
                    <Play className="w-3.5 h-3.5" />
                    {isSimulating ? 'Simulating...' : 'Run Scenario'}
                  </button>
                </div>
              </div>

              {activeSimulation && (
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white text-sm">{activeSimulation.scenarioName}</span>
                    <span className="text-[11px] font-mono text-slate-500">{activeSimulation.id}</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
                    <div className="p-2.5 bg-slate-900 rounded border border-slate-800">
                      <div className="text-slate-400">Affected Population</div>
                      <div className="text-base font-bold text-white mt-0.5">{activeSimulation.affectedPopulationEstimatedCount}</div>
                    </div>
                    <div className="p-2.5 bg-slate-900 rounded border border-slate-800">
                      <div className="text-slate-400">Evacuation Time</div>
                      <div className="text-base font-bold text-amber-400 mt-0.5">{activeSimulation.estimatedEvacuationTimeMinutes} mins</div>
                    </div>
                    <div className="p-2.5 bg-slate-900 rounded border border-slate-800">
                      <div className="text-slate-400">Resilience Score</div>
                      <div className="text-base font-bold text-emerald-400 mt-0.5">{activeSimulation.safetyResilienceScoreCalculated}/100</div>
                    </div>
                    <div className="p-2.5 bg-slate-900 rounded border border-slate-800">
                      <div className="text-slate-400">Simulated Direct Impact</div>
                      <div className="text-base font-bold text-rose-400 mt-0.5">${activeSimulation.simulatedDirectSafetyCostRef.toLocaleString()}</div>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-900 rounded border border-slate-800">
                    <div className="font-semibold text-slate-200 mb-1">Recommended Resilience Mitigations:</div>
                    <ul className="list-disc pl-4 space-y-1 text-slate-300 text-[11px]">
                      {activeSimulation.mitigationRecommendations.map((rec, i) => (
                        <li key={i}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW 13: DIAGNOSTICS & AUDIT */}
        {activeView === 'DIAGNOSTICS_AUDIT' && (
          <div className="space-y-5">
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 text-xs space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-amber-400" />
                    Automated Institutional Safety Diagnostic Engine
                  </h3>
                  <p className="text-slate-400 text-xs">
                    Scans for orphan hazards, uncontrolled risks, expired exceptions, overdue CAPA, SoD violations, and life-safety deficits.
                  </p>
                </div>
                <button
                  onClick={handleRunDiagnostics}
                  className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-lg text-xs"
                >
                  Scan Now
                </button>
              </div>

              {hasRunDiagnostics ? (
                <div className="space-y-2.5">
                  {diagnosticFindings.length === 0 ? (
                    <div className="p-6 text-center text-emerald-400 bg-emerald-950/20 border border-emerald-800/40 rounded-xl">
                      <CheckCircle2 className="w-8 h-8 mx-auto mb-2" />
                      All safety governance controls and separation of duties rules are operating with zero detected defects.
                    </div>
                  ) : (
                    diagnosticFindings.map((df) => (
                      <div key={df.id} className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 flex justify-between items-start gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              df.severity === 'CRITICAL' ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                            }`}>
                              {df.severity}
                            </span>
                            <span className="font-semibold text-white">{df.title}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-1">{df.description}</p>
                          <p className="text-[10px] text-amber-300 mt-1"><strong>Action:</strong> {df.recommendedRemediation}</p>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500">{df.category}</span>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <div className="p-6 text-center text-slate-500 bg-slate-950 rounded-xl border border-slate-800">
                  Click "Scan Now" to run full diagnostic integrity audit.
                </div>
              )}
            </div>

            {/* Append-Only Audit Trail Reference */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 text-xs space-y-3">
              <h3 className="text-sm font-semibold text-white">Append-Only Safety Governance Audit Trail</h3>
              <p className="text-slate-400 text-xs">Immutable `safety_ehs_audit_logs` records enforcing create-only security rules.</p>
              <div className="space-y-2 font-mono text-[11px]">
                <div className="p-2.5 bg-slate-950 rounded border border-slate-800 flex justify-between text-slate-300">
                  <span>2026-03-24T10:14:02Z • ACTION: HAZARD_RISK_ASSESSED • ACTOR: usr-ehs-officer</span>
                  <span className="text-emerald-400">HASH_VERIFIED</span>
                </div>
                <div className="p-2.5 bg-slate-950 rounded border border-slate-800 flex justify-between text-slate-300">
                  <span>2026-03-22T15:00:00Z • ACTION: FINDING_INDEPENDENTLY_VERIFIED • ACTOR: usr-inspector-davis</span>
                  <span className="text-emerald-400">HASH_VERIFIED</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Log Hazard Observation */}
      {showAddHazardModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-lg p-5 text-xs space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                Log Hazard Observation (Deterministic Scoring)
              </h3>
              <button onClick={() => setShowAddHazardModal(false)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateHazard} className="space-y-3">
              <div>
                <label className="block text-slate-400 mb-1">Hazard Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Inadequate Ventilation in Organic Chemistry Prep Room"
                  value={newHazardForm.title}
                  onChange={(e) => setNewHazardForm({ ...newHazardForm, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Hazard Category</label>
                  <select
                    value={newHazardForm.category}
                    onChange={(e) => setNewHazardForm({ ...newHazardForm, category: e.target.value as HazardCategory })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
                  >
                    {['CHEMICAL', 'BIOLOGICAL', 'RADIATION', 'FIRE', 'ELECTRICAL', 'ENVIRONMENTAL', 'LABORATORY', 'STRUCTURAL'].map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Campus Scope</label>
                  <select
                    value={newHazardForm.campusScope}
                    onChange={(e) => setNewHazardForm({ ...newHazardForm, campusScope: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
                  >
                    <option value="North Campus">North Campus</option>
                    <option value="Downtown Health Sciences">Downtown Health Sciences</option>
                    <option value="South Innovation Campus">South Innovation Campus</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Likelihood (1 - 5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={newHazardForm.likelihood}
                    onChange={(e) => setNewHazardForm({ ...newHazardForm, likelihood: parseInt(e.target.value) || 1 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Severity (1 - 5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={newHazardForm.severity}
                    onChange={(e) => setNewHazardForm({ ...newHazardForm, severity: parseInt(e.target.value) || 1 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddHazardModal(false)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded"
                >
                  Submit Observation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
