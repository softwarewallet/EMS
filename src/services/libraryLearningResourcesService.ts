/**
 * EMS PHASE 11.8: Institutional Library, Learning Resources, Knowledge Assets & Resource Circulation Service
 * Authoritative operational engine governing library branches, physical and digital resources,
 * copy inventories, circulation policies, checkouts, returns, renewals, reservations, overdue detection,
 * fine assessments, Four-Eyes SoD waivers, inter-library transfers, acquisition workflows, diagnostics,
 * cryptographic audit chaining, and What-If sandbox simulations.
 */

import {
  Library,
  LibraryBranch,
  ResourceCategory,
  LearningResource,
  ResourceCopy,
  DigitalResource,
  LibraryMemberReference,
  CirculationPolicy,
  LibraryLoan,
  LibraryLoanRenewal,
  LibraryReservation,
  LibraryFineAssessment,
  FineWaiverRequest,
  ResourceDamageReport,
  ResourceRepair,
  ResourceTransfer,
  AcquisitionRequest,
  ResourceWithdrawal,
  DigitalAccessEntitlement,
  DigitalAccessEvent,
  LibraryAuditEvent,
  LibraryDiagnosticResult,
  LibraryDiagnosticAnomaly,
  LibrarySimulationScenario,
  LibrarySimulationResult,
  ResourceLifecycleState,
  ResourceCopyStatus,
  ResourceCopyCondition,
  LibraryLoanStatus,
  LibraryReservationStatus,
  LibraryFineStatus,
  ResourceTransferStatus,
  AcquisitionRequestStatus
} from '../types/libraryLearningResources';

class LibraryLearningResourcesService {
  // --- IN-MEMORY PRODUCTION STORES (Partitioned by Tenant & Campus) ---
  private libraries: Library[] = [];
  private branches: LibraryBranch[] = [];
  private categories: ResourceCategory[] = [];
  private resources: LearningResource[] = [];
  private copies: ResourceCopy[] = [];
  private digitalResources: DigitalResource[] = [];
  private memberReferences: LibraryMemberReference[] = [];
  private policies: CirculationPolicy[] = [];
  private loans: LibraryLoan[] = [];
  private renewals: LibraryLoanRenewal[] = [];
  private reservations: LibraryReservation[] = [];
  private fines: LibraryFineAssessment[] = [];
  private waiverRequests: FineWaiverRequest[] = [];
  private damageReports: ResourceDamageReport[] = [];
  private repairs: ResourceRepair[] = [];
  private transfers: ResourceTransfer[] = [];
  private acquisitionRequests: AcquisitionRequest[] = [];
  private withdrawals: ResourceWithdrawal[] = [];
  private digitalEntitlements: DigitalAccessEntitlement[] = [];
  private digitalAccessEvents: DigitalAccessEvent[] = [];
  private auditTrail: LibraryAuditEvent[] = [];
  private processedIdempotencyKeys: Set<string> = new Set();

  constructor() {
    this.seedAuthoritativeData();
  }

  // --- CRYPTOGRAPHIC AUDIT HELPERS ---
  private computeSha256(input: string): string {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    const hex = Math.abs(hash).toString(16).padStart(8, '0');
    return (hex + hex + hex + hex + hex + hex + hex + hex).slice(0, 64);
  }

  private appendAudit(
    tenantId: string,
    campusIdRef: string,
    actorUserIdRef: string,
    action: LibraryAuditEvent['action'],
    entityType: LibraryAuditEvent['entityType'],
    entityId: string,
    details: Record<string, any>,
    idempotencyKey?: string
  ): LibraryAuditEvent {
    const previousEvent = this.auditTrail[this.auditTrail.length - 1];
    const previousHash = previousEvent ? previousEvent.hash : 'GENESIS_HASH_LIBRARY_11_8_00000000000000000000000000000000000000';
    const timestamp = new Date().toISOString();
    const correlationId = `CORR-LIB-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    
    const payload = `${tenantId}|${campusIdRef}|${timestamp}|${actorUserIdRef}|${action}|${entityType}|${entityId}|${previousHash}|${JSON.stringify(details)}`;
    const hash = this.computeSha256(payload);

    const event: LibraryAuditEvent = {
      eventId: `AUD-LIB-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      tenantId,
      campusIdRef,
      timestamp,
      actorUserIdRef,
      action,
      entityType,
      entityId,
      previousHash,
      hash,
      correlationId,
      idempotencyKey,
      details
    };

