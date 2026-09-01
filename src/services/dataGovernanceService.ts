import { 
  DataDomain, DataAsset, DataQualityIssue, DataGovernanceAuditEvent 
} from '../types/dataGovernance';

export class DataGovernanceService {
  
  static async logAudit(
    tenantId: string, 
    actorId: string, 
    action: string, 
    entityType: string, 
    entityId: string, 
    resultingState: any = null,
    justification?: string
  ): Promise<DataGovernanceAuditEvent> {
    const event: DataGovernanceAuditEvent = {
      id: `dgevt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
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
    // In a real app, write to Firestore
    return event;
  }

  static async runDataGovernanceDiagnostics(tenantId: string, assets: DataAsset[]): Promise<DataQualityIssue[]> {
    const issues: DataQualityIssue[] = [];
    
    // Simulate detecting orphan data assets (no owner or steward)
    assets.forEach(asset => {
      if (!asset.ownerId || !asset.stewardId) {
        issues.push({
          id: `dqi_${Date.now()}_${asset.id}`,
          tenantId,
          campusScope: asset.campusScope || 'GLOBAL',
          issueType: 'ORPHAN_ASSET',
          severity: 'HIGH',
          domainId: asset.domainId || 'UNKNOWN',
          assetId: asset.id,
          description: `Data asset ${asset.name} is missing an owner or steward.`,
          detectedAt: new Date().toISOString(),
          ownerId: 'SYSTEM',
          stewardId: 'SYSTEM',
          status: 'OPEN',
          createdAt: new Date().toISOString()
        });
      }
    });

    return issues;
  }

  static validateSoD(creatorId: string, reviewerId?: string, approverId?: string) {
    if (approverId && creatorId === approverId) {
      throw new Error('Separation of Duties violation: Creator cannot approve their own asset or certification.');
    }
    if (reviewerId && approverId && reviewerId === approverId) {
      throw new Error('Separation of Duties violation: Reviewer cannot be the final approver.');
    }
  }

  // Safe Math functions for quality scoring
  static safeDivide(numerator: number, denominator: number): number {
    if (!denominator || isNaN(denominator) || denominator === 0) return 0;
    if (isNaN(numerator) || !numerator) return 0;
    const result = numerator / denominator;
    if (!isFinite(result)) return 0;
    return result;
  }
  
  static safePercentage(numerator: number, denominator: number): number {
    return Math.round(this.safeDivide(numerator, denominator) * 100);
  }
}
