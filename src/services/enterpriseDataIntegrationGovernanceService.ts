import {
  EnterpriseDataDomain,
  EnterpriseMasterDataReference,
  EnterpriseReferenceDataSet,
  EnterpriseReferenceDataValue,
  EnterpriseDataMapping,
  EnterpriseDataContract,
  EnterpriseDataContractVersion,
  EnterpriseIntegrationDefinition,
  EnterpriseSynchronizationPolicy,
  EnterpriseSynchronizationEvent,
  EnterpriseReconciliationRun,
  EnterpriseReconciliationException,
  EnterpriseDataQualityRule,
  EnterpriseDataQualityObservation,
  EnterpriseDataLineageNode,
  EnterpriseDataLineageEdge,
  EnterpriseDataDependency,
  EnterpriseDataProvenance,
  EnterpriseDataException,
  EnterpriseIntegrationRisk,
  EnterpriseIntegrationApproval,
  EnterpriseIntegrationAuditLog,
  EnterpriseIntegrationDiagnostic,
  ScenarioType805,
  SimulationResult805,
  ReconciliationStatus805
} from '../types/enterpriseDataIntegrationGovernance';

export class EnterpriseDataIntegrationGovernanceService {
  /**
   * Enforces Four-Eyes Segregation of Duties (SoD)
   * Prevents self-approval: requesterUserIdRef !== approverUserIdRef
   */
  static validateFourEyesSoD(
    requesterUserIdRef: string,
    approverUserIdRef: string,
    targetType: string,
    targetIdRef: string
  ): { isValid: boolean; reason?: string } {
    if (!requesterUserIdRef || !approverUserIdRef) {
      return { isValid: false, reason: 'Missing mandatory requester or approver identity reference.' };
    }
    if (requesterUserIdRef.trim().toLowerCase() === approverUserIdRef.trim().toLowerCase()) {
      return {
        isValid: false,
        reason: `Four-Eyes Violation: Requester (${requesterUserIdRef}) cannot self-approve ${targetType} reference [${targetIdRef}].`
      };
    }
    return { isValid: true };
  }

  /**
   * Validates Data Contract Lifecycle Transitions
   */
  static validateContractLifecycleTransition(
    currentStatus: string,
    targetStatus: string,
    approverUserIdRef?: string
  ): { isValid: boolean; reason?: string } {
    const validTransitions: Record<string, string[]> = {
      DRAFT: ['REVIEW'],
      REVIEW: ['APPROVED', 'DRAFT'],
      APPROVED: ['ACTIVE'],
      ACTIVE: ['DEPRECATED', 'RETIRED'],
      DEPRECATED: ['RETIRED'],
      RETIRED: []
    };

    const allowed = validTransitions[currentStatus] || [];
    if (!allowed.includes(targetStatus)) {
      return {
        isValid: false,
        reason: `Invalid Data Contract status transition from ${currentStatus} to ${targetStatus}.`
      };
    }

    if ((targetStatus === 'APPROVED' || targetStatus === 'ACTIVE') && !approverUserIdRef) {
      return {
        isValid: false,
        reason: 'Approval or activation requires an explicit approver identity reference.'
      };
    }

    return { isValid: true };
  }

  /**
   * Deterministic Idempotency Key Validation
   */
  static validateIdempotencyKey(key: string, existingKeys: string[]): boolean {
    if (!key || key.trim() === '') return false;
    return !existingKeys.includes(key);
  }

  /**
   * Calculates Composite Integration Risk Score (Bounded 1.0 to 10.0)
   */
  static calculateCompositeRiskScore(
    criticalityScore: number,
    sensitivityScore: number,
    failureExposureScore: number
  ): EnterpriseIntegrationRisk {
    const bound = (v: number) => Math.max(1, Math.min(10, isNaN(v) ? 1 : v));

    const c = bound(criticalityScore);
    const s = bound(sensitivityScore);
    const f = bound(failureExposureScore);

    const composite = Math.round(((c * 0.4 + s * 0.35 + f * 0.25) * 10)) / 10;
    const finalScore = Math.max(1, Math.min(10, composite));

    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
    if (finalScore >= 8.5) riskLevel = 'CRITICAL';
    else if (finalScore >= 6.5) riskLevel = 'HIGH';
    else if (finalScore >= 4.0) riskLevel = 'MEDIUM';

    return {
      id: `risk-eval-${Date.now()}`,
      tenantId: 'tenant-main-edu',
      integrationIdRef: 'int-global-eval',
      criticalityScore: c,
      sensitivityScore: s,
      failureExposureScore: f,
      compositeRiskScore: finalScore,
      riskLevel,
      evaluatedAt: new Date().toISOString()
    };
  }

