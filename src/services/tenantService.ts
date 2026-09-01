import { Tenant, Campus, Building, Classroom, TenantBranding, AcademicConfig } from '../types';
import { FirebaseService } from './firebaseService';
import { AuditService } from './auditService';

const TENANTS_COL = 'tenants';
const CAMPUSES_COL = 'campuses';
const BUILDINGS_COL = 'buildings';
const CLASSROOMS_COL = 'classrooms';

export class TenantService {
  /**
   * Get all registered institutions / tenants
   */
  static async getAllTenants(): Promise<Tenant[]> {
    return FirebaseService.getTenantCollection<Tenant>(TENANTS_COL, 'ALL');
  }

  /**
   * Get single tenant by ID
   */
  static async getTenantById(id: string): Promise<Tenant | null> {
    return FirebaseService.getDocument<Tenant>(TENANTS_COL, id);
  }

  /**
   * Create new institutional tenant
   */
  static async createTenant(
    data: Omit<Tenant, 'id' | 'createdAt' | 'updatedAt'>,
    performedBy: { userId: string; email: string; name: string }
  ): Promise<Tenant> {
    const id = FirebaseService.generateId('ten');
    const now = new Date().toISOString();
    const newTenant: Tenant = {
      ...data,
      id,
      createdAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(TENANTS_COL, id, newTenant);

    // Create default Main Campus automatically
    const campusId = FirebaseService.generateId('cmp');
    const mainCampus: Campus = {
      id: campusId,
      tenantId: id,
      name: `${data.name} - Main Campus`,
      code: `${data.code}-MC`,
      address: `${data.address?.street || ''}, ${data.address?.city || ''}, ${data.address?.country || ''}`.replace(/^, |, $/g, ''),
      isMainCampus: true,
      contactEmail: data.email,
      contactPhone: data.phone,
      createdAt: now
    };
    await FirebaseService.setDocument(CAMPUSES_COL, campusId, mainCampus);

    // Audit record
    await AuditService.log({
      tenantId: id,
      tenantName: newTenant.name,
      userId: performedBy.userId,
      userEmail: performedBy.email,
      userDisplayName: performedBy.name,
      action: 'TENANT_CREATED',
      resource: 'tenant',
      resourceId: id,
      resourceName: newTenant.name,
      newValue: newTenant,
      result: 'SUCCESS',
      notes: `Institutional tenant ${newTenant.name} registered with main campus.`
    });

    return newTenant;
  }

  /**
   * Update tenant details or branding
   */
  static async updateTenant(
    id: string,
    data: Partial<Tenant>,
    performedBy: { userId: string; email: string; name: string }
  ): Promise<void> {
    const prev = await this.getTenantById(id);
    await FirebaseService.updateDocument(TENANTS_COL, id, data);

    await AuditService.log({
      tenantId: id,
      tenantName: prev?.name || id,
      userId: performedBy.userId,
      userEmail: performedBy.email,
      userDisplayName: performedBy.name,
      action: 'TENANT_UPDATED',
      resource: 'tenant',
      resourceId: id,
      resourceName: data.name || prev?.name,
      previousValue: prev || undefined,
      newValue: data,
      result: 'SUCCESS'
    });
  }

  // Campus Operations
  static async getCampuses(tenantId: string): Promise<Campus[]> {
    return FirebaseService.getTenantCollection<Campus>(CAMPUSES_COL, tenantId);
  }

  static async createCampus(campus: Omit<Campus, 'id' | 'createdAt'>): Promise<Campus> {
    const id = FirebaseService.generateId('cmp');
    const newCampus: Campus = {
      ...campus,
      id,
      createdAt: new Date().toISOString()
    };
    await FirebaseService.setDocument(CAMPUSES_COL, id, newCampus);
    return newCampus;
  }

  // Building & Classroom Operations
  static async getClassrooms(tenantId: string): Promise<Classroom[]> {
    return FirebaseService.getTenantCollection<Classroom>(CLASSROOMS_COL, tenantId);
  }

  static async createClassroom(classroom: Omit<Classroom, 'id'>): Promise<Classroom> {
    const id = FirebaseService.generateId('cls');
    const newRoom: Classroom = {
      ...classroom,
      id
    };
    await FirebaseService.setDocument(CLASSROOMS_COL, id, newRoom);
    return newRoom;
  }
}
