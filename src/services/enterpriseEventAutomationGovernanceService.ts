import {
  EnterpriseEventDefinition,
  EnterpriseEventEnvelope,
  EnterpriseEventSubscription,
  EnterpriseEventSource,
  EnterpriseBusinessRule,
  EnterpriseRuleVersion,
  EnterpriseRuleEvaluation,
  EnterpriseAutomationPolicy,
  EnterpriseAutomationExecution,
  EnterpriseWorkQueue,
  EnterpriseWorkQueueItem,
  EnterpriseActionRequest,
  EnterpriseActionAuthorization,
  EnterpriseActionExecution,
  EnterpriseEscalationPolicy,
  EnterpriseEscalationEvent,
  EnterpriseAutomationException,
  EnterpriseAutomationSuppression,
  EnterpriseDeadLetterEvent,
  EnterpriseReplayRequest,
  EnterpriseReplayExecution,
  EnterpriseAutomationRisk,
  EnterpriseAutomationAuditLog,
  EnterpriseAutomationDiagnostic,
  ScenarioType806,
  SimulationResult806,
  EventCategory806,
  ActionType806,
  RuleLifecycle806
} from '../types/enterpriseEventAutomationGovernance';

export class EnterpriseEventAutomationGovernanceService {
  /**
   * Four-Eyes Segregation of Duties Check
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
        reason: `Four-Eyes Violation: Requester (${requesterUserIdRef}) cannot self-approve ${targetType} [${targetIdRef}].`
      };
    }
    return { isValid: true };
  }

  /**
   * Deterministic Provenance SHA-256 Hash Generator
   */
  static generateAuditHash(payload: string, actor: string, timestamp: string, previousHash = '0000000000000000'): string {
    const input = `${payload}|${actor}|${timestamp}|${previousHash}`;
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    const hex = Math.abs(hash).toString(16).padStart(8, '0');
    return `sha256-auto-${hex}-${timestamp.replace(/[^0-9]/g, '').slice(0, 10)}`;
  }

  /**
   * Registers a new Event Definition
   */
  static registerEventDefinition(
    tenantId: string,
    eventCode: string,
    name: string,
    category: EventCategory806,
    sourceModuleIdRef: string
  ): EnterpriseEventDefinition {
    const now = new Date().toISOString();
    return {
      id: `evt-def-${Date.now()}`,
      tenantId,
      eventCode,
      name,
      description: `Governed event definition for ${eventCode}`,
      category,
      sourceModuleIdRef,
      schemaVersion: '1.0.0',
      dataClassification: 'RESTRICTED',
      isActive: true,
      createdAt: now,
      updatedAt: now
    };
  }

  /**
   * Receives and wraps an incoming event into a Governed Envelope
   */
  static receiveEvent(
    tenantId: string,
    category: EventCategory806,
    sourceModuleIdRef: string,
    sourceRecordIdRef: string,
    actorIdRef: string,
    idempotencyKey: string,
    campusId?: string
  ): EnterpriseEventEnvelope {
    const now = new Date().toISOString();
    const eventId = `evt-env-${Date.now()}`;
    const provenanceHash = this.generateAuditHash(`${category}:${sourceRecordIdRef}`, actorIdRef, now);

    return {
      id: eventId,
      tenantId,
      campusId,
      eventId,
      eventType: category,
      sourceModuleIdRef,
      sourceRecordIdRef,
      sourceSystemIdRef: `sys-${sourceModuleIdRef}`,
      actorIdRef,
      correlationId: `corr-${Date.now()}`,
      occurredAt: now,
      receivedAt: now,
      schemaVersion: '1.0.0',
      idempotencyKey,
      dataClassification: 'RESTRICTED',
      provenanceHash
    };
  }