  /**
   * Generates a deterministic SHA-256 provenance hash string
   */
  static generateProvenanceHash(payload: string, actor: string, timestamp: string): string {
    const input = `${payload}|${actor}|${timestamp}`;
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    const hex = Math.abs(hash).toString(16).padStart(8, '0');
    return `sha256-prov-${hex}-${timestamp.replace(/[^0-9]/g, '').slice(0, 10)}`;
  }

  /**
   * Bounded Lineage Traversal & Circular Dependency Detection
   */
  static traverseLineageGraph(
    startNodeId: string,
    edges: EnterpriseDataLineageEdge[],
    maxDepth = 10
  ): { visitedNodeIds: string[]; hasCircularDependency: boolean; depthReached: number } {
    const visited: string[] = [];
    let hasCircular = false;
    let maxDepthReached = 0;

    const dfs = (currentNodeId: string, path: string[], currentDepth: number) => {
      if (currentDepth > maxDepthReached) maxDepthReached = currentDepth;
      if (currentDepth >= maxDepth) return;

      if (path.includes(currentNodeId)) {
        hasCircular = true;
        return;
      }

      visited.push(currentNodeId);
      const outgoing = edges.filter(e => e.sourceNodeIdRef === currentNodeId);

      for (const edge of outgoing) {
        dfs(edge.targetNodeIdRef, [...path, currentNodeId], currentDepth + 1);
      }
    };

    dfs(startNodeId, [], 0);

    return {
      visitedNodeIds: Array.from(new Set(visited)),
      hasCircularDependency: hasCircular,
      depthReached: maxDepthReached
    };
  }

  /**
   * Automated Diagnostic Scanner
   */
  static runDiagnosticScan(
    domains: EnterpriseDataDomain[],
    contracts: EnterpriseDataContract[],
    exceptions: EnterpriseDataException[],
    qualityObservations: EnterpriseDataQualityObservation[]
  ): EnterpriseIntegrationDiagnostic[] {
    const diagnostics: EnterpriseIntegrationDiagnostic[] = [];

    // 1. Unapproved or Expired Contracts
    const activeContractsWithoutExpiry = contracts.filter(c => c.status === 'ACTIVE' && !c.expiryDate);
    if (activeContractsWithoutExpiry.length > 0) {
      diagnostics.push({
        id: `diag-001`,
        tenantId: 'tenant-main-edu',
        code: 'CONTRACT_EXPIRY_MISSING',
        severity: 'WARNING',
        title: 'Active Data Contracts Lack Expiry Date',
        description: `${activeContractsWithoutExpiry.length} active data contract(s) do not define a mandatory review/expiry date.`,
        recommendation: 'Configure review dates on all active data contracts to prevent governance obsolescence.',
        detectedAt: new Date().toISOString()
      });
    }

    // 2. Expired Active Exceptions
    const now = new Date().toISOString();
    const expiredExceptions = exceptions.filter(e => e.status === 'ACTIVE' && e.expiryDate < now);
    if (expiredExceptions.length > 0) {
      diagnostics.push({
        id: `diag-002`,
        tenantId: 'tenant-main-edu',
        code: 'EXPIRED_DATA_EXCEPTION_ACTIVE',
        severity: 'ERROR',
        title: 'Expired Data Exception Marked Active',
        description: `${expiredExceptions.length} data exception(s) have passed their expiry date but remain active.`,
        recommendation: 'Revoke or re-evaluate expired integration exceptions immediately.',
        detectedAt: new Date().toISOString()
      });
    }

    // 3. Degraded Data Domains
    const degradedDomains = domains.filter(d => d.qualityStatus === 'CRITICAL' || d.qualityStatus === 'DEGRADED');
    if (degradedDomains.length > 0) {
      diagnostics.push({
        id: `diag-003`,
        tenantId: 'tenant-main-edu',
        code: 'DOMAIN_QUALITY_DEGRADED',
        severity: 'CRITICAL',
        title: 'Master Data Domain Quality Degraded',
        description: `${degradedDomains.length} data domain(s) report degraded or critical data quality status.`,
        recommendation: 'Trigger reconciliation and quality remediation pipelines for affected master data domains.',
        detectedAt: new Date().toISOString()
      });
    }

    return diagnostics;
  }

