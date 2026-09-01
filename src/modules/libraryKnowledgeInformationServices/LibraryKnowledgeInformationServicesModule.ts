import { UniversalModuleContract } from '../../core/contracts/ModuleContract';

export const LibraryKnowledgeInformationServicesModule: UniversalModuleContract = {
  moduleId: 'mod_library_knowledge_information_services',
  name: 'Institutional Library, Knowledge, Learning Resources & Information Services Operations',
  displayName: 'Library & Information Services',
  description: 'Authoritative operations module governing institutional library catalogs, physical holdings, barcodes, accessions, patron eligibility, circulation (loans, returns, renewals), reservations, waitlists, overdue & fine references (Phase 11.2), digital resources, electronic subscriptions (Phase 11.3), research resource services (Phase 11.9), reference desk operations, reading room reservations (Phase 11.5), inter-campus transfers, acquisitions, collection reviews, preservation, loss/damage, disposal governance with Four-Eyes SoD, diagnostics, what-if simulations, and cryptographic SHA-256 audit chaining.',
  category: 'Core',
  status: 'REGISTERED',
  provider: 'CORE',
  version: '11.10.0',
  dependencies: [
    { moduleId: 'mod_institutional_administration', minVersion: '10.1.0' },
    { moduleId: 'mod_academic_management', minVersion: '10.2.0' },
    { moduleId: 'mod_student_lifecycle', minVersion: '10.4.0' },
    { moduleId: 'mod_human_resources_workforce', minVersion: '11.1.0' },
    { moduleId: 'mod_institutional_finance_operations', minVersion: '11.2.0' },
    { moduleId: 'mod_institutional_procurement_operations', minVersion: '11.3.0' },
    { moduleId: 'mod_facilities_space_safety', minVersion: '11.5.0' },
    { moduleId: 'mod_inventory_assets_stores_materials', minVersion: '11.7.0' },
    { moduleId: 'mod_research_grants_projects_innovation', minVersion: '11.9.0' }
  ],
  configurationSchema: [],
  navigationItems: [
    {
      id: 'nav_library_knowledge_information_services',
      moduleId: 'mod_library_knowledge_information_services',
      label: 'Library & Info Services',
      icon: 'BookOpenCheck',
      route: 'library_knowledge_information_services',
      sortOrder: 19,
      status: 'active',
      requiredPermission: 'library.view',
      allowedRoles: [
        'super_admin',
        'platform_admin',
        'chief_librarian',
        'deputy_librarian',
        'librarian_staff',
        'cataloger',
        'circulation_officer',
        'reference_librarian',
        'faculty_member',
        'research_scholar',
        'student',
        'auditor'
      ],
      targetContext: 'tenant'
    }
  ],
  permissions: [
    {
      code: 'library.view',
      name: 'View Library Discovery & Holdings',
      description: 'Access the library public discovery catalog, holding locations, and general operating schedules'
    },
    {
      code: 'library.manage',
      name: 'Manage Library Configuration',
      description: 'Configure institutional libraries, branches, stacks, and collection parameters'
    },
    {
      code: 'library.resource.view',
      name: 'View Detailed Catalog Metadata',
      description: 'Inspect full bibliographic catalog records, classifications, MARC/Dublin Core tags, and DOI citations'
    },
    {
      code: 'library.resource.manage',
      name: 'Manage Bibliographic Records',
      description: 'Create and update authoritative catalog records, classifications, subject headings, and editions'
    },
    {
      code: 'library.catalog.manage',
      name: 'Manage Master Catalog Scheme',
      description: 'Maintain taxonomy, DDC/LCC classification schemes, and institutional thesauri'
    },
    {
      code: 'library.holding.view',
      name: 'View Holdings & Location Data',
      description: 'Inspect physical copy quantities, shelf tags, and branch allocations'
    },
    {
      code: 'library.holding.manage',
      name: 'Manage Holdings & Physical Copies',
      description: 'Accession new physical copies, assign barcodes, and adjust shelf locations'
    },
    {
      code: 'library.patron.view',
      name: 'View Patron Profiles',
      description: 'Inspect patron memberships, category eligibility, and borrowing balances'
    },
    {
      code: 'library.patron.manage',
      name: 'Manage Patron Borrowing Policies',
      description: 'Configure borrowing limits, renewal thresholds, and category privileges'
    },
    {
      code: 'library.circulation.manage',
      name: 'Manage Circulation Operations',
      description: 'Oversee circulation desk queues, loan overrides, and bulk checkouts'
    },
    {
      code: 'library.loan.issue',
      name: 'Issue Circulation Loans',
      description: 'Authorize and issue physical item checkouts to validated patrons'
    },
    {
      code: 'library.loan.return',
      name: 'Process Item Returns',
      description: 'Process check-ins, inspect item condition, and assess late return durations'
    },
    {
      code: 'library.loan.renew',
      name: 'Renew Active Loans',
      description: 'Extend loan due dates in accordance with policy thresholds and reservation holds'
    },
    {
      code: 'library.reservation.manage',
      name: 'Manage Resource Reservations',
      description: 'Maintain patron hold requests, queue ordering, and notification triggers'
    },
    {
      code: 'library.waitlist.manage',
      name: 'Manage Resource Waitlists',
      description: 'Oversee prioritized waitlists and automated allocation upon copy return'
    },
    {
      code: 'library.digitalresource.manage',
      name: 'Manage Digital Resources & Vault',
      description: 'Administer institutional repositories, open access datasets, and electronic journals'
    },
    {
      code: 'library.subscription.view',
      name: 'View Electronic Resource Subscriptions',
      description: 'Inspect database vendor agreements, license terms, and renewal cycles'
    },
    {
      code: 'library.subscription.manage',
      name: 'Manage Electronic Subscriptions',
      description: 'Maintain electronic subscriptions, proxy authentication, and vendor licenses'
    },
    {
      code: 'library.reference.manage',
      name: 'Manage Reference & Information Services',
      description: 'Log reference desk consultations, assign research inquiries, and track SLA targets'
    },
    {
      code: 'library.researchresource.manage',
      name: 'Manage Sponsored Research Resource Services',
      description: 'Facilitate specialized dataset discovery and restricted manuscript access for Phase 11.9 Grants'
    },
    {
      code: 'library.acquisition.create',
      name: 'Create Acquisition Requests',
      description: 'Submit departmental and faculty acquisition requests for new titles and subscriptions'
    },
    {
      code: 'library.acquisition.approve',
      name: 'Approve Acquisition Requests',
      description: 'Execute Four-Eyes institutional approval for library acquisitions prior to Phase 11.3 Procurement'
    },
    {
      code: 'library.transfer.create',
      name: 'Initiate Inter-Campus Transfers',
      description: 'Dispatch physical copies across campuses for hold fulfillment or collection rebalancing'
    },
    {
      code: 'library.transfer.approve',
      name: 'Approve Inter-Campus Transfers',
      description: 'Verify chain-of-custody and authorize inter-campus item movements'
    },
    {
      code: 'library.collection.review',
      name: 'Conduct Collection Reviews',
      description: 'Audit shelf inventory, missing copies, and usage turnover rates'
    },
    {
      code: 'library.collection.maintain',
      name: 'Execute Collection Maintenance',
      description: 'Perform rebinding, deacidification, relabeling, and minor conservation mending'
    },
    {
      code: 'library.damage.manage',
      name: 'Process Damage Reports',
      description: 'Document physical item defects, bindery routing, and repair assessments'
    },
    {
      code: 'library.loss.manage',
      name: 'Process Loss Reports',
      description: 'Investigate missing items, patron loss declarations, and replacement assessments'
    },
    {
      code: 'library.disposal.request',
      name: 'Request Resource Disposal',
      description: 'Initiate weeding proposals for obsolete, damaged, or superseded physical copies'
    },
    {
      code: 'library.disposal.approve',
      name: 'Approve Resource Disposal',
      description: 'Execute Four-Eyes institutional approval for scrap, donation, or write-off of assets'
    },
    {
      code: 'library.fine.view',
      name: 'View Library Fines & Balances',
      description: 'Inspect calculated overdue charges and damage restoration fees'
    },
    {
      code: 'library.fine.manage',
      name: 'Manage Library Fines & Recovery',
      description: 'Process patron fee payments and generate Phase 11.2 Finance transaction references'
    },
    {
      code: 'library.fine.waiver.approve',
      name: 'Approve Fine Waivers',
      description: 'Execute Four-Eyes authorized fee waivers and policy exceptions'
    },
    {
      code: 'library.diagnostic.view',
      name: 'View Library Diagnostics Scanner',
      description: 'Run automated integrity scans for barcode collisions, double-loans, and SoD breaches'
    },
    {
      code: 'library.audit.view',
      name: 'View Tamper-Evident Audit Trail',
      description: 'Inspect chronological SHA-256 chained provenance events and state hashes'
    }
  ]
};