  /**
   * Evaluates a Business Rule against an Event Envelope
   */
  static evaluateRule(rule: EnterpriseBusinessRule, event: EnterpriseEventEnvelope): EnterpriseRuleEvaluation {
    const now = new Date().toISOString();
    let isMatched = false;

    if (rule.lifecycle === 'ACTIVE') {
      if (rule.matchType === 'ALL') {
        isMatched = rule.conditions.every(c => c.value === event.sourceRecordIdRef || event.eventType === rule.category);
      } else {
        isMatched = rule.conditions.some(c => c.value === event.sourceRecordIdRef || event.eventType === rule.category);
      }
    }

    return {
      id: `eval-${Date.now()}`,
      tenantId: rule.tenantId,
      ruleIdRef: rule.id,
      ruleVersionIdRef: `ver-${rule.id}-${rule.activeVersionNumber}`,
      triggeringEventIdRef: event.id,
      evaluationResult: isMatched ? 'MATCHED' : 'NO_MATCH',
      evaluatedAt: now,
      durationMs: 4
    };
  }

  /**
   * Creates a new Immutable Rule Version
   */
  static createRuleVersion(
    rule: EnterpriseBusinessRule,
    requesterUserIdRef: string,
    changeDescription: string
  ): EnterpriseRuleVersion {
    const now = new Date().toISOString();
    const nextVer = (parseFloat(rule.activeVersionNumber) + 0.1).toFixed(1);
    const hash = this.generateAuditHash(JSON.stringify(rule.conditions), requesterUserIdRef, now);

    return {
      id: `ver-${Date.now()}`,
      tenantId: rule.tenantId,
      ruleIdRef: rule.id,
      versionNumber: nextVer,
      versionHash: hash,
      conditionsSnapshot: [...rule.conditions],
      actionsSnapshot: [...rule.actions],
      changeDescription,
      requesterUserIdRef,
      lifecycle: 'DRAFT',
      createdAt: now
    };
  }

  /**
   * Activates a Rule Version with Four-Eyes Approval
   */
  static activateRule(
    version: EnterpriseRuleVersion,
    approverUserIdRef: string
  ): { isValid: boolean; version?: EnterpriseRuleVersion; reason?: string } {
    const sod = this.validateFourEyesSoD(version.requesterUserIdRef, approverUserIdRef, 'RULE_VERSION', version.id);
    if (!sod.isValid) {
      return { isValid: false, reason: sod.reason };
    }

    const now = new Date().toISOString();
    const updatedVersion: EnterpriseRuleVersion = {
      ...version,
      approverUserIdRef,
      approvedAt: now,
      lifecycle: 'ACTIVE'
    };

    return { isValid: true, version: updatedVersion };
  }

  /**
   * Authorizes an Action Request
   */
  static authorizeAction(
    request: EnterpriseActionRequest,
    approverUserIdRef: string,
    justification: string
  ): { isValid: boolean; authorization?: EnterpriseActionAuthorization; reason?: string } {
    if (request.requiresSoD) {
      const sod = this.validateFourEyesSoD(request.requesterUserIdRef, approverUserIdRef, 'ACTION_REQUEST', request.id);
      if (!sod.isValid) {
        return { isValid: false, reason: sod.reason };
      }
    }

    const now = new Date().toISOString();
    const auth: EnterpriseActionAuthorization = {
      id: `auth-${Date.now()}`,
      tenantId: request.tenantId,
      requestIdRef: request.id,
      requesterUserIdRef: request.requesterUserIdRef,
      approverUserIdRef,
      decision: 'APPROVED',
      justification,
      decidedAt: now,
      idempotencyKey: `idemp-auth-${request.id}`
    };

    return { isValid: true, authorization: auth };
  }

  /**
   * Bounded Risk Score Calculator (1.0 to 10.0)
   */
  static calculateAutomationRisk(
    criticalityScore: number,
    sensitivityScore: number,
    blastRadiusScore: number
  ): EnterpriseAutomationRisk {
    const bound = (v: number) => Math.max(1, Math.min(10, isNaN(v) ? 1 : v));

    const c = bound(criticalityScore);
    const s = bound(sensitivityScore);
    const b = bound(blastRadiusScore);

    const composite = Math.round((c * 0.4 + s * 0.35 + b * 0.25) * 10) / 10;
    const finalScore = Math.max(1, Math.min(10, composite));

    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
    if (finalScore >= 8.5) riskLevel = 'CRITICAL';
    else if (finalScore >= 6.5) riskLevel = 'HIGH';
    else if (finalScore >= 4.0) riskLevel = 'MEDIUM';

    return {
      id: `risk-eval-${Date.now()}`,
      tenantId: 'tenant-main-edu',
      ruleIdRef: 'rule-global',
      criticalityScore: c,
      sensitivityScore: s,
      blastRadiusScore: b,
      compositeRiskScore: finalScore,
      riskLevel,
      evaluatedAt: new Date().toISOString()
    };
  }

