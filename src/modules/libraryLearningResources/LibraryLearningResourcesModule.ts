import { UniversalModuleContract } from '../../core/contracts/ModuleContract';

export const LibraryLearningResourcesModule: UniversalModuleContract = {
  moduleId: 'mod_library_learning_resources',
  name: 'Institutional Library, Learning Resources, Knowledge Assets & Resource Circulation Operations',
  displayName: 'Library & Learning Resources',
  description: 'Authoritative operations module governing institutional libraries, physical and digital learning resources, cataloguing, copy inventory, circulation, renewals, reservations, overdue management, fine assessments, Four-Eyes SoD waivers, inter-library transfers, acquisition proposals, and digital entitlements.',
  category: 'Core',
  status: 'REGISTERED',
  provider: 'CORE',
  version: '11.8.0',
  dependencies: [
    { moduleId: 'mod_institutional_administration', minVersion: '10.1.0' },
    { moduleId: 'mod_academic_management', minVersion: '10.2.0' },
    { moduleId: 'mod_student_lifecycle', minVersion: '10.4.0' },
    { moduleId: 'mod_human_resources_workforce', minVersion: '11.1.0' },
    { moduleId: 'mod_institutional_finance_operations', minVersion: '11.2.0' },
    { moduleId: 'mod_institutional_procurement_operations', minVersion: '11.3.0' },
    { moduleId: 'mod_facilities_space_safety', minVersion: '11.5.0' },
    { moduleId: 'mod_inventory_assets_stores_materials', minVersion: '11.7.0' }
  ],
  configurationSchema: [],
  navigationItems: [
    {
      id: 'nav_library_learning_resources',
      moduleId: 'mod_library_learning_resources',
      label: 'Library & Learning Resources',
      icon: 'BookOpen',
      route: 'library_learning_resources',
      sortOrder: 17,
      status: 'active',
      requiredPermission: 'library.view',
      allowedRoles: [
        'super_admin',
        'platform_admin',
        'librarian',
        'assistant_librarian',
        'library_clerk',
        'faculty_member',
        'student',
        'auditor'
      ],
      targetContext: 'tenant'
    }
  ],
  permissions: [
    {
      code: 'library.view',
      name: 'View Library Resources',
      description: 'Access library catalog, resource search, availability status, and general branch information'
    },
    {
      code: 'library.manage',
      name: 'Manage Library Configuration',
      description: 'Configure library branch facilities, operating hours, and general catalog classifications'
    },
    {
      code: 'library.resource.create',
      name: 'Catalogue New Learning Resource',
      description: 'Add new titles, editions, and bibliographic metadata records to institutional catalog'
    },
    {
      code: 'library.resource.update',
      name: 'Update Learning Resource Metadata',
      description: 'Edit bibliographic records, subject keywords, access restrictions, and replacement costs'
    },
    {
      code: 'library.circulation.manage',
      name: 'Manage Resource Circulation',
      description: 'Execute check-out, return, renewal, and condition inspection on physical resource copies'
    },
    {
      code: 'library.reservation.manage',
      name: 'Manage Holds & Reservations',
      description: 'Process patron holds, manage reservation queue positions, and hold expiry deadlines'
    },
    {
      code: 'library.fine.view',
      name: 'View Overdue & Fine Records',
      description: 'Inspect patron fine assessments, payment receipts, and outstanding fee balances'
    },
    {
      code: 'library.fine.manage',
      name: 'Assess & Collect Fines',
      description: 'Assess overdue penalties, process fine payments, and update member credit blocks'
    },
    {
      code: 'library.fine.waive',
      name: 'Approve Fine Waivers (Four-Eyes SoD)',
      description: 'Sign off on fine waiver requests with strict separation of duties preventing self-approval'
    },
    {
      code: 'library.digital.access',
      name: 'Access Digital Knowledge Assets',
      description: 'Stream, download, or view institutional e-books, research journals, and multimedia resources'
    },
    {
      code: 'library.restricted.override',
      name: 'Override Restricted Resource Controls',
      description: 'Authorize access or circulation for Rare Manuscripts, Faculty-Only, and Archival assets'
    },
    {
      code: 'library.acquisition.manage',
      name: 'Manage Acquisition Requests',
      description: 'Submit resource purchase requests, verify academic justifications, and create proposals'
    },
    {
      code: 'library.acquisition.approve',
      name: 'Approve Acquisitions (Four-Eyes SoD)',
      description: 'Authorize budget expenditure and order issuance for new resource acquisitions'
    },
    {
      code: 'library.transfer.manage',
      name: 'Manage Inter-Library Transfers',
      description: 'Dispatch, track in-transit items, and receive cross-branch or cross-campus book transfers'
    },
    {
      code: 'library.withdrawal.approve',
      name: 'Approve Resource Deaccessioning',
      description: 'Approve weeding, obsolescence write-off, or physical disposal of damaged collection copies'
    },
    {
      code: 'library.audit.view',
      name: 'Inspect Cryptographic Audit Trail',
      description: 'View append-only SHA-256 chained audit logs and run automated diagnostic integrity scans'
    }
  ]
};
