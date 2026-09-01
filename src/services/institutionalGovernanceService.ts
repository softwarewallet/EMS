import { FirebaseService } from './firebaseService';
import { AuditService } from './auditService';
import { InstitutionalGovernanceFramework, GovernanceObligation, GovernanceControl } from '../types/institutionalGovernance';

export class InstitutionalGovernanceService {
  static async createFramework(tenantId: string, campusId: string, data: Omit<InstitutionalGovernanceFramework, 'id' | 'tenantId' | 'campusId' | 'createdAt' | 'updatedAt'>, actorId: string): Promise<string> {
    const id = FirebaseService.generateId('govfw');
    const framework: InstitutionalGovernanceFramework = {
      ...data,
      id,
      tenantId,
      campusId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await FirebaseService.setDocument('governance_frameworks', id, framework);
    await AuditService.logAction(tenantId, actorId, 'CREATE_FRAMEWORK', 'InstitutionalGovernanceFramework', id, { name: data.name });
    return id;
  }
}