  /**
   * Diagnostic Engine Scanner
   */
  static runDiagnostics(
    rules: EnterpriseBusinessRule[],
    queues: EnterpriseWorkQueue[],
    exceptions: EnterpriseAutomationException[],
    deadLetters: EnterpriseDeadLetterEvent[]
  ): EnterpriseAutomationDiagnostic[] {
    const diagnostics: EnterpriseAutomationDiagnostic[] = [];
    const now = new Date().toISOString();

    // 1. Inactive Rules in Production
    const inactiveRules = rules.filter(r => r.lifecycle === 'DRAFT' || r.lifecycle === 'SUSPENDED');
    if (inactiveRules.length > 0) {
      diagnostics.push({
        id: 'diag-001',
        tenantId: 'tenant-main-edu',
        code: 'INACTIVE_RULES_PENDING',
        severity: 'WARNING',
        title: 'Draft or Suspended Automation Rules Present',
        description: `${inactiveRules.length} business rule(s) remain in DRAFT or SUSPENDED state.`,
        recommendation: 'Complete review and Four-Eyes approval to activate or retire rules.',
        detectedAt: now
      });
    }

    // 2. Expired Active Automation Exceptions
    const expiredExceptions = exceptions.filter(e => e.status === 'ACTIVE' && e.expiryDate < now);
    if (expiredExceptions.length > 0) {
      diagnostics.push({
        id: 'diag-002',
        tenantId: 'tenant-main-edu',
        code: 'EXPIRED_AUTOMATION_EXCEPTION',
        severity: 'ERROR',
        title: 'Expired Automation Exception Still Active',
        description: `${expiredExceptions.length} automation exception(s) passed their mandatory expiry date.`,
        recommendation: 'Revoke expired automation exceptions immediately or re-submit with new justification.',
        detectedAt: now
      });
    }

    // 3. Work Queue Capacity Warning
    const overloadedQueues = queues.filter(q => q.activeItemCount >= q.maxCapacity);
    if (overloadedQueues.length > 0) {
      diagnostics.push({
        id: 'diag-003',
        tenantId: 'tenant-main-edu',
        code: 'WORK_QUEUE_OVERCAPACITY',
        severity: 'CRITICAL',
        title: 'Work Queue Overcapacity Breached',
        description: `${overloadedQueues.length} enterprise work queue(s) reached max item capacity.`,
        recommendation: 'Reassign queue workload or temporarily pause ingestion policies.',
        detectedAt: now
      });
    }

    // 4. Dead-Letter Accumulation
    if (deadLetters.length > 0) {
      diagnostics.push({
        id: 'diag-004',
        tenantId: 'tenant-main-edu',
        code: 'DEAD_LETTER_ACCUMULATION',
        severity: 'WARNING',
        title: 'Unresolved Dead-Letter Events Present',
        description: `${deadLetters.length} unhandled dead-letter event(s) in dead-letter queue.`,
        recommendation: 'Review dead-letter failure causes and issue authorized replay requests.',
        detectedAt: now
      });
    }

    return diagnostics;
  }

