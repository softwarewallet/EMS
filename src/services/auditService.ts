import { AuditRecord, AuditAction } from '../types';
import { FirebaseService } from './firebaseService';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

const AUDIT_COLLECTION = 'audit_logs';

export class AuditService {
  /**
   * Records an immutable security/system event
   */
  static async log(params: {
    tenantId: string;
    tenantName?: string;
    userId?: string;
    actorId?: string;
    userEmail?: string;
    userDisplayName?: string;
    actorName?: string;
    action: AuditAction;
    resource?: AuditRecord['resource'];
    targetResource?: string;
    resourceId?: string;
    targetId?: string;
    campusId?: string;
    resourceName?: string;
    previousValue?: Record<string, any> | null;
    newValue?: Record<string, any> | null;
    details?: Record<string, any>;
    result?: 'SUCCESS' | 'FAILURE' | 'DENIED';
    notes?: string;
  }): Promise<void> {
    try {
      const id = FirebaseService.generateId('aud');
      const userId = params.userId || params.actorId || 'system';
      const userEmail = params.userEmail || `${userId}@system.local`;
      const userDisplayName = params.userDisplayName || params.actorName || userId;
      const resourceId = params.resourceId || params.targetId || 'unknown';
      const resource = params.resource || (params.targetResource as any) || 'system';
      const newValue = params.newValue || params.details || null;
      let notes = params.notes || '';
      if (params.campusId && !notes.includes(params.campusId)) {
        notes = notes ? `${notes} (Campus: ${params.campusId})` : `Campus: ${params.campusId}`;
      }

      const record: AuditRecord = {
        id,
        tenantId: params.tenantId || 'DEFAULT',
        tenantName: params.tenantName || '',
        userId,
        userEmail,
        userDisplayName,
        action: params.action,
        resource,
        resourceId,
        ...(params.resourceName ? { resourceName: params.resourceName } : {}),
        timestamp: new Date().toISOString(),
        ipAddress: '127.0.0.1 (Client Gateway)',
        userAgent: typeof navigator !== 'undefined' && navigator.userAgent ? navigator.userAgent.substring(0, 100) : 'EMS Core System',
        previousValue: params.previousValue || null,
        newValue: newValue || null,
        result: params.result || 'SUCCESS',
        notes
      };

      await FirebaseService.setDocument(AUDIT_COLLECTION, id, record);
    } catch (e) {
      console.error("Failed to write audit log:", e);
    }
  }

  /**
   * Helper alias for log Action
   */
  static async logAction(
    arg1: string | { id: string; email?: string; displayName?: string },
    arg2: any,
    arg3: any,
    arg4?: any,
    arg5?: any,
    arg6?: any,
    arg7?: any,
    arg8?: any
  ): Promise<void> {
    // Check if called as (userId, userEmail, userDisplayName, action, resource, resourceId, tenantId, details)
    if (typeof arg1 === 'string' && typeof arg2 === 'string' && typeof arg3 === 'string' && typeof arg4 === 'string') {
      const userId = arg1;
      const userEmail = arg2;
      const userDisplayName = arg3;
      const action = arg4 as AuditAction;
      const resource = arg5 as AuditRecord['resource'];
      const resourceId = arg6 as string;
      const tenantId = (arg7 as string) || 'DEFAULT';
      const newValue = typeof arg8 === 'object' ? arg8 : null;
      const notes = typeof arg8 === 'string' ? arg8 : '';

      return this.log({
        tenantId,
        userId,
        userEmail,
        userDisplayName,
        action,
        resource,
        resourceId,
        newValue,
        notes
      });
    }

    // Called as (tenantId, user, action, resource, resourceId, ...)
    const tenantId = typeof arg1 === 'string' ? arg1 : 'DEFAULT';
    const user = arg2;
    const userId = typeof user === 'string' ? user : (user?.id || 'system');
    const userEmail = typeof user === 'string' ? `${user}@system.local` : (user?.email || `${userId}@system.local`);
    const userDisplayName = typeof user === 'string' ? user : (user?.displayName || userId);
    const action = arg3 as AuditAction;
    const resource = arg4 as AuditRecord['resource'];
    const resourceId = arg5 as string;

    let notes = '';
    let previousValue: Record<string, any> | null = null;
    let newValue: Record<string, any> | null = null;

    if (typeof arg6 === 'string') {
      notes = arg6;
      previousValue = arg7 || null;
      newValue = arg8 || null;
    } else {
      previousValue = arg6 || null;
      newValue = arg7 || null;
      if (typeof arg8 === 'string') {
        notes = arg8;
      }
    }

    return this.log({
      tenantId,
      userId,
      userEmail,
      userDisplayName,
      action,
      resource,
      resourceId,
      notes,
      previousValue,
      newValue
    });
  }

  /**
   * Alias for getLogs with object params
   */
  static async getAuditLogs(params: { tenantId: string; limit?: number }): Promise<AuditRecord[]> {
    return this.getLogs(params.tenantId, params.limit || 100);
  }

  /**
   * Alias for getLogs
   */
  static async queryAuditLogs(tenantId: string, options?: { limit?: number }): Promise<AuditRecord[]> {
    return this.getLogs(tenantId, options?.limit || 100);
  }

  /**
   * Retrieves audit records filtered by tenant or global
   */
  static async getLogs(tenantId: string, maxLimit: number = 100): Promise<AuditRecord[]> {
    try {
      const colRef = collection(db, AUDIT_COLLECTION);
      let q;
      if (tenantId === 'ALL') {
        q = query(colRef, orderBy('timestamp', 'desc'), limit(maxLimit));
      } else {
        q = query(
          colRef, 
          where('tenantId', 'in', [tenantId, 'ALL']), 
          orderBy('timestamp', 'desc'), 
          limit(maxLimit)
        );
      }

      const snap = await getDocs(q);
      return (snap.docs || []).map(d => ({ id: d.id, ...(d.data() as object) } as AuditRecord));
    } catch (error) {
      // Fallback query without complex index if needed
      try {
        const colRef = collection(db, AUDIT_COLLECTION);
        const q = query(colRef, limit(maxLimit));
        const snap = await getDocs(q);
        const docs = (snap.docs || []).map(d => ({ id: d.id, ...(d.data() as object) } as AuditRecord));
        if (tenantId !== 'ALL') {
          return docs
            .filter(d => d.tenantId === tenantId || d.tenantId === 'ALL')
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        }
        return docs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      } catch (fallbackErr) {
        console.warn("Audit logs query failed:", fallbackErr);
        return [];
      }
    }
  }
}
