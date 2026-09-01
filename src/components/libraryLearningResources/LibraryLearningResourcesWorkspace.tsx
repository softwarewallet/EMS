import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Library as LibraryIcon,
  Layers,
  Bookmark,
  ArrowRightLeft,
  DollarSign,
  Globe,
  Truck,
  ShoppingCart,
  ShieldAlert,
  History,
  Play,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Plus,
  Building,
  UserCheck,
  PlusCircle,
  Clock,
  QrCode,
  ShieldCheck,
  Activity,
  FileText,
  Search,
  Key,
  RotateCcw,
  Sparkles,
  Lock,
  Unlock,
  AlertCircle
} from 'lucide-react';
import { libraryLearningResourcesService } from '../../services/libraryLearningResourcesService';
import {
  Library,
  LibraryBranch,
  LearningResource,
  ResourceCopy,
  DigitalResource,
  LibraryLoan,
  LibraryReservation,
  LibraryFineAssessment,
  FineWaiverRequest,
  ResourceTransfer,
  AcquisitionRequest,
  LibraryAuditEvent,
  LibraryDiagnosticResult,
  LibrarySimulationResult,
  LibrarySimulationScenario
} from '../../types/libraryLearningResources';

export const LibraryLearningResourcesWorkspace: React.FC = () => {
  const tenantId = 'TENANT_INDIA_DEFAULT';
  const campusId = 'CAMPUS_DELHI';

  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'libraries'
    | 'resources'
    | 'copies'
    | 'circulation'
    | 'reservations'
    | 'fines'
    | 'digital'
    | 'transfers'
    | 'acquisitions'
    | 'diagnostics'
    | 'audit'
    | 'sandbox'
  >('overview');

  // State slices
  const [libraries, setLibraries] = useState<Library[]>([]);
  const [branches, setBranches] = useState<LibraryBranch[]>([]);
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [copies, setCopies] = useState<ResourceCopy[]>([]);
  const [loans, setLoans] = useState<LibraryLoan[]>([]);
  const [reservations, setReservations] = useState<LibraryReservation[]>([]);
  const [fines, setFines] = useState<LibraryFineAssessment[]>([]);
  const [transfers, setTransfers] = useState<ResourceTransfer[]>([]);
  const [acquisitions, setAcquisitions] = useState<AcquisitionRequest[]>([]);
  const [digitalResources, setDigitalResources] = useState<DigitalResource[]>([]);
  const [auditEvents, setAuditEvents] = useState<LibraryAuditEvent[]>([]);
  const [diagnosticsResult, setDiagnosticsResult] = useState<LibraryDiagnosticResult | null>(null);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal / Form States
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showCatalogModal, setShowCatalogModal] = useState(false);
  const [showWaiverModal, setShowWaiverModal] = useState(false);
  const [showAcquisitionModal, setShowAcquisitionModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedFineForWaiver, setSelectedFineForWaiver] = useState<LibraryFineAssessment | null>(null);

  // Form inputs
  const [checkoutForm, setCheckoutForm] = useState({
    copyIdRef: '',
    memberType: 'STUDENT' as 'STUDENT' | 'EMPLOYEE',
    studentIdRef: 'STU-2025-001',
    employeeIdRef: '',
    libraryIdRef: 'LIB-DEL-CENTRAL'
  });

  const [catalogForm, setCatalogForm] = useState({
    title: '',
    isbn: '',
    callNumber: '',
    authors: '',
    publisher: '',
    publicationYear: 2025,
    format: 'PHYSICAL_BOOK' as any,
    accessClassification: 'GENERAL_CIRCULATION' as any,
    standardReplacementCost: 2500,
    categoryIdRef: 'CAT-CS-AI'
  });

  const [waiverForm, setWaiverForm] = useState({
    waiverAmount: 0,
    reasonCategory: 'ACADEMIC_EXCUSE' as any,
    justification: '',
    requestedByUserIdRef: 'USER_DESK_CLERK',
    approverUserIdRef: 'USER_CHIEF_LIBRARIAN'
  });

  const [acquisitionForm, setAcquisitionForm] = useState({
    title: '',
    authors: '',
    format: 'PHYSICAL_BOOK' as any,
    quantityRequested: 3,
    estimatedTotalCost: 9000,
    requestedByUserIdRef: 'FAC-CS-DR-RAO',
    requesterType: 'FACULTY' as any,
    academicJustification: 'Required reference for new Generative AI syllabus'
  });

  // What-If Sandbox State
  const [selectedScenario, setSelectedScenario] = useState<LibrarySimulationScenario['type']>('SEMESTER_CIRCULATION_SURGE');
  const [simulationResult, setSimulationResult] = useState<LibrarySimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // Notification / Feedback banner
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showNotice = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const refreshAllData = () => {
    setLibraries(libraryLearningResourcesService.getLibraries(tenantId));
    setBranches(libraryLearningResourcesService.getBranches(tenantId));
    setResources(libraryLearningResourcesService.getResources(tenantId));
    setCopies(libraryLearningResourcesService.getCopies(tenantId));
    setLoans(libraryLearningResourcesService.getLoans(tenantId));
    setReservations(libraryLearningResourcesService.getReservations(tenantId));
    setFines(libraryLearningResourcesService.getFines(tenantId));
    setTransfers(libraryLearningResourcesService.getTransfers(tenantId));
    setAcquisitions(libraryLearningResourcesService.getAcquisitionRequests(tenantId));
    setDigitalResources(libraryLearningResourcesService.getDigitalResources(tenantId));
    setAuditEvents(libraryLearningResourcesService.getAuditTrail(tenantId));
    setDiagnosticsResult(libraryLearningResourcesService.runDiagnostics(tenantId));
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  // Handlers
  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      libraryLearningResourcesService.checkoutResource({
        tenantId,
        campusIdRef: campusId,
        libraryIdRef: checkoutForm.libraryIdRef,
        copyIdRef: checkoutForm.copyIdRef,
        memberType: checkoutForm.memberType,
        studentIdRef: checkoutForm.memberType === 'STUDENT' ? checkoutForm.studentIdRef : undefined,
        employeeIdRef: checkoutForm.memberType === 'EMPLOYEE' ? checkoutForm.employeeIdRef : undefined,
        issuedByUserIdRef: 'USER_LIBRARIAN_DESK',
        idempotencyKey: `IDEM-CO-${Date.now()}`
      });
      showNotice('Resource successfully checked out to patron');
      setShowCheckoutModal(false);
      refreshAllData();
    } catch (err: any) {
      showNotice(err.message || 'Checkout failed', 'error');
    }
  };

  const handleReturnLoan = (loanId: string) => {
    try {
      const res = libraryLearningResourcesService.checkinResource({
        loanId,
        tenantId,
        returnedToUserIdRef: 'USER_LIBRARIAN_DESK',
        condition: 'GOOD',
        idempotencyKey: `IDEM-RET-${Date.now()}`
      });
      if (res.fine) {
        showNotice(`Loan returned. Overdue fine assessed: ₹${res.fine.assessedAmount.amount}`, 'success');
      } else {
        showNotice('Resource returned in good condition and restocked', 'success');
      }
      refreshAllData();
    } catch (err: any) {
      showNotice(err.message || 'Return failed', 'error');
    }
  };

  const handleRenewLoan = (loanId: string) => {
    try {
      libraryLearningResourcesService.renewLoan({
        loanId,
        tenantId,
        renewedByUserIdRef: 'USER_LIBRARIAN_DESK',
        idempotencyKey: `IDEM-RNW-${Date.now()}`
      });
      showNotice('Loan renewal granted according to circulation policy');
      refreshAllData();
    } catch (err: any) {
      showNotice(err.message || 'Renewal failed', 'error');
    }
  };

  const handleCatalogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      libraryLearningResourcesService.createResource(
        {
          resourceId: `RES-${Date.now().toString().slice(-6)}`,
          title: catalogForm.title,
          isbn: catalogForm.isbn || undefined,
          callNumber: catalogForm.callNumber,
          authors: catalogForm.authors.split(',').map(a => a.trim()),
          publisher: catalogForm.publisher,
          publicationYear: Number(catalogForm.publicationYear),
          language: 'English',
          format: catalogForm.format,
          categoryIdRef: catalogForm.categoryIdRef,
          accessClassification: catalogForm.accessClassification,
          keywords: ['Computer Science', 'Textbook'],
          standardReplacementCost: { amount: Number(catalogForm.standardReplacementCost), currency: 'INR' },
          tenantId,
          permittedCampusScope: [campusId],
          status: 'AVAILABLE',
          isDigital: false
        },
        'USER_CATALOGUER'
      );
      showNotice('New resource record successfully catalogued');
      setShowCatalogModal(false);
      refreshAllData();
    } catch (err: any) {
      showNotice(err.message || 'Cataloguing failed', 'error');
    }
  };

  const handleWaiverSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFineForWaiver) return;
    try {
      const wvr = libraryLearningResourcesService.requestFineWaiver({
        fineIdRef: selectedFineForWaiver.fineId,
        tenantId,
        campusIdRef: selectedFineForWaiver.campusIdRef,
        waiverAmount: Number(waiverForm.waiverAmount),
        reasonCategory: waiverForm.reasonCategory,
        justification: waiverForm.justification,
        requestedByUserIdRef: waiverForm.requestedByUserIdRef,
        idempotencyKey: `IDEM-WVR-${Date.now()}`
      });

      // Attempt SoD Approval
      libraryLearningResourcesService.approveFineWaiver(
        wvr.waiverRequestId,
        tenantId,
        waiverForm.approverUserIdRef
      );

      showNotice('Fine waiver approved with Four-Eyes Segregation of Duties');
      setShowWaiverModal(false);
      setSelectedFineForWaiver(null);
      refreshAllData();
    } catch (err: any) {
      showNotice(err.message || 'Waiver operation failed', 'error');
    }
  };

  const handleAcquisitionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      libraryLearningResourcesService.createAcquisitionRequest(
        {
          tenantId,
          campusIdRef: campusId,
          title: acquisitionForm.title,
          authors: acquisitionForm.authors.split(',').map(a => a.trim()),
          format: acquisitionForm.format,
          quantityRequested: Number(acquisitionForm.quantityRequested),
          estimatedTotalCost: { amount: Number(acquisitionForm.estimatedTotalCost), currency: 'INR' },
          requestedByUserIdRef: acquisitionForm.requestedByUserIdRef,
          requesterType: acquisitionForm.requesterType,
          academicJustification: acquisitionForm.academicJustification,
          idempotencyKey: `IDEM-ACQ-${Date.now()}`
        },
        acquisitionForm.requestedByUserIdRef
      );
      showNotice('Acquisition proposal submitted for library committee review');
      setShowAcquisitionModal(false);
      refreshAllData();
    } catch (err: any) {
      showNotice(err.message || 'Acquisition request failed', 'error');
    }
  };

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const res = libraryLearningResourcesService.runSimulation(selectedScenario);
      setSimulationResult(res);
      setIsSimulating(false);
    }, 400);
  };

  // Filtered lists
  const filteredResources = resources.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.callNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.authors.some(a => a.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 md:p-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-lg text-blue-700">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Institutional Library & Knowledge Operations
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Phase 11.8 • Authoritative Resource Circulation, Digital Entitlements, Fines & Four-Eyes Governance
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowCheckoutModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer transition-colors"
          >
            <ArrowRightLeft className="w-4 h-4" />
            Issue / Check-out
          </button>
          <button
            onClick={() => setShowCatalogModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4" />
            Catalogue Resource
          </button>
          <button
            onClick={() => setShowAcquisitionModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
            Propose Acquisition
          </button>
        </div>
      </div>

      {/* Notification Banner */}
      {notification && (
        <div
          className={`mb-5 p-3.5 rounded-lg text-xs font-semibold flex items-center gap-2 border ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}
        >
          {notification.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          {notification.message}
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2 mb-6 border-b border-slate-200 text-xs font-semibold">
        {[
          { id: 'overview', label: 'Command Center', icon: Activity },
          { id: 'libraries', label: 'Libraries & Branches', icon: LibraryIcon },
          { id: 'resources', label: 'Resource Catalog', icon: BookOpen },
          { id: 'copies', label: 'Physical Copies', icon: QrCode },
          { id: 'circulation', label: 'Circulation & Loans', icon: ArrowRightLeft },
          { id: 'reservations', label: 'Holds & Queues', icon: Bookmark },
          { id: 'fines', label: 'Fines & SoD Waivers', icon: DollarSign },
          { id: 'digital', label: 'Digital Assets', icon: Globe },
          { id: 'transfers', label: 'Inter-Campus Transfers', icon: Truck },
          { id: 'acquisitions', label: 'Acquisitions', icon: ShoppingCart },
          { id: 'diagnostics', label: 'Diagnostics Engine', icon: ShieldCheck },
          { id: 'audit', label: 'Audit Trail', icon: History },
          { id: 'sandbox', label: 'What-If Sandbox', icon: Sparkles }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: COMMAND CENTER / OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <span className="text-2xs font-bold text-slate-400 uppercase tracking-wider">Libraries</span>
              <p className="text-xl font-black text-slate-900 mt-1">{libraries.length}</p>
              <span className="text-2xs text-blue-600 font-medium">{branches.length} branches active</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <span className="text-2xs font-bold text-slate-400 uppercase tracking-wider">Catalog Titles</span>
              <p className="text-xl font-black text-slate-900 mt-1">{resources.length}</p>
              <span className="text-2xs text-emerald-600 font-medium">{copies.length} physical copies</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <span className="text-2xs font-bold text-slate-400 uppercase tracking-wider">Active Loans</span>
              <p className="text-xl font-black text-blue-600 mt-1">
                {loans.filter(l => l.status === 'ACTIVE' || l.status === 'RENEWED').length}
              </p>
              <span className="text-2xs text-slate-500 font-medium">In patron custody</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <span className="text-2xs font-bold text-slate-400 uppercase tracking-wider">Active Holds</span>
              <p className="text-xl font-black text-amber-600 mt-1">
                {reservations.filter(r => r.status === 'QUEUED' || r.status === 'REQUESTED').length}
              </p>
              <span className="text-2xs text-slate-500 font-medium">In reservation queues</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <span className="text-2xs font-bold text-slate-400 uppercase tracking-wider">Unpaid Fines</span>
              <p className="text-xl font-black text-red-600 mt-1">
                ₹{fines.reduce((sum, f) => sum + f.outstandingAmount.amount, 0)}
              </p>
              <span className="text-2xs text-slate-500 font-medium">{fines.length} fee assessments</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <span className="text-2xs font-bold text-slate-400 uppercase tracking-wider">Audit Chain</span>
              <p className="text-xl font-black text-emerald-600 mt-1">
                {diagnosticsResult?.auditChainIntact ? 'VALID' : 'CORRUPT'}
              </p>
              <span className="text-2xs text-emerald-600 font-medium">SHA-256 chained</span>
            </div>
          </div>

          {/* Quick Operations & Recent Loans */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ArrowRightLeft className="w-4 h-4 text-blue-600" />
                  Active Circulation Loans
                </h2>
                <span className="text-xs text-slate-400">{loans.length} total loan records</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                      <th className="pb-2">Loan #</th>
                      <th className="pb-2">Resource & Copy</th>
                      <th className="pb-2">Patron Ref</th>
                      <th className="pb-2">Due Date</th>
                      <th className="pb-2">Status</th>
                      <th className="pb-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loans.map(loan => {
                      const res = resources.find(r => r.resourceId === loan.resourceIdRef);
                      const copy = copies.find(c => c.copyId === loan.copyIdRef);
                      return (
                        <tr key={loan.loanId} className="hover:bg-slate-50">
                          <td className="py-2.5 font-bold text-slate-800">{loan.loanNumber}</td>
                          <td className="py-2.5">
                            <p className="font-semibold text-slate-900 truncate max-w-xs">{res?.title || loan.resourceIdRef}</p>
                            <p className="text-2xs text-slate-400">Barcode: {copy?.barcode}</p>
                          </td>
                          <td className="py-2.5">
                            <span className="px-1.5 py-0.5 bg-slate-100 rounded text-2xs font-semibold">
                              {loan.studentIdRef || loan.employeeIdRef}
                            </span>
                            <p className="text-2xs text-slate-400">{loan.memberCategory}</p>
                          </td>
                          <td className="py-2.5 font-mono text-slate-600">
                            {new Date(loan.dueDate).toLocaleDateString()}
                          </td>
                          <td className="py-2.5">
                            <span
                              className={`px-2 py-0.5 rounded text-2xs font-bold ${
                                loan.status === 'ACTIVE'
                                  ? 'bg-blue-50 text-blue-700'
                                  : loan.status === 'RETURNED'
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : 'bg-amber-50 text-amber-700'
                              }`}
                            >
                              {loan.status}
                            </span>
                          </td>
                          <td className="py-2.5 text-right space-x-1">
                            {loan.status === 'ACTIVE' && (
                              <>
                                <button
                                  onClick={() => handleReturnLoan(loan.loanId)}
                                  className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded text-2xs font-bold cursor-pointer"
                                >
                                  Return
                                </button>
                                <button
                                  onClick={() => handleRenewLoan(loan.loanId)}
                                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-2xs font-bold cursor-pointer"
                                >
                                  Renew
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Diagnostic & Governance Health Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Governance Control Tower
                </h3>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-2xs font-bold">
                  {diagnosticsResult?.status || 'HEALTHY'}
                </span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-lg space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Tenant Scope</span>
                  <span className="font-mono font-semibold text-slate-800">{tenantId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Campus Authority</span>
                  <span className="font-mono font-semibold text-slate-800">{campusId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Four-Eyes SoD</span>
                  <span className="font-semibold text-emerald-600">ENFORCED (No Self-Approval)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Upstream References</span>
                  <span className="font-semibold text-blue-600">Phase 10.4 / 11.1 / 11.2 Aligned</span>
                </div>
              </div>

              <button
                onClick={() => {
                  const res = libraryLearningResourcesService.runDiagnostics(tenantId);
                  setDiagnosticsResult(res);
                  showNotice('Comprehensive catalog & circulation diagnostics completed');
                }}
                className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                Execute Diagnostic Integrity Scan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: RESOURCE CATALOG */}
      {activeTab === 'resources' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search catalog by title, call number, author, ISBN..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="AVAILABLE">AVAILABLE</option>
              <option value="ON_LOAN">ON_LOAN</option>
              <option value="RESERVED">RESERVED</option>
              <option value="WITHDRAWN">WITHDRAWN</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="pb-2">Call Number</th>
                  <th className="pb-2">Title & Metadata</th>
                  <th className="pb-2">Format</th>
                  <th className="pb-2">Access Type</th>
                  <th className="pb-2 text-center">Copies</th>
                  <th className="pb-2 text-center">Avail / Loan</th>
                  <th className="pb-2 text-right">Replacement Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredResources.map(res => (
                  <tr key={res.resourceId} className="hover:bg-slate-50">
                    <td className="py-3 font-mono font-bold text-slate-700">{res.callNumber}</td>
                    <td className="py-3">
                      <p className="font-bold text-slate-900">{res.title}</p>
                      <p className="text-2xs text-slate-500">
                        {res.authors.join(', ')} • {res.publisher} ({res.publicationYear})
                      </p>
                      {res.isbn && <p className="text-2xs text-slate-400 font-mono">ISBN: {res.isbn}</p>}
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-2xs font-semibold">
                        {res.format}
                      </span>
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-2xs font-bold ${
                          res.accessClassification === 'GENERAL_CIRCULATION'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {res.accessClassification}
                      </span>
                    </td>
                    <td className="py-3 text-center font-bold text-slate-800">{res.totalCopiesCount}</td>
                    <td className="py-3 text-center">
                      <span className="text-emerald-600 font-bold">{res.availableCopiesCount}</span>
                      <span className="text-slate-300 mx-1">/</span>
                      <span className="text-blue-600 font-bold">{res.borrowedCopiesCount}</span>
                    </td>
                    <td className="py-3 text-right font-mono font-semibold text-slate-800">
                      ₹{res.standardReplacementCost.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: PHYSICAL COPIES */}
      {activeTab === 'copies' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold text-slate-900">Physical Barcoded Copies Inventory</h2>
            <span className="text-xs text-slate-400">{copies.length} barcoded assets registered</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="pb-2">Barcode / Accession</th>
                  <th className="pb-2">Resource Title</th>
                  <th className="pb-2">Shelf Location</th>
                  <th className="pb-2">Condition</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2 text-center">Circulation Count</th>
                  <th className="pb-2 text-right">Restricted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {copies.map(copy => {
                  const res = resources.find(r => r.resourceId === copy.resourceIdRef);
                  return (
                    <tr key={copy.copyId} className="hover:bg-slate-50">
                      <td className="py-3">
                        <p className="font-mono font-bold text-slate-800">{copy.barcode}</p>
                        <p className="text-2xs text-slate-400">{copy.accessionNumber}</p>
                      </td>
                      <td className="py-3">
                        <p className="font-semibold text-slate-900">{res?.title || copy.resourceIdRef}</p>
                      </td>
                      <td className="py-3 text-slate-600 font-mono">{copy.shelfLocation}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 bg-slate-100 rounded text-2xs font-semibold text-slate-700">
                          {copy.condition}
                        </span>
                      </td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-2xs font-bold ${
                            copy.status === 'AVAILABLE'
                              ? 'bg-emerald-50 text-emerald-700'
                              : copy.status === 'ON_LOAN'
                              ? 'bg-blue-50 text-blue-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {copy.status}
                        </span>
                      </td>
                      <td className="py-3 text-center font-bold text-slate-700">{copy.totalCirculationCount}</td>
                      <td className="py-3 text-right">
                        {copy.isRestricted ? (
                          <span className="px-2 py-0.5 bg-red-50 text-red-700 rounded text-2xs font-bold">YES</span>
                        ) : (
                          <span className="text-slate-400 text-2xs">NO</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: FINES & FOUR-EYES SOD WAIVERS */}
      {activeTab === 'fines' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Patron Fine Assessments & Four-Eyes Waivers</h2>
                <p className="text-xs text-slate-500">
                  Four-Eyes Segregation of Duties (SoD) enforced: Desk officer cannot approve their own fine waiver
                </p>
              </div>
              <span className="text-xs text-red-600 font-bold">
                Total Outstanding: ₹{fines.reduce((sum, f) => sum + f.outstandingAmount.amount, 0)}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="pb-2">Fine #</th>
                    <th className="pb-2">Patron Ref</th>
                    <th className="pb-2">Reason</th>
                    <th className="pb-2">Assessed Date</th>
                    <th className="pb-2 text-right">Assessed</th>
                    <th className="pb-2 text-right">Outstanding</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {fines.map(fine => (
                    <tr key={fine.fineId} className="hover:bg-slate-50">
                      <td className="py-3 font-mono font-bold text-slate-800">{fine.fineNumber}</td>
                      <td className="py-3">
                        <span className="font-semibold text-slate-900">{fine.studentIdRef || fine.employeeIdRef}</span>
                        <p className="text-2xs text-slate-400">{fine.memberType}</p>
                      </td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 bg-slate-100 rounded text-2xs font-semibold">
                          {fine.reason} ({fine.daysOverdue || 0} days)
                        </span>
                      </td>
                      <td className="py-3 font-mono text-slate-600">{new Date(fine.assessedDate).toLocaleDateString()}</td>
                      <td className="py-3 text-right font-mono font-semibold">₹{fine.assessedAmount.amount}</td>
                      <td className="py-3 text-right font-mono font-bold text-red-600">₹{fine.outstandingAmount.amount}</td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-2xs font-bold ${
                            fine.status === 'PAID'
                              ? 'bg-emerald-50 text-emerald-700'
                              : fine.status === 'WAIVED'
                              ? 'bg-purple-50 text-purple-700'
                              : 'bg-red-50 text-red-700'
                          }`}
                        >
                          {fine.status}
                        </span>
                      </td>
                      <td className="py-3 text-right space-x-1">
                        {fine.outstandingAmount.amount > 0 && (
                          <>
                            <button
                              onClick={() => {
                                try {
                                  libraryLearningResourcesService.payFine(fine.fineId, tenantId, fine.outstandingAmount.amount, 'USER_CASHIER');
                                  showNotice('Fine paid in full and receipt recorded');
                                  refreshAllData();
                                } catch (err: any) {
                                  showNotice(err.message, 'error');
                                }
                              }}
                              className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded text-2xs font-bold cursor-pointer"
                            >
                              Collect Pay
                            </button>
                            <button
                              onClick={() => {
                                setSelectedFineForWaiver(fine);
                                setWaiverForm({
                                  ...waiverForm,
                                  waiverAmount: fine.outstandingAmount.amount
                                });
                                setShowWaiverModal(true);
                              }}
                              className="px-2 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded text-2xs font-bold cursor-pointer"
                            >
                              SoD Waiver
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

      {/* TAB CONTENT: WHAT-IF SANDBOX (15 ISOLATED SCENARIOS) */}
      {activeTab === 'sandbox' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  What-If Simulation Sandbox
                </h2>
                <p className="text-xs text-slate-500">
                  Stress-test library resource capacity, mass overdue spikes, and inter-campus courier loads with zero production mutations.
                </p>
              </div>
              <span className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-lg text-2xs font-bold">
                15 Stress Scenarios Available
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="text-2xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Select Stress Scenario
                </label>
                <select
                  value={selectedScenario}
                  onChange={e => setSelectedScenario(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold outline-none"
                >
                  <option value="SEMESTER_CIRCULATION_SURGE">1. Semester Circulation Surge (Peak Exams)</option>
                  <option value="LIBRARY_CAPACITY_EXHAUSTION">2. Library Seating Capacity Exhaustion</option>
                  <option value="MASS_OVERDUE_EVENT">3. Mass Overdue Event (Semester End)</option>
                  <option value="HIGH_DEMAND_RESOURCE_SHORTAGE">4. High-Demand Course Text Shortage</option>
                  <option value="RESERVATION_SURGE">5. Reservation & Hold Queue Surge</option>
                  <option value="INTER_CAMPUS_TRANSFER_CASCADE">6. Inter-Campus Courier Transfer Cascade</option>
                  <option value="LOST_RESOURCE_SURGE">7. Lost Resource & Security Tag Audit</option>
                  <option value="FINE_POLICY_CHANGE">8. Fine Policy Restructuring</option>
                  <option value="FINE_WAIVER_SURGE">9. Fine Waiver Discretionary Surge</option>
                  <option value="ACQUISITION_DEMAND_SURGE">10. Departmental Acquisition Demand Surge</option>
                  <option value="DIGITAL_ENTITLEMENT_EXPIRY_EVENT">11. Digital Subscription Renewal & Expiry</option>
                  <option value="RESTRICTED_RESOURCE_ACCESS_ATTEMPT">12. Restricted Archive & Rare MS Gating</option>
                  <option value="CAMPUS_CLOSURE">13. Emergency Campus Closure Loan Extensions</option>
                  <option value="RESOURCE_WITHDRAWAL_CASCADE">14. Collection Weeding & Deaccessioning</option>
                  <option value="LIBRARY_SERVICE_DISRUPTION">15. Cloud & Network Service Disruption Buffer</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleRunSimulation}
                  disabled={isSimulating}
                  className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4 fill-white" />
                  {isSimulating ? 'Simulating...' : 'Execute Sandbox Test'}
                </button>
              </div>
            </div>
          </div>

          {/* Simulation Output Card */}
          {simulationResult && (
            <div className="bg-white rounded-xl border border-purple-200 p-5 space-y-4 shadow-xs">
              <div className="p-3 bg-purple-50 border border-purple-100 rounded-lg text-center">
                <p className="text-2xs font-extrabold text-purple-900 tracking-wider">
                  {simulationResult.simulationBanner}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="text-2xs text-slate-400 font-bold uppercase">Circulation Volume</span>
                  <p className="text-lg font-black text-slate-900 mt-0.5">
                    {simulationResult.projectedCirculationVolume} loans
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="text-2xs text-slate-400 font-bold uppercase">Capacity Shortfall</span>
                  <p className="text-lg font-black text-amber-600 mt-0.5">
                    {simulationResult.projectedCapacityShortfallPercent}%
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="text-2xs text-slate-400 font-bold uppercase">Stress Factor</span>
                  <p className="text-lg font-black text-purple-600 mt-0.5">
                    {simulationResult.stressFactorMultiplier}x
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="text-2xs text-slate-400 font-bold uppercase">Zero Mutation</span>
                  <p className="text-lg font-black text-emerald-600 mt-0.5">
                    {simulationResult.zeroProductionMutationVerified ? 'CONFIRMED' : 'FAILED'}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-900 mb-2">Automated Policy Recommendations:</h4>
                <ul className="space-y-1.5">
                  {simulationResult.recommendations.map((rec, idx) => (
                    <li key={idx} className="text-xs text-slate-600 flex items-start gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: AUDIT TRAIL */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Cryptographic Provenance Log (SHA-256)</h2>
              <p className="text-xs text-slate-500">Append-only audit trail with tamper-evident cryptographic block hashes</p>
            </div>
            <span className="text-xs font-mono text-emerald-600 font-bold">
              {auditEvents.length} Verified Ledger Blocks
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase">
                  <th className="pb-2">Event ID</th>
                  <th className="pb-2">Action</th>
                  <th className="pb-2">Actor</th>
                  <th className="pb-2">Block Hash (SHA-256)</th>
                  <th className="pb-2 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-2xs">
                {auditEvents.map(evt => (
                  <tr key={evt.eventId} className="hover:bg-slate-50">
                    <td className="py-2.5 font-bold text-slate-800">{evt.eventId}</td>
                    <td className="py-2.5">
                      <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded font-semibold">
                        {evt.action}
                      </span>
                    </td>
                    <td className="py-2.5 text-slate-600">{evt.actorUserIdRef}</td>
                    <td className="py-2.5 text-slate-500 truncate max-w-xs">{evt.hash}</td>
                    <td className="py-2.5 text-right text-slate-400">
                      {new Date(evt.timestamp).toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: CHECKOUT RESOURCE */}
      {showCheckoutModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-5 shadow-xl border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-slate-900">Issue Resource Copy to Patron</h3>
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCheckoutSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-2xs font-bold text-slate-500 uppercase mb-1">Select Available Copy</label>
                <select
                  value={checkoutForm.copyIdRef}
                  onChange={e => setCheckoutForm({ ...checkoutForm, copyIdRef: e.target.value })}
                  required
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                >
                  <option value="">-- Choose Copy Barcode --</option>
                  {copies
                    .filter(c => c.status === 'AVAILABLE' && !c.isRestricted)
                    .map(c => {
                      const res = resources.find(r => r.resourceId === c.resourceIdRef);
                      return (
                        <option key={c.copyId} value={c.copyId}>
                          {c.barcode} - {res?.title} ({c.shelfLocation})
                        </option>
                      );
                    })}
                </select>
              </div>

              <div>
                <label className="block text-2xs font-bold text-slate-500 uppercase mb-1">Patron Member Type</label>
                <select
                  value={checkoutForm.memberType}
                  onChange={e => setCheckoutForm({ ...checkoutForm, memberType: e.target.value as any })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                >
                  <option value="STUDENT">Student (Phase 10.4 Ref)</option>
                  <option value="EMPLOYEE">Faculty / Employee (Phase 11.1 Ref)</option>
                </select>
              </div>

              {checkoutForm.memberType === 'STUDENT' ? (
                <div>
                  <label className="block text-2xs font-bold text-slate-500 uppercase mb-1">Student ID Ref</label>
                  <input
                    type="text"
                    value={checkoutForm.studentIdRef}
                    onChange={e => setCheckoutForm({ ...checkoutForm, studentIdRef: e.target.value })}
                    required
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none font-mono"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-2xs font-bold text-slate-500 uppercase mb-1">Employee ID Ref</label>
                  <input
                    type="text"
                    value={checkoutForm.employeeIdRef}
                    onChange={e => setCheckoutForm({ ...checkoutForm, employeeIdRef: e.target.value })}
                    required
                    placeholder="EMP-FACULTY-01"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none font-mono"
                  />
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCheckoutModal(false)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold cursor-pointer"
                >
                  Confirm Issue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CATALOG RESOURCE */}
      {showCatalogModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-lg w-full p-5 shadow-xl border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-slate-900">Catalogue New Learning Resource</h3>
              <button
                onClick={() => setShowCatalogModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCatalogSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-2xs font-bold text-slate-500 uppercase mb-1">Title</label>
                <input
                  type="text"
                  value={catalogForm.title}
                  onChange={e => setCatalogForm({ ...catalogForm, title: e.target.value })}
                  required
                  placeholder="e.g. Modern Operating Systems"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-2xs font-bold text-slate-500 uppercase mb-1">Call Number</label>
                  <input
                    type="text"
                    value={catalogForm.callNumber}
                    onChange={e => setCatalogForm({ ...catalogForm, callNumber: e.target.value })}
                    required
                    placeholder="QA76.76.O63 T35"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-2xs font-bold text-slate-500 uppercase mb-1">ISBN</label>
                  <input
                    type="text"
                    value={catalogForm.isbn}
                    onChange={e => setCatalogForm({ ...catalogForm, isbn: e.target.value })}
                    placeholder="978-0133591620"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-2xs font-bold text-slate-500 uppercase mb-1">Authors (comma separated)</label>
                <input
                  type="text"
                  value={catalogForm.authors}
                  onChange={e => setCatalogForm({ ...catalogForm, authors: e.target.value })}
                  required
                  placeholder="Andrew S. Tanenbaum, Herbert Bos"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-2xs font-bold text-slate-500 uppercase mb-1">Publisher</label>
                  <input
                    type="text"
                    value={catalogForm.publisher}
                    onChange={e => setCatalogForm({ ...catalogForm, publisher: e.target.value })}
                    required
                    placeholder="Pearson"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="block text-2xs font-bold text-slate-500 uppercase mb-1">Publication Year</label>
                  <input
                    type="number"
                    value={catalogForm.publicationYear}
                    onChange={e => setCatalogForm({ ...catalogForm, publicationYear: Number(e.target.value) })}
                    required
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCatalogModal(false)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold cursor-pointer"
                >
                  Catalogue Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: FOUR-EYES SOD FINE WAIVER */}
      {showWaiverModal && selectedFineForWaiver && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-5 shadow-xl border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-purple-600" />
                Four-Eyes Fine Waiver Approval
              </h3>
              <button
                onClick={() => setShowWaiverModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleWaiverSubmit} className="space-y-3 text-xs">
              <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                <div className="flex justify-between">
                  <span className="text-purple-700 font-semibold">Fine Reference</span>
                  <span className="font-mono font-bold text-purple-900">{selectedFineForWaiver.fineNumber}</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-purple-700 font-semibold">Outstanding Balance</span>
                  <span className="font-mono font-bold text-red-600">₹{selectedFineForWaiver.outstandingAmount.amount}</span>
                </div>
              </div>

              <div>
                <label className="block text-2xs font-bold text-slate-500 uppercase mb-1">Waiver Amount (₹)</label>
                <input
                  type="number"
                  value={waiverForm.waiverAmount}
                  onChange={e => setWaiverForm({ ...waiverForm, waiverAmount: Number(e.target.value) })}
                  max={selectedFineForWaiver.outstandingAmount.amount}
                  required
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-2xs font-bold text-slate-500 uppercase mb-1">Reason Category</label>
                <select
                  value={waiverForm.reasonCategory}
                  onChange={e => setWaiverForm({ ...waiverForm, reasonCategory: e.target.value as any })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                >
                  <option value="ACADEMIC_EXCUSE">Academic Off-Campus Excuse</option>
                  <option value="MEDICAL_EMERGENCY">Medical Emergency Exemption</option>
                  <option value="INSTITUTIONAL_DELAY">Institutional / Administrative Delay</option>
                  <option value="SPECIAL_DISPENSATION">Dean Special Dispensation</option>
                </select>
              </div>

              <div>
                <label className="block text-2xs font-bold text-slate-500 uppercase mb-1">Justification Note</label>
                <textarea
                  value={waiverForm.justification}
                  onChange={e => setWaiverForm({ ...waiverForm, justification: e.target.value })}
                  required
                  placeholder="Official justification for waiver audit record..."
                  rows={2}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <div>
                  <label className="block text-2xs font-bold text-slate-500 uppercase mb-1">Requester ID</label>
                  <input
                    type="text"
                    value={waiverForm.requestedByUserIdRef}
                    onChange={e => setWaiverForm({ ...waiverForm, requestedByUserIdRef: e.target.value })}
                    required
                    className="w-full p-1.5 bg-white border border-slate-200 rounded outline-none font-mono text-2xs"
                  />
                </div>
                <div>
                  <label className="block text-2xs font-bold text-slate-500 uppercase mb-1">Approver ID (Distinct)</label>
                  <input
                    type="text"
                    value={waiverForm.approverUserIdRef}
                    onChange={e => setWaiverForm({ ...waiverForm, approverUserIdRef: e.target.value })}
                    required
                    className="w-full p-1.5 bg-white border border-slate-200 rounded outline-none font-mono text-2xs"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowWaiverModal(false)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold cursor-pointer"
                >
                  Execute SoD Waiver
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ACQUISITION PROPOSAL */}
      {showAcquisitionModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-5 shadow-xl border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-slate-900">Propose New Resource Acquisition</h3>
              <button
                onClick={() => setShowAcquisitionModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAcquisitionSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-2xs font-bold text-slate-500 uppercase mb-1">Proposed Title</label>
                <input
                  type="text"
                  value={acquisitionForm.title}
                  onChange={e => setAcquisitionForm({ ...acquisitionForm, title: e.target.value })}
                  required
                  placeholder="e.g. Deep Learning with PyTorch"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                />
              </div>

              <div>
                <label className="block text-2xs font-bold text-slate-500 uppercase mb-1">Author(s)</label>
                <input
                  type="text"
                  value={acquisitionForm.authors}
                  onChange={e => setAcquisitionForm({ ...acquisitionForm, authors: e.target.value })}
                  required
                  placeholder="Eli Stevens, Luca Antiga"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-2xs font-bold text-slate-500 uppercase mb-1">Quantity</label>
                  <input
                    type="number"
                    value={acquisitionForm.quantityRequested}
                    onChange={e => setAcquisitionForm({ ...acquisitionForm, quantityRequested: Number(e.target.value) })}
                    min={1}
                    required
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="block text-2xs font-bold text-slate-500 uppercase mb-1">Estimated Cost (₹)</label>
                  <input
                    type="number"
                    value={acquisitionForm.estimatedTotalCost}
                    onChange={e => setAcquisitionForm({ ...acquisitionForm, estimatedTotalCost: Number(e.target.value) })}
                    required
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-2xs font-bold text-slate-500 uppercase mb-1">Academic Justification</label>
                <textarea
                  value={acquisitionForm.academicJustification}
                  onChange={e => setAcquisitionForm({ ...acquisitionForm, academicJustification: e.target.value })}
                  required
                  rows={2}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAcquisitionModal(false)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-semibold cursor-pointer"
                >
                  Submit Proposal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