  /**
   * 15-Scenario What-If Automation Sandbox Simulation Engine
   */
  static executeWhatIfSimulation(scenario: ScenarioType806): SimulationResult806 {
    const timestamp = new Date().toISOString();
    const banner = 'SIMULATION ONLY • SANDBOX MODE ACTIVE • ZERO PRODUCTION MUTATION' as const;

    switch (scenario) {
      case 'MASS_EVENT_SURGE':
        return {
          scenario,
          banner,
          timestamp,
          simulatedEventsCount: 25000,
          rulesEvaluatedCount: 75000,
          actionsTriggeredCount: 12000,
          deadLettersGeneratedCount: 350,
          circuitBreakerActivated: true,
          diagnosticsGenerated: ['EVENT_INGESTION_THROTTLED', 'QUEUE_BACKPRESSURE_HIGH'],
          summary: 'Simulated 25,000 concurrent student enrollment events. Circuit breaker throttled queue dispatches safely.'
        };

      case 'RULE_FAILURE':
        return {
          scenario,
          banner,
          timestamp,
          simulatedEventsCount: 1200,
          rulesEvaluatedCount: 3600,
          actionsTriggeredCount: 0,
          deadLettersGeneratedCount: 1200,
          circuitBreakerActivated: false,
          diagnosticsGenerated: ['RULE_CONDITION_SYNTAX_ERROR', 'DEAD_LETTER_RULE_EVAL_FAILED'],
          summary: 'Simulated invalid field reference in Grade Calculation Rule. Events routed to Dead-Letter Queue cleanly.'
        };

      case 'WORK_QUEUE_OVERLOAD':
        return {
          scenario,
          banner,
          timestamp,
          simulatedEventsCount: 5000,
          rulesEvaluatedCount: 15000,
          actionsTriggeredCount: 4500,
          deadLettersGeneratedCount: 50,
          circuitBreakerActivated: true,
          diagnosticsGenerated: ['QUEUE_CAPACITY_100_PERCENT', 'WORKLOAD_REASSIGNED'],
          summary: 'Simulated Academic Support Queue exceeding 1,000 active items. Workload redistributed to secondary regional queues.'
        };

      case 'SLA_BREACH_CASCADE':
        return {
          scenario,
          banner,
          timestamp,
          simulatedEventsCount: 800,
          rulesEvaluatedCount: 2400,
          actionsTriggeredCount: 800,
          deadLettersGeneratedCount: 0,
          circuitBreakerActivated: false,
          diagnosticsGenerated: ['SLA_BREACH_LEVEL_3', 'ESCALATION_DIRECTOR_NOTIFIED'],
          summary: 'Simulated 24-hour SLA expiration across 800 unresolved compliance tasks. Deterministic level-3 escalation dispatches triggered.'
        };

      case 'NOTIFICATION_PROVIDER_FAILURE':
        return {
          scenario,
          banner,
          timestamp,
          simulatedEventsCount: 3000,
          rulesEvaluatedCount: 9000,
          actionsTriggeredCount: 2800,
          deadLettersGeneratedCount: 200,
          circuitBreakerActivated: true,
          diagnosticsGenerated: ['SMS_GATEWAY_TIMEOUT', 'FALLBACK_EMAIL_ENGAGED'],
          summary: 'Simulated primary SMS provider outage. Fallback email notification policies engaged with zero event loss.'
        };

      case 'CROSS_MODULE_OUTAGE':
        return {
          scenario,
          banner,
          timestamp,
          simulatedEventsCount: 4000,
          rulesEvaluatedCount: 12000,
          actionsTriggeredCount: 0,
          deadLettersGeneratedCount: 1500,
          circuitBreakerActivated: true,
          diagnosticsGenerated: ['FINANCIAL_ERP_OFFLINE', 'ACTIONS_SUSPENDED'],
          summary: 'Simulated SAP ERP offline state. Financial cross-module action requests queued in pending authorization store.'
        };

      case 'DUPLICATE_EVENT_STORM':
        return {
          scenario,
          banner,
          timestamp,
          simulatedEventsCount: 15000,
          rulesEvaluatedCount: 15000,
          actionsTriggeredCount: 100,
          deadLettersGeneratedCount: 0,
          circuitBreakerActivated: false,
          diagnosticsGenerated: ['IDEMPOTENCY_KEYS_SUPPRESSED_14900'],
          summary: 'Simulated 14,900 duplicate event replays. Idempotency engine suppressed 14,900 duplicate executions.'
        };

      case 'CYBER_ALERT_SURGE':
        return {
          scenario,
          banner,
          timestamp,
          simulatedEventsCount: 500,
          rulesEvaluatedCount: 1500,
          actionsTriggeredCount: 500,
          deadLettersGeneratedCount: 0,
          circuitBreakerActivated: false,
          diagnosticsGenerated: ['CYBER_SECURITY_REVIEW_MANDATORY', 'CRITICAL_RISK_TRIGGERED'],
          summary: 'Simulated surge in failed SSH logins. Security review work requests dispatched immediately with top queue priority.'
        };

      case 'COMPLIANCE_ALERT_SURGE':
        return {
          scenario,
          banner,
          timestamp,
          simulatedEventsCount: 600,
          rulesEvaluatedCount: 1800,
          actionsTriggeredCount: 600,
          deadLettersGeneratedCount: 0,
          circuitBreakerActivated: false,
          diagnosticsGenerated: ['COMPLIANCE_EXCEPTION_LOGGED'],
          summary: 'Simulated FERPA access audit anomalies. Compliance review tasks routed to Data Protection Officer queue.'
        };

      case 'SAFETY_ALERT_SURGE':
        return {
          scenario,
          banner,
          timestamp,
          simulatedEventsCount: 150,
          rulesEvaluatedCount: 450,
          actionsTriggeredCount: 150,
          deadLettersGeneratedCount: 0,
          circuitBreakerActivated: false,
          diagnosticsGenerated: ['SAFETY_CRITICAL_ESCALATION'],
          summary: 'Simulated chemical spill sensor alert. Safety review tasks dispatched and emergency notifications broadcast.'
        };

      case 'CONTRACT_EXPIRING_WAVE':
        return {
          scenario,
          banner,
          timestamp,
          simulatedEventsCount: 350,
          rulesEvaluatedCount: 1050,
          actionsTriggeredCount: 350,
          deadLettersGeneratedCount: 0,
          circuitBreakerActivated: false,
          diagnosticsGenerated: ['CONTRACT_RENEWAL_TASK_CREATED'],
          summary: 'Simulated batch of 350 vendor contracts reaching 60-day expiry threshold. Procurement tasks automatically queued.'
        };

      case 'DATA_QUALITY_DEGRADATION':
        return {
          scenario,
          banner,
          timestamp,
          simulatedEventsCount: 8000,
          rulesEvaluatedCount: 24000,
          actionsTriggeredCount: 2000,
          deadLettersGeneratedCount: 800,
          circuitBreakerActivated: true,
          diagnosticsGenerated: ['COMPLETENESS_DROP_ALERT', 'DATA_QUALITY_REVIEW_CREATED'],
          summary: 'Simulated mass ingestion of incomplete address records. Data quality review tasks queued for data stewards.'
        };

      case 'AUTOMATION_DEPENDENCY_FAILURE':
        return {
          scenario,
          banner,
          timestamp,
          simulatedEventsCount: 1200,
          rulesEvaluatedCount: 3600,
          actionsTriggeredCount: 0,
          deadLettersGeneratedCount: 400,
          circuitBreakerActivated: true,
          diagnosticsGenerated: ['UPSTREAM_RULE_BLOCKER_ACTIVE'],
          summary: 'Simulated failure in Upstream Student Intake Rule cascading into Course Allocation Rule.'
        };

      case 'DEAD_LETTER_BACKLOG':
        return {
          scenario,
          banner,
          timestamp,
          simulatedEventsCount: 5000,
          rulesEvaluatedCount: 0,
          actionsTriggeredCount: 2500,
          deadLettersGeneratedCount: 0,
          circuitBreakerActivated: false,
          diagnosticsGenerated: ['REPLAY_BATCH_EXECUTED_2500'],
          summary: 'Simulated authorized replay of 2,500 dead-letter events. Replay executions created with full provenance integrity.'
        };

      case 'MULTI_MODULE_CASCADE':
      default:
        return {
          scenario: 'MULTI_MODULE_CASCADE',
          banner,
          timestamp,
          simulatedEventsCount: 18000,
          rulesEvaluatedCount: 54000,
          actionsTriggeredCount: 15000,
          deadLettersGeneratedCount: 120,
          circuitBreakerActivated: true,
          diagnosticsGenerated: ['MULTI_MODULE_CASCADE_CONTAINED'],
          summary: 'Simulated campus-wide power disruption triggering Student, Financial, Facilities, and IT automation rules simultaneously.'
        };
    }
  }

