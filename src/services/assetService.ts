import { FirebaseService } from './firebaseService';
import { AuditService } from './auditService';
import { UserActor } from '../types/inventory';
import {
  MaintenanceSchedule,
  MaintenanceWorkOrder,
  FacilityRequest,
  AssetInspection,
  Warranty,
  ServiceContract,
  AssetIncident,
  DisposalRecord,
  MaintenancePriority,
  MaintenanceStatus
} from '../types/asset';
import { InventoryAsset, AssetAssignment } from '../types/inventory';
import { db } from '../config/firebase';
import { doc, runTransaction, getDoc, collection, where } from 'firebase/firestore';

const MAINTENANCE_SCHEDULES_COL = 'asset_maintenance_schedules';
const WORK_ORDERS_COL = 'asset_work_orders';
const FACILITY_REQUESTS_COL = 'facility_requests';
const INSPECTIONS_COL = 'asset_inspections';
const WARRANTIES_COL = 'asset_warranties';
const CONTRACTS_COL = 'asset_service_contracts';
const INCIDENTS_COL = 'asset_incidents';
const DISPOSALS_COL = 'asset_disposals';
const ASSETS_COL = 'inventory_assets'; // From inventory

export class AssetService {

  // ==========================================
  // MAINTENANCE WORK ORDERS
  // ==========================================

  static async getWorkOrders(tenantId: string, campusId?: string): Promise<MaintenanceWorkOrder[]> {
    const constraints = campusId ? [where('campusId', '==', campusId)] : [];
    return FirebaseService.getTenantCollection<MaintenanceWorkOrder>(WORK_ORDERS_COL, tenantId, constraints);
  }

  static async createWorkOrder(
    tenantId: string,
    data: Omit<MaintenanceWorkOrder, 'id' | 'tenantId' | 'workOrderNumber' | 'createdAt' | 'updatedAt' | 'version' | 'status'>,
    actor: UserActor
  ): Promise<MaintenanceWorkOrder> {
    const id = `wo_${Date.now()}`;
    const now = new Date().toISOString();
    const shortId = FirebaseService.generateId('').split('-')[0].substring(0, 6).toUpperCase();
    
    const newWorkOrder: MaintenanceWorkOrder = {
      ...data,
      id,
      tenantId,
      workOrderNumber: `WO-${new Date().getFullYear()}-${shortId}`,
      status: 'OPEN',
      createdAt: now,
      updatedAt: now,
      version: 1
    };

    await FirebaseService.setDocument(WORK_ORDERS_COL, id, newWorkOrder);
    
    await AuditService.log({
      tenantId,
      campusId: data.campusId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'MAINTENANCE_CREATED' as any,
      targetResource: 'maintenance_work_order',
      targetId: id,
      details: { workOrderNumber: newWorkOrder.workOrderNumber, title: data.title }
    });

    return newWorkOrder;
  }

  static async updateWorkOrderStatus(
    tenantId: string,
    workOrderId: string,
    newStatus: MaintenanceStatus,
    actor: UserActor,
    details?: { diagnosis?: string; repairActivity?: string; cost?: number }
  ): Promise<MaintenanceWorkOrder> {
    const existing = await FirebaseService.getDocument<MaintenanceWorkOrder>(WORK_ORDERS_COL, workOrderId);
    if (!existing || existing.tenantId !== tenantId) {
      throw new Error('Work order not found');
    }

    // Example state machine enforcement
    if (existing.status === 'CLOSED' || existing.status === 'CANCELLED') {
      throw new Error('Cannot update a closed or cancelled work order');
    }

    const now = new Date().toISOString();
    const updates: Partial<MaintenanceWorkOrder> = {
      status: newStatus,
      updatedAt: now,
      version: existing.version + 1,
      ...details
    };

    if (newStatus === 'COMPLETED') {
      updates.completedAt = now;
    }

    await FirebaseService.updateDocument(WORK_ORDERS_COL, workOrderId, updates);
    
    if (newStatus === 'COMPLETED') {
       await AuditService.log({
        tenantId,
        campusId: existing.campusId,
        actorId: actor.id,
        actorName: actor.displayName,
        action: 'MAINTENANCE_COMPLETED' as any,
        targetResource: 'maintenance_work_order',
        targetId: workOrderId,
        details: { workOrderNumber: existing.workOrderNumber, cost: details?.cost }
      });
    }

    return { ...existing, ...updates } as MaintenanceWorkOrder;
  }

