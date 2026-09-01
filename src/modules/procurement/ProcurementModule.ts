import { UniversalModuleContract } from '../../core/contracts/ModuleContract';

export const ProcurementModule: UniversalModuleContract = {
  moduleId: 'mod_procurement',
  name: 'Procurement & Purchasing',
  displayName: 'Procurement, Vendor & Purchase Management Engine',
  description: 'Enterprise procurement engine supporting vendor master, RFQs, quotations, comparative statements, POs, GRNs, quality inspection, contracts, and finance integration (Phase 7.18)',
  version: '1.0.0',
  status: 'AVAILABLE',
  category: 'Operations',
  provider: 'EMS',
  dependencies: [
    { moduleId: 'mod_core', optional: false },
    { moduleId: 'mod_finance', optional: true }
  ],
  configurationSchema: [],
  permissions: [
    { code: 'procurement.view', name: 'View Procurement', description: 'View procurement dashboards, purchase requests, and orders' },
    { code: 'procurement.create', name: 'Create Procurement Request', description: 'Draft and submit procurement requests and requisitions' },
    { code: 'procurement.update', name: 'Update Procurement', description: 'Modify procurement records and line items' },
    { code: 'procurement.submit', name: 'Submit Procurement', description: 'Submit procurement requests for review and approval' },
    { code: 'procurement.approve', name: 'Approve Procurement', description: 'Approve procurement requests and requisitions' },
    { code: 'procurement.manage_vendors', name: 'Manage Vendors', description: 'Onboard and manage vendor profiles and catalog' },
    { code: 'procurement.verify_vendors', name: 'Verify Vendors', description: 'Verify vendor registration, tax compliance, and legal status' },
    { code: 'procurement.manage_rfqs', name: 'Manage RFQs', description: 'Create and issue Requests For Quotation' },
    { code: 'procurement.manage_quotations', name: 'Manage Quotations', description: 'Log and lock vendor quotation responses' },
    { code: 'procurement.compare_quotations', name: 'Compare Quotations', description: 'Generate comparative statements and select vendor bids' },
    { code: 'procurement.create_po', name: 'Create Purchase Orders', description: 'Convert selected quotations into issued Purchase Orders' },
    { code: 'procurement.approve_po', name: 'Approve Purchase Orders', description: 'Authorize purchase orders and financial commitment' },
    { code: 'procurement.receive', name: 'Receive Goods & Services', description: 'Record Goods Receipts (GRN) and Service Receipts (SRN)' },
    { code: 'procurement.inspect', name: 'Quality Inspection', description: 'Conduct quality inspections and record condition findings' },
    { code: 'procurement.manage_returns', name: 'Manage Returns', description: 'Process vendor returns, replacements, and rejections' },
    { code: 'procurement.manage_contracts', name: 'Manage Contracts', description: 'Maintain vendor contracts, terms, and renewals' },
    { code: 'procurement.manage_exceptions', name: 'Manage Exceptions', description: 'Log procurement exceptions, waivers, and overrides' },
    { code: 'procurement.export', name: 'Export Procurement Data', description: 'Export procurement registers and spend summaries' },
    { code: 'procurement.view_audit', name: 'View Procurement Audit', description: 'Audit trail inspection for procurement transactions' }
  ],
  navigationItems: [
    {
      id: 'procurement_workspace',
      moduleId: 'mod_procurement',
      label: 'Procurement & Purchasing',
      icon: 'ShoppingBag',
      route: '/procurement/workspace',
      requiredPermission: 'procurement.view',
      sortOrder: 52,
      status: 'active'
    }
  ],
  onEnable: async (tenantId: string) => {
    console.log(`[ModuleEngine] ProcurementModule enabled for tenant ${tenantId}`);
  },
  onDisable: async (tenantId: string) => {
    console.log(`[ModuleEngine] ProcurementModule disabled for tenant ${tenantId}`);
  }
};