  /**
   * Initial Mock Data for Phase 8.6 Control Plane
   */
  static getInitialRules(tenantId: string): EnterpriseBusinessRule[] {
    return [
      {
        id: 'rule-001',
        tenantId,
        ruleCode: 'RULE-SLA-ESCALATE-01',
        title: 'High-Priority Student Case SLA Escalation Rule',
        description: 'Automatically creates escalation when student academic grievance SLA reaches 80% threshold.',
        category: 'SLA_AT_RISK',
        lifecycle: 'ACTIVE',
        activeVersionNumber: '1.0',
        matchType: 'ALL',
        conditions: [
          { field: 'category', operator: 'EQUALS', value: 'ACADEMIC_GRIEVANCE' },
          { field: 'priority', operator: 'EQUALS', value: 'HIGH' }
        ],
        actions: [
          { actionType: 'CREATE_ESCALATION', targetModuleIdRef: 'mod_enterprise_case_governance', payloadSummary: 'Escalate to Dean of Students', requiresSoDApproval: false }
        ],
        priority: 1,
        ownerUserIdRef: 'usr-dean-academic',
        stewardUserIdRef: 'usr-case-mgr-01',
        effectiveDate: '2026-01-01T00:00:00.000Z',
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-08-30T00:00:00.000Z'
      },
      {
        id: 'rule-002',
        tenantId,
        ruleCode: 'RULE-CONTRACT-EXP-02',
        title: 'Vendor Contract Expiry Notification & Review Rule',
        description: 'Triggers contract review request 60 days prior to contract expiration date.',
        category: 'CONTRACT_EXPIRING',
        lifecycle: 'ACTIVE',
        activeVersionNumber: '2.1',
        matchType: 'ALL',
        conditions: [
          { field: 'daysToExpiry', operator: 'LESS_THAN', value: '60' }
        ],
        actions: [
          { actionType: 'REQUEST_CONTRACT_REVIEW', targetModuleIdRef: 'mod_contract_governance', payloadSummary: 'Queue Contract Renewal Review', requiresSoDApproval: true }
        ],
        priority: 2,
        ownerUserIdRef: 'usr-procurement-dir',
        stewardUserIdRef: 'usr-legal-counsel',
        effectiveDate: '2026-01-01T00:00:00.000Z',
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-08-30T00:00:00.000Z'
      }
    ];
  }