  // ==========================================
  // FACILITY REQUESTS
  // ==========================================

  static async getFacilityRequests(tenantId: string, campusId?: string): Promise<FacilityRequest[]> {
    const constraints = campusId ? [where('campusId', '==', campusId)] : [];
    return FirebaseService.getTenantCollection<FacilityRequest>(FACILITY_REQUESTS_COL, tenantId, constraints);
  }

  static async createFacilityRequest(
    tenantId: string,
    data: Omit<FacilityRequest, 'id' | 'tenantId' | 'requestNumber' | 'createdAt' | 'updatedAt' | 'version' | 'status'>,
    actor: UserActor
  ): Promise<FacilityRequest> {
    const id = `fac_${Date.now()}`;
    const now = new Date().toISOString();
    const shortId = FirebaseService.generateId('').split('-')[0].substring(0, 6).toUpperCase();
    
    const newRequest: FacilityRequest = {
      ...data,
      id,
      tenantId,
      requestNumber: `FAC-${new Date().getFullYear()}-${shortId}`,
      status: 'OPEN',
      createdAt: now,
      updatedAt: now,
      version: 1
    };

    await FirebaseService.setDocument(FACILITY_REQUESTS_COL, id, newRequest);
    
    await AuditService.log({
      tenantId,
      campusId: data.campusId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'FACILITY_REQUEST_CREATED' as any,
      targetResource: 'facility_request',
      targetId: id,
      details: { requestNumber: newRequest.requestNumber, title: data.title }
    });

    return newRequest;
  }

  // ==========================================
  // DISPOSAL WORKFLOW
  // ==========================================

  static async proposeDisposal(
    tenantId: string,
    data: Omit<DisposalRecord, 'id' | 'tenantId' | 'disposalNumber' | 'createdAt' | 'updatedAt' | 'status' | 'approvedById'>,
    actor: UserActor
  ): Promise<DisposalRecord> {
    const asset = await FirebaseService.getDocument<InventoryAsset>(ASSETS_COL, data.assetId);
    if (!asset || asset.tenantId !== tenantId) {
      throw new Error('Asset not found');
    }

    const id = `disp_${Date.now()}`;
    const now = new Date().toISOString();
    const shortId = FirebaseService.generateId('').split('-')[0].substring(0, 6).toUpperCase();
    
    const disposal: DisposalRecord = {
      ...data,
      id,
      tenantId,
      disposalNumber: `DISP-${new Date().getFullYear()}-${shortId}`,
      status: 'DISPOSAL_PROPOSED',
      createdAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(DISPOSALS_COL, id, disposal);

    await AuditService.log({
      tenantId,
      campusId: data.campusId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'ASSET_DISPOSAL_PROPOSED' as any,
      targetResource: 'disposal_record',
      targetId: id,
      details: { disposalNumber: disposal.disposalNumber, assetId: data.assetId }
    });

    return disposal;
  }

  static async approveDisposal(
    tenantId: string,
    disposalId: string,
    actor: UserActor
  ): Promise<DisposalRecord> {
    const existing = await FirebaseService.getDocument<DisposalRecord>(DISPOSALS_COL, disposalId);
    if (!existing || existing.tenantId !== tenantId) {
      throw new Error('Disposal record not found');
    }

    if (existing.status !== 'DISPOSAL_PROPOSED' && existing.status !== 'UNDER_REVIEW') {
      throw new Error('Cannot approve disposal in its current state');
    }

    const now = new Date().toISOString();

    await runTransaction(db, async (t) => {
      const dispRef = doc(db, DISPOSALS_COL, disposalId);
      const assetRef = doc(db, ASSETS_COL, existing.assetId);
      
      const assetDoc = await t.get(assetRef);
      if (!assetDoc.exists()) {
        throw new Error('Asset not found');
      }

      t.update(dispRef, {
        status: 'APPROVED',
        approvedById: actor.id,
        updatedAt: now
      });

      t.update(assetRef, {
        status: 'WRITTEN_OFF', // Transition to WRITTEN_OFF before final DISPOSED
        updatedAt: now,
        version: assetDoc.data().version + 1
      });
    });

    await AuditService.log({
      tenantId,
      campusId: existing.campusId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'ASSET_DISPOSAL_APPROVED' as any,
      targetResource: 'disposal_record',
      targetId: disposalId,
      details: { disposalNumber: existing.disposalNumber }
    });

    return { ...existing, status: 'APPROVED', approvedById: actor.id, updatedAt: now };
  }

}