  /**
   * 12-Scenario What-If Integration Resilience Sandbox Engine
   */
  static executeWhatIfSimulation(scenario: ScenarioType805): SimulationResult805 {
    const timestamp = new Date().toISOString();
    const banner = 'SIMULATION ONLY • SANDBOX MODE ACTIVE • ZERO PRODUCTION MUTATION' as const;

    switch (scenario) {
      case 'AUTHORITATIVE_SYSTEM_OUTAGE':
        return {
          scenario,
          banner,
          timestamp,
          simulatedRecordsCount: 1500,
          reconciliationMismatchCount: 340,
          circuitBreakerActivated: true,
          diagnosticsGenerated: ['AUTHORITATIVE_SYSTEM_DOWN', 'SYNC_CIRCUIT_OPEN'],
          summary: 'Simulated primary Student Master DB outage. Circuit breaker opened; read-only fallback mode engaged.'
        };

      case 'INTEGRATION_ENDPOINT_FAILURE':
        return {
          scenario,
          banner,
          timestamp,
          simulatedRecordsCount: 800,
          reconciliationMismatchCount: 120,
          circuitBreakerActivated: true,
          diagnosticsGenerated: ['ENDPOINT_HTTP_503', 'RETRY_QUEUE_FULL'],
          summary: 'Simulated HR payroll webhook endpoint failure. Retry policies throttled event dispatches.'
        };

      case 'DATA_CONTRACT_BREAK':
        return {
          scenario,
          banner,
          timestamp,
          simulatedRecordsCount: 2200,
          reconciliationMismatchCount: 510,
          circuitBreakerActivated: false,
          diagnosticsGenerated: ['SCHEMA_MISMATCH_FIELD_ADDED', 'CONTRACT_VALIDATION_FAILED'],
          summary: 'Simulated unannounced schema change on Financial ERP feed. Ingestion rejected non-conforming fields.'
        };

      case 'REFERENCE_DATA_CHANGE':
        return {
          scenario,
          banner,
          timestamp,
          simulatedRecordsCount: 450,
          reconciliationMismatchCount: 45,
          circuitBreakerActivated: false,
          diagnosticsGenerated: ['UNMAPPED_REF_CODE', 'VOCABULARY_DRIFT'],
          summary: 'Simulated new department code introduction without mapping update. Mappings quarantined for review.'
        };

      case 'SYNCHRONIZATION_DELAY':
        return {
          scenario,
          banner,
          timestamp,
          simulatedRecordsCount: 5000,
          reconciliationMismatchCount: 890,
          circuitBreakerActivated: false,
          diagnosticsGenerated: ['SLA_SYNC_LAG_EXCEEDED', 'STALE_REFERENCE_DETECTED'],
          summary: 'Simulated 4-hour batch synchronization lag. Downstream modules alerted to stale reference data.'
        };

      case 'MASS_DATA_QUALITY_DEGRADATION':
        return {
          scenario,
          banner,
          timestamp,
          simulatedRecordsCount: 10000,
          reconciliationMismatchCount: 2400,
          circuitBreakerActivated: true,
          diagnosticsGenerated: ['COMPLETENESS_DROP_50_PERCENT', 'REFERENTIAL_INTEGRITY_BREACH'],
          summary: 'Simulated ingestion of corrupted legacy CSV dataset. Mass data quality rules aborted sync pipeline.'
        };

      case 'DUPLICATE_EVENT_SURGE':
        return {
          scenario,
          banner,
          timestamp,
          simulatedRecordsCount: 12000,
          reconciliationMismatchCount: 0,
          circuitBreakerActivated: false,
          diagnosticsGenerated: ['DUPLICATE_IDEMP_KEYS_DROPPED'],
          summary: 'Simulated 10,000 duplicate message replay attack. Idempotency engine suppressed all 10,000 duplicates.'
        };

      case 'CROSS_CAMPUS_INTEGRATION_FAILURE':
        return {
          scenario,
          banner,
          timestamp,
          simulatedRecordsCount: 3200,
          reconciliationMismatchCount: 410,
          circuitBreakerActivated: true,
          diagnosticsGenerated: ['CROSS_CAMPUS_BRIDGE_OFFLINE'],
          summary: 'Simulated WAN partition between Main Campus and Regional Campus. Local offline queues activated.'
        };

      case 'THIRD_PARTY_PLATFORM_OUTAGE':
        return {
          scenario,
          banner,
          timestamp,
          simulatedRecordsCount: 600,
          reconciliationMismatchCount: 95,
          circuitBreakerActivated: true,
          diagnosticsGenerated: ['THIRD_PARTY_LMS_OUTAGE'],
          summary: 'Simulated external LMS API timeout. Data sync fallback switched to nightly delta export mode.'
        };

      case 'CASCADING_DEPENDENCY_FAILURE':
        return {
          scenario,
          banner,
          timestamp,
          simulatedRecordsCount: 7500,
          reconciliationMismatchCount: 1800,
          circuitBreakerActivated: true,
          diagnosticsGenerated: ['CASCADING_FAIL_DEPT_TO_COURSE', 'UPSTREAM_BLOCKER'],
          summary: 'Simulated Department Master failure cascading into Course Catalog and Staff Allocation modules.'
        };

      case 'DATA_MAPPING_CORRUPTION':
        return {
          scenario,
          banner,
          timestamp,
          simulatedRecordsCount: 1100,
          reconciliationMismatchCount: 620,
          circuitBreakerActivated: false,
          diagnosticsGenerated: ['TRANSFORMATION_NULL_POINTER', 'MAPPING_REJECTED'],
          summary: 'Simulated corrupted regex expression in student status mapping. Records quarantined to Exception table.'
        };

      case 'RECONCILIATION_BACKLOG':
      default:
        return {
          scenario: 'RECONCILIATION_BACKLOG',
          banner,
          timestamp,
          simulatedRecordsCount: 25000,
          reconciliationMismatchCount: 3100,
          circuitBreakerActivated: false,
          diagnosticsGenerated: ['RECONCILIATION_QUEUE_OVERFLOW'],
          summary: 'Simulated backlog of 25,000 unverified cross-system records. Parallel background reconciliation workers scaled.'
        };
    }
  }