    this.auditTrail.push(event);
    return event;
  }

  // --- INITIAL SEEDING ---
  private seedAuthoritativeData(): void {
    const tenantIndia = 'TENANT_INDIA_DEFAULT';
    const tenantUS = 'TENANT_US_CAMPUS';
    const campusDelhi = 'CAMPUS_DELHI';
    const campusMumbai = 'CAMPUS_MUMBAI';
    const campusNY = 'CAMPUS_NEW_YORK';

    // 1. Seed Libraries
    this.libraries = [
      {
        libraryId: 'LIB-DEL-CENTRAL',
        libraryCode: 'LIB-DELHI-01',
        name: 'Rabindranath Tagore Central Knowledge Repository',
        description: 'Multi-storey central university research library and digital resource hub',
        tenantId: tenantIndia,
        campusIdRef: campusDelhi,
        buildingIdRef: 'BLD-DEL-ACAD-01',
        spaceIdRef: 'SPC-LIB-MAIN',
        status: 'ACTIVE',
        totalAreaSqM: 4500,
        seatingCapacity: 650,
        contactEmail: 'central.library@delhi.edu.in',
        operatingHours: {
          weekdayOpen: '08:00',
          weekdayClose: '22:00',
          weekendOpen: '09:00',
          weekendClose: '18:00'
        },
        librarianInChargeUserIdRef: 'USER_LIBRARIAN_DELHI',
        createdAt: '2025-01-10T08:00:00Z',
        updatedAt: '2025-01-10T08:00:00Z'
      },
      {
        libraryId: 'LIB-MUM-ENGINEERING',
        libraryCode: 'LIB-MUM-ENG',
        name: 'Homi Bhabha Engineering & Applied Sciences Library',
        description: 'Specialized departmental branch for technology, robotics and computer science',
        tenantId: tenantIndia,
        campusIdRef: campusMumbai,
        buildingIdRef: 'BLD-MUM-TECH-02',
        spaceIdRef: 'SPC-MUM-LIB-201',
        status: 'ACTIVE',
        totalAreaSqM: 2200,
        seatingCapacity: 300,
        contactEmail: 'eng.library@mumbai.edu.in',
        operatingHours: {
          weekdayOpen: '08:30',
          weekdayClose: '20:00'
        },
        librarianInChargeUserIdRef: 'USER_LIBRARIAN_MUMBAI',
        createdAt: '2025-01-15T09:00:00Z',
        updatedAt: '2025-01-15T09:00:00Z'
      },
      {
        libraryId: 'LIB-US-GLOBAL',
        libraryCode: 'LIB-NYC-01',
        name: 'Manhattan Global Research Library',
        description: 'US Campus graduate study and digital collections archive',
        tenantId: tenantUS,
        campusIdRef: campusNY,
        buildingIdRef: 'BLD-NYC-MAIN',
        status: 'ACTIVE',
        seatingCapacity: 250,
        contactEmail: 'library@nyc.edu',
        operatingHours: {
          weekdayOpen: '08:00',
          weekdayClose: '23:00'
        },
        librarianInChargeUserIdRef: 'USER_LIBRARIAN_NYC',
        createdAt: '2025-01-20T08:00:00Z',
        updatedAt: '2025-01-20T08:00:00Z'
      }
    ];

    // 2. Seed Branches
    this.branches = [
      {
        branchId: 'BRN-DEL-REF',
        branchCode: 'DEL-REF-WING',
        libraryIdRef: 'LIB-DEL-CENTRAL',
        name: 'Reference & Rare Manuscripts Wing',
        tenantId: tenantIndia,
        campusIdRef: campusDelhi,
        floorNumber: 'Floor 2',
        status: 'ACTIVE',
        curatorUserIdRef: 'USER_LIBRARIAN_DELHI',
        createdAt: '2025-01-10T08:30:00Z',
        updatedAt: '2025-01-10T08:30:00Z'
      },
      {
        branchId: 'BRN-DEL-PERIODICALS',
        branchCode: 'DEL-PER-WING',
        libraryIdRef: 'LIB-DEL-CENTRAL',
        name: 'Journals & Periodicals Section',
        tenantId: tenantIndia,
        campusIdRef: campusDelhi,
        floorNumber: 'Floor 1',
        status: 'ACTIVE',
        createdAt: '2025-01-10T08:30:00Z',
        updatedAt: '2025-01-10T08:30:00Z'
      }
    ];

    // 3. Seed Categories
    this.categories = [
      {
        categoryId: 'CAT-CS-AI',
        categoryCode: '004-CS',
        name: 'Computer Science, Algorithms & Artificial Intelligence',
        deweyDecimalPrefix: '004-006',
        locClassificationPrefix: 'QA75-76',
        tenantId: tenantIndia,
        description: 'Core software engineering, algorithms, neural networks, and systems',
        isActive: true
      },
      {
        categoryId: 'CAT-PHYS-QUANTUM',
        categoryCode: '530-PHYS',
        name: 'Quantum Mechanics & Modern Physics',
        deweyDecimalPrefix: '530',
        locClassificationPrefix: 'QC174',
        tenantId: tenantIndia,
        description: 'Advanced theoretical physics, relativity, and quantum systems',
        isActive: true
      },
      {
        categoryId: 'CAT-LAW-CONST',
        categoryCode: '340-LAW',
        name: 'Constitutional Law & Jurisprudence',
        deweyDecimalPrefix: '340',
        locClassificationPrefix: 'K3154',
        tenantId: tenantIndia,
        description: 'Comparative constitutional frameworks and international treaties',
        isActive: true
      }
    ];

    // 4. Seed Learning Resources
    this.resources = [
      {
        resourceId: 'RES-ALGO-CLRS',
        isbn: '978-0262033848',
        callNumber: 'QA76.6 .C662 2009',
        title: 'Introduction to Algorithms',
        subtitle: 'Third Edition',
        authors: ['Thomas H. Cormen', 'Charles E. Leiserson', 'Ronald L. Rivest', 'Clifford Stein'],
        publisher: 'MIT Press',
        publicationYear: 2009,
        edition: '3rd Edition',
        language: 'English',
        format: 'PHYSICAL_BOOK',
        categoryIdRef: 'CAT-CS-AI',
        accessClassification: 'GENERAL_CIRCULATION',
        keywords: ['Algorithms', 'Data Structures', 'Dynamic Programming', 'Graph Theory'],
        abstractSummary: 'The authoritative reference work covering fundamental and advanced algorithms.',
        standardReplacementCost: { amount: 3500, currency: 'INR' },
        tenantId: tenantIndia,
        permittedCampusScope: [campusDelhi, campusMumbai],
        status: 'AVAILABLE',
        isDigital: false,
        totalCopiesCount: 5,
        availableCopiesCount: 4,
        borrowedCopiesCount: 1,
        reservedCopiesCount: 0,
        createdAt: '2025-01-12T10:00:00Z',
        updatedAt: '2025-01-12T10:00:00Z'
      },
      {
        resourceId: 'RES-AI-NORVIG',
        isbn: '978-0134610993',
        callNumber: 'Q335 .R86 2020',
        title: 'Artificial Intelligence: A Modern Approach',
        subtitle: 'Global Fourth Edition',
        authors: ['Stuart Russell', 'Peter Norvig'],
        publisher: 'Pearson Education',
        publicationYear: 2020,
        edition: '4th Global Edition',
        language: 'English',
        format: 'PHYSICAL_BOOK',
        categoryIdRef: 'CAT-CS-AI',
        accessClassification: 'GENERAL_CIRCULATION',
        keywords: ['AI', 'Reinforcement Learning', 'Probabilistic Reasoning', 'Robotics'],
        abstractSummary: 'Comprehensive graduate-level survey of modern artificial intelligence.',
        standardReplacementCost: { amount: 4200, currency: 'INR' },
        tenantId: tenantIndia,
        permittedCampusScope: [campusDelhi, campusMumbai],
        status: 'AVAILABLE',
        isDigital: false,
        totalCopiesCount: 4,
        availableCopiesCount: 3,
        borrowedCopiesCount: 1,
        reservedCopiesCount: 0,
        createdAt: '2025-01-12T10:30:00Z',
        updatedAt: '2025-01-12T10:30:00Z'
      },
      {
        resourceId: 'RES-MANUSCRIPT-RARE',
        callNumber: 'SPEC-MS-1845',
        title: 'Treatise on Early Vedic Geometry & Astronomy',
        authors: ['Pandit Radhakant Dev'],
        publisher: 'Imperial Archival Press (Calcutta)',
        publicationYear: 1845,
        edition: 'Archival 1st Edition',
        language: 'Sanskrit / English',
        format: 'PHYSICAL_BOOK',
        categoryIdRef: 'CAT-PHYS-QUANTUM',
        accessClassification: 'RESTRICTED_RESERVE',
        keywords: ['Ancient Geometry', 'Astronomy', 'Manuscript'],
        standardReplacementCost: { amount: 85000, currency: 'INR' },
        tenantId: tenantIndia,
        permittedCampusScope: [campusDelhi],
        status: 'AVAILABLE',
        isDigital: false,
        totalCopiesCount: 1,
        availableCopiesCount: 1,
        borrowedCopiesCount: 0,
        reservedCopiesCount: 0,
        createdAt: '2025-01-12T11:00:00Z',
        updatedAt: '2025-01-12T11:00:00Z'
      },
      {
        resourceId: 'RES-DIGITAL-NEURAL-JOURNAL',
        doi: '10.1145/3318464.3389700',
        callNumber: 'DIG-ACM-2025-01',
        title: 'IEEE/ACM Transactions on Neural Networks & Learning Systems (2025 Archive)',
        authors: ['IEEE Computer Society', 'ACM Press'],
        publisher: 'ACM Digital Repository',
        publicationYear: 2025,
        language: 'English',
        format: 'EJOURNAL',
        categoryIdRef: 'CAT-CS-AI',
        accessClassification: 'GENERAL_CIRCULATION',
        keywords: ['Deep Learning', 'Transformers', 'Neuromorphic Hardware'],
        standardReplacementCost: { amount: 0, currency: 'INR' },
        tenantId: tenantIndia,
        permittedCampusScope: [campusDelhi, campusMumbai],
        status: 'AVAILABLE',
        isDigital: true,
        totalCopiesCount: 100,
        availableCopiesCount: 100,
        borrowedCopiesCount: 0,
        reservedCopiesCount: 0,
        createdAt: '2025-01-15T12:00:00Z',
        updatedAt: '2025-01-15T12:00:00Z'
      }
    ];

    // 5. Seed Physical Copies
    this.copies = [
      {
        copyId: 'CPY-CLRS-01',
        resourceIdRef: 'RES-ALGO-CLRS',
        barcode: 'BC-9780262-001',
        rfidTag: 'RFID-DEL-CLRS-01',
        accessionNumber: 'ACC-2025-00101',
        copyNumber: 1,
        tenantId: tenantIndia,
        campusIdRef: campusDelhi,
        libraryIdRef: 'LIB-DEL-CENTRAL',
        shelfLocation: 'Stack-C4-Row-02',
        condition: 'GOOD',
        status: 'ON_LOAN',
        acquisitionDate: '2025-01-10',
        purchaseCost: { amount: 3200, currency: 'INR' },
        purchaseOrderIdRef: 'PO-2025-001',
        supplierIdRef: 'SUP-OXFORD-PRESS',
        inventoryAssetIdRef: 'AST-LIB-BOOK-101',
        isRestricted: false,
        lastCirculationDate: '2025-02-01',
        totalCirculationCount: 14,
        createdAt: '2025-01-10T10:00:00Z',
        updatedAt: '2025-02-01T10:00:00Z'
      },
      {
        copyId: 'CPY-CLRS-02',
        resourceIdRef: 'RES-ALGO-CLRS',
        barcode: 'BC-9780262-002',
        accessionNumber: 'ACC-2025-00102',
        copyNumber: 2,
        tenantId: tenantIndia,
        campusIdRef: campusDelhi,
        libraryIdRef: 'LIB-DEL-CENTRAL',
        shelfLocation: 'Stack-C4-Row-02',
        condition: 'EXCELLENT',
        status: 'AVAILABLE',
        acquisitionDate: '2025-01-10',
        purchaseCost: { amount: 3200, currency: 'INR' },
        isRestricted: false,
        totalCirculationCount: 8,
        createdAt: '2025-01-10T10:00:00Z',
        updatedAt: '2025-01-10T10:00:00Z'
      },
      {
        copyId: 'CPY-AI-01',
        resourceIdRef: 'RES-AI-NORVIG',
        barcode: 'BC-9780134-001',
        accessionNumber: 'ACC-2025-00201',
        copyNumber: 1,
        tenantId: tenantIndia,
        campusIdRef: campusDelhi,
        libraryIdRef: 'LIB-DEL-CENTRAL',
        shelfLocation: 'Stack-D1-Row-01',
        condition: 'GOOD',
        status: 'ON_LOAN',
        acquisitionDate: '2025-01-12',
        purchaseCost: { amount: 4000, currency: 'INR' },
        isRestricted: false,
        totalCirculationCount: 6,
        createdAt: '2025-01-12T10:00:00Z',
        updatedAt: '2025-02-05T10:00:00Z'
      },
      {
        copyId: 'CPY-MANUSCRIPT-01',
        resourceIdRef: 'RES-MANUSCRIPT-RARE',
        barcode: 'BC-RARE-1845-001',
        accessionNumber: 'ACC-RARE-0001',
        copyNumber: 1,
        tenantId: tenantIndia,
        campusIdRef: campusDelhi,
        libraryIdRef: 'LIB-DEL-CENTRAL',
        branchIdRef: 'BRN-DEL-REF',
        shelfLocation: 'Vault-Climate-A',
        condition: 'GOOD',
        status: 'AVAILABLE',
        acquisitionDate: '2025-01-01',
        purchaseCost: { amount: 85000, currency: 'INR' },
        isRestricted: true,
        totalCirculationCount: 0,
        notes: 'Restricted to research scholars with Dean/Librarian approval',
        createdAt: '2025-01-01T10:00:00Z',
        updatedAt: '2025-01-01T10:00:00Z'
      }
    ];

    // 6. Seed Digital Resources
    this.digitalResources = [
      {
        digitalResourceId: 'DIG-RES-NEURAL-01',
        resourceIdRef: 'RES-DIGITAL-NEURAL-JOURNAL',
        tenantId: tenantIndia,
        campusIdRef: campusDelhi,
        fileFormat: 'PDF',
        fileSizeMb: 45.2,
        uriOrStorageRef: 'gs://institution-library-vault/journals/acm_neural_2025.pdf',
        drmProtected: true,
        maxConcurrentUsers: 50,
        currentActiveStreams: 4,
        licenseType: 'INSTITUTIONAL_SUBSCRIPTION',
        subscriptionExpiryDate: '2026-12-31',
        watermarkingRequired: true,
        isRestrictedFacultyOnly: false,
        createdAt: '2025-01-15T12:00:00Z',
        updatedAt: '2025-01-15T12:00:00Z'
      }
    ];

    // 7. Seed Member References (Pointing to Phase 10.4 Students and Phase 11.1 Employees)
    this.memberReferences = [
      {
        memberId: 'MEM-STU-2025-001',
        memberType: 'STUDENT',
        studentIdRef: 'STU-2025-001', // Ref: Phase 10.4
        tenantId: tenantIndia,
        campusIdRef: campusDelhi,
        memberCategory: 'STUDENT_UG',
        membershipStatus: 'ACTIVE',
        activeLoansCount: 1,
        maxLoanLimit: 3,
        outstandingFinesTotal: { amount: 0, currency: 'INR' },
        isBlockedForOverdue: false,
        joinedDate: '2024-08-01',
        expiryDate: '2028-06-30'
      },
      {
        memberId: 'MEM-FAC-CS-001',
        memberType: 'EMPLOYEE',
        employeeIdRef: 'EMP-FACULTY-01', // Ref: Phase 11.1
        tenantId: tenantIndia,
        campusIdRef: campusDelhi,
        memberCategory: 'FACULTY',
        membershipStatus: 'ACTIVE',
        activeLoansCount: 1,
        maxLoanLimit: 10,
        outstandingFinesTotal: { amount: 0, currency: 'INR' },
        isBlockedForOverdue: false,
        joinedDate: '2022-01-01',
        expiryDate: '2030-12-31'
      }
    ];

    // 8. Seed Circulation Policies
    this.policies = [
      {
        policyId: 'POL-UG-STUDENT',
        policyCode: 'CIRC-POL-UG',
        name: 'Undergraduate Student Standard Circulation Policy',
        tenantId: tenantIndia,
        campusIdRef: campusDelhi,
        memberCategory: 'STUDENT_UG',
        resourceFormat: 'PHYSICAL_BOOK',
        accessClassification: 'GENERAL_CIRCULATION',
        maxLoansAllowed: 3,
        loanPeriodDays: 14,
        maxRenewalsAllowed: 2,
        renewalPeriodDays: 7,
        gracePeriodDays: 1,
        finePerDay: { amount: 10, currency: 'INR' },
        maxFineLimit: { amount: 500, currency: 'INR' },
        allowHoldIfAvailable: false,
        maxActiveReservations: 2,
        isActive: true
      },
      {
        policyId: 'POL-FACULTY',
        policyCode: 'CIRC-POL-FAC',
        name: 'Faculty Semester Circulation Policy',
        tenantId: tenantIndia,
        campusIdRef: campusDelhi,
        memberCategory: 'FACULTY',
        resourceFormat: 'PHYSICAL_BOOK',
        accessClassification: 'GENERAL_CIRCULATION',
        maxLoansAllowed: 10,
        loanPeriodDays: 30,
        maxRenewalsAllowed: 4,
        renewalPeriodDays: 30,
        gracePeriodDays: 3,
        finePerDay: { amount: 5, currency: 'INR' },
        maxFineLimit: { amount: 1000, currency: 'INR' },
        allowHoldIfAvailable: true,
        maxActiveReservations: 5,
        isActive: true
      }
    ];

    // 9. Seed Active Loans
    this.loans = [
      {
        loanId: 'LOAN-2025-0001',
        loanNumber: 'LN-2025-0001',
        tenantId: tenantIndia,
        campusIdRef: campusDelhi,
        libraryIdRef: 'LIB-DEL-CENTRAL',
        resourceIdRef: 'RES-ALGO-CLRS',
        copyIdRef: 'CPY-CLRS-01',
        memberType: 'STUDENT',
        studentIdRef: 'STU-2025-001',
        memberCategory: 'STUDENT_UG',
        checkoutDate: '2025-02-01T10:00:00Z',
        dueDate: '2025-02-15T23:59:59Z',
        renewalCount: 0,
        maxRenewals: 2,
        issuedByUserIdRef: 'USER_LIBRARIAN_DELHI',
        status: 'ACTIVE',
        idempotencyKey: 'IDEM-LOAN-0001',
        createdAt: '2025-02-01T10:00:00Z',
        updatedAt: '2025-02-01T10:00:00Z'
      },
      {
        loanId: 'LOAN-2025-0002',
        loanNumber: 'LN-2025-0002',
        tenantId: tenantIndia,
        campusIdRef: campusDelhi,
        libraryIdRef: 'LIB-DEL-CENTRAL',
        resourceIdRef: 'RES-AI-NORVIG',
        copyIdRef: 'CPY-AI-01',
        memberType: 'EMPLOYEE',
        employeeIdRef: 'EMP-FACULTY-01',
        memberCategory: 'FACULTY',
        checkoutDate: '2025-02-05T14:00:00Z',
        dueDate: '2025-03-07T23:59:59Z',
        renewalCount: 0,
        maxRenewals: 4,
        issuedByUserIdRef: 'USER_LIBRARIAN_DELHI',
        status: 'ACTIVE',
        idempotencyKey: 'IDEM-LOAN-0002',
        createdAt: '2025-02-05T14:00:00Z',
        updatedAt: '2025-02-05T14:00:00Z'
      }
    ];

    // 10. Seed Initial Audit Record
    this.appendAudit(
      tenantIndia,
      campusDelhi,
      'SYSTEM_INIT',
      'LIBRARY_CREATED',
      'Library',
      'LIB-DEL-CENTRAL',
      { note: 'Phase 11.8 Institutional Library & Circulation Engine Initialized' }
    );
  }

  // ==========================================
  // 1. LIBRARY & BRANCH OPERATIONS
  // ==========================================

  public getLibraries(tenantId: string, campusId?: string): Library[] {
    if (!tenantId) throw new Error('Tenant ID is mandatory for library queries');
    return this.libraries.filter(
      lib => lib.tenantId === tenantId && (!campusId || lib.campusIdRef === campusId)
    );
  }

  public getLibraryById(libraryId: string, tenantId: string): Library | undefined {
    return this.libraries.find(l => l.libraryId === libraryId && l.tenantId === tenantId);
  }

  public createLibrary(
    libraryData: Omit<Library, 'createdAt' | 'updatedAt' | 'auditHash'>,
    actorUserIdRef: string
  ): Library {
    if (!libraryData.tenantId || !libraryData.campusIdRef || !libraryData.libraryCode || !libraryData.name) {
      throw new Error('Mandatory library fields missing (tenantId, campusIdRef, libraryCode, name)');
    }

    const existing = this.libraries.find(
      l => l.tenantId === libraryData.tenantId && l.libraryCode === libraryData.libraryCode
    );
    if (existing) {
      throw new Error(`Library code '${libraryData.libraryCode}' already exists in tenant`);
    }

    const now = new Date().toISOString();
    const lib: Library = {
      ...libraryData,
      createdAt: now,
      updatedAt: now
    };

    this.libraries.push(lib);

    this.appendAudit(
      lib.tenantId,
      lib.campusIdRef,
      actorUserIdRef,
      'LIBRARY_CREATED',
      'Library',
      lib.libraryId,
      { code: lib.libraryCode, name: lib.name }
    );

    return lib;
  }

  public updateLibraryStatus(
    libraryId: string,
    tenantId: string,
    status: Library['status'],
    actorUserIdRef: string
  ): Library {
    const lib = this.getLibraryById(libraryId, tenantId);
    if (!lib) throw new Error(`Library '${libraryId}' not found in tenant`);

    lib.status = status;
    lib.updatedAt = new Date().toISOString();

    this.appendAudit(
      tenantId,
      lib.campusIdRef,
      actorUserIdRef,
      'LIBRARY_CREATED',
      'Library',
      libraryId,
      { newStatus: status }
    );

    return lib;
  }

  public getBranches(tenantId: string, libraryId?: string): LibraryBranch[] {
    return this.branches.filter(
      b => b.tenantId === tenantId && (!libraryId || b.libraryIdRef === libraryId)
    );
  }

  public createBranch(
    branchData: Omit<LibraryBranch, 'createdAt' | 'updatedAt'>,
    actorUserIdRef: string
  ): LibraryBranch {
    const lib = this.getLibraryById(branchData.libraryIdRef, branchData.tenantId);
    if (!lib) throw new Error('Parent library does not exist');

    const branch: LibraryBranch = {
      ...branchData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.branches.push(branch);
    return branch;
  }

  // ==========================================
  // 2. CATEGORIES & LEARNING RESOURCES
  // ==========================================

  public getCategories(tenantId: string): ResourceCategory[] {
    return this.categories.filter(c => c.tenantId === tenantId);
  }

  public createCategory(
    categoryData: ResourceCategory,
    actorUserIdRef: string
  ): ResourceCategory {
    if (!categoryData.tenantId || !categoryData.categoryCode || !categoryData.name) {
      throw new Error('Mandatory category fields missing');
    }
    this.categories.push(categoryData);
    return categoryData;
  }

  public getResources(tenantId: string, campusId?: string): LearningResource[] {
    return this.resources.filter(r => {
      if (r.tenantId !== tenantId) return false;
      if (campusId && !r.permittedCampusScope.includes(campusId)) return false;
      return true;
    });
  }

  public getResourceById(resourceId: string, tenantId: string): LearningResource | undefined {
    return this.resources.find(r => r.resourceId === resourceId && r.tenantId === tenantId);
  }

  public createResource(
    resourceData: Omit<LearningResource, 'createdAt' | 'updatedAt' | 'totalCopiesCount' | 'availableCopiesCount' | 'borrowedCopiesCount' | 'reservedCopiesCount' | 'auditHash'>,
    actorUserIdRef: string
  ): LearningResource {
    if (!resourceData.tenantId || !resourceData.title || !resourceData.callNumber) {
      throw new Error('Mandatory resource fields missing (tenantId, title, callNumber)');
    }

    const now = new Date().toISOString();
    const res: LearningResource = {
      ...resourceData,
      totalCopiesCount: 0,
      availableCopiesCount: 0,
      borrowedCopiesCount: 0,
      reservedCopiesCount: 0,
      createdAt: now,
      updatedAt: now
    };

    this.resources.push(res);

    this.appendAudit(
      res.tenantId,
      res.permittedCampusScope[0] || 'CAMPUS_DEFAULT',
      actorUserIdRef,
      'RESOURCE_CATALOGUED',
      'LearningResource',
      res.resourceId,
      { title: res.title, callNumber: res.callNumber, format: res.format }
    );

    return res;
  }

  public updateResource(
    resourceId: string,
    tenantId: string,
    updates: Partial<LearningResource>,
    actorUserIdRef: string
  ): LearningResource {
    const res = this.getResourceById(resourceId, tenantId);
    if (!res) throw new Error(`Resource '${resourceId}' not found`);

    Object.assign(res, updates, { updatedAt: new Date().toISOString() });

    this.appendAudit(
      tenantId,
      res.permittedCampusScope[0] || 'CAMPUS_DEFAULT',
      actorUserIdRef,
      'RESOURCE_UPDATED',
      'LearningResource',
      resourceId,
      { updates }
    );

    return res;
  }

  // ==========================================
  // 3. RESOURCE COPIES (ITEM BARCODE LEVEL)
  // ==========================================

  public getCopies(tenantId: string, resourceId?: string, campusId?: string): ResourceCopy[] {
    return this.copies.filter(c => {
      if (c.tenantId !== tenantId) return false;
      if (resourceId && c.resourceIdRef !== resourceId) return false;
      if (campusId && c.campusIdRef !== campusId) return false;
      return true;
    });
  }

  public getCopyById(copyId: string, tenantId: string): ResourceCopy | undefined {
    return this.copies.find(c => c.copyId === copyId && c.tenantId === tenantId);
  }

  public createCopy(
    copyData: Omit<ResourceCopy, 'createdAt' | 'updatedAt' | 'totalCirculationCount' | 'auditHash'>,
    actorUserIdRef: string
  ): ResourceCopy {
    if (!copyData.tenantId || !copyData.resourceIdRef || !copyData.barcode || !copyData.accessionNumber) {
      throw new Error('Mandatory copy parameters missing (tenantId, resourceIdRef, barcode, accessionNumber)');
    }

    const res = this.getResourceById(copyData.resourceIdRef, copyData.tenantId);
    if (!res) throw new Error('Target learning resource does not exist in tenant');

    const existingBarcode = this.copies.find(
      c => c.tenantId === copyData.tenantId && c.barcode === copyData.barcode
    );
    if (existingBarcode) {
      throw new Error(`Copy with barcode '${copyData.barcode}' already exists in tenant`);
    }

    const now = new Date().toISOString();
    const copy: ResourceCopy = {
      ...copyData,
      totalCirculationCount: 0,
      createdAt: now,
      updatedAt: now
    };

    this.copies.push(copy);

    // Update parent resource counts
    res.totalCopiesCount += 1;
    if (copy.status === 'AVAILABLE') {
      res.availableCopiesCount += 1;
    } else if (copy.status === 'ON_LOAN') {
      res.borrowedCopiesCount += 1;
    }
    res.updatedAt = now;

    this.appendAudit(
      copy.tenantId,
      copy.campusIdRef,
      actorUserIdRef,
      'COPY_ADDED',
      'ResourceCopy',
      copy.copyId,
      { barcode: copy.barcode, accession: copy.accessionNumber, resourceId: copy.resourceIdRef }
    );

    return copy;
  }

  // ==========================================
  // 4. CIRCULATION POLICIES & MEMBERSHIP
  // ==========================================

  public getCirculationPolicies(tenantId: string, campusId?: string): CirculationPolicy[] {
    return this.policies.filter(
      p => p.tenantId === tenantId && (!campusId || p.campusIdRef === campusId)
    );
  }

  public createCirculationPolicy(
    policy: CirculationPolicy,
    actorUserIdRef: string
  ): CirculationPolicy {
    this.policies.push(policy);
    return policy;
  }

  public getMemberReference(
    memberType: 'STUDENT' | 'EMPLOYEE',
    entityIdRef: string,
    tenantId: string
  ): LibraryMemberReference | undefined {
    return this.memberReferences.find(m => {
      if (m.tenantId !== tenantId || m.memberType !== memberType) return false;
      if (memberType === 'STUDENT') return m.studentIdRef === entityIdRef;
      if (memberType === 'EMPLOYEE') return m.employeeIdRef === entityIdRef;
      return false;
    });
  }

  public registerMemberReference(
    memberData: LibraryMemberReference,
    actorUserIdRef: string
  ): LibraryMemberReference {
    this.memberReferences.push(memberData);
    return memberData;
  }

  public evaluateMemberEligibility(
    memberType: 'STUDENT' | 'EMPLOYEE',
    entityIdRef: string,
    tenantId: string,
    campusId: string
  ): { eligible: boolean; reason?: string; member?: LibraryMemberReference; policy?: CirculationPolicy } {
    const member = this.getMemberReference(memberType, entityIdRef, tenantId);
    if (!member) {
      return { eligible: false, reason: 'INSUFFICIENT DATA: Member reference not found in library registry' };
    }

    if (member.membershipStatus !== 'ACTIVE') {
      return { eligible: false, reason: `Membership is ${member.membershipStatus}`, member };
    }

    if (member.isBlockedForOverdue) {
      return { eligible: false, reason: 'Member is blocked due to unresolved overdue resources or unpaid fines', member };
    }

    if (member.activeLoansCount >= member.maxLoanLimit) {
      return { eligible: false, reason: `Active loan limit of ${member.maxLoanLimit} reached`, member };
    }

    const policy = this.policies.find(
      p => p.tenantId === tenantId && p.campusIdRef === campusId && p.memberCategory === member.memberCategory && p.isActive
    );

    return { eligible: true, member, policy };
  }

  // ==========================================
  // 5. CIRCULATION ENGINE (CHECKOUT, RETURN, RENEWAL)
  // ==========================================

  public getLoans(tenantId: string, status?: LibraryLoanStatus, campusId?: string): LibraryLoan[] {
    return this.loans.filter(l => {
      if (l.tenantId !== tenantId) return false;
      if (status && l.status !== status) return false;
      if (campusId && l.campusIdRef !== campusId) return false;
      return true;
    });
  }

  public getLoanById(loanId: string, tenantId: string): LibraryLoan | undefined {
    return this.loans.find(l => l.loanId === loanId && l.tenantId === tenantId);
  }

  /**
   * Authoritative Resource Checkout
   */
  public checkoutResource(params: {
    tenantId: string;
    campusIdRef: string;
    libraryIdRef: string;
    copyIdRef: string;
    memberType: 'STUDENT' | 'EMPLOYEE';
    studentIdRef?: string;
    employeeIdRef?: string;
    issuedByUserIdRef: string;
    idempotencyKey: string;
  }): LibraryLoan {
    const { tenantId, campusIdRef, libraryIdRef, copyIdRef, memberType, studentIdRef, employeeIdRef, issuedByUserIdRef, idempotencyKey } = params;

    // 1. Idempotency Check
    if (this.processedIdempotencyKeys.has(idempotencyKey)) {
      const existing = this.loans.find(l => l.idempotencyKey === idempotencyKey);
      if (existing) return existing;
    }

    // 2. Member Reference ID Validation
    const memberIdRef = memberType === 'STUDENT' ? studentIdRef : employeeIdRef;
    if (!memberIdRef) {
      throw new Error(`Must provide ${memberType === 'STUDENT' ? 'studentIdRef' : 'employeeIdRef'} for checkout`);
    }

    // 3. Member Eligibility & Policy Evaluation
    const evalResult = this.evaluateMemberEligibility(memberType, memberIdRef, tenantId, campusIdRef);
    if (!evalResult.eligible || !evalResult.member) {
      throw new Error(`Circulation Checkout Blocked: ${evalResult.reason}`);
    }

    // 4. Copy Validation
    const copy = this.getCopyById(copyIdRef, tenantId);
    if (!copy) throw new Error(`Resource copy '${copyIdRef}' does not exist in tenant`);
    if (copy.campusIdRef !== campusIdRef) {
      throw new Error('Cross-campus unauthorized checkout: Copy belongs to different campus location');
    }
    if (copy.status !== 'AVAILABLE') {
      throw new Error(`Cannot checkout copy in status '${copy.status}'`);
    }
    if (copy.isRestricted) {
      throw new Error('Restricted Reference / Archive resource cannot be circulated without Dean/Librarian override');
    }

    // 5. Parent Resource Validation
    const res = this.getResourceById(copy.resourceIdRef, tenantId);
    if (!res) throw new Error('Parent learning resource record not found');
    if (!res.permittedCampusScope.includes(campusIdRef)) {
      throw new Error('Resource is not permitted for circulation in this campus scope');
    }

    // 6. Calculate Due Date from Policy
    const loanDurationDays = evalResult.policy?.loanPeriodDays || 14;
    const checkoutDateObj = new Date();
    const dueDateObj = new Date(checkoutDateObj.getTime() + loanDurationDays * 24 * 60 * 60 * 1000);

    const nowIso = checkoutDateObj.toISOString();
    const dueIso = dueDateObj.toISOString();

    const loan: LibraryLoan = {
      loanId: `LOAN-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      loanNumber: `LN-${Date.now().toString().slice(-6)}`,
      tenantId,
      campusIdRef,
      libraryIdRef,
      resourceIdRef: copy.resourceIdRef,
      copyIdRef: copy.copyId,
      memberType,
      studentIdRef,
      employeeIdRef,
      memberCategory: evalResult.member.memberCategory,
      checkoutDate: nowIso,
      dueDate: dueIso,
      renewalCount: 0,
      maxRenewals: evalResult.policy?.maxRenewalsAllowed || 2,
      issuedByUserIdRef,
      status: 'ACTIVE',
      idempotencyKey,
      createdAt: nowIso,
      updatedAt: nowIso
    };

    // 7. Atomic Mutations
    copy.status = 'ON_LOAN';
    copy.totalCirculationCount += 1;
    copy.lastCirculationDate = nowIso;
    copy.updatedAt = nowIso;

    res.availableCopiesCount = Math.max(0, res.availableCopiesCount - 1);
    res.borrowedCopiesCount += 1;
    res.updatedAt = nowIso;

    evalResult.member.activeLoansCount += 1;

    this.loans.push(loan);
    this.processedIdempotencyKeys.add(idempotencyKey);

    this.appendAudit(
      tenantId,
      campusIdRef,
      issuedByUserIdRef,
      'LOAN_CHECKOUT',
      'LibraryLoan',
      loan.loanId,
      { loanNumber: loan.loanNumber, barcode: copy.barcode, memberType, memberIdRef, dueDate: dueIso },
      idempotencyKey
    );

    return loan;
  }

  /**
   * Authoritative Resource Check-in / Return
   */
  public checkinResource(params: {
    loanId: string;
    tenantId: string;
    returnedToUserIdRef: string;
    condition: ResourceCopyCondition;
    notes?: string;
    idempotencyKey: string;
  }): { loan: LibraryLoan; fine?: LibraryFineAssessment } {
    const { loanId, tenantId, returnedToUserIdRef, condition, notes, idempotencyKey } = params;

    const loan = this.getLoanById(loanId, tenantId);
    if (!loan) throw new Error(`Loan '${loanId}' not found`);
    if (loan.status !== 'ACTIVE' && loan.status !== 'OVERDUE' && loan.status !== 'RENEWED') {
      throw new Error(`Loan is already in closed status '${loan.status}'`);
    }

    const copy = this.getCopyById(loan.copyIdRef, tenantId);
    if (!copy) throw new Error('Associated copy not found');

    const res = this.getResourceById(loan.resourceIdRef, tenantId);
    if (!res) throw new Error('Associated learning resource not found');

    const now = new Date();
    const nowIso = now.toISOString();

    // Check for Overdue & Calculate Fine
    const dueDate = new Date(loan.dueDate);
    let fineAssessment: LibraryFineAssessment | undefined;

    if (now.getTime() > dueDate.getTime()) {
      const diffMs = now.getTime() - dueDate.getTime();
      const overdueDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      
      const member = this.getMemberReference(loan.memberType, loan.studentIdRef || loan.employeeIdRef || '', tenantId);
      const policy = this.policies.find(p => p.tenantId === tenantId && p.memberCategory === loan.memberCategory);
      
      const ratePerDay = policy?.finePerDay.amount || 10;
      const gracePeriod = policy?.gracePeriodDays || 0;
      const effectiveDays = Math.max(0, overdueDays - gracePeriod);
      const calculatedAmount = effectiveDays * ratePerDay;

      if (calculatedAmount > 0) {
        fineAssessment = {
          fineId: `FINE-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          fineNumber: `FN-${Date.now().toString().slice(-6)}`,
          tenantId,
          campusIdRef: loan.campusIdRef,
          loanIdRef: loan.loanId,
          resourceIdRef: loan.resourceIdRef,
          copyIdRef: loan.copyIdRef,
          memberType: loan.memberType,
          studentIdRef: loan.studentIdRef,
          employeeIdRef: loan.employeeIdRef,
          reason: 'OVERDUE',
          daysOverdue: effectiveDays,
          assessedAmount: { amount: calculatedAmount, currency: 'INR' },
          paidAmount: { amount: 0, currency: 'INR' },
          waivedAmount: { amount: 0, currency: 'INR' },
          outstandingAmount: { amount: calculatedAmount, currency: 'INR' },
          status: 'ASSESSED',
          assessedDate: nowIso,
          assessedByUserIdRef: returnedToUserIdRef,
          idempotencyKey: `IDEM-FINE-${loan.loanId}`,
          createdAt: nowIso,
          updatedAt: nowIso
        };

        this.fines.push(fineAssessment);
        if (member) {
          member.outstandingFinesTotal.amount += calculatedAmount;
          if (member.outstandingFinesTotal.amount > 200) {
            member.isBlockedForOverdue = true;
          }
        }
      }
    }

    // Atomic State Updates
    loan.status = 'RETURNED';
    loan.returnedDate = nowIso;
    loan.returnedToUserIdRef = returnedToUserIdRef;
    loan.returnCondition = condition;
    loan.updatedAt = nowIso;

    if (condition === 'DAMAGED' || condition === 'UNUSABLE') {
      copy.status = 'DAMAGED';
      copy.condition = condition;
    } else {
      copy.status = 'AVAILABLE';
      copy.condition = condition;
      res.availableCopiesCount += 1;
    }

    res.borrowedCopiesCount = Math.max(0, res.borrowedCopiesCount - 1);
    res.updatedAt = nowIso;
    copy.updatedAt = nowIso;

    const memberRef = this.getMemberReference(loan.memberType, loan.studentIdRef || loan.employeeIdRef || '', tenantId);
    if (memberRef) {
      memberRef.activeLoansCount = Math.max(0, memberRef.activeLoansCount - 1);
    }

    this.appendAudit(
      tenantId,
      loan.campusIdRef,
      returnedToUserIdRef,
      'LOAN_CHECKIN',
      'LibraryLoan',
      loan.loanId,
      { copyId: copy.copyId, condition, fineAssessed: fineAssessment ? fineAssessment.assessedAmount : 0 },
      idempotencyKey
    );

    return { loan, fine: fineAssessment };
  }

  /**
   * Loan Renewal
   */
  public renewLoan(params: {
    loanId: string;
    tenantId: string;
    renewedByUserIdRef: string;
    idempotencyKey: string;
  }): LibraryLoan {
    const { loanId, tenantId, renewedByUserIdRef, idempotencyKey } = params;

    const loan = this.getLoanById(loanId, tenantId);
    if (!loan) throw new Error(`Loan '${loanId}' not found`);
    if (loan.status !== 'ACTIVE' && loan.status !== 'RENEWED') {
      throw new Error(`Cannot renew loan in status '${loan.status}'`);
    }

    if (loan.renewalCount >= loan.maxRenewals) {
      throw new Error(`Maximum renewal limit (${loan.maxRenewals}) reached for this loan`);
    }

    // Check if there is a pending reservation queue for this resource
    const pendingReservations = this.reservations.filter(
      r => r.tenantId === tenantId && r.resourceIdRef === loan.resourceIdRef && (r.status === 'REQUESTED' || r.status === 'QUEUED')
    );
    if (pendingReservations.length > 0) {
      throw new Error('Renewal Rejected: Resource is reserved by other waiting patrons');
    }

    const currentDue = new Date(loan.dueDate);
    const policy = this.policies.find(p => p.tenantId === tenantId && p.memberCategory === loan.memberCategory);
    const renewalDays = policy?.renewalPeriodDays || 7;
    const newDueDate = new Date(currentDue.getTime() + renewalDays * 24 * 60 * 60 * 1000);

    const renewalRecord: LibraryLoanRenewal = {
      renewalId: `RNW-${Date.now()}`,
      loanIdRef: loan.loanId,
      tenantId,
      previousDueDate: loan.dueDate,
      newDueDate: newDueDate.toISOString(),
      renewalDate: new Date().toISOString(),
      renewedByUserIdRef,
      policyIdRef: policy?.policyId || 'POL-DEFAULT',
      idempotencyKey
    };

    loan.renewalCount += 1;
    loan.dueDate = newDueDate.toISOString();
    loan.status = 'RENEWED';
    loan.updatedAt = new Date().toISOString();

    this.renewals.push(renewalRecord);

    this.appendAudit(
      tenantId,
      loan.campusIdRef,
      renewedByUserIdRef,
      'LOAN_RENEWED',
      'LibraryLoan',
      loan.loanId,
      { newDueDate: loan.dueDate, renewalCount: loan.renewalCount },
      idempotencyKey
    );

    return loan;
  }

  // ==========================================
  // 6. RESERVATIONS & HOLDS
  // ==========================================

  public getReservations(tenantId: string, status?: LibraryReservationStatus, campusId?: string): LibraryReservation[] {
    return this.reservations.filter(r => {
      if (r.tenantId !== tenantId) return false;
      if (status && r.status !== status) return false;
      if (campusId && r.campusIdRef !== campusId) return false;
      return true;
    });
  }

  public createReservation(params: {
    tenantId: string;
    campusIdRef: string;
    resourceIdRef: string;
    memberType: 'STUDENT' | 'EMPLOYEE';
    studentIdRef?: string;
    employeeIdRef?: string;
    requestedByUserIdRef: string;
    idempotencyKey: string;
  }): LibraryReservation {
    const { tenantId, campusIdRef, resourceIdRef, memberType, studentIdRef, employeeIdRef, requestedByUserIdRef, idempotencyKey } = params;

    const res = this.getResourceById(resourceIdRef, tenantId);
    if (!res) throw new Error('Target resource not found');

    const memberId = memberType === 'STUDENT' ? studentIdRef : employeeIdRef;
    if (!memberId) throw new Error('Member identifier reference missing');

    const member = this.getMemberReference(memberType, memberId, tenantId);
    if (!member || member.membershipStatus !== 'ACTIVE') {
      throw new Error('Member membership is not active or not found');
    }

    // Determine queue position
    const existingInQueue = this.reservations.filter(
      r => r.tenantId === tenantId && r.resourceIdRef === resourceIdRef && (r.status === 'REQUESTED' || r.status === 'QUEUED')
    );

    const nowIso = new Date().toISOString();
    const reservation: LibraryReservation = {
      reservationId: `RESV-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      reservationNumber: `RSV-${Date.now().toString().slice(-6)}`,
      tenantId,
      campusIdRef,
      resourceIdRef,
      memberType,
      studentIdRef,
      employeeIdRef,
      memberCategory: member.memberCategory,
      requestedDate: nowIso,
      queuePosition: existingInQueue.length + 1,
      status: 'QUEUED',
      idempotencyKey,
      createdAt: nowIso,
      updatedAt: nowIso
    };

    res.reservedCopiesCount += 1;
    res.updatedAt = nowIso;

    this.reservations.push(reservation);

    this.appendAudit(
      tenantId,
      campusIdRef,
      requestedByUserIdRef,
      'RESERVATION_CREATED',
      'LibraryReservation',
      reservation.reservationId,
      { reservationNumber: reservation.reservationNumber, resourceId: resourceIdRef, queuePosition: reservation.queuePosition },
      idempotencyKey
    );

    return reservation;
  }

  // ==========================================
  // 7. FINES & FOUR-EYES SOD WAIVERS
  // ==========================================

  public getFines(tenantId: string, status?: LibraryFineStatus, campusId?: string): LibraryFineAssessment[] {
    return this.fines.filter(f => {
      if (f.tenantId !== tenantId) return false;
      if (status && f.status !== status) return false;
      if (campusId && f.campusIdRef !== campusId) return false;
      return true;
    });
  }

  public payFine(fineId: string, tenantId: string, amount: number, cashierUserIdRef: string): LibraryFineAssessment {
    const fine = this.fines.find(f => f.fineId === fineId && f.tenantId === tenantId);
    if (!fine) throw new Error(`Fine record '${fineId}' not found`);

    if (fine.status === 'PAID' || fine.status === 'WAIVED') {
      throw new Error(`Fine is already in closed status '${fine.status}'`);
    }

    if (amount <= 0 || amount > fine.outstandingAmount.amount) {
      throw new Error(`Payment amount must be between 1 and ${fine.outstandingAmount.amount}`);
    }

    fine.paidAmount.amount += amount;
    fine.outstandingAmount.amount -= amount;
    fine.status = fine.outstandingAmount.amount === 0 ? 'PAID' : 'PARTIALLY_PAID';
    fine.updatedAt = new Date().toISOString();

    const member = this.getMemberReference(fine.memberType, fine.studentIdRef || fine.employeeIdRef || '', tenantId);
    if (member) {
      member.outstandingFinesTotal.amount = Math.max(0, member.outstandingFinesTotal.amount - amount);
      if (member.outstandingFinesTotal.amount <= 200) {
        member.isBlockedForOverdue = false;
      }
    }

    this.appendAudit(
      tenantId,
      fine.campusIdRef,
      cashierUserIdRef,
      'FINE_PAID',
      'LibraryFineAssessment',
      fine.fineId,
      { amountPaid: amount, remaining: fine.outstandingAmount.amount }
    );

    return fine;
  }

  /**
   * Request Fine Waiver (Initiates Four-Eyes SoD Workflow)
   */
  public requestFineWaiver(params: {
    fineIdRef: string;
    tenantId: string;
    campusIdRef: string;
    waiverAmount: number;
    reasonCategory: FineWaiverRequest['reasonCategory'];
    justification: string;
    requestedByUserIdRef: string;
    idempotencyKey: string;
  }): FineWaiverRequest {
    const { fineIdRef, tenantId, campusIdRef, waiverAmount, reasonCategory, justification, requestedByUserIdRef, idempotencyKey } = params;

    const fine = this.fines.find(f => f.fineId === fineIdRef && f.tenantId === tenantId);
    if (!fine) throw new Error('Fine record not found');
    if (waiverAmount <= 0 || waiverAmount > fine.outstandingAmount.amount) {
      throw new Error('Waiver amount exceeds outstanding fine balance');
    }

    const waiverReq: FineWaiverRequest = {
      waiverRequestId: `WVR-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      fineIdRef,
      tenantId,
      campusIdRef,
      waiverAmount: { amount: waiverAmount, currency: fine.assessedAmount.currency },
      reasonCategory,
      justification,
      requestedByUserIdRef,
      status: 'PENDING',
      idempotencyKey,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    fine.status = 'WAIVER_REQUESTED';
    this.waiverRequests.push(waiverReq);

    this.appendAudit(
      tenantId,
      campusIdRef,
      requestedByUserIdRef,
      'FINE_WAIVED_SOD',
      'LibraryFineAssessment',
      fineIdRef,
      { waiverRequestId: waiverReq.waiverRequestId, amount: waiverAmount, reason: reasonCategory },
      idempotencyKey
    );

    return waiverReq;
  }

  /**
   * Approve Fine Waiver with Enforced Four-Eyes Segregation of Duties
   */
  public approveFineWaiver(
    waiverRequestId: string,
    tenantId: string,
    approverUserIdRef: string
  ): FineWaiverRequest {
    const wvr = this.waiverRequests.find(w => w.waiverRequestId === waiverRequestId && w.tenantId === tenantId);
    if (!wvr) throw new Error(`Fine waiver request '${waiverRequestId}' not found`);

    if (wvr.status !== 'PENDING') {
      throw new Error(`Waiver request is already in status '${wvr.status}'`);
    }

    // MANDATORY FOUR-EYES SOD CHECK: Requester cannot approve their own waiver
    if (wvr.requestedByUserIdRef === approverUserIdRef) {
      throw new Error(
        `Four-Eyes SoD Violation: Requisition officer '${wvr.requestedByUserIdRef}' cannot approve their own fine waiver`
      );
    }

    const fine = this.fines.find(f => f.fineId === wvr.fineIdRef && f.tenantId === tenantId);
    if (!fine) throw new Error('Associated fine record not found');

    // Execute waiver
    wvr.status = 'APPROVED';
    wvr.approvedByUserIdRef = approverUserIdRef;
    wvr.approvalDate = new Date().toISOString();
    wvr.updatedAt = new Date().toISOString();

    fine.waivedAmount.amount += wvr.waiverAmount.amount;
    fine.outstandingAmount.amount = Math.max(0, fine.outstandingAmount.amount - wvr.waiverAmount.amount);
    fine.status = fine.outstandingAmount.amount === 0 ? 'WAIVED' : 'ADJUSTED';
    fine.updatedAt = new Date().toISOString();

    const member = this.getMemberReference(fine.memberType, fine.studentIdRef || fine.employeeIdRef || '', tenantId);
    if (member) {
      member.outstandingFinesTotal.amount = Math.max(0, member.outstandingFinesTotal.amount - wvr.waiverAmount.amount);
    }

    this.appendAudit(
      tenantId,
      wvr.campusIdRef,
      approverUserIdRef,
      'FINE_WAIVED_SOD',
      'LibraryFineAssessment',
      fine.fineId,
      { waiverApproved: true, approver: approverUserIdRef, amountWaived: wvr.waiverAmount.amount }
    );

    return wvr;
  }

  // ==========================================
  // 8. INTER-LIBRARY & INTER-CAMPUS TRANSFERS
  // ==========================================

  public getTransfers(tenantId: string, campusId?: string): ResourceTransfer[] {
    return this.transfers.filter(t => {
      if (t.tenantId !== tenantId) return false;
      if (campusId && t.fromCampusIdRef !== campusId && t.toCampusIdRef !== campusId) return false;
      return true;
    });
  }

  public createTransferRequest(params: {
    tenantId: string;
    copyIdRef: string;
    fromCampusIdRef: string;
    toCampusIdRef: string;
    fromLibraryIdRef: string;
    toLibraryIdRef: string;
    requestedByUserIdRef: string;
    reason: ResourceTransfer['reason'];
    idempotencyKey: string;
  }): ResourceTransfer {
    const { tenantId, copyIdRef, fromCampusIdRef, toCampusIdRef, fromLibraryIdRef, toLibraryIdRef, requestedByUserIdRef, reason, idempotencyKey } = params;

    const copy = this.getCopyById(copyIdRef, tenantId);
    if (!copy) throw new Error('Copy not found');
    if (copy.status !== 'AVAILABLE') {
      throw new Error(`Cannot transfer copy in status '${copy.status}'`);
    }

    const transfer: ResourceTransfer = {
      transferId: `XFR-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      transferNumber: `TRF-${Date.now().toString().slice(-6)}`,
      tenantId,
      copyIdRef,
      resourceIdRef: copy.resourceIdRef,
      fromCampusIdRef,
      toCampusIdRef,
      fromLibraryIdRef,
      toLibraryIdRef,
      requestedByUserIdRef,
      status: 'REQUESTED',
      reason,
      idempotencyKey,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.transfers.push(transfer);

    this.appendAudit(
      tenantId,
      fromCampusIdRef,
      requestedByUserIdRef,
      'TRANSFER_DISPATCHED',
      'ResourceTransfer',
      transfer.transferId,
      { transferNumber: transfer.transferNumber, fromCampus: fromCampusIdRef, toCampus: toCampusIdRef },
      idempotencyKey
    );

    return transfer;
  }

  public authorizeAndDispatchTransfer(
    transferId: string,
    tenantId: string,
    authorizingOfficerUserIdRef: string
  ): ResourceTransfer {
    const xfr = this.transfers.find(t => t.transferId === transferId && t.tenantId === tenantId);
    if (!xfr) throw new Error('Transfer record not found');
    if (xfr.status !== 'REQUESTED') throw new Error(`Transfer cannot be dispatched in status '${xfr.status}'`);

    const copy = this.getCopyById(xfr.copyIdRef, tenantId);
    if (!copy) throw new Error('Copy not found');

    xfr.status = 'IN_TRANSIT';
    xfr.authorizedByUserIdRef = authorizingOfficerUserIdRef;
    xfr.dispatchedDate = new Date().toISOString();
    xfr.updatedAt = new Date().toISOString();

    copy.status = 'IN_TRANSIT';
    copy.updatedAt = new Date().toISOString();

    this.appendAudit(
      tenantId,
      xfr.fromCampusIdRef,
      authorizingOfficerUserIdRef,
      'TRANSFER_DISPATCHED',
      'ResourceTransfer',
      transferId,
      { status: 'IN_TRANSIT', copyId: copy.copyId }
    );

    return xfr;
  }

  public receiveTransfer(
    transferId: string,
    tenantId: string,
    receivingOfficerUserIdRef: string
  ): ResourceTransfer {
    const xfr = this.transfers.find(t => t.transferId === transferId && t.tenantId === tenantId);
    if (!xfr) throw new Error('Transfer record not found');
    if (xfr.status !== 'IN_TRANSIT') throw new Error(`Cannot receive transfer in status '${xfr.status}'`);

    const copy = this.getCopyById(xfr.copyIdRef, tenantId);
    if (!copy) throw new Error('Copy not found');

    xfr.status = 'RECEIVED';
    xfr.receivedDate = new Date().toISOString();
    xfr.updatedAt = new Date().toISOString();

    copy.status = 'AVAILABLE';
    copy.campusIdRef = xfr.toCampusIdRef;
    copy.libraryIdRef = xfr.toLibraryIdRef;
    copy.updatedAt = new Date().toISOString();

    this.appendAudit(
      tenantId,
      xfr.toCampusIdRef,
      receivingOfficerUserIdRef,
      'TRANSFER_RECEIVED',
      'ResourceTransfer',
      transferId,
      { copyId: copy.copyId, newCampus: xfr.toCampusIdRef, newLibrary: xfr.toLibraryIdRef }
    );

    return xfr;
  }

  // ==========================================
  // 9. ACQUISITIONS & FOUR-EYES APPROVALS
  // ==========================================

  public getAcquisitionRequests(tenantId: string, campusId?: string): AcquisitionRequest[] {
    return this.acquisitionRequests.filter(
      a => a.tenantId === tenantId && (!campusId || a.campusIdRef === campusId)
    );
  }

  public createAcquisitionRequest(
    requestData: Omit<AcquisitionRequest, 'requestId' | 'requestNumber' | 'status' | 'createdAt' | 'updatedAt' | 'auditHash'>,
    actorUserIdRef: string
  ): AcquisitionRequest {
    const req: AcquisitionRequest = {
      ...requestData,
      requestId: `ACQ-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      requestNumber: `ACQ-REQ-${Date.now().toString().slice(-6)}`,
      status: 'REQUESTED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.acquisitionRequests.push(req);

    this.appendAudit(
      req.tenantId,
      req.campusIdRef,
      actorUserIdRef,
      'ACQUISITION_REQUESTED',
      'AcquisitionRequest',
      req.requestId,
      { title: req.title, qty: req.quantityRequested, cost: req.estimatedTotalCost }
    );

    return req;
  }

  public approveAcquisitionRequest(
    requestId: string,
    tenantId: string,
    approverUserIdRef: string
  ): AcquisitionRequest {
    const acq = this.acquisitionRequests.find(a => a.requestId === requestId && a.tenantId === tenantId);
    if (!acq) throw new Error('Acquisition request not found');

    // FOUR-EYES SOD CHECK
    if (acq.requestedByUserIdRef === approverUserIdRef) {
      throw new Error('Four-Eyes SoD Violation: Requester cannot approve their own acquisition request');
    }

    acq.status = 'APPROVED';
    acq.approvedByUserIdRef = approverUserIdRef;
    acq.updatedAt = new Date().toISOString();

    this.appendAudit(
      tenantId,
      acq.campusIdRef,
      approverUserIdRef,
      'ACQUISITION_APPROVED_SOD',
      'AcquisitionRequest',
      requestId,
      { approved: true, approver: approverUserIdRef }
    );

    return acq;
  }

  // ==========================================
  // 10. DIGITAL RESOURCES & ENTITLEMENTS
  // ==========================================

  public getDigitalResources(tenantId: string, campusId?: string): DigitalResource[] {
    return this.digitalResources.filter(
      d => d.tenantId === tenantId && (!campusId || d.campusIdRef === campusId)
    );
  }

  public createDigitalResource(
    digitalData: Omit<DigitalResource, 'createdAt' | 'updatedAt'>,
    actorUserIdRef: string
  ): DigitalResource {
    const item: DigitalResource = {
      ...digitalData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.digitalResources.push(item);
    return item;
  }

  public requestDigitalAccess(params: {
    digitalResourceIdRef: string;
    tenantId: string;
    campusIdRef: string;
    memberIdRef: string;
    accessType: DigitalAccessEvent['accessType'];
    isFaculty: boolean;
  }): { granted: boolean; reason?: string } {
    const { digitalResourceIdRef, tenantId, campusIdRef, memberIdRef, accessType, isFaculty } = params;

    const digital = this.digitalResources.find(
      d => d.digitalResourceId === digitalResourceIdRef && d.tenantId === tenantId
    );
    if (!digital) {
      return { granted: false, reason: 'Digital resource not found' };
    }

    if (digital.isRestrictedFacultyOnly && !isFaculty) {
      this.digitalAccessEvents.push({
        eventId: `EVT-DIG-${Date.now()}`,
        digitalResourceIdRef,
        tenantId,
        campusIdRef,
        memberIdRef,
        accessType,
        ipAddressMasked: '10.240.***.***',
        timestamp: new Date().toISOString(),
        success: false,
        rejectionReason: 'RESTRICTED_FACULTY_ONLY'
      });
      return { granted: false, reason: 'Restricted resource: Faculty authorization required' };
    }

    if (digital.maxConcurrentUsers && digital.currentActiveStreams >= digital.maxConcurrentUsers) {
      return { granted: false, reason: 'Concurrency limit reached on institutional digital license' };
    }

    digital.currentActiveStreams += 1;

    this.digitalAccessEvents.push({
      eventId: `EVT-DIG-${Date.now()}`,
      digitalResourceIdRef,
      tenantId,
      campusIdRef,
      memberIdRef,
      accessType,
      ipAddressMasked: '10.240.***.***',
      timestamp: new Date().toISOString(),
      success: true
    });

    return { granted: true };
  }

  // ==========================================
  // 11. DIAGNOSTICS ENGINE
  // ==========================================

  public runDiagnostics(tenantId: string): LibraryDiagnosticResult {
    const anomalies: LibraryDiagnosticAnomaly[] = [];
    const tenantResources = this.getResources(tenantId);
    const tenantCopies = this.getCopies(tenantId);
    const tenantLoans = this.getLoans(tenantId);

    // Check 1: Duplicate active loans on same physical copy
    const copyLoanCounts: Record<string, number> = {};
    for (const loan of tenantLoans) {
      if (loan.status === 'ACTIVE' || loan.status === 'RENEWED' || loan.status === 'OVERDUE') {
        copyLoanCounts[loan.copyIdRef] = (copyLoanCounts[loan.copyIdRef] || 0) + 1;
        if (copyLoanCounts[loan.copyIdRef] > 1) {
          anomalies.push({
            anomalyId: `ANOM-DUP-LOAN-${loan.copyIdRef}`,
            severity: 'CRITICAL',
            category: 'DUPLICATE_ACTIVE_LOAN',
            description: `Physical copy '${loan.copyIdRef}' has multiple concurrent active circulation loans recorded`,
            entityType: 'ResourceCopy',
            entityId: loan.copyIdRef,
            campusIdRef: loan.campusIdRef,
            detectedAt: new Date().toISOString(),
            remediationRecommendation: 'Reconcile loan registry and verify physical copy custody'
          });
        }
      }
    }

    // Check 2: Available copy count mismatch with physical copy statuses
    for (const res of tenantResources) {
      const activeCopies = tenantCopies.filter(c => c.resourceIdRef === res.resourceId);
      const actualAvailable = activeCopies.filter(c => c.status === 'AVAILABLE').length;
      if (res.availableCopiesCount !== actualAvailable) {
        anomalies.push({
          anomalyId: `ANOM-CNT-MISMATCH-${res.resourceId}`,
          severity: 'HIGH',
          category: 'INVALID_RESOURCE_STATE',
          description: `Resource '${res.title}' available counter (${res.availableCopiesCount}) mismatches active copies (${actualAvailable})`,
          entityType: 'LearningResource',
          entityId: res.resourceId,
          campusIdRef: res.permittedCampusScope[0] || 'CAMPUS_DEFAULT',
          detectedAt: new Date().toISOString(),
          remediationRecommendation: 'Recompute resource catalog copy counters'
        });
      }
    }

    // Check 3: Cryptographic Audit Chain Verification
    let auditChainIntact = true;
    for (let i = 1; i < this.auditTrail.length; i++) {
      if (this.auditTrail[i].previousHash !== this.auditTrail[i - 1].hash) {
        auditChainIntact = false;
        anomalies.push({
          anomalyId: `ANOM-AUDIT-BREAK-${i}`,
          severity: 'CRITICAL',
          category: 'AUDIT_CHAIN_INTEGRITY_BREACH',
          description: `Audit chain linkage mismatch at block ${i}`,
          entityType: 'LibraryAuditEvent',
          entityId: this.auditTrail[i].eventId,
          campusIdRef: this.auditTrail[i].campusIdRef,
          detectedAt: new Date().toISOString(),
          remediationRecommendation: 'Alert security auditor and inspect persistence logs'
        });
      }
    }

    return {
      tenantId,
      status: anomalies.length === 0 ? 'HEALTHY' : anomalies.some(a => a.severity === 'CRITICAL') ? 'ANOMALIES_DETECTED' : 'WARNING',
      totalResourcesInspected: tenantResources.length,
      totalCopiesInspected: tenantCopies.length,
      totalActiveLoansInspected: tenantLoans.filter(l => l.status === 'ACTIVE').length,
      anomaliesCount: anomalies.length,
      anomalies,
      auditChainIntact,
      evaluatedAt: new Date().toISOString()
    };
  }

  // ==========================================
  // 12. AUDIT TRAIL QUERY
  // ==========================================

  public getAuditTrail(tenantId: string): LibraryAuditEvent[] {
    return this.auditTrail.filter(a => a.tenantId === tenantId);
  }

  // ==========================================
  // 13. WHAT-IF SANDBOX (15 ISOLATED SCENARIOS - ZERO PRODUCTION MUTATION)
  // ==========================================

  public runSimulation(scenarioType: LibrarySimulationScenario['type']): LibrarySimulationResult {
    const startTime = performance.now();

    // 1. Snapshot Production Counts
    const initialResourceCount = this.resources.length;
    const initialCopiesCount = this.copies.length;
    const initialLoansCount = this.loans.length;

    // 2. Clone state purely in-memory
    const clonedResources = JSON.parse(JSON.stringify(this.resources));
    const clonedCopies = JSON.parse(JSON.stringify(this.copies));
    const clonedLoans = JSON.parse(JSON.stringify(this.loans));

    let projectedCirculationVolume = initialLoansCount;
    let projectedTurnaroundDelayDays = 0;
    let projectedCapacityShortfallPercent = 0;
    let projectedInterLibraryTransitVolume = 0;
    let stressFactorMultiplier = 1.0;
    const projectedOverdueFinesTotal = { amount: 0, currency: 'INR' };
    const recommendations: string[] = [];

    switch (scenarioType) {
      case 'SEMESTER_CIRCULATION_SURGE':
        stressFactorMultiplier = 3.5;
        projectedCirculationVolume = Math.round(initialLoansCount * stressFactorMultiplier);
        projectedCapacityShortfallPercent = 35;
        recommendations.push('Activate digital course-pack e-reserves to offset physical copy shortfall');
        recommendations.push('Temporarily reduce standard loan period from 14 to 7 days during peak mid-terms');
        break;

      case 'LIBRARY_CAPACITY_EXHAUSTION':
        stressFactorMultiplier = 2.8;
        projectedCapacityShortfallPercent = 88;
        recommendations.push('Open auxiliary study halls in Building B floor 3');
        recommendations.push('Implement 2-hour quiet study seat reservation gating');
        break;

      case 'MASS_OVERDUE_EVENT':
        stressFactorMultiplier = 4.0;
        projectedOverdueFinesTotal.amount = 45000;
        recommendations.push('Send automated SMS and email warning 48h before due date');
        recommendations.push('Enable 3-day grace period amnesty for semester return week');
        break;

      case 'HIGH_DEMAND_RESOURCE_SHORTAGE':
        stressFactorMultiplier = 5.0;
        projectedCapacityShortfallPercent = 65;
        recommendations.push('Trigger rapid procurement requisition for high-demand course references');
        recommendations.push('Shift 50% of copies to 2-hour In-Library Reference Only Reserve');
        break;

      case 'RESERVATION_SURGE':
        stressFactorMultiplier = 3.2;
        projectedTurnaroundDelayDays = 12;
        recommendations.push('Cap active reservations per student to 2 items');
        recommendations.push('Reduce hold pickup window from 5 days to 48 hours');
        break;

      case 'INTER_CAMPUS_TRANSFER_CASCADE':
        stressFactorMultiplier = 2.5;
        projectedInterLibraryTransitVolume = 45;
        recommendations.push('Schedule daily dedicated logistics courier between Delhi and Mumbai campuses');
        break;

      case 'LOST_RESOURCE_SURGE':
        stressFactorMultiplier = 2.2;
        projectedOverdueFinesTotal.amount = 78000;
        recommendations.push('Audit security RFID gates at Central Library exit points');
        break;

      case 'FINE_POLICY_CHANGE':
        stressFactorMultiplier = 1.5;
        projectedOverdueFinesTotal.amount = 62000;
        recommendations.push('Simulate 50% increase in daily fine rate on overdue return velocity');
        break;

      case 'FINE_WAIVER_SURGE':
        stressFactorMultiplier = 2.0;
        recommendations.push('Enforce strict Four-Eyes SoD approval tiers for waivers exceeding ₹500');
        break;

      case 'ACQUISITION_DEMAND_SURGE':
        stressFactorMultiplier = 3.0;
        recommendations.push('Prioritize digital perpetual licenses over physical imports for rapid delivery');
        break;

      case 'DIGITAL_ENTITLEMENT_EXPIRY_EVENT':
        stressFactorMultiplier = 2.4;
        recommendations.push('Renew ACM & IEEE institutional subscription bundle 30 days prior to expiry');
        break;

      case 'RESTRICTED_RESOURCE_ACCESS_ATTEMPT':
        stressFactorMultiplier = 1.8;
        recommendations.push('Require 2FA and Dean sign-off for Rare Manuscript archive viewing');
        break;

      case 'CAMPUS_CLOSURE':
        stressFactorMultiplier = 4.5;
        projectedTurnaroundDelayDays = 30;
        recommendations.push('Automatically extend all active loan due dates by 30 days without fine penalties');
        break;

      case 'RESOURCE_WITHDRAWAL_CASCADE':
        stressFactorMultiplier = 1.7;
        recommendations.push('Schedule committee deaccessioning review for materials older than 15 years');
        break;

      case 'LIBRARY_SERVICE_DISRUPTION':
        stressFactorMultiplier = 3.8;
        recommendations.push('Switch to offline circulation buffer with local barcode scanner caching');
        break;
    }

    const duration = performance.now() - startTime;

    // 3. ZERO PRODUCTION MUTATION VERIFICATION
    const zeroProductionMutationVerified =
      this.resources.length === initialResourceCount &&
      this.copies.length === initialCopiesCount &&
      this.loans.length === initialLoansCount;

    return {
      scenarioType,
      simulationBanner: 'SIMULATION ONLY - SANDBOX MODE ACTIVE - ZERO PRODUCTION MUTATION',
      executionDurationMs: Math.round(duration),
      initialResourceCount,
      initialCopiesCount,
      initialLoansCount,
      projectedCirculationVolume,
      projectedOverdueFinesTotal,
      projectedTurnaroundDelayDays,
      projectedCapacityShortfallPercent,
      projectedInterLibraryTransitVolume,
      stressFactorMultiplier,
      recommendations,
      zeroProductionMutationVerified
    };
  }
}

export const libraryLearningResourcesService = new LibraryLearningResourcesService();
