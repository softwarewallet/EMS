import { FirebaseService } from './firebaseService';
import { AuditService } from './auditService';
import { 
  TimetableProfile, 
  PeriodStructure, 
  SchedulingResource, 
  TimetableSlot, 
  SubstituteTeacher, 
  TimetableConflict 
} from '../types/timetable';

const PROFILES_COL = 'timetables';
const PERIODS_COL = 'period_structures';
const RESOURCES_COL = 'scheduling_resources';
const SLOTS_COL = 'timetable_slots';
const SUBSTITUTIONS_COL = 'substitutions';
const CONFLICTS_COL = 'timetable_conflicts';

export class TimetableService {
  /**
   * Get period structures
   */
  static async getPeriodStructures(tenantId: string, campusId?: string): Promise<PeriodStructure[]> {
    let list = await FirebaseService.getTenantCollection<PeriodStructure>(PERIODS_COL, tenantId);
    if (campusId) {
      list = list.filter(p => !p.campusId || p.campusId === campusId);
    }
    return list || [];
  }

  static async savePeriodStructure(
    structure: Omit<PeriodStructure, 'periodStructureId' | 'createdAt' | 'updatedAt'>,
    user: { id: string; email: string; displayName?: string }
  ): Promise<PeriodStructure> {
    const periodStructureId = `ps_${Date.now()}`;
    const now = new Date().toISOString();
    const record: PeriodStructure = { ...structure, periodStructureId, createdAt: now, updatedAt: now };

    await FirebaseService.setDocument(PERIODS_COL, periodStructureId, record);

    await AuditService.log({
      tenantId: structure.tenantId,
      userId: user.id,
      userEmail: user.email,
      userDisplayName: user.displayName || user.email,
      action: 'PERIOD_STRUCTURE_CREATED' as any,
      resource: 'period_structure' as any,
      resourceId: periodStructureId,
      resourceName: structure.name,
      newValue: record,
      result: 'SUCCESS'
    });
    return record;
  }

  /**
   * Get timetables
   */
  static async getTimetables(tenantId: string, campusId?: string, academicYearId?: string): Promise<TimetableProfile[]> {
    let list = await FirebaseService.getTenantCollection<TimetableProfile>(PROFILES_COL, tenantId);
    if (campusId) list = list.filter(t => !t.campusId || t.campusId === campusId);
    if (academicYearId) list = list.filter(t => t.academicYearId === academicYearId);
    return list || [];
  }

  static async saveTimetable(
    timetable: Omit<TimetableProfile, 'timetableId' | 'createdAt' | 'updatedAt'>,
    user: { id: string; email: string; displayName?: string }
  ): Promise<TimetableProfile> {
    const timetableId = `tt_${Date.now()}`;
    const now = new Date().toISOString();
    const record: TimetableProfile = { ...timetable, timetableId, createdAt: now, updatedAt: now };

    await FirebaseService.setDocument(PROFILES_COL, timetableId, record);

    await AuditService.log({
      tenantId: timetable.tenantId,
      userId: user.id,
      userEmail: user.email,
      userDisplayName: user.displayName || user.email,
      action: 'TIMETABLE_CREATED' as any,
      resource: 'timetable' as any,
      resourceId: timetableId,
      resourceName: timetable.name,
      newValue: record,
      result: 'SUCCESS'
    });
    return record;
  }

  /**
   * Get resources
   */
  static async getResources(tenantId: string, campusId?: string): Promise<SchedulingResource[]> {
    let list = await FirebaseService.getTenantCollection<SchedulingResource>(RESOURCES_COL, tenantId);
    if (campusId) list = list.filter(r => !r.campusId || r.campusId === campusId);
    return list || [];
  }

  static async saveResource(
    resource: Omit<SchedulingResource, 'resourceId' | 'createdAt' | 'updatedAt'>,
    user: { id: string; email: string; displayName?: string }
  ): Promise<SchedulingResource> {
    const resourceId = `res_${Date.now()}`;
    const now = new Date().toISOString();
    const record: SchedulingResource = { ...resource, resourceId, createdAt: now, updatedAt: now };

    await FirebaseService.setDocument(RESOURCES_COL, resourceId, record);

    await AuditService.log({
      tenantId: resource.tenantId,
      userId: user.id,
      userEmail: user.email,
      userDisplayName: user.displayName || user.email,
      action: 'RESOURCE_CREATED' as any,
      resource: 'resource' as any,
      resourceId,
      resourceName: resource.name,
      newValue: record,
      result: 'SUCCESS'
    });
    return record;
  }

  /**
   * Get slots
   */
  static async getTimetableSlots(tenantId: string, timetableId?: string): Promise<TimetableSlot[]> {
    let list = await FirebaseService.getTenantCollection<TimetableSlot>(SLOTS_COL, tenantId);
    if (timetableId) list = list.filter(s => s.timetableId === timetableId);
    return list || [];
  }

  static async saveTimetableSlot(
    slot: Omit<TimetableSlot, 'slotId' | 'createdAt' | 'updatedAt'>,
    user: { id: string; email: string; displayName?: string }
  ): Promise<TimetableSlot> {
    const slotId = `ts_${Date.now()}`;
    const now = new Date().toISOString();
    const record: TimetableSlot = { ...slot, slotId, createdAt: now, updatedAt: now };

    // Simple conflict detection (Teacher)
    const existingSlots = await this.getTimetableSlots(slot.tenantId, slot.timetableId);
    const hasConflict = existingSlots.some(s => 
      s.dayOfWeek === slot.dayOfWeek && 
      s.periodId === slot.periodId && 
      s.teacherId === slot.teacherId &&
      s.status === 'ACTIVE'
    );

    if (hasConflict) {
      throw new Error('Teacher Conflict Detected: Teacher is already assigned to this period.');
    }

    await FirebaseService.setDocument(SLOTS_COL, slotId, record);

    await AuditService.log({
      tenantId: slot.tenantId,
      userId: user.id,
      userEmail: user.email,
      userDisplayName: user.displayName || user.email,
      action: 'SLOT_CREATED' as any,
      resource: 'timetable_slot' as any,
      resourceId: slotId,
      newValue: record,
      result: 'SUCCESS'
    });
    return record;
  }

  /**
   * Get substitutions
   */
  static async getSubstitutions(tenantId: string): Promise<SubstituteTeacher[]> {
    return (await FirebaseService.getTenantCollection<SubstituteTeacher>(SUBSTITUTIONS_COL, tenantId)) || [];
  }

  static async saveSubstitution(
    sub: Omit<SubstituteTeacher, 'substitutionId' | 'status'>,
    user: { id: string; email: string; displayName?: string }
  ): Promise<SubstituteTeacher> {
    const substitutionId = `sub_${Date.now()}`;
    const record: SubstituteTeacher = { ...sub, substitutionId, status: 'REQUESTED' };

    await FirebaseService.setDocument(SUBSTITUTIONS_COL, substitutionId, record);

    await AuditService.log({
      tenantId: sub.tenantId,
      userId: user.id,
      userEmail: user.email,
      userDisplayName: user.displayName || user.email,
      action: 'SUBSTITUTION_CREATED' as any,
      resource: 'substitution' as any,
      resourceId: substitutionId,
      newValue: record,
      result: 'SUCCESS'
    });
    return record;
  }

  /**
   * Get conflicts
   */
  static async getConflicts(tenantId: string): Promise<TimetableConflict[]> {
    return (await FirebaseService.getTenantCollection<TimetableConflict>(CONFLICTS_COL, tenantId)) || [];
  }
}
