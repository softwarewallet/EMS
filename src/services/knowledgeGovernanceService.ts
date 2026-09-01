import { 
  InstitutionalKnowledgeAsset, 
  KnowledgeDataQualityIssue, 
  KnowledgeAuditEvent
} from '../types/knowledgeGovernance';

export class KnowledgeGovernanceService {
  static async logAudit(
    tenantId: string, 
    actorId: string, 
    action: string, 
    entityType: string, 
    entityId: string, 
    resultingState: any = null,
    justification?: string
  ): Promise<KnowledgeAuditEvent> {
    const event: KnowledgeAuditEvent = {
      id: `kgevt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      tenantId,
      campusScope: resultingState?.campusScope || 'GLOBAL',
      actorId,
      action,
      entityType,
      entityId,
      timestamp: new Date().toISOString(),
      resultingState,
      justification
    };
    return event;
  }

  static async runContradictionDiagnostics(tenantId: string, policies: InstitutionalKnowledgeAsset[]): Promise<KnowledgeDataQualityIssue[]> {
    const issues: KnowledgeDataQualityIssue[] = [];
    
    const activePolicies = policies.filter(p => p.status === 'PUBLISHED' || p.status === 'ACTIVE');
    const grouped = activePolicies.reduce((acc, policy) => {
      acc[policy.category] = acc[policy.category] || [];
      acc[policy.category].push(policy);
      return acc;
    }, {} as Record<string, InstitutionalKnowledgeAsset[]>);

    for (const [category, items] of Object.entries(grouped)) {
      if (items.length > 1) {
        issues.push({
          id: `kq_${Date.now()}`,
          tenantId,
          campusScope: 'GLOBAL',
          entityType: 'InstitutionalKnowledgeAsset',
          entityId: items[0].id,
          severity: 'HIGH',
          status: 'OPEN',
          description: `POTENTIAL_CONFLICT: Multiple active assets in category ${category}`,
          detectedAt: new Date().toISOString(),
          remediation: 'Review and supersede older policies'
        });
      }
    }
    return issues;
  }

  static validateSoD(creatorId: string, reviewerId?: string, approverId?: string) {
    if (approverId && creatorId === approverId) {
      throw new Error('Separation of Duties violation: Creator cannot approve their own asset.');
    }
    if (reviewerId && approverId && reviewerId === approverId) {
      throw new Error('Separation of Duties violation: Reviewer cannot be the final approver.');
    }
  }

  static checkClassificationChange(oldClass: string, newClass: string, hasAdminRole: boolean) {
    const order = ['PUBLIC', 'INTERNAL', 'CONFIDENTIAL', 'RESTRICTED', 'HIGHLY_CONFIDENTIAL'];
    const oldIdx = order.indexOf(oldClass);
    const newIdx = order.indexOf(newClass);
    
    if (newIdx < oldIdx && !hasAdminRole) {
      throw new Error('Classification downgrade prevention: Only authorized administrators can downgrade knowledge classifications.');
    }
  }

  static validateLifecycleTransition(oldStatus: string, newStatus: string) {
    const validTransitions: Record<string, string[]> = {
      'DRAFT': ['REVIEW', 'ARCHIVED'],
      'REVIEW': ['APPROVAL_PENDING', 'DRAFT'],
      'APPROVAL_PENDING': ['APPROVED', 'DRAFT'],
      'APPROVED': ['PUBLISHED', 'DRAFT'],
      'PUBLISHED': ['ACTIVE', 'UNDER_REVIEW', 'SUPERSEDED', 'RETIRED'],
      'ACTIVE': ['UNDER_REVIEW', 'SUPERSEDED', 'RETIRED'],
      'UNDER_REVIEW': ['ACTIVE', 'SUPERSEDED', 'RETIRED'],
      'SUPERSEDED': ['ARCHIVED'],
      'RETIRED': ['ARCHIVED'],
      'ARCHIVED': []
    };
    const allowed = validTransitions[oldStatus] || [];
    if (!allowed.includes(newStatus)) {
      throw new Error(`Invalid lifecycle transition from ${oldStatus} to ${newStatus}`);
    }
  }

  static async logOrgAudit(
    tenantId: string, 
    actorId: string, 
    action: string, 
    entityType: string, 
    entityId: string, 
    resultingState: any = null,
    justification?: string
  ) {
    const event = {
      id: `okgevt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      tenantId,
      campusScope: resultingState?.campusScope || 'GLOBAL',
      actorId,
      action,
      entityType,
      entityId,
      timestamp: new Date().toISOString(),
      resultingState,
      justification
    };
    return event;
  }

  static async runKnowledgeGovernanceDiagnostics(tenantId: string, assets: any[]): Promise<any[]> {
    const issues: any[] = [];
    
    assets.forEach(asset => {
      if (!asset.ownerId) {
        issues.push({
          type: 'ORPHAN_KNOWLEDGE_ASSET',
          assetId: asset.id,
          description: `Knowledge asset ${asset.title} is missing an owner.`
        });
      }
    });
    
    assets.forEach(asset => {
      if (asset.type === 'LESSON_LEARNED' && (!asset.evidenceRefs || asset.evidenceRefs.length === 0)) {
        issues.push({
          type: 'MISSING_EVIDENCE',
          assetId: asset.id,
          description: `Lesson learned ${asset.title} is missing evidence references.`
        });
      }
    });

    return issues;
  }
}
