// EMS Phase 7.15A - Library & Learning Resource Foundation Service Engine

import {
  LibraryProfile,
  LibraryResource,
  LibraryResourceVersion,
  LibraryResourceCopy,
  LibraryResourceAuthor,
  LibraryResourcePublisher,
  LibraryResourceCategory,
  LibraryResourceLocation,
  LibraryResourceIdentifier,
  LibraryResourceSubjectMapping,
  LibraryResourceCurriculumMapping,
  LibraryMembership,
  LibraryAcquisition,
  LibraryAnalyticsCache,
  ResourceStatus,
  CopyStatus,
  MembershipStatus,
  AcquisitionStatus,
  IdentifierType
} from '../types/library';
import { FirebaseService } from './firebaseService';
import { AuditService } from './auditService';
import { where } from 'firebase/firestore';

const LIBRARIES_COL = 'library_profiles';
const RESOURCES_COL = 'library_resources';
const RESOURCE_VERSIONS_COL = 'library_resource_versions';
const COPIES_COL = 'library_resource_copies';
const AUTHORS_COL = 'library_resource_authors';
const PUBLISHERS_COL = 'library_resource_publishers';
const CATEGORIES_COL = 'library_resource_categories';
const LOCATIONS_COL = 'library_resource_locations';
const IDENTIFIERS_COL = 'library_resource_identifiers';
const SUBJECT_MAPPINGS_COL = 'library_resource_subject_mappings';
const CURRICULUM_MAPPINGS_COL = 'library_resource_curriculum_mappings';
const MEMBERSHIPS_COL = 'library_memberships';
const ACQUISITIONS_COL = 'library_acquisitions';
const ANALYTICS_COL = 'library_analytics_cache';

export interface UserActor {
  id: string;
  email: string;
  displayName: string;
  role?: string;
}

export class LibraryService {

  // ============================================================================
  // 1. LIBRARY PROFILES
  // ============================================================================

  static async getLibraries(tenantId: string, campusId?: string): Promise<LibraryProfile[]> {
    const constraints = campusId ? [where('campusId', '==', campusId)] : [];
    return FirebaseService.getTenantCollection<LibraryProfile>(LIBRARIES_COL, tenantId, constraints);
  }

  static async getLibrary(libraryId: string, tenantId: string): Promise<LibraryProfile | null> {
    const lib = await FirebaseService.getDocument<LibraryProfile>(LIBRARIES_COL, libraryId);
    if (lib && lib.tenantId !== tenantId && tenantId !== 'ALL') {
      console.warn(`IDOR Violation: Access denied to library ${libraryId} for tenant ${tenantId}`);
      return null;
    }
    return lib;
  }