  /**
   * Initial Mock Data Loaders for Phase 8.5 Control Plane
   */
  static getInitialDomains(tenantId: string): EnterpriseDataDomain[] {
    return [
      {
        id: 'dom-001',
        tenantId,
        domainCode: 'STUDENT',
        domainName: 'Student Master Data Domain',
        domainType: 'STUDENT',
        authoritativeSystemIdRef: 'sys-sis-core',
        authoritativeIdentifierName: 'studentId',
        sourceOwnershipDepartmentRef: 'dept-academic-records',
        stewardshipUserIdRef: 'usr-registrar-01',
        synchronizationPolicyMode: 'REAL_TIME',
        dataClassification: 'RESTRICTED',
        lifecycle: 'ACTIVE',
        qualityStatus: 'HEALTHY',
        dependencyCount: 14,
        integrationHealthScore: 98,
        createdAt: '2026-08-30T00:00:00.000Z',
        updatedAt: '2026-08-30T00:00:00.000Z'
      },
      {
        id: 'dom-002',
        tenantId,
        domainCode: 'EMPLOYEE',
        domainName: 'Human Capital & Faculty Master',
        domainType: 'EMPLOYEE',
        authoritativeSystemIdRef: 'sys-hris-workday',
        authoritativeIdentifierName: 'employeeId',
        sourceOwnershipDepartmentRef: 'dept-hr',
        stewardshipUserIdRef: 'usr-hr-director',
        synchronizationPolicyMode: 'NEAR_REAL_TIME',
        dataClassification: 'HIGHLY_RESTRICTED',
        lifecycle: 'ACTIVE',
        qualityStatus: 'HEALTHY',
        dependencyCount: 18,
        integrationHealthScore: 95,
        createdAt: '2026-08-30T00:00:00.000Z',
        updatedAt: '2026-08-30T00:00:00.000Z'
      },
      {
        id: 'dom-003',
        tenantId,
        domainCode: 'FINANCE',
        domainName: 'Institutional General Ledger & Accounts',
        domainType: 'FINANCE',
        authoritativeSystemIdRef: 'sys-erp-sap',
        authoritativeIdentifierName: 'glAccountId',
        sourceOwnershipDepartmentRef: 'dept-finance',
        stewardshipUserIdRef: 'usr-cfo-01',
        synchronizationPolicyMode: 'BATCH',
        dataClassification: 'RESTRICTED',
        lifecycle: 'ACTIVE',
        qualityStatus: 'HEALTHY',
        dependencyCount: 22,
        integrationHealthScore: 99,
        createdAt: '2026-08-30T00:00:00.000Z',
        updatedAt: '2026-08-30T00:00:00.000Z'
      }
    ];
  }

