import { FirebaseService } from './firebaseService';
import { AuditService } from './auditService';
import { InstitutionalPerformanceFramework } from '../types/institutionalPerformanceAssurance';

export class InstitutionalPerformanceAssuranceService {
  static async createFramework(tenantId: string, campusId: string, data: Omit<InstitutionalPerformanceFramework, 'id' | 'tenantId' | 'campusId' | 'createdAt' | 'updatedAt'>, actorId: string): Promise<string> {
    const id = FirebaseService.generateId('perf-framework');
    const framework: InstitutionalPerformanceFramework = {
      ...data,
      id,
      tenantId,
      campusId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await FirebaseService.setDocument('performance_frameworks', id, framework);
    await AuditService.logAction(tenantId, actorId, 'CREATE_PERFORMANCE_FRAMEWORK', 'InstitutionalPerformanceFramework', id, { name: data.name });
    return id;
  }
}