  static async createLibrary(
    profile: Omit<LibraryProfile, 'id' | 'currentVersion' | 'createdAt' | 'updatedAt'>,
    actor: UserActor
  ): Promise<LibraryProfile> {
    const id = FirebaseService.generateId('lib');
    const newLib: LibraryProfile = {
      ...profile,
      id,
      currentVersion: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await FirebaseService.setDocument(LIBRARIES_COL, id, newLib);

    await AuditService.logAction(
      actor.id,
      actor.email,
      actor.displayName,
      'LIBRARY_CREATED',
      'library_profile',
      id,
      newLib.tenantId,
      {
        name: newLib.name,
        code: newLib.code,
        libraryType: newLib.libraryType
      }
    );

    return newLib;
  }

  static async updateLibrary(
    libraryId: string,
    updates: Partial<LibraryProfile>,
    actor: UserActor,
    tenantId: string
  ): Promise<LibraryProfile> {
    const existing = await this.getLibrary(libraryId, tenantId);
    if (!existing) throw new Error('Library profile not found or access denied');

    const updated: LibraryProfile = {
      ...existing,
      ...updates,
      updatedBy: actor.id,
      updatedAt: new Date().toISOString()
    };

    await FirebaseService.updateDocument(LIBRARIES_COL, libraryId, updated);

    await AuditService.logAction(
      actor.id,
      actor.email,
      actor.displayName,
      'LIBRARY_UPDATED',
      'library_profile',
      libraryId,
      tenantId,
      { previous: existing, updated }
    );

    return updated;
  }

  // ============================================================================
  // 2. RESOURCE AUTHORS & PUBLISHERS & CATEGORIES & LOCATIONS
  // ============================================================================

  static async getAuthors(tenantId: string): Promise<LibraryResourceAuthor[]> {
    return FirebaseService.getTenantCollection<LibraryResourceAuthor>(AUTHORS_COL, tenantId);
  }

  static async createAuthor(
    author: Omit<LibraryResourceAuthor, 'id' | 'createdAt' | 'updatedAt'>,
    actor: UserActor
  ): Promise<LibraryResourceAuthor> {
    const id = FirebaseService.generateId('aut');
    const newAuthor: LibraryResourceAuthor = {
      ...author,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await FirebaseService.setDocument(AUTHORS_COL, id, newAuthor);
    return newAuthor;
  }

  static async getPublishers(tenantId: string): Promise<LibraryResourcePublisher[]> {
    return FirebaseService.getTenantCollection<LibraryResourcePublisher>(PUBLISHERS_COL, tenantId);
  }

  static async createPublisher(
    publisher: Omit<LibraryResourcePublisher, 'id' | 'createdAt' | 'updatedAt'>,
    actor: UserActor
  ): Promise<LibraryResourcePublisher> {
    const id = FirebaseService.generateId('pub');
    const newPub: LibraryResourcePublisher = {
      ...publisher,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await FirebaseService.setDocument(PUBLISHERS_COL, id, newPub);
    return newPub;
  }

  static async getCategories(tenantId: string): Promise<LibraryResourceCategory[]> {
    return FirebaseService.getTenantCollection<LibraryResourceCategory>(CATEGORIES_COL, tenantId);
  }

  static async createCategory(
    category: Omit<LibraryResourceCategory, 'id' | 'createdAt' | 'updatedAt'>,
    actor: UserActor
  ): Promise<LibraryResourceCategory> {
    const id = FirebaseService.generateId('cat');
    const newCat: LibraryResourceCategory = {
      ...category,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await FirebaseService.setDocument(CATEGORIES_COL, id, newCat);

    await AuditService.logAction(
      actor.id,
      actor.email,
      actor.displayName,
      'CATEGORY_CREATED',
      'library_category',
      id,
      category.tenantId,
      { name: newCat.name, code: newCat.code }
    );

    return newCat;
  }

  static async getLocations(tenantId: string, campusId?: string): Promise<LibraryResourceLocation[]> {
    const constraints = campusId ? [where('campusId', '==', campusId)] : [];
    return FirebaseService.getTenantCollection<LibraryResourceLocation>(LOCATIONS_COL, tenantId, constraints);
  }

  static async createLocation(
    location: Omit<LibraryResourceLocation, 'id' | 'createdAt' | 'updatedAt'>,
    actor: UserActor
  ): Promise<LibraryResourceLocation> {
    const id = FirebaseService.generateId('loc');
    const newLoc: LibraryResourceLocation = {
      ...location,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await FirebaseService.setDocument(LOCATIONS_COL, id, newLoc);

    await AuditService.logAction(
      actor.id,
      actor.email,
      actor.displayName,
      'LOCATION_CREATED',
      'library_location',
      id,
      location.tenantId,
      { name: newLoc.name, code: newLoc.code, type: newLoc.type }
    );

    return newLoc;
  }

  // ============================================================================
  // 3. MASTER CATALOGUE RESOURCES
  // ============================================================================

  static async getResources(
    tenantId: string,
    filters?: {
      campusId?: string;
      libraryId?: string;
      status?: ResourceStatus;
      resourceType?: string;
      categoryId?: string;
      searchQuery?: string;
    }
  ): Promise<LibraryResource[]> {
    const constraints = [];
    if (filters?.campusId) constraints.push(where('campusId', '==', filters.campusId));
    if (filters?.libraryId) constraints.push(where('libraryId', '==', filters.libraryId));
    if (filters?.status) constraints.push(where('status', '==', filters.status));
    if (filters?.resourceType) constraints.push(where('resourceType', '==', filters.resourceType));
    if (filters?.categoryId) constraints.push(where('categoryId', '==', filters.categoryId));

    let resources = await FirebaseService.getTenantCollection<LibraryResource>(RESOURCES_COL, tenantId, constraints);

    if (filters?.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      resources = resources.filter(
        r =>
          r.title.toLowerCase().includes(q) ||
          r.isbn?.toLowerCase().includes(q) ||
          r.authors.some(a => a.toLowerCase().includes(q)) ||
          r.keywords?.some(k => k.toLowerCase().includes(q))
      );
    }

    return resources;
  }

  static async getResource(resourceId: string, tenantId: string): Promise<LibraryResource | null> {
    const res = await FirebaseService.getDocument<LibraryResource>(RESOURCES_COL, resourceId);
    if (res && res.tenantId !== tenantId && tenantId !== 'ALL') {
      console.warn(`IDOR Violation: Access denied to resource ${resourceId} for tenant ${tenantId}`);
      return null;
    }
    return res;
  }

  static async createResource(
    resourceData: Omit<LibraryResource, 'id' | 'version' | 'totalCopies' | 'availableCopies' | 'createdAt' | 'updatedAt'>,
    actor: UserActor
  ): Promise<LibraryResource> {
    // Idempotency check
    if (resourceData.idempotencyKey) {
      const existingKeyDocs = await FirebaseService.getTenantCollection<LibraryResource>(
        RESOURCES_COL,
        resourceData.tenantId,
        [where('idempotencyKey', '==', resourceData.idempotencyKey)]
      );
      if (existingKeyDocs.length > 0) {
        return existingKeyDocs[0];
      }
    }

    const id = FirebaseService.generateId('res');
    const newRes: LibraryResource = {
      ...resourceData,
      id,
      version: 1,
      totalCopies: 0,
      availableCopies: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await FirebaseService.setDocument(RESOURCES_COL, id, newRes);

    // Save identifier records if present
    if (newRes.isbn) {
      await this.registerIdentifier(newRes.tenantId, id, undefined, 'ISBN13', newRes.isbn);
    }
    if (newRes.issn) {
      await this.registerIdentifier(newRes.tenantId, id, undefined, 'ISSN', newRes.issn);
    }
    if (newRes.doi) {
      await this.registerIdentifier(newRes.tenantId, id, undefined, 'DOI', newRes.doi);
    }

    await AuditService.logAction(
      actor.id,
      actor.email,
      actor.displayName,
      'RESOURCE_CREATED',
      'library_resource',
      id,
      newRes.tenantId,
      { title: newRes.title, resourceType: newRes.resourceType, status: newRes.status }
    );

    return newRes;
  }

  static async updateResource(
    resourceId: string,
    updates: Partial<LibraryResource>,
    actor: UserActor,
    tenantId: string,
    changeReason?: string
  ): Promise<LibraryResource> {
    const existing = await this.getResource(resourceId, tenantId);
    if (!existing) throw new Error('Library resource not found or access denied');

    // Create a version snapshot if resource was in APPROVED or ACTIVE state
    if (existing.status === 'APPROVED' || existing.status === 'ACTIVE') {
      const versionId = FirebaseService.generateId('ver');
      const versionRecord: LibraryResourceVersion = {
        id: versionId,
        resourceId,
        tenantId,
        version: existing.version,
        metadataSnapshot: existing,
        changeReason: changeReason || 'Routine metadata update',
        changedBy: actor.id,
        changedAt: new Date().toISOString()
      };
      await FirebaseService.setDocument(RESOURCE_VERSIONS_COL, versionId, versionRecord);
      
      await AuditService.logAction(
        actor.id,
        actor.email,
        actor.displayName,
        'RESOURCE_VERSION_CREATED',
        'library_resource',
        versionId,
        tenantId,
        { resourceId, version: existing.version }
      );
    }

    const nextVersion = (existing.version || 1) + 1;
    const updated: LibraryResource = {
      ...existing,
      ...updates,
      version: nextVersion,
      updatedBy: actor.id,
      updatedAt: new Date().toISOString()
    };

    await FirebaseService.updateDocument(RESOURCES_COL, resourceId, updated);

    await AuditService.logAction(
      actor.id,
      actor.email,
      actor.displayName,
      'RESOURCE_UPDATED',
      'library_resource',
      resourceId,
      tenantId,
      { previousVersion: existing.version, newVersion: nextVersion, updates }
    );

    return updated;
  }

  static async updateResourceStatus(
    resourceId: string,
    status: ResourceStatus,
    actor: UserActor,
    tenantId: string,
    notes?: string
  ): Promise<LibraryResource> {
    const existing = await this.getResource(resourceId, tenantId);
    if (!existing) throw new Error('Resource not found or access denied');

    const updated = await this.updateResource(
      resourceId,
      { status },
      actor,
      tenantId,
      `Status changed to ${status}. Notes: ${notes || 'N/A'}`
    );

    const actionType = 
      status === 'APPROVED' ? 'RESOURCE_APPROVED' :
      status === 'ACTIVE' ? 'RESOURCE_PUBLISHED' :
      status === 'WITHDRAWN' ? 'RESOURCE_WITHDRAWN' :
      status === 'ARCHIVED' ? 'RESOURCE_ARCHIVED' : 'RESOURCE_UPDATED';

    await AuditService.logAction(
      actor.id,
      actor.email,
      actor.displayName,
      actionType,
      'library_resource',
      resourceId,
      tenantId,
      { previousStatus: existing.status, newStatus: status, notes }
    );

    return updated;
  }

  static async getResourceVersions(resourceId: string, tenantId: string): Promise<LibraryResourceVersion[]> {
    return FirebaseService.getTenantCollection<LibraryResourceVersion>(
      RESOURCE_VERSIONS_COL,
      tenantId,
      [where('resourceId', '==', resourceId)]
    );
  }

  // ============================================================================
  // 4. PHYSICAL RESOURCE COPIES & ACCESSION/BARCODE ENGINE
  // ============================================================================

  static async getCopies(
    tenantId: string,
    filters?: {
      resourceId?: string;
      libraryId?: string;
      campusId?: string;
      status?: CopyStatus;
    }
  ): Promise<LibraryResourceCopy[]> {
    const constraints = [];
    if (filters?.resourceId) constraints.push(where('resourceId', '==', filters.resourceId));
    if (filters?.libraryId) constraints.push(where('libraryId', '==', filters.libraryId));
    if (filters?.campusId) constraints.push(where('campusId', '==', filters.campusId));
    if (filters?.status) constraints.push(where('copyStatus', '==', filters.status));

    return FirebaseService.getTenantCollection<LibraryResourceCopy>(COPIES_COL, tenantId, constraints);
  }

  static async createCopy(
    copyData: Omit<LibraryResourceCopy, 'id' | 'accessionNumber' | 'barcode' | 'qrCode' | 'version' | 'createdAt' | 'updatedAt'>,
    actor: UserActor
  ): Promise<LibraryResourceCopy> {
    // Idempotency check
    if (copyData.idempotencyKey) {
      const existing = await FirebaseService.getTenantCollection<LibraryResourceCopy>(
        COPIES_COL,
        copyData.tenantId,
        [where('idempotencyKey', '==', copyData.idempotencyKey)]
      );
      if (existing.length > 0) return existing[0];
    }

    const id = FirebaseService.generateId('cpy');
    const existingCopies = await this.getCopies(copyData.tenantId, { libraryId: copyData.libraryId });
    const sequenceNumber = (existingCopies.length + 1).toString().padStart(5, '0');
    const year = new Date().getFullYear();
    const accessionNumber = `ACC-${year}-${sequenceNumber}`;
    const codeSuffix = id.slice(-8).toUpperCase();
    const barcode = `BC-LIB-${codeSuffix}`;
    const qrCode = `QR-LIB-${codeSuffix}`;

    const newCopy: LibraryResourceCopy = {
      ...copyData,
      id,
      accessionNumber,
      barcode,
      qrCode,
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await FirebaseService.setDocument(COPIES_COL, id, newCopy);

    // Register identifier
    await this.registerIdentifier(newCopy.tenantId, newCopy.resourceId, id, 'ACCESSION', accessionNumber);
    await this.registerIdentifier(newCopy.tenantId, newCopy.resourceId, id, 'BARCODE', barcode);

    // Update copy counts on the parent resource
    const parentResource = await this.getResource(newCopy.resourceId, newCopy.tenantId);
    if (parentResource) {
      const totalCopies = (parentResource.totalCopies || 0) + 1;
      const availableCopies = newCopy.copyStatus === 'AVAILABLE' ? (parentResource.availableCopies || 0) + 1 : (parentResource.availableCopies || 0);
      await FirebaseService.updateDocument(RESOURCES_COL, newCopy.resourceId, { totalCopies, availableCopies });
    }

    await AuditService.logAction(
      actor.id,
      actor.email,
      actor.displayName,
      'COPY_CREATED',
      'library_copy',
      id,
      newCopy.tenantId,
      { accessionNumber, barcode, resourceId: newCopy.resourceId }
    );

    return newCopy;
  }

  static async updateCopyStatus(
    copyId: string,
    copyStatus: CopyStatus,
    actor: UserActor,
    tenantId: string,
    notes?: string
  ): Promise<LibraryResourceCopy> {
    const existing = await FirebaseService.getDocument<LibraryResourceCopy>(COPIES_COL, copyId);
    if (!existing || (existing.tenantId !== tenantId && tenantId !== 'ALL')) {
      throw new Error('Copy record not found or access denied');
    }

    const updated: LibraryResourceCopy = {
      ...existing,
      copyStatus,
      notes: notes ? `${existing.notes || ''}\n${notes}`.trim() : existing.notes,
      version: (existing.version || 1) + 1,
      updatedBy: actor.id,
      updatedAt: new Date().toISOString()
    };

    await FirebaseService.updateDocument(COPIES_COL, copyId, updated);

    // Update resource copy count delta if status changed between AVAILABLE and non-AVAILABLE
    if (existing.copyStatus !== copyStatus) {
      const parent = await this.getResource(existing.resourceId, tenantId);
      if (parent) {
        let availDelta = 0;
        if (existing.copyStatus === 'AVAILABLE' && copyStatus !== 'AVAILABLE') availDelta = -1;
        if (existing.copyStatus !== 'AVAILABLE' && copyStatus === 'AVAILABLE') availDelta = 1;
        if (availDelta !== 0) {
          const newAvail = Math.max(0, (parent.availableCopies || 0) + availDelta);
          await FirebaseService.updateDocument(RESOURCES_COL, existing.resourceId, { availableCopies: newAvail });
        }
      }
    }

    await AuditService.logAction(
      actor.id,
      actor.email,
      actor.displayName,
      'COPY_STATUS_CHANGED',
      'library_copy',
      copyId,
      tenantId,
      { previousStatus: existing.copyStatus, newStatus: copyStatus, notes }
    );

    return updated;
  }

  // ============================================================================
  // 5. MEMBERSHIPS & ELIGIBILITY
  // ============================================================================

  static async getMemberships(
    tenantId: string,
    filters?: {
      campusId?: string;
      libraryId?: string;
      membershipType?: string;
      status?: MembershipStatus;
      userId?: string;
    }
  ): Promise<LibraryMembership[]> {
    const constraints = [];
    if (filters?.campusId) constraints.push(where('campusId', '==', filters.campusId));
    if (filters?.libraryId) constraints.push(where('libraryId', '==', filters.libraryId));
    if (filters?.membershipType) constraints.push(where('membershipType', '==', filters.membershipType));
    if (filters?.status) constraints.push(where('status', '==', filters.status));
    if (filters?.userId) constraints.push(where('userId', '==', filters.userId));

    return FirebaseService.getTenantCollection<LibraryMembership>(MEMBERSHIPS_COL, tenantId, constraints);
  }

  static async createMembership(
    memData: Omit<LibraryMembership, 'id' | 'membershipNumber' | 'createdAt' | 'updatedAt'>,
    actor: UserActor
  ): Promise<LibraryMembership> {
    // Idempotency check
    if (memData.idempotencyKey) {
      const existing = await FirebaseService.getTenantCollection<LibraryMembership>(
        MEMBERSHIPS_COL,
        memData.tenantId,
        [where('idempotencyKey', '==', memData.idempotencyKey)]
      );
      if (existing.length > 0) return existing[0];
    }

    const id = FirebaseService.generateId('mem');
    const existingMems = await this.getMemberships(memData.tenantId, { libraryId: memData.libraryId });
    const seq = (existingMems.length + 1).toString().padStart(5, '0');
    const membershipNumber = `MEM-${memData.membershipType.slice(0, 3)}-${seq}`;

    const newMem: LibraryMembership = {
      ...memData,
      id,
      membershipNumber,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await FirebaseService.setDocument(MEMBERSHIPS_COL, id, newMem);

    await AuditService.logAction(
      actor.id,
      actor.email,
      actor.displayName,
      'MEMBERSHIP_CREATED',
      'library_membership',
      id,
      newMem.tenantId,
      { membershipNumber, userId: newMem.userId, membershipType: newMem.membershipType }
    );

    return newMem;
  }

  static async updateMembershipStatus(
    membershipId: string,
    status: MembershipStatus,
    actor: UserActor,
    tenantId: string,
    notes?: string
  ): Promise<LibraryMembership> {
    const existing = await FirebaseService.getDocument<LibraryMembership>(MEMBERSHIPS_COL, membershipId);
    if (!existing || (existing.tenantId !== tenantId && tenantId !== 'ALL')) {
      throw new Error('Membership record not found or access denied');
    }

    const updated: LibraryMembership = {
      ...existing,
      status,
      notes: notes ? `${existing.notes || ''}\n${notes}`.trim() : existing.notes,
      updatedBy: actor.id,
      updatedAt: new Date().toISOString()
    };

    await FirebaseService.updateDocument(MEMBERSHIPS_COL, membershipId, updated);

    const action = status === 'SUSPENDED' ? 'MEMBERSHIP_SUSPENDED' :
                   status === 'EXPIRED' ? 'MEMBERSHIP_EXPIRED' : 'MEMBERSHIP_UPDATED';

    await AuditService.logAction(
      actor.id,
      actor.email,
      actor.displayName,
      action,
      'library_membership',
      membershipId,
      tenantId,
      { previousStatus: existing.status, newStatus: status, notes }
    );

    return updated;
  }

  // ============================================================================
  // 6. ACQUISITIONS & PURCHASING
  // ============================================================================

  static async getAcquisitions(tenantId: string, campusId?: string): Promise<LibraryAcquisition[]> {
    const constraints = campusId ? [where('campusId', '==', campusId)] : [];
    return FirebaseService.getTenantCollection<LibraryAcquisition>(ACQUISITIONS_COL, tenantId, constraints);
  }

  static async createAcquisition(
    acqData: Omit<LibraryAcquisition, 'id' | 'createdAt' | 'updatedAt'>,
    actor: UserActor
  ): Promise<LibraryAcquisition> {
    if (acqData.idempotencyKey) {
      const existing = await FirebaseService.getTenantCollection<LibraryAcquisition>(
        ACQUISITIONS_COL,
        acqData.tenantId,
        [where('idempotencyKey', '==', acqData.idempotencyKey)]
      );
      if (existing.length > 0) return existing[0];
    }

    const id = FirebaseService.generateId('acq');
    const newAcq: LibraryAcquisition = {
      ...acqData,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await FirebaseService.setDocument(ACQUISITIONS_COL, id, newAcq);

    await AuditService.logAction(
      actor.id,
      actor.email,
      actor.displayName,
      'ACQUISITION_CREATED',
      'library_acquisition',
      id,
      newAcq.tenantId,
      { supplier: newAcq.supplier, quantity: newAcq.quantity, totalCost: newAcq.totalCost }
    );

    return newAcq;
  }

  static async updateAcquisitionStatus(
    acquisitionId: string,
    status: AcquisitionStatus,
    actor: UserActor,
    tenantId: string
  ): Promise<LibraryAcquisition> {
    const existing = await FirebaseService.getDocument<LibraryAcquisition>(ACQUISITIONS_COL, acquisitionId);
    if (!existing || (existing.tenantId !== tenantId && tenantId !== 'ALL')) {
      throw new Error('Acquisition not found or access denied');
    }

    const updated: LibraryAcquisition = {
      ...existing,
      status,
      updatedAt: new Date().toISOString()
    };

    await FirebaseService.updateDocument(ACQUISITIONS_COL, acquisitionId, updated);

    await AuditService.logAction(
      actor.id,
      actor.email,
      actor.displayName,
      'ACQUISITION_UPDATED',
      'library_acquisition',
      acquisitionId,
      tenantId,
      { previousStatus: existing.status, newStatus: status }
    );

    return updated;
  }

  // ============================================================================
  // 7. MAPPINGS & IDENTIFIERS
  // ============================================================================

  static async registerIdentifier(
    tenantId: string,
    resourceId?: string,
    copyId?: string,
    type: IdentifierType = 'CUSTOM',
    rawValue: string = ''
  ): Promise<LibraryResourceIdentifier> {
    const id = FirebaseService.generateId('idn');
    const normalizedValue = rawValue.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    const newIdent: LibraryResourceIdentifier = {
      id,
      tenantId,
      resourceId,
      copyId,
      type,
      normalizedValue,
      rawValue,
      createdAt: new Date().toISOString()
    };
    await FirebaseService.setDocument(IDENTIFIERS_COL, id, newIdent);
    return newIdent;
  }

  static async createSubjectMapping(
    tenantId: string,
    resourceId: string,
    subjectId: string,
    actor: UserActor
  ): Promise<LibraryResourceSubjectMapping> {
    const id = FirebaseService.generateId('smap');
    const mapping: LibraryResourceSubjectMapping = {
      id,
      tenantId,
      resourceId,
      subjectId,
      mappedBy: actor.id,
      createdAt: new Date().toISOString()
    };
    await FirebaseService.setDocument(SUBJECT_MAPPINGS_COL, id, mapping);
    return mapping;
  }

  static async createCurriculumMapping(
    tenantId: string,
    resourceId: string,
    curriculumId: string,
    unitId: string | undefined,
    topicId: string | undefined,
    actor: UserActor
  ): Promise<LibraryResourceCurriculumMapping> {
    const id = FirebaseService.generateId('cmap');
    const mapping: LibraryResourceCurriculumMapping = {
      id,
      tenantId,
      resourceId,
      curriculumId,
      unitId,
      topicId,
      mappedBy: actor.id,
      createdAt: new Date().toISOString()
    };
    await FirebaseService.setDocument(CURRICULUM_MAPPINGS_COL, id, mapping);
    return mapping;
  }

  // ============================================================================
  // 8. ANALYTICS & CACHE
  // ============================================================================

  static async rebuildAnalyticsCache(tenantId: string, campusId?: string): Promise<LibraryAnalyticsCache> {
    const resources = await this.getResources(tenantId, { campusId });
    const copies = await this.getCopies(tenantId, { campusId });
    const memberships = await this.getMemberships(tenantId, { campusId, status: 'ACTIVE' });
    const acquisitions = await this.getAcquisitions(tenantId, campusId);

    const resourcesByType: Record<string, number> = {};
    const resourcesByCategory: Record<string, number> = {};
    const copiesByStatus: Record<string, number> = {};
    const resourceConditionDistribution: Record<string, number> = {};

    let digitalCount = 0;

    for (const r of resources) {
      resourcesByType[r.resourceType] = (resourcesByType[r.resourceType] || 0) + 1;
      if (r.categoryName || r.categoryId) {
        const cat = r.categoryName || r.categoryId || 'Uncategorized';
        resourcesByCategory[cat] = (resourcesByCategory[cat] || 0) + 1;
      }
      if (r.digitalResourceReference || r.resourceType === 'EBOOK' || r.resourceType === 'DIGITAL_DOCUMENT') {
        digitalCount++;
      }
    }

    for (const c of copies) {
      copiesByStatus[c.copyStatus] = (copiesByStatus[c.copyStatus] || 0) + 1;
      resourceConditionDistribution[c.condition] = (resourceConditionDistribution[c.condition] || 0) + 1;
    }

    const cacheId = `${tenantId}_${campusId || 'all'}`;
    const cacheRecord: LibraryAnalyticsCache = {
      id: cacheId,
      tenantId,
      campusId,
      totalResources: resources.length,
      totalPhysicalCopies: copies.length,
      totalDigitalResources: digitalCount,
      activeMemberships: memberships.length,
      resourcesByType,
      resourcesByCategory,
      resourcesBySubject: {},
      resourcesByCampus: {},
      copiesByStatus,
      resourceConditionDistribution,
      acquisitionCounts: acquisitions.length,
      catalogueGrowth: resources.length,
      lastRebuiltAt: new Date().toISOString()
    };

    await FirebaseService.setDocument(ANALYTICS_COL, cacheId, cacheRecord);
    return cacheRecord;
  }

  static async getAnalyticsCache(tenantId: string, campusId?: string): Promise<LibraryAnalyticsCache | null> {
    const cacheId = `${tenantId}_${campusId || 'all'}`;
    const cache = await FirebaseService.getDocument<LibraryAnalyticsCache>(ANALYTICS_COL, cacheId);
    if (!cache) {
      return this.rebuildAnalyticsCache(tenantId, campusId);
    }
    return cache;
  }

  // ============================================================================
  // 9. GOVERNANCE & EXPORT ENGINE
  // ============================================================================

  static async exportCatalogueData(tenantId: string, campusId?: string): Promise<any[]> {
    const resources = await this.getResources(tenantId, { campusId });
    return resources.map(r => ({
      ID: r.id,
      Title: r.title,
      ResourceType: r.resourceType,
      Authors: r.authors.join('; '),
      ISBN: r.isbn || 'N/A',
      Status: r.status,
      TotalCopies: r.totalCopies,
      AvailableCopies: r.availableCopies,
      Language: r.language,
      PublicationYear: r.publicationYear || 'N/A',
      CreatedAt: r.createdAt
    }));
  }

  static async exportCopiesData(tenantId: string, campusId?: string): Promise<any[]> {
    const copies = await this.getCopies(tenantId, { campusId });
    return copies.map(c => ({
      CopyID: c.id,
      ResourceID: c.resourceId,
      AccessionNumber: c.accessionNumber,
      Barcode: c.barcode,
      Status: c.copyStatus,
      Condition: c.condition,
      Cost: c.cost || 0,
      AcquiredDate: c.purchaseDate || 'N/A',
      CreatedAt: c.createdAt
    }));
  }
}
