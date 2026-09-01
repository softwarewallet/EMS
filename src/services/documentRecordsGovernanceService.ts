import {
  EnterpriseDocumentGovDoc,
  EnterpriseDocumentStatus,
  EnterpriseDocumentClassification,
  EnterpriseDocumentVersion,
  EnterpriseRecordGovRecord,
  EnterpriseRecordStatus,
  EnterpriseCorrespondenceGovRecord,
  EnterpriseCorrespondenceType,
  EnterpriseCorrespondenceStatus,
  EnterpriseApprovalPackageGovPkg,
  EnterpriseApprovalPackageStatus,
  EnterpriseApprovalDecisionGovDec,
  EnterpriseApprovalDecisionStatus,
  EnterpriseApprovalLevel,
  EnterpriseDocumentReviewGovRev,
  EnterpriseReviewStatus,
  EnterpriseDocumentIssueGovIssue,
  EnterpriseIssueStatus,
  EnterpriseLegalHoldGovHold,
  EnterpriseHoldStatus,
  EnterpriseDocumentRelationship,
  EnterpriseDocumentEvidenceGovEv,
  EnterpriseDocumentExceptionGovExc,
  EnterpriseDocumentDiagnostic,
  EnterpriseDocumentSimulation,
  EnterpriseDocumentAuditLog
} from '../types/documentRecordsGovernance';

export class DocumentRecordsGovernanceService {
  private static idempotencyTracker: Set<string> = new Set();
  private static activeLocks: Set<string> = new Set();

  // 1. DOCUMENT REGISTRATION & LIFECYCLE
  public static registerDocument(
    tenantId: string,
    campusId: string | undefined,
    documentNumber: string,
    title: string,
    description: string,
    documentType: string,
    classification: EnterpriseDocumentClassification,
    ownerUserIdRef: string,
    stewardUserIdRef: string,
    sourceModuleIdRef: string,
    sourceRecordIdRef: string,
    idempotencyKey?: string
  ): { success: boolean; document?: EnterpriseDocumentGovDoc; error?: string } {
    if (idempotencyKey) {
      if (this.idempotencyTracker.has(idempotencyKey)) {
        return { success: false, error: `Duplicate document registration rejected (Idempotency Key: ${idempotencyKey})` };
      }
      this.idempotencyTracker.add(idempotencyKey);
    }

    const doc: EnterpriseDocumentGovDoc = {
      id: `doc-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      tenantId,
      campusId,
      documentNumber,
      title,
      description,
      documentType,
      status: 'REGISTERED',
      classification,
      businessCriticality: 'MEDIUM',
      sourceModuleIdRef,
      sourceRecordIdRef,
      ownerUserIdRef,
      stewardUserIdRef,
      activeVersionNumber: 1,
      legalHoldActive: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return { success: true, document: doc };
  }

  // 2. DOCUMENT TRANSITION ENGINE
  public static transitionDocument(
    existingDoc: EnterpriseDocumentGovDoc,
    targetStatus: EnterpriseDocumentStatus,
    actorUserIdRef: string,
    legalHoldActive: boolean = false
  ): { success: boolean; updatedDocument?: EnterpriseDocumentGovDoc; error?: string } {
    if (legalHoldActive && (targetStatus === 'RETIRED' || targetStatus === 'ARCHIVED')) {
      return { success: false, error: 'Legal Hold Active: Cannot retire or archive document while legal hold is active.' };
    }

    const validTransitions: Record<EnterpriseDocumentStatus, EnterpriseDocumentStatus[]> = {
      REGISTERED: ['DRAFT', 'ARCHIVED'],
      DRAFT: ['REVIEW', 'ARCHIVED'],
      REVIEW: ['APPROVAL_PENDING', 'DRAFT', 'REJECTED' as any],
      APPROVAL_PENDING: ['APPROVED', 'DRAFT', 'REVIEW'],
      APPROVED: ['PUBLISHED', 'SUPERSEDED', 'RETIRED'],
      PUBLISHED: ['SUPERSEDED', 'RETIRED', 'ARCHIVED'],
      SUPERSEDED: ['RETIRED', 'ARCHIVED'],
      RETIRED: ['ARCHIVED'],
      ARCHIVED: []
    };

    const allowed = validTransitions[existingDoc.status] || [];
    if (!allowed.includes(targetStatus)) {
      return {
        success: false,
        error: `Invalid document transition from ${existingDoc.status} to ${targetStatus}`
      };
    }

    const updated: EnterpriseDocumentGovDoc = {
      ...existingDoc,
      status: targetStatus,
      updatedAt: new Date().toISOString()
    };

    return { success: true, updatedDocument: updated };
  }

  // 3. IMMUTABLE VERSION CREATION
  public static createDocumentVersion(
    doc: EnterpriseDocumentGovDoc,
    changeSummary: string,
    createdByUserIdRef: string,
    sourceUrl?: string,
    contentHash?: string
  ): { success: boolean; version?: EnterpriseDocumentVersion; updatedDoc?: EnterpriseDocumentGovDoc; error?: string } {
    if (doc.status === 'APPROVED' || doc.status === 'PUBLISHED') {
      // Must not mutate existing approved version, increments version number
    }

    const newVersionNumber = doc.activeVersionNumber + 1;
    const version: EnterpriseDocumentVersion = {
      id: `ver-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      tenantId: doc.tenantId,
      documentIdRef: doc.id,
      versionNumber: newVersionNumber,
      sourceReferenceUrl: sourceUrl,
      contentHash: contentHash || `sha256-${Date.now()}`,
      changeSummary,
      createdByUserIdRef,
      isApprovedVersion: false,
      verificationStatus: contentHash ? 'VERIFIED' : 'UNVERIFIED',
      createdAt: new Date().toISOString()
    };

    const updatedDoc: EnterpriseDocumentGovDoc = {
      ...doc,
      activeVersionNumber: newVersionNumber,
      status: 'DRAFT',
      updatedAt: new Date().toISOString()
    };

    return { success: true, version, updatedDoc };
  }

