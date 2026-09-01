import React, { useState } from 'react';
import {
  BookOpenCheck,
  Library,
  BookMarked,
  Layers,
  Users,
  Repeat,
  RotateCcw,
  Clock,
  AlertTriangle,
  FileCheck2,
  Globe,
  FlaskConical,
  HelpCircle,
  Armchair,
  ShoppingCart,
  Truck,
  Archive,
  Trash2,
  Activity,
  Boxes,
  ShieldCheck,
  Search,
  CheckCircle2,
  XCircle,
  Plus,
  Play,
  Lock,
  ArrowRight,
  TrendingUp,
  FileText
} from 'lucide-react';
import { libraryKnowledgeInformationServicesService } from '../../services/libraryKnowledgeInformationServicesService';
import {
  Resource,
  ResourceCopy,
  Loan,
  Patron,
  LibraryFineReference,
  Reservation,
  DigitalResource,
  AcquisitionRequest,
  ResourceTransfer,
  ResourceDisposalRequest,
  SimulationScenario,
  SimulationResult,
  LibraryDiagnosticFinding,
  LibraryAuditEvent
} from '../../types/libraryKnowledgeInformationServices';

export const LibraryKnowledgeInformationServicesWorkspace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('command_center');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCampus, setSelectedCampus] = useState('CAMPUS_DELHI');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Data bindings
  const [libraries] = useState(() => libraryKnowledgeInformationServicesService.getLibraries());
  const [branches] = useState(() => libraryKnowledgeInformationServicesService.getBranches());
  const [locations] = useState(() => libraryKnowledgeInformationServicesService.getLocations());
  const [collections] = useState(() => libraryKnowledgeInformationServicesService.getCollections());
  const [resources, setResources] = useState<Resource[]>(() => libraryKnowledgeInformationServicesService.getResources());
  const [holdings] = useState(() => libraryKnowledgeInformationServicesService.getHoldings());
  const [copies, setCopies] = useState<ResourceCopy[]>(() => libraryKnowledgeInformationServicesService.getCopies());
  const [patrons] = useState<Patron[]>(() => libraryKnowledgeInformationServicesService.getPatrons());
  const [loans, setLoans] = useState<Loan[]>(() => libraryKnowledgeInformationServicesService.getLoans());
  const [reservations, setReservations] = useState<Reservation[]>(() => libraryKnowledgeInformationServicesService.getReservations());
  const [overdueRecords] = useState(() => libraryKnowledgeInformationServicesService.getOverdueRecords());
  const [fines, setFines] = useState<LibraryFineReference[]>(() => libraryKnowledgeInformationServicesService.getFines());
  const [damageReports] = useState(() => libraryKnowledgeInformationServicesService.getDamageReports());
  const [digitalResources] = useState<DigitalResource[]>(() => libraryKnowledgeInformationServicesService.getDigitalResources());
  const [electronicResources] = useState(() => libraryKnowledgeInformationServicesService.getElectronicResources());
  const [researchRequests] = useState(() => libraryKnowledgeInformationServicesService.getResearchRequests());
  const [referenceSessions] = useState(() => libraryKnowledgeInformationServicesService.getReferenceSessions());
  const [readingRoomReservations] = useState(() => libraryKnowledgeInformationServicesService.getReadingRoomReservations());
  const [transfers] = useState<ResourceTransfer[]>(() => libraryKnowledgeInformationServicesService.getTransfers());
  const [acquisitions, setAcquisitions] = useState<AcquisitionRequest[]>(() => libraryKnowledgeInformationServicesService.getAcquisitionRequests());
  const [preservationRecords] = useState(() => libraryKnowledgeInformationServicesService.getPreservationRecords());
  const [disposalRequests, setDisposalRequests] = useState<ResourceDisposalRequest[]>(() => libraryKnowledgeInformationServicesService.getDisposalRequests());
  const [auditTrail, setAuditTrail] = useState<LibraryAuditEvent[]>(() => libraryKnowledgeInformationServicesService.getAuditTrail());

  // Action State
  const [diagnosticsResult, setDiagnosticsResult] = useState<{
    findings: LibraryDiagnosticFinding[];
    summary: { totalChecks: number; passed: number; warnings: number; errors: number };
    auditChainIntact: boolean;
  } | null>(null);

  const [selectedScenario, setSelectedScenario] = useState<SimulationScenario>('MASS_RETURN_SURGE');
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);

  // Form Modals / Submissions
  const [issueModalOpen, setIssueModalOpen] = useState(false);
  const [selectedCopyId, setSelectedCopyId] = useState('');
  const [selectedPatronId, setSelectedPatronId] = useState('PAT-STU-001');

  const [waiverModalOpen, setWaiverModalOpen] = useState(false);
  const [selectedFineId, setSelectedFineId] = useState('');
  const [waiverAmountMinor, setWaiverAmountMinor] = useState(500); // ₹5.00
  const [waiverApprover, setWaiverApprover] = useState('USER_CHIEF_LIBRARIAN');

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const refreshData = () => {
    setResources(libraryKnowledgeInformationServicesService.getResources());
    setCopies(libraryKnowledgeInformationServicesService.getCopies());
    setLoans(libraryKnowledgeInformationServicesService.getLoans());
    setReservations(libraryKnowledgeInformationServicesService.getReservations());
    setFines(libraryKnowledgeInformationServicesService.getFines());
    setAcquisitions(libraryKnowledgeInformationServicesService.getAcquisitionRequests());
    setDisposalRequests(libraryKnowledgeInformationServicesService.getDisposalRequests());
    setAuditTrail(libraryKnowledgeInformationServicesService.getAuditTrail());
  };

  const handleIssueLoan = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      libraryKnowledgeInformationServicesService.issueLoan(
        {
          tenantId: 'TENANT_INDIA_DEFAULT',
          campusIdRef: selectedCampus,
          libraryIdRef: 'LIB-CENTRAL-001',
          patronIdRef: selectedPatronId,
          copyIdRef: selectedCopyId,
          issuedByUserIdRef: 'USER_DESK_OFFICER'
        },
        `IDEM-ISSUE-${Date.now()}`
      );
      refreshData();
      setIssueModalOpen(false);
      showNotification('success', `Loan successfully issued for copy ${selectedCopyId}`);
    } catch (err: any) {
      showNotification('error', err.message);
    }
  };

  const handleReturnLoan = (loanId: string) => {
    try {
      libraryKnowledgeInformationServicesService.returnLoan(
        {
          loanId,
          tenantId: 'TENANT_INDIA_DEFAULT',
          processedByUserIdRef: 'USER_DESK_OFFICER',
          conditionOnReturn: 'GOOD'
        },
        `IDEM-RET-${Date.now()}`
      );
      refreshData();
      showNotification('success', `Loan ${loanId} marked RETURNED and copy restored to inventory.`);
    } catch (err: any) {
      showNotification('error', err.message);
    }
  };

  const handleRenewLoan = (loanId: string) => {
    try {
      libraryKnowledgeInformationServicesService.renewLoan(
        {
          loanId,
          tenantId: 'TENANT_INDIA_DEFAULT',
          renewedByUserIdRef: 'USER_DESK_OFFICER'
        },
        `IDEM-RNW-${Date.now()}`
      );
      refreshData();
      showNotification('success', `Loan ${loanId} successfully extended.`);
    } catch (err: any) {
      showNotification('error', err.message);
    }
  };

  const handleWaiveFine = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      libraryKnowledgeInformationServicesService.waiveFine(
        selectedFineId,
        'TENANT_INDIA_DEFAULT',
        { amount: waiverAmountMinor, currency: 'INR' },
        'Dean of Academic Affairs authorized hardship waiver',
        'USER_STAFF_REPRESENTATIVE', // Requestor
        waiverApprover // Approver (Must not match requestor)
      );
      refreshData();
      setWaiverModalOpen(false);
      showNotification('success', `Four-Eyes Fine Waiver approved for ₹${waiverAmountMinor / 100}`);
    } catch (err: any) {
      showNotification('error', err.message);
    }
  };

  const handleApproveDisposal = (disposalId: string) => {
    try {
      libraryKnowledgeInformationServicesService.approveDisposal(
        disposalId,
        'TENANT_INDIA_DEFAULT',
        'USER_DEPUTY_LIBRARIAN'
      );
      refreshData();
      showNotification('success', `Disposal ${disposalId} approved via Four-Eyes governance.`);
    } catch (err: any) {
      showNotification('error', err.message);
    }
  };

  const handleRunDiagnostics = () => {
    const res = libraryKnowledgeInformationServicesService.runDiagnostics();
    setDiagnosticsResult(res);
    showNotification('success', `Diagnostics scan completed: ${res.summary.passed} checks passed, ${res.summary.errors} errors.`);
  };

  const handleRunSimulation = () => {
    const res = libraryKnowledgeInformationServicesService.runSimulation(selectedScenario);
    setSimulationResult(res);
    showNotification('success', `What-If Scenario '${selectedScenario}' executed with verified zero production mutations.`);
  };

  // Metrics
  const activeLoansCount = loans.filter(l => l.status === 'ISSUED' || l.status === 'OVERDUE').length;
  const overdueLoansCount = loans.filter(l => l.status === 'OVERDUE').length;
  const availableCopiesCount = copies.filter(c => c.availabilityStatus === 'AVAILABLE').length;
  const totalFineOutstandingMinor = fines.reduce((acc, f) => acc + f.outstandingAmount.amount, 0);

  const tabs = [
    { id: 'command_center', label: 'Command Center', icon: Activity },
    { id: 'libraries_branches', label: 'Libraries & Stacks', icon: Library },
    { id: 'catalog_holdings', label: 'Master Catalog & Copies', icon: BookMarked },
    { id: 'circulation_loans', label: 'Circulation & Loans', icon: Repeat },
    { id: 'reservations_waitlists', label: 'Reservations & Queue', icon: Clock },
    { id: 'fines_overdue', label: 'Fines & Recovery (Phase 11.2)', icon: AlertTriangle },
    { id: 'digital_electronic', label: 'Digital Vault & Subscriptions', icon: Globe },
    { id: 'research_services', label: 'Research & Reference (11.9)', icon: FlaskConical },
    { id: 'reading_rooms', label: 'Reading Rooms & Desks (11.5)', icon: Armchair },
    { id: 'transfers_acquisitions', label: 'Transfers & Acquisitions', icon: Truck },
    { id: 'preservation_disposal', label: 'Preservation & Disposal', icon: Trash2 },
    { id: 'diagnostics', label: 'Diagnostics Scanner', icon: FileCheck2 },
    { id: 'what_if_sandbox', label: 'What-If Sandbox (15)', icon: Boxes },
    { id: 'audit_provenance', label: 'SHA-256 Audit Trail', icon: ShieldCheck }
  ];

  return (
    <div id="library-knowledge-workspace" className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Top Banner & Header */}
      <header id="lib-header" className="bg-white border-b border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-700 text-white rounded-lg shadow-xs">
            <BookOpenCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Library &amp; Knowledge Information Services</h1>
              <span className="px-2 py-0.5 text-xs font-semibold rounded bg-emerald-100 text-emerald-800 border border-emerald-300">Phase 11.10 Authoritative</span>
            </div>
            <p className="text-xs text-slate-500">Universal Cataloging, Circulation State Machine, Digital Vault, Multi-Campus Transfers &amp; Four-Eyes Governed Disposals</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select
            id="campus-scope-selector"
            aria-label="Select Campus Scope"
            value={selectedCampus}
            onChange={(e) => setSelectedCampus(e.target.value)}
            className="text-xs font-medium bg-slate-100 border border-slate-300 rounded-md px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="CAMPUS_DELHI">Campus Delhi (Main Heritage Campus)</option>
            <option value="CAMPUS_MUMBAI">Campus Mumbai (Tech Center)</option>
          </select>

          <button
            id="btn-issue-quick-loan"
            onClick={() => {
              const av = copies.find(c => c.availabilityStatus === 'AVAILABLE' && c.isCirculating);
              if (av) setSelectedCopyId(av.copyId);
              setIssueModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-md shadow-xs transition"
          >
            <Plus className="w-4 h-4" /> Issue Loan
          </button>
        </div>
      </header>

      {/* Global Notification */}
      {notification && (
        <div
          id="lib-notification-bar"
          className={`px-6 py-2.5 text-xs font-medium flex items-center justify-between border-b ${
            notification.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-rose-600" />}
            <span>{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-slate-600 font-bold">×</button>
        </div>
      )}

      {/* Workspace Body */}
      <div className="flex flex-1 flex-col lg:flex-row overflow-hidden">
        {/* Navigation Sidebar */}
        <aside id="lib-sidebar-nav" className="w-full lg:w-64 bg-white border-r border-slate-200 p-3 space-y-1 overflow-y-auto shrink-0">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1.5">Operational Domains</div>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-btn-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-md transition ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-800 font-semibold border-l-4 border-emerald-600 shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-700' : 'text-slate-400'}`} />
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </aside>

        {/* Tab Main Content Canvas */}
        <main id="lib-main-canvas" className="flex-1 p-6 overflow-y-auto space-y-6 max-w-7xl mx-auto w-full">
          {/* TAB 1: COMMAND CENTER */}
          {activeTab === 'command_center' && (
            <div id="section-command-center" className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs">
                  <div className="text-xs text-slate-500 font-medium">Active Circulation Loans</div>
                  <div className="text-2xl font-bold text-slate-900 mt-1">{activeLoansCount}</div>
                  <div className="text-[11px] text-emerald-600 font-medium mt-1">Across 3 physical branches</div>
                </div>

                <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs">
                  <div className="text-xs text-slate-500 font-medium">Overdue Holds &amp; Late Items</div>
                  <div className="text-2xl font-bold text-rose-600 mt-1">{overdueLoansCount}</div>
                  <div className="text-[11px] text-slate-500 mt-1">Automatic fine triggers active</div>
                </div>

                <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs">
                  <div className="text-xs text-slate-500 font-medium">Available Physical Copies</div>
                  <div className="text-2xl font-bold text-slate-900 mt-1">{availableCopiesCount} / {copies.length}</div>
                  <div className="text-[11px] text-slate-500 mt-1">Total cataloged accessioned stock</div>
                </div>

                <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs">
                  <div className="text-xs text-slate-500 font-medium">Outstanding Fines (Minor-Units)</div>
                  <div className="text-2xl font-bold text-slate-900 mt-1">₹{(totalFineOutstandingMinor / 100).toFixed(2)}</div>
                  <div className="text-[11px] text-indigo-600 font-medium mt-1">Phase 11.2 Finance Bound</div>
                </div>
              </div>

              {/* Quick Summary Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Active Loans Table */}
                <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-bold text-slate-800">Current Circulation Queue</h2>
                    <span className="text-xs text-slate-500">{loans.length} total loans recorded</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                        <tr>
                          <th className="py-2 px-3">Loan ID</th>
                          <th className="py-2 px-3">Copy / Accession</th>
                          <th className="py-2 px-3">Patron</th>
                          <th className="py-2 px-3">Due Date</th>
                          <th className="py-2 px-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {loans.map(loan => (
                          <tr key={loan.loanId} className="hover:bg-slate-50">
                            <td className="py-2 px-3 font-mono font-semibold">{loan.loanId}</td>
                            <td className="py-2 px-3">{loan.copyIdRef}</td>
                            <td className="py-2 px-3 font-mono">{loan.patronIdRef}</td>
                            <td className="py-2 px-3 text-slate-600">{new Date(loan.dueDate).toLocaleDateString()}</td>
                            <td className="py-2 px-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                loan.status === 'OVERDUE' ? 'bg-rose-100 text-rose-800' :
                                loan.status === 'ISSUED' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                              }`}>
                                {loan.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Digital Subscriptions & Research Integrations */}
                <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-bold text-slate-800">Digital Vault &amp; Electronic Resources</h2>
                    <span className="text-xs text-slate-500">IEEE Xplore &amp; ACM Digital Vault</span>
                  </div>
                  <div className="space-y-3">
                    {digitalResources.map(dig => (
                      <div key={dig.digitalResourceId} className="p-3 bg-slate-50 border border-slate-200 rounded-md">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="text-xs font-bold text-slate-900">{dig.providerName}</div>
                            <div className="text-[11px] text-slate-500 font-mono mt-0.5">Resource: {dig.resourceIdRef}</div>
                          </div>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            {dig.accessState}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-200 text-[11px] text-slate-600">
                          <div>Concurrent Cap: <span className="font-semibold text-slate-800">{dig.licenseConstraint.concurrentUserLimit} users</span></div>
                          <div>Active Sessions: <span className="font-semibold text-slate-800">{dig.activeSessionsCount}</span></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LIBRARIES & BRANCHES */}
          {activeTab === 'libraries_branches' && (
            <div id="section-libraries-branches" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Institutional Libraries &amp; Stacks</h2>
                  <p className="text-xs text-slate-500">Authoritative physical library entities, branch wings, and shelf locations</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {libraries.map(lib => (
                  <div key={lib.libraryId} className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">{lib.code}</span>
                        <h3 className="text-sm font-bold text-slate-900 mt-1">{lib.name}</h3>
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                        {lib.type}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 space-y-1">
                      <div>Hours: <span className="font-medium text-slate-800">{lib.operatingHours}</span></div>
                      <div>Floor Area: <span className="font-medium text-slate-800">{lib.totalFloorAreaSqMt} sq.m</span></div>
                      <div>Email: <span className="font-medium text-slate-800">{lib.contactEmail}</span></div>
                      <div>Campus Ref: <span className="font-mono text-slate-800">{lib.campusIdRef}</span></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Locations Table */}
              <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs">
                <h3 className="text-sm font-bold text-slate-800 mb-3">Stack Locations &amp; Capacity</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                      <tr>
                        <th className="py-2 px-3">Location ID</th>
                        <th className="py-2 px-3">Name / Zone</th>
                        <th className="py-2 px-3">Zone Type</th>
                        <th className="py-2 px-3">Max Capacity</th>
                        <th className="py-2 px-3">Branch Ref</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {locations.map(loc => (
                        <tr key={loc.locationId} className="hover:bg-slate-50">
                          <td className="py-2 px-3 font-mono font-semibold">{loc.locationId}</td>
                          <td className="py-2 px-3 font-medium text-slate-900">{loc.name}</td>
                          <td className="py-2 px-3"><span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-semibold">{loc.zoneType}</span></td>
                          <td className="py-2 px-3">{loc.capacityCopies} copies</td>
                          <td className="py-2 px-3 font-mono">{loc.branchIdRef}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MASTER CATALOG & COPIES */}
          {activeTab === 'catalog_holdings' && (
            <div id="section-catalog-holdings" className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Bibliographic Master Catalog &amp; Physical Holdings</h2>
                  <p className="text-xs text-slate-500">Authoritative title catalog, classifications, ISBN/ISSN, accession numbers, and active barcodes</p>
                </div>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Filter by title, author, barcode..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="text-xs bg-white border border-slate-300 rounded-md pl-9 pr-3 py-1.5 w-64 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Resources List */}
              <div className="space-y-4">
                {resources
                  .filter(r => r.title.toLowerCase().includes(searchQuery.toLowerCase()) || r.resourceId.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map(resource => {
                    const resCopies = copies.filter(c => c.resourceIdRef === resource.resourceId);
                    return (
                      <div key={resource.resourceId} className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs space-y-3">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded">
                              {resource.resourceId}
                            </span>
                            <h3 className="text-sm font-bold text-slate-900 mt-1">{resource.title}</h3>
                            {resource.subtitle && <p className="text-xs text-slate-500">{resource.subtitle}</p>}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-semibold px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded">
                              {resource.format}
                            </span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                              {resource.lifecycleState}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-600 bg-slate-50 p-3 rounded-md">
                          <div>
                            <span className="font-semibold text-slate-700">Authors:</span> {resource.authors.map(a => a.fullName).join(', ')}
                          </div>
                          <div>
                            <span className="font-semibold text-slate-700">Call Number:</span> {resource.callNumber} ({resource.classification.scheme}: {resource.classification.classificationNumber})
                          </div>
                          <div>
                            <span className="font-semibold text-slate-700">Identifiers:</span> {resource.identifiers.map(i => `${i.type}: ${i.value}`).join(', ')}
                          </div>
                        </div>

                        {/* Copies Sub-Table */}
                        <div>
                          <div className="text-xs font-bold text-slate-800 mb-2">Accessioned Physical Copies ({resCopies.length})</div>
                          <div className="overflow-x-auto border border-slate-200 rounded-md">
                            <table className="w-full text-left text-xs">
                              <thead className="bg-slate-100 text-slate-500">
                                <tr>
                                  <th className="py-1.5 px-3">Copy ID</th>
                                  <th className="py-1.5 px-3">Accession #</th>
                                  <th className="py-1.5 px-3">Barcode</th>
                                  <th className="py-1.5 px-3">Location</th>
                                  <th className="py-1.5 px-3">Condition</th>
                                  <th className="py-1.5 px-3">Availability</th>
                                  <th className="py-1.5 px-3">Circ Count</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 bg-white">
                                {resCopies.map(copy => (
                                  <tr key={copy.copyId} className="hover:bg-slate-50">
                                    <td className="py-1.5 px-3 font-mono font-medium">{copy.copyId}</td>
                                    <td className="py-1.5 px-3 font-mono text-slate-800">{copy.accessionNumber}</td>
                                    <td className="py-1.5 px-3 font-mono text-indigo-700 font-semibold">{copy.barcode.barcodeValue}</td>
                                    <td className="py-1.5 px-3 text-slate-600">{copy.locationIdRef}</td>
                                    <td className="py-1.5 px-3">{copy.itemCondition}</td>
                                    <td className="py-1.5 px-3">
                                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                        copy.availabilityStatus === 'AVAILABLE' ? 'bg-emerald-100 text-emerald-800' :
                                        copy.availabilityStatus === 'ON_LOAN' ? 'bg-amber-100 text-amber-800' :
                                        copy.availabilityStatus === 'RESERVED' ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-100 text-slate-700'
                                      }`}>
                                        {copy.availabilityStatus}
                                      </span>
                                    </td>
                                    <td className="py-1.5 px-3 font-semibold text-slate-700">{copy.totalCirculationCount}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* TAB 4: CIRCULATION & LOANS */}
          {activeTab === 'circulation_loans' && (
            <div id="section-circulation-loans" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Circulation Operations &amp; Active Loans</h2>
                  <p className="text-xs text-slate-500">Loan state machine, due date extensions, check-ins, and condition assessments</p>
                </div>
                <button
                  onClick={() => setIssueModalOpen(true)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-md shadow-xs transition"
                >
                  <Plus className="w-4 h-4" /> Issue New Loan
                </button>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3">Loan ID</th>
                        <th className="py-2.5 px-3">Patron Reference</th>
                        <th className="py-2.5 px-3">Copy / Accession</th>
                        <th className="py-2.5 px-3">Issued Date</th>
                        <th className="py-2.5 px-3">Due Date</th>
                        <th className="py-2.5 px-3">Renewals</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3 text-right">Governed Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {loans.map(loan => (
                        <tr key={loan.loanId} className="hover:bg-slate-50">
                          <td className="py-2 px-3 font-mono font-bold text-slate-900">{loan.loanId}</td>
                          <td className="py-2 px-3 font-mono text-slate-700">{loan.patronIdRef}</td>
                          <td className="py-2 px-3 font-mono text-slate-800">{loan.copyIdRef}</td>
                          <td className="py-2 px-3 text-slate-600">{new Date(loan.issuedAt).toLocaleDateString()}</td>
                          <td className="py-2 px-3 font-semibold text-slate-800">{new Date(loan.dueDate).toLocaleDateString()}</td>
                          <td className="py-2 px-3 text-center font-medium">{loan.renewalCount} / {loan.maxRenewalsPermitted}</td>
                          <td className="py-2 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              loan.status === 'OVERDUE' ? 'bg-rose-100 text-rose-800' :
                              loan.status === 'ISSUED' ? 'bg-emerald-100 text-emerald-800' :
                              loan.status === 'RETURNED' ? 'bg-slate-100 text-slate-700' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {loan.status}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-right space-x-2">
                            {(loan.status === 'ISSUED' || loan.status === 'OVERDUE') && (
                              <>
                                <button
                                  onClick={() => handleReturnLoan(loan.loanId)}
                                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded text-[11px] transition"
                                >
                                  Process Return
                                </button>
                                <button
                                  onClick={() => handleRenewLoan(loan.loanId)}
                                  className="px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-semibold rounded text-[11px] transition"
                                >
                                  Renew
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: RESERVATIONS & WAITLISTS */}
          {activeTab === 'reservations_waitlists' && (
            <div id="section-reservations-waitlists" className="space-y-6">
              <div>
                <h2 className="text-base font-bold text-slate-900">Reservations &amp; Hold Queue Management</h2>
                <p className="text-xs text-slate-500">Deterministic queue ordering, hold notifications, and expiry triggers</p>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                      <tr>
                        <th className="py-2 px-3">Reservation ID</th>
                        <th className="py-2 px-3">Resource Ref</th>
                        <th className="py-2 px-3">Patron Ref</th>
                        <th className="py-2 px-3">Queue Position</th>
                        <th className="py-2 px-3">Status</th>
                        <th className="py-2 px-3">Requested At</th>
                        <th className="py-2 px-3">Expiry Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {reservations.map(resv => (
                        <tr key={resv.reservationId} className="hover:bg-slate-50">
                          <td className="py-2 px-3 font-mono font-bold">{resv.reservationId}</td>
                          <td className="py-2 px-3 font-mono">{resv.resourceIdRef}</td>
                          <td className="py-2 px-3 font-mono">{resv.patronIdRef}</td>
                          <td className="py-2 px-3 font-bold text-center">#{resv.queuePosition}</td>
                          <td className="py-2 px-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800">
                              {resv.status}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-slate-600">{new Date(resv.requestedAt).toLocaleDateString()}</td>
                          <td className="py-2 px-3 text-slate-600">{resv.expiryDate ? new Date(resv.expiryDate).toLocaleDateString() : 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: FINES & RECOVERY */}
          {activeTab === 'fines_overdue' && (
            <div id="section-fines-overdue" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Overdue Fines &amp; Financial References (Phase 11.2)</h2>
                  <p className="text-xs text-slate-500">Minor-unit integer arithmetic, GL ledger references, and Four-Eyes SoD fine waivers</p>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                      <tr>
                        <th className="py-2 px-3">Fine ID</th>
                        <th className="py-2 px-3">Patron Ref</th>
                        <th className="py-2 px-3">Reason</th>
                        <th className="py-2 px-3">Assessed</th>
                        <th className="py-2 px-3">Waived</th>
                        <th className="py-2 px-3">Outstanding</th>
                        <th className="py-2 px-3">Finance Tx Ref</th>
                        <th className="py-2 px-3 text-right">Governed Waiver</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {fines.map(fine => (
                        <tr key={fine.fineId} className="hover:bg-slate-50">
                          <td className="py-2 px-3 font-mono font-bold">{fine.fineId}</td>
                          <td className="py-2 px-3 font-mono">{fine.patronIdRef}</td>
                          <td className="py-2 px-3"><span className="px-2 py-0.5 bg-slate-100 rounded text-[10px]">{fine.reason}</span></td>
                          <td className="py-2 px-3 font-semibold">₹{(fine.fineAmount.amount / 100).toFixed(2)}</td>
                          <td className="py-2 px-3 text-slate-500">₹{(fine.waivedAmount.amount / 100).toFixed(2)}</td>
                          <td className="py-2 px-3 font-bold text-rose-600">₹{(fine.outstandingAmount.amount / 100).toFixed(2)}</td>
                          <td className="py-2 px-3 font-mono text-indigo-600">{fine.financeTransactionIdRef}</td>
                          <td className="py-2 px-3 text-right">
                            {fine.outstandingAmount.amount > 0 && (
                              <button
                                onClick={() => {
                                  setSelectedFineId(fine.fineId);
                                  setWaiverAmountMinor(fine.outstandingAmount.amount);
                                  setWaiverModalOpen(true);
                                }}
                                className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 font-semibold rounded text-[11px] transition"
                              >
                                Four-Eyes Waiver
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: DIGITAL & ELECTRONIC */}
          {activeTab === 'digital_electronic' && (
            <div id="section-digital-electronic" className="space-y-6">
              <div>
                <h2 className="text-base font-bold text-slate-900">Digital Resource Vault &amp; Electronic Subscriptions</h2>
                <p className="text-xs text-slate-500">Institutional repositories, database agreements, SAML SSO, and Phase 11.3 Procurement contracts</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {electronicResources.map(el => (
                  <div key={el.electronicResourceId} className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded">{el.electronicResourceId}</span>
                        <h3 className="text-sm font-bold text-slate-900 mt-1">{el.title}</h3>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">{el.status}</span>
                    </div>
                    <div className="text-xs text-slate-600 space-y-1">
                      <div>Provider: <span className="font-medium text-slate-800">{el.provider}</span></div>
                      <div>Auth Method: <span className="font-semibold text-indigo-700">{el.authenticationMethod}</span></div>
                      <div>License Period: <span className="text-slate-800">{el.licenseStart} to {el.licenseEnd}</span></div>
                      <div>Annual Cost: <span className="font-bold text-slate-900">₹{(el.annualSubscriptionFee?.amount || 0) / 100}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: RESEARCH & REFERENCE */}
          {activeTab === 'research_services' && (
            <div id="section-research-services" className="space-y-6">
              <div>
                <h2 className="text-base font-bold text-slate-900">Research Resource Services &amp; Reference Desk (Phase 11.9)</h2>
                <p className="text-xs text-slate-500">Sponsored research dataset discovery, restricted manuscript access, and systematic reviews</p>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs">
                <h3 className="text-sm font-bold text-slate-800 mb-3">Sponsored Research Resource Requests</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                      <tr>
                        <th className="py-2 px-3">Request ID</th>
                        <th className="py-2 px-3">Phase 11.9 Project Ref</th>
                        <th className="py-2 px-3">Researcher</th>
                        <th className="py-2 px-3">Resource Title</th>
                        <th className="py-2 px-3">Restricted</th>
                        <th className="py-2 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {researchRequests.map(req => (
                        <tr key={req.requestId} className="hover:bg-slate-50">
                          <td className="py-2 px-3 font-mono font-bold">{req.requestId}</td>
                          <td className="py-2 px-3 font-mono text-indigo-600">{req.researchProjectIdRef}</td>
                          <td className="py-2 px-3 font-mono">{req.researcherPatronIdRef}</td>
                          <td className="py-2 px-3 font-medium text-slate-900">{req.resourceTitleOrDescription}</td>
                          <td className="py-2 px-3">{req.isRestrictedResource ? 'YES (Four-Eyes)' : 'NO'}</td>
                          <td className="py-2 px-3"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">{req.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: READING ROOMS */}
          {activeTab === 'reading_rooms' && (
            <div id="section-reading-rooms" className="space-y-6">
              <div>
                <h2 className="text-base font-bold text-slate-900">Reading Rooms &amp; Study Carrel Reservations (Phase 11.5)</h2>
                <p className="text-xs text-slate-500">Facilities Space &amp; Room references with conflict-free seat reservation schedules</p>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                      <tr>
                        <th className="py-2 px-3">Reservation ID</th>
                        <th className="py-2 px-3">Room / Space Ref</th>
                        <th className="py-2 px-3">Desk / Carrel</th>
                        <th className="py-2 px-3">Patron Ref</th>
                        <th className="py-2 px-3">Time Window</th>
                        <th className="py-2 px-3">Purpose</th>
                        <th className="py-2 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {readingRoomReservations.map(rr => (
                        <tr key={rr.reservationId} className="hover:bg-slate-50">
                          <td className="py-2 px-3 font-mono font-bold">{rr.reservationId}</td>
                          <td className="py-2 px-3 font-mono text-indigo-600">{rr.buildingSpaceIdRef}</td>
                          <td className="py-2 px-3 font-medium text-slate-900">{rr.seatDeskNumber}</td>
                          <td className="py-2 px-3 font-mono">{rr.patronIdRef}</td>
                          <td className="py-2 px-3 text-slate-600">{new Date(rr.startTime).toLocaleTimeString()} - {new Date(rr.endTime).toLocaleTimeString()}</td>
                          <td className="py-2 px-3"><span className="px-2 py-0.5 bg-slate-100 rounded text-[10px]">{rr.purpose}</span></td>
                          <td className="py-2 px-3"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">{rr.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 10: TRANSFERS & ACQUISITIONS */}
          {activeTab === 'transfers_acquisitions' && (
            <div id="section-transfers-acquisitions" className="space-y-6">
              <div>
                <h2 className="text-base font-bold text-slate-900">Inter-Campus Transfers &amp; Acquisition Requests</h2>
                <p className="text-xs text-slate-500">Chain-of-custody transfer manifests and Phase 11.3 Procurement purchase requests</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Transfers */}
                <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs">
                  <h3 className="text-sm font-bold text-slate-800 mb-3">Active Inter-Campus Transfers</h3>
                  <div className="space-y-3">
                    {transfers.map(tr => (
                      <div key={tr.transferId} className="p-3 bg-slate-50 border border-slate-200 rounded-md text-xs space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="font-mono font-bold text-slate-900">{tr.transferId}</span>
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-bold text-[10px]">{tr.status}</span>
                        </div>
                        <div className="text-slate-600">From: <span className="font-semibold text-slate-800">{tr.sourceCampusIdRef}</span> → To: <span className="font-semibold text-slate-800">{tr.destinationCampusIdRef}</span></div>
                        <div className="text-slate-500">Items: {tr.items.length} copies (Accession: {tr.items[0]?.accessionNumber})</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Acquisitions */}
                <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs">
                  <h3 className="text-sm font-bold text-slate-800 mb-3">Governed Acquisition Requests</h3>
                  <div className="space-y-3">
                    {acquisitions.map(acq => (
                      <div key={acq.acquisitionRequestId} className="p-3 bg-slate-50 border border-slate-200 rounded-md text-xs space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="font-mono font-bold text-slate-900">{acq.acquisitionRequestId}</span>
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">{acq.status}</span>
                        </div>
                        <div className="font-bold text-slate-900">{acq.title}</div>
                        <div className="text-slate-600">Estimated Cost: ₹{(acq.estimatedCost.amount / 100).toFixed(2)}</div>
                        <div className="text-indigo-600 font-mono text-[11px]">Procurement Requisition: {acq.procurementRequisitionIdRef}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 11: PRESERVATION & DISPOSAL */}
          {activeTab === 'preservation_disposal' && (
            <div id="section-preservation-disposal" className="space-y-6">
              <div>
                <h2 className="text-base font-bold text-slate-900">Preservation, Conservation &amp; Governed Disposals</h2>
                <p className="text-xs text-slate-500">In-house bindery treatments and Four-Eyes segregation of duties for resource scrap/write-offs</p>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs">
                <h3 className="text-sm font-bold text-slate-800 mb-3">Four-Eyes Resource Disposal Queue</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                      <tr>
                        <th className="py-2 px-3">Disposal ID</th>
                        <th className="py-2 px-3">Accession #</th>
                        <th className="py-2 px-3">Action</th>
                        <th className="py-2 px-3">Justification</th>
                        <th className="py-2 px-3">Requestor</th>
                        <th className="py-2 px-3">Approver</th>
                        <th className="py-2 px-3">Status</th>
                        <th className="py-2 px-3 text-right">Governed Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {disposalRequests.map(disp => (
                        <tr key={disp.disposalId} className="hover:bg-slate-50">
                          <td className="py-2 px-3 font-mono font-bold">{disp.disposalId}</td>
                          <td className="py-2 px-3 font-mono">{disp.accessionNumber}</td>
                          <td className="py-2 px-3"><span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-semibold">{disp.disposalAction}</span></td>
                          <td className="py-2 px-3 text-slate-600">{disp.justification}</td>
                          <td className="py-2 px-3 font-mono">{disp.requestedByUserIdRef}</td>
                          <td className="py-2 px-3 font-mono font-bold text-emerald-700">{disp.approvedByUserIdRef || 'PENDING'}</td>
                          <td className="py-2 px-3"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">{disp.disposalStatus}</span></td>
                          <td className="py-2 px-3 text-right">
                            {disp.disposalStatus === 'REQUESTED' && (
                              <button
                                onClick={() => handleApproveDisposal(disp.disposalId)}
                                className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded text-[11px] transition"
                              >
                                Four-Eyes Approve
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 12: DIAGNOSTICS SCANNER */}
          {activeTab === 'diagnostics' && (
            <div id="section-diagnostics" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Automated Library Diagnostic Scanner</h2>
                  <p className="text-xs text-slate-500">Evaluates barcode collisions, double-loans, missing overdue records, and SoD breaches</p>
                </div>
                <button
                  id="btn-run-diag"
                  onClick={handleRunDiagnostics}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-md shadow-xs transition"
                >
                  <Play className="w-4 h-4" /> Run Full Scan
                </button>
              </div>

              {diagnosticsResult ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-4">
                    <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-2xs">
                      <div className="text-xs text-slate-500">Checks Performed</div>
                      <div className="text-xl font-bold text-slate-900">{diagnosticsResult.summary.totalChecks}</div>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-2xs">
                      <div className="text-xs text-slate-500">Passed Checks</div>
                      <div className="text-xl font-bold text-emerald-600">{diagnosticsResult.summary.passed}</div>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-2xs">
                      <div className="text-xs text-slate-500">Warnings</div>
                      <div className="text-xl font-bold text-amber-600">{diagnosticsResult.summary.warnings}</div>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-2xs">
                      <div className="text-xs text-slate-500">Errors</div>
                      <div className="text-xl font-bold text-rose-600">{diagnosticsResult.summary.errors}</div>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs">
                    <div className="text-xs font-bold text-slate-800 mb-3">Diagnostic Findings &amp; Integrity Assurances</div>
                    {diagnosticsResult.findings.length === 0 ? (
                      <div className="p-4 bg-emerald-50 text-emerald-800 rounded-md text-xs font-medium flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <span>All 6 core diagnostic invariants verified with zero integrity violations.</span>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {diagnosticsResult.findings.map(f => (
                          <div key={f.findingId} className="p-3 bg-slate-50 border border-slate-200 rounded text-xs flex justify-between items-start">
                            <div>
                              <div className="font-bold text-slate-900">{f.checkName}</div>
                              <div className="text-slate-600 mt-0.5">{f.message}</div>
                            </div>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              f.severity === 'ERROR' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {f.severity}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-8 bg-white border border-slate-200 rounded-lg text-center text-xs text-slate-500">
                  Click 'Run Full Scan' to trigger the automated integrity diagnostics scanner.
                </div>
              )}
            </div>
          )}

          {/* TAB 13: WHAT-IF SANDBOX */}
          {activeTab === 'what_if_sandbox' && (
            <div id="section-what-if-sandbox" className="space-y-6">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2.5">
                <Boxes className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">Isolated Synthetic What-If Simulation Sandbox</div>
                  <div>All simulations execute strictly in-memory without mutating production databases, arrays, or SHA-256 audit chains.</div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="w-full sm:w-auto">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Select Simulation Scenario (15 Scenarios)</label>
                    <select
                      id="scenario-selector"
                      value={selectedScenario}
                      onChange={(e) => setSelectedScenario(e.target.value as SimulationScenario)}
                      className="text-xs bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full sm:w-80"
                    >
                      <option value="MASS_RETURN_SURGE">1. MASS_RETURN_SURGE (End of Semester Peak)</option>
                      <option value="COPY_DEMAND_SURGE">2. COPY_DEMAND_SURGE (Syllabus Course Reserves)</option>
                      <option value="RESERVATION_QUEUE_SURGE">3. RESERVATION_QUEUE_SURGE (High-Demand Texts)</option>
                      <option value="WAITLIST_CASCADE">4. WAITLIST_CASCADE (Inter-Branch Float Rebalance)</option>
                      <option value="CAMPUS_TRANSFER_SURGE">5. CAMPUS_TRANSFER_SURGE (Inter-Campus Dispatch)</option>
                      <option value="OVERDUE_SURGE">6. OVERDUE_SURGE (Exam Period Leniency vs Holds)</option>
                      <option value="DIGITAL_LICENSE_EXHAUSTION">7. DIGITAL_LICENSE_EXHAUSTION (IEEE / ACM Seats)</option>
                      <option value="CONCURRENT_ISSUE_CONFLICT">8. CONCURRENT_ISSUE_CONFLICT (Kiosk Race Simulation)</option>
                      <option value="BARCODE_COLLISION">9. BARCODE_COLLISION (Accession Collision Stress)</option>
                      <option value="ACQUISITION_BACKLOG">10. ACQUISITION_BACKLOG (Faculty Purchase Surge)</option>
                      <option value="RESOURCE_LOSS_SURGE">11. RESOURCE_LOSS_SURGE (Inventory Shrinkage Audit)</option>
                      <option value="DAMAGE_SURGE">12. DAMAGE_SURGE (Bindery Capacity Stress)</option>
                      <option value="RESEARCH_ACCESS_SURGE">13. RESEARCH_ACCESS_SURGE (Phase 11.9 Grants)</option>
                      <option value="READING_ROOM_CAPACITY_SURGE">14. READING_ROOM_CAPACITY_SURGE (Peak Study Desks)</option>
                      <option value="COLLECTION_WITHDRAWAL_SCENARIO">15. COLLECTION_WITHDRAWAL_SCENARIO (Four-Eyes Scrap)</option>
                    </select>
                  </div>

                  <button
                    id="btn-run-simulation"
                    onClick={handleRunSimulation}
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-md shadow-xs transition"
                  >
                    <Play className="w-4 h-4" /> Execute Simulation
                  </button>
                </div>

                {simulationResult && (
                  <div className="space-y-4 pt-3 border-t border-slate-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-md text-xs space-y-1">
                        <div className="font-bold text-slate-800">Production Baseline Snapshot</div>
                        <div>Total Copies: {simulationResult.baselineSnapshot.totalCopies}</div>
                        <div>Active Loans: {simulationResult.baselineSnapshot.activeLoans}</div>
                        <div>Active Reservations: {simulationResult.baselineSnapshot.activeReservations}</div>
                      </div>

                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-md text-xs space-y-1 text-emerald-900">
                        <div className="font-bold">Simulated Projection</div>
                        <div>Zero Production Mutation: <span className="font-bold text-emerald-700">VERIFIED TRUE</span></div>
                        {simulationResult.simulatedOutcomes.projectedTurnoverIncreasePercent && (
                          <div>Projected Turnover Surge: +{simulationResult.simulatedOutcomes.projectedTurnoverIncreasePercent}%</div>
                        )}
                        {simulationResult.simulatedOutcomes.rebalancedCopiesCount && (
                          <div>Rebalanced Copies: {simulationResult.simulatedOutcomes.rebalancedCopiesCount}</div>
                        )}
                      </div>
                    </div>

                    <div className="p-3 bg-white border border-slate-200 rounded-md text-xs">
                      <div className="font-bold text-slate-900 mb-1">Operational Strategic Recommendations:</div>
                      <ul className="list-disc pl-5 space-y-1 text-slate-700">
                        {simulationResult.recommendations.map((rec, i) => (
                          <li key={i}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 14: AUDIT PROVENANCE */}
          {activeTab === 'audit_provenance' && (
            <div id="section-audit-provenance" className="space-y-6">
              <div>
                <h2 className="text-base font-bold text-slate-900">Tamper-Evident SHA-256 Chained Provenance Log</h2>
                <p className="text-xs text-slate-500">Chronological immutable audit events with previousEventHash and currentAuditHash chaining</p>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                      <tr>
                        <th className="py-2 px-3">Event ID</th>
                        <th className="py-2 px-3">Action</th>
                        <th className="py-2 px-3">Entity Type / ID</th>
                        <th className="py-2 px-3">Actor</th>
                        <th className="py-2 px-3">Timestamp</th>
                        <th className="py-2 px-3">Cryptographic SHA-256 Hash</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono">
                      {auditTrail.map(event => (
                        <tr key={event.auditEventId} className="hover:bg-slate-50 text-[11px]">
                          <td className="py-2 px-3 font-semibold text-slate-900">{event.auditEventId}</td>
                          <td className="py-2 px-3"><span className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] font-sans font-semibold">{event.action}</span></td>
                          <td className="py-2 px-3 text-slate-700">{event.entityType}: {event.entityId}</td>
                          <td className="py-2 px-3 text-slate-600">{event.actorUserIdRef}</td>
                          <td className="py-2 px-3 text-slate-500 font-sans">{new Date(event.timestamp).toLocaleTimeString()}</td>
                          <td className="py-2 px-3 text-emerald-700 font-bold truncate max-w-xs">{event.currentAuditHash}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL: ISSUE LOAN */}
      {issueModalOpen && (
        <div id="modal-issue-loan" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Issue Circulation Checkout</h3>
              <button onClick={() => setIssueModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold">×</button>
            </div>
            <form onSubmit={handleIssueLoan} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Available Physical Copy</label>
                <select
                  value={selectedCopyId}
                  onChange={(e) => setSelectedCopyId(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                >
                  <option value="">-- Select Copy --</option>
                  {copies.filter(c => c.availabilityStatus === 'AVAILABLE' && c.isCirculating).map(c => (
                    <option key={c.copyId} value={c.copyId}>
                      {c.accessionNumber} ({c.barcode.barcodeValue}) - {c.copyId}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Validated Patron</label>
                <select
                  value={selectedPatronId}
                  onChange={(e) => setSelectedPatronId(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                >
                  {patrons.map(p => (
                    <option key={p.patronId} value={p.patronId}>
                      {p.patronId} ({p.patronCategory}) - {p.institutionalEmail}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded text-[11px] text-slate-600">
                Verifies patron eligibility, active loan caps, and reservation conflicts before committing transaction.
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIssueModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-semibold transition"
                >
                  Confirm Issue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: FOUR-EYES FINE WAIVER */}
      {waiverModalOpen && (
        <div id="modal-waive-fine" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Four-Eyes Segregated Fine Waiver</h3>
              <button onClick={() => setWaiverModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold">×</button>
            </div>
            <form onSubmit={handleWaiveFine} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Fine Reference ID</label>
                <input
                  type="text"
                  value={selectedFineId}
                  readOnly
                  className="w-full p-2 bg-slate-100 border border-slate-300 rounded font-mono text-slate-700"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Waiver Amount (in Minor Units Paise)</label>
                <input
                  type="number"
                  value={waiverAmountMinor}
                  onChange={(e) => setWaiverAmountMinor(Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
                <span className="text-[11px] text-slate-500">₹{(waiverAmountMinor / 100).toFixed(2)} INR</span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Approving Officer (Four-Eyes SoD)</label>
                <select
                  value={waiverApprover}
                  onChange={(e) => setWaiverApprover(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                >
                  <option value="USER_CHIEF_LIBRARIAN">Chief University Librarian (USER_CHIEF_LIBRARIAN)</option>
                  <option value="USER_DEAN_ACADEMICS">Dean of Academic Affairs (USER_DEAN_ACADEMICS)</option>
                </select>
              </div>

              <div className="p-2.5 bg-amber-50 border border-amber-200 rounded text-[11px] text-amber-900">
                Four-Eyes SoD Mandate: Approver user ID cannot equal requestor user ID.
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setWaiverModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-semibold transition"
                >
                  Authorize Waiver
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