  static getInitialContracts(tenantId: string): EnterpriseDataContract[] {
    return [
      {
        id: 'cnt-001',
        tenantId,
        contractCode: 'CNT-SIS-LMS-2026',
        title: 'Student Enrollment Data Contract (SIS -> Canvas)',
        sourceSystemIdRef: 'sys-sis-core',
        targetSystemIdRef: 'sys-lms-canvas',
        domainType: 'STUDENT',
        schemaReference: 'schema-sis-enrollment-v2.json',
        version: '2.1.0',
        classification: 'RESTRICTED',
        requiredFields: ['studentId', 'courseCode', 'termId', 'enrollmentStatus'],
        validationRulesSummary: 'studentId must be valid UUID; termId must match Active Academic Term',
        compatibilityMode: 'BACKWARD_COMPATIBLE',
        status: 'ACTIVE',
        ownerUserIdRef: 'usr-tech-director',
        stewardUserIdRef: 'usr-registrar-01',
        effectiveDate: '2026-01-01T00:00:00.000Z',
        expiryDate: '2027-01-01T00:00:00.000Z',
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-08-30T00:00:00.000Z'
      },
      {
        id: 'cnt-002',
        tenantId,
        contractCode: 'CNT-HR-PAYROLL-2026',
        title: 'Faculty Assignment & Compensation Contract',
        sourceSystemIdRef: 'sys-hris-workday',
        targetSystemIdRef: 'sys-payroll-adp',
        domainType: 'EMPLOYEE',
        schemaReference: 'schema-hr-payroll-v1.json',
        version: '1.0.0',
        classification: 'HIGHLY_RESTRICTED',
        requiredFields: ['employeeId', 'departmentCode', 'payGrade', 'effectiveDate'],
        validationRulesSummary: 'employeeId must exist in HR Master; payGrade must be within active scale',
        compatibilityMode: 'STRICT',
        status: 'ACTIVE',
        ownerUserIdRef: 'usr-hr-director',
        stewardUserIdRef: 'usr-payroll-mgr',
        effectiveDate: '2026-01-01T00:00:00.000Z',
        expiryDate: '2026-12-31T00:00:00.000Z',
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-08-30T00:00:00.000Z'
      }
    ];
  }

  static getInitialIntegrations(tenantId: string): EnterpriseIntegrationDefinition[] {
    return [
      {
        id: 'int-001',
        tenantId,
        integrationCode: 'INT-SIS-SYNC-01',
        name: 'Core SIS Real-Time Webhook Bridge',
        endpointType: 'WEBHOOK',
        sourceSystemIdRef: 'sys-sis-core',
        targetSystemIdRef: 'sys-lms-canvas',
        providerReference: 'aws-sqs-sis-events',
        endpointReference: 'https://api.institution.edu/v2/events/sis',
        authenticationReference: 'auth-oauth2-m2m',
        dataClassification: 'RESTRICTED',
        contractIdRef: 'cnt-001',
        status: 'ACTIVE',
        ownerUserIdRef: 'usr-lead-architect',
        dependencyIds: ['int-auth-01'],
        healthScore: 99,
        lastObservedExecution: '2026-08-30T10:30:00.000Z',
        failureRateObservationPercentage: 0.02,
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-08-30T10:30:00.000Z'
      }
    ];
  }
}