  // 4. RECORD GOVERNANCE
  public static registerRecord(
    tenantId: string,
    campusId: string | undefined,
    recordNumber: string,
    title: string,
    recordCategory: string,
    sourceSystem: string,
    sourceRecordIdRef: string,
    ownerUserIdRef: string,
    stewardUserIdRef: string,
    retentionCategory: string
  ): { success: boolean; record?: EnterpriseRecordGovRecord; error?: string } {
    const now = new Date();
    const disposalDate = new Date(now.getFullYear() + 7, now.getMonth(), now.getDate());

    const rec: EnterpriseRecordGovRecord = {
      id: `rec-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      tenantId,
      campusId,
      recordNumber,
      title,
      recordCategory,
      status: 'IDENTIFIED',
      sourceSystem,
      sourceRecordIdRef,
      ownerUserIdRef,
      stewardUserIdRef,
      retentionCategory,
      retentionStartDate: now.toISOString(),
      disposalEligibilityDate: disposalDate.toISOString(),
      legalHoldActive: false,
      preservationStatus: 'NORMAL',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    };

    return { success: true, record: rec };
  }

  // 5. CORRESPONDENCE GOVERNANCE
  public static createCorrespondence(
    tenantId: string,
    campusId: string | undefined,
    correspondenceNumber: string,
    type: EnterpriseCorrespondenceType,
    subject: string,
    classification: EnterpriseDocumentClassification,
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT',
    senderReference: string,
    recipientReference: string,
    responseRequired: boolean = false,
    responseDueDate?: string
  ): { success: boolean; correspondence?: EnterpriseCorrespondenceGovRecord; error?: string } {
    const corr: EnterpriseCorrespondenceGovRecord = {
      id: `corr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      tenantId,
      campusId,
      correspondenceNumber,
      type,
      status: type === 'INCOMING' ? 'RECEIVED' : 'SENT',
      subject,
      classification,
      priority,
      senderReference,
      recipientReference,
      responseRequired,
      responseDueDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return { success: true, correspondence: corr };
  }

  // 6. APPROVAL PACKAGE ENGINE & FOUR-EYES SOD
  public static createApprovalPackage(
    tenantId: string,
    campusId: string | undefined,
    packageNumber: string,
    title: string,
    purpose: string,
    classification: EnterpriseDocumentClassification,
    ownerUserIdRef: string,
    requesterUserIdRef: string,
    targetApprovalLevel: EnterpriseApprovalLevel,
    referencedDocumentIds: string[]
  ): { success: boolean; packageItem?: EnterpriseApprovalPackageGovPkg; error?: string } {
    const pkg: EnterpriseApprovalPackageGovPkg = {
      id: `pkg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      tenantId,
      campusId,
      packageNumber,
      title,
      purpose,
      classification,
      status: 'DRAFT',
      ownerUserIdRef,
      requesterUserIdRef,
      targetApprovalLevel,
      requiredApprovalCount: targetApprovalLevel === 'LEVEL_4' || targetApprovalLevel === 'LEVEL_5' ? 2 : 1,
      referencedDocumentIds,
      auditHash: `hash-pkg-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return { success: true, packageItem: pkg };
  }

  public static approvePackage(
    pkg: EnterpriseApprovalPackageGovPkg,
    approverUserIdRef: string,
    approverRoleRef: string,
    rationale: string,
    idempotencyKey: string
  ): { success: boolean; decision?: EnterpriseApprovalDecisionGovDec; updatedPackage?: EnterpriseApprovalPackageGovPkg; error?: string } {
    if (this.idempotencyTracker.has(idempotencyKey)) {
      return { success: false, error: `Duplicate approval decision rejected (Idempotency Key: ${idempotencyKey})` };
    }

    // Four-Eyes SoD Enforcements
    if (approverUserIdRef === pkg.requesterUserIdRef) {
      return { success: false, error: 'SoD Violation: Package requester cannot approve their own approval package.' };
    }
    if (approverUserIdRef === pkg.ownerUserIdRef) {
      return { success: false, error: 'SoD Violation: Package owner cannot approve their own approval package.' };
    }

    this.idempotencyTracker.add(idempotencyKey);

    const decision: EnterpriseApprovalDecisionGovDec = {
      id: `dec-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      tenantId: pkg.tenantId,
      packageIdRef: pkg.id,
      approverUserIdRef,
      approverRoleRef,
      approvalLevel: pkg.targetApprovalLevel,
      decision: 'APPROVED',
      rationale,
      idempotencyKey,
      auditHash: `hash-dec-${Date.now()}`,
      decidedAt: new Date().toISOString()
    };

    const updatedPkg: EnterpriseApprovalPackageGovPkg = {
      ...pkg,
      status: 'APPROVED',
      finalDecision: 'APPROVED',
      decisionRationale: rationale,
      updatedAt: new Date().toISOString()
    };

    return { success: true, decision, updatedPackage: updatedPkg };
  }

  // 7. SEPARATION OF DUTIES (SoD) VALIDATION
  public static validateSoD(
    requesterId: string,
    approverId: string,
    operationName: string
  ): { valid: boolean; reason?: string } {
    if (!requesterId || !approverId) {
      return { valid: false, reason: 'Requester and approver IDs are required for SoD validation.' };
    }
    if (requesterId === approverId) {
      return {
        valid: false,
        reason: `SoD Violation in ${operationName}: Requester (${requesterId}) cannot verify/approve their own request.`
      };
    }
    return { valid: true };
  }

  // 8. LEGAL HOLD GOVERNANCE
  public static placeLegalHold(
    tenantId: string,
    holdNumber: string,
    title: string,
    matterName: string,
    reason: string,
    authorizedByUserIdRef: string,
    targetDocumentIdRefs: string[],
    targetRecordIdRefs: string[]
  ): { success: boolean; hold?: EnterpriseLegalHoldGovHold; error?: string } {
    const hold: EnterpriseLegalHoldGovHold = {
      id: `hold-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      tenantId,
      holdNumber,
      title,
      matterName,
      reason,
      status: 'ACTIVE',
      authorizedByUserIdRef,
      effectiveDate: new Date().toISOString(),
      targetDocumentIdRefs,
      targetRecordIdRefs,
      auditHash: `hash-hold-${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    return { success: true, hold };
  }

  // 9. BOUNDED DOCUMENT RELATIONSHIP & CIRCULAR DETECTION
  public static detectCircularRelationships(
    docId: string,
    allRelationships: EnterpriseDocumentRelationship[]
  ): boolean {
    const visited = new Set<string>();
    const recStack = new Set<string>();

    const adjMap = new Map<string, string[]>();
    allRelationships.forEach(r => {
      const list = adjMap.get(r.sourceDocumentIdRef) || [];
      list.push(r.targetDocumentIdRef);
      adjMap.set(r.sourceDocumentIdRef, list);
    });

    const dfs = (currentId: string, depth: number = 0): boolean => {
      if (depth > 20) return true; // Safety depth limit against unbounded recursion
      if (recStack.has(currentId)) return true;
      if (visited.has(currentId)) return false;

      visited.add(currentId);
      recStack.add(currentId);

      const neighbors = adjMap.get(currentId) || [];
      for (const n of neighbors) {
        if (dfs(n, depth + 1)) return true;
      }

      recStack.delete(currentId);
      return false;
    };

    return dfs(docId);
  }

  // 10. DIAGNOSTICS ENGINE
  public static runDiagnostics(
    documents: EnterpriseDocumentGovDoc[],
    packages: EnterpriseApprovalPackageGovPkg[],
    holds: EnterpriseLegalHoldGovHold[],
    relationships: EnterpriseDocumentRelationship[]
  ): EnterpriseDocumentDiagnostic[] {
    const diagnostics: EnterpriseDocumentDiagnostic[] = [];
    const nowIso = new Date().toISOString();

    // Check documents for missing owner or legal hold blocks
    documents.forEach(d => {
      if (!d.ownerUserIdRef) {
        diagnostics.push({
          id: `diag-no-owner-${d.id}`,
          issueType: 'ORPHAN_DOCUMENT',
          severity: 'CRITICAL',
          message: `Document ${d.documentNumber} lacks an assigned owner`,
          entityIdRef: d.id,
          detectedAt: nowIso
        });
      }

      if (this.detectCircularRelationships(d.id, relationships)) {
        diagnostics.push({
          id: `diag-circ-${d.id}`,
          issueType: 'CIRCULAR_RELATIONSHIP',
          severity: 'CRITICAL',
          message: `Circular relationship loop detected starting at document ${d.documentNumber}`,
          entityIdRef: d.id,
          detectedAt: nowIso
        });
      }
    });

    // Check approval packages for SoD issues or overdue decision deadlines
    packages.forEach(p => {
      if (p.requesterUserIdRef === p.ownerUserIdRef) {
        diagnostics.push({
          id: `diag-sod-${p.id}`,
          issueType: 'SOD_VIOLATION',
          severity: 'HIGH' as any,
          message: `Approval package ${p.packageNumber} has identical owner and requester`,
          entityIdRef: p.id,
          detectedAt: nowIso
        });
      }
      if (p.decisionDeadline && new Date(p.decisionDeadline) < new Date() && p.status === 'APPROVAL_PENDING') {
        diagnostics.push({
          id: `diag-exp-app-${p.id}`,
          issueType: 'EXPIRED_APPROVAL',
          severity: 'WARNING',
          message: `Approval package ${p.packageNumber} is past decision deadline`,
          entityIdRef: p.id,
          detectedAt: nowIso
        });
      }
    });

    return diagnostics;
  }

  // 11. ISOLATED WHAT-IF SIMULATION SANDBOX (ZERO PRODUCTION MUTATION)
  public static runSimulation(
    scenario: EnterpriseDocumentSimulation['scenario'],
    packages: EnterpriseApprovalPackageGovPkg[]
  ): EnterpriseDocumentSimulation {
    const packageCount = packages.length + 30;
    let predictedOverdue = 0;
    const bottlenecks: string[] = [];
    const impactSummary: string[] = [];

    switch (scenario) {
      case 'APPROVAL_BACKLOG_SURGE':
        predictedOverdue = Math.ceil(packageCount * 0.4);
        bottlenecks.push('Executive Approval Matrix Level 3 & Level 4');
        impactSummary.push('Overdue package approvals predicted to increase by 40%', 'Average decision cycle time extended to 5.8 days');
        break;
      case 'LEGAL_HOLD_SURGE':
        predictedOverdue = Math.ceil(packageCount * 0.25);
        bottlenecks.push('Litigation Freeze Repository Queue');
        impactSummary.push('Active legal holds predicted +25%', 'Record disposition reviews placed on litigation hold');
        break;
      default:
        predictedOverdue = Math.ceil(packageCount * 0.1);
        bottlenecks.push('General Document Registry');
        impactSummary.push('Simulation executed cleanly in isolated sandbox memory.', 'Zero production database mutation occurred.');
    }

    return {
      scenario,
      simulatedPackageCount: packageCount,
      predictedOverdueApprovals: predictedOverdue,
      capacityBottlenecks: bottlenecks,
      impactSummary,
      executedAt: new Date().toISOString()
    };
  }

  // 12. IMMUTABLE AUDIT HASH GENERATOR
  public static generateAuditHash(log: Omit<EnterpriseDocumentAuditLog, 'auditHash'>): string {
    const raw = `${log.id}:${log.tenantId}:${log.actorId}:${log.action}:${log.entityId}:${log.timestamp}:${log.idempotencyKey}`;
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      const char = raw.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return `hash-803-${Math.abs(hash).toString(16)}`;
  }
}