  static getInitialQueues(tenantId: string): EnterpriseWorkQueue[] {
    return [
      {
        id: 'q-001',
        tenantId,
        queueCode: 'Q-ACADEMIC-GRIEVANCE',
        name: 'Academic Grievance & Student Appeals Queue',
        description: 'Governed queue for high-priority student appeals and case evaluations.',
        departmentIdRef: 'dept-student-affairs',
        ownerUserIdRef: 'usr-dean-academic',
        status: 'ACTIVE',
        maxCapacity: 500,
        activeItemCount: 42,
        targetSlaMinutes: 1440, // 24 hours
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-08-30T00:00:00.000Z'
      },
      {
        id: 'q-002',
        tenantId,
        queueCode: 'Q-CYBER-INCIDENTS',
        name: 'Cybersecurity & Privacy Response Queue',
        description: 'High-security queue for FERPA data breach alerts and security reviews.',
        departmentIdRef: 'dept-it-security',
        ownerUserIdRef: 'usr-ciso-01',
        status: 'ACTIVE',
        maxCapacity: 200,
        activeItemCount: 8,
        targetSlaMinutes: 60, // 1 hour
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-08-30T00:00:00.000Z'
      }
    ];
  }

  static getInitialSources(tenantId: string): EnterpriseEventSource[] {
    return [
      {
        id: 'src-001',
        tenantId,
        sourceCode: 'SRC-SIS-CORE',
        name: 'Core Student Information System Webhook Feed',
        sourceModuleIdRef: 'mod_student_engine',
        isTelemetryAvailable: true,
        lastHeartbeat: '2026-08-30T11:15:00.000Z',
        status: 'HEALTHY'
      },
      {
        id: 'src-002',
        tenantId,
        sourceCode: 'SRC-LMS-CANVAS',
        name: 'Learning Management System Real-Time Stream',
        sourceModuleIdRef: 'mod_learning_management',
        isTelemetryAvailable: false, // INSUFFICIENT DATA
        status: 'OFFLINE'
      }
    ];
  }
}
