import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Building,
  Tag,
  MapPin,
  Users,
  ShoppingBag,
  BarChart3,
  Shield,
  FileText,
  Copy,
  Barcode,
  QrCode,
  Download,
  AlertTriangle,
  RefreshCw,
  Eye,
  Edit,
  GitBranch,
  Layers,
  BookMarked,
  CheckSquare,
  RotateCcw,
  DollarSign,
  Bookmark,
  PackageX,
  UserCheck
} from 'lucide-react';
import {
  LibraryProfile,
  LibraryResource,
  LibraryResourceCopy,
  LibraryResourceCategory,
  LibraryResourceLocation,
  LibraryMembership,
  LibraryAcquisition,
  LibraryAnalyticsCache,
  ResourceType,
  ResourceStatus,
  CopyStatus,
  CopyCondition,
  MembershipStatus,
  AcquisitionStatus,
  LocationType,
  MembershipType
} from '../../types/library';
import { LibraryService } from '../../services/libraryService';
import { AuditService } from '../../services/auditService';
import { AuditRecord } from '../../types';

import { IssueScanTab } from './circulation/IssueScanTab';
import { ReturnsTab } from './circulation/ReturnsTab';
import { RenewalsTab } from './circulation/RenewalsTab';
import { ReservationsTab } from './circulation/ReservationsTab';
import { OverdueTab } from './circulation/OverdueTab';
import { FinesTab } from './circulation/FinesTab';
import { LostDamagedTab } from './circulation/LostDamagedTab';
import { MemberCirculationHistoryTab } from './circulation/MemberCirculationHistoryTab';
import { PolicyGovernanceTab } from './circulation/PolicyGovernanceTab';
import { CirculationAnalyticsTab } from './circulation/CirculationAnalyticsTab';

interface LibraryWorkspaceProps {
  currentTenantId: string;
  currentUser: {
    id: string;
    email: string;
    displayName: string;
    role?: string;
  };
}

export const LibraryWorkspace: React.FC<LibraryWorkspaceProps> = ({
  currentTenantId,
  currentUser
}) => {
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'catalogue'
    | 'copies'
    | 'digital'
    | 'categories'
    | 'locations'
    | 'memberships'
    | 'acquisitions'
    | 'mappings'
    | 'analytics'
    | 'governance'
    | 'issue_scan'
    | 'returns'
    | 'renewals'
    | 'reservations'
    | 'overdue'
    | 'fines'
    | 'lost_damaged'
    | 'member_history'
    | 'policy_governance'
    | 'circulation_analytics'
  >('overview');

  // State
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [libraries, setLibraries] = useState<LibraryProfile[]>([]);
  const [selectedLibraryId, setSelectedLibraryId] = useState<string>('');

  const [resources, setResources] = useState<LibraryResource[]>([]);
  const [copies, setCopies] = useState<LibraryResourceCopy[]>([]);
  const [categories, setCategories] = useState<LibraryResourceCategory[]>([]);
  const [locations, setLocations] = useState<LibraryResourceLocation[]>([]);
  const [memberships, setMemberships] = useState<LibraryMembership[]>([]);
  const [acquisitions, setAcquisitions] = useState<LibraryAcquisition[]>([]);
  const [analyticsCache, setAnalyticsCache] = useState<LibraryAnalyticsCache | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditRecord[]>([]);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedResourceType, setSelectedResourceType] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');

  // Modal states
  const [showCreateLibModal, setShowCreateLibModal] = useState<boolean>(false);
  const [showCreateResourceModal, setShowCreateResourceModal] = useState<boolean>(false);
  const [showCreateCopyModal, setShowCreateCopyModal] = useState<boolean>(false);
  const [showCreateCategoryModal, setShowCreateCategoryModal] = useState<boolean>(false);
  const [showCreateLocationModal, setShowCreateLocationModal] = useState<boolean>(false);
  const [showCreateMembershipModal, setShowCreateMembershipModal] = useState<boolean>(false);
  const [showCreateAcquisitionModal, setShowCreateAcquisitionModal] = useState<boolean>(false);

  // New Entity Forms State
  const [newLibForm, setNewLibForm] = useState({
    name: '',
    code: '',
    description: '',
    libraryType: 'MAIN' as any,
    openingHours: '08:00 AM - 05:00 PM',
    policyVersion: 'v1.0'
  });

  const [newResourceForm, setNewResourceForm] = useState({
    title: '',
    subtitle: '',
    resourceType: 'BOOK' as ResourceType,
    authors: '',
    publisherName: '',
    publicationYear: new Date().getFullYear(),
    isbn: '',
    issn: '',
    doi: '',
    language: 'English',
    categoryId: '',
    digitalResourceReference: '',
    description: ''
  });

  const [newCopyForm, setNewCopyForm] = useState({
    resourceId: '',
    condition: 'GOOD' as CopyCondition,
    locationId: '',
    cost: 0,
    fundingSource: 'Institutional Budget'
  });

  const [newCategoryForm, setNewCategoryForm] = useState({
    name: '',
    code: '',
    description: ''
  });

  const [newLocationForm, setNewLocationForm] = useState({
    name: '',
    code: '',
    type: 'MAIN_LIBRARY' as LocationType,
    capacity: 50,
    description: ''
  });

  const [newMembershipForm, setNewMembershipForm] = useState({
    userId: '',
    studentId: '',
    membershipType: 'STUDENT' as MembershipType,
    startDate: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const [newAcquisitionForm, setNewAcquisitionForm] = useState({
    supplier: '',
    purchaseReference: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    quantity: 5,
    unitCost: 20,
    currency: 'USD',
    notes: ''
  });

  useEffect(() => {
    loadData();
  }, [currentTenantId]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const libs = await LibraryService.getLibraries(currentTenantId);
      setLibraries(libs);
      if (libs.length > 0 && !selectedLibraryId) {
        setSelectedLibraryId(libs[0].id);
      }

      const resList = await LibraryService.getResources(currentTenantId);
      setResources(resList);

      const copyList = await LibraryService.getCopies(currentTenantId);
      setCopies(copyList);

      const catList = await LibraryService.getCategories(currentTenantId);
      setCategories(catList);

      const locList = await LibraryService.getLocations(currentTenantId);
      setLocations(locList);

      const memList = await LibraryService.getMemberships(currentTenantId);
      setMemberships(memList);

      const acqList = await LibraryService.getAcquisitions(currentTenantId);
      setAcquisitions(acqList);

      const cache = await LibraryService.getAnalyticsCache(currentTenantId);
      setAnalyticsCache(cache);

      const logs = await AuditService.queryAuditLogs(currentTenantId, { limit: 50 });
      const libLogs = logs.filter(l => l.action.startsWith('LIBRARY_') || l.action.startsWith('RESOURCE_') || l.action.startsWith('COPY_') || l.action.startsWith('MEMBERSHIP_'));
      setAuditLogs(libLogs);

    } catch (err: any) {
      console.error('Error loading library data:', err);
      setError('Failed to load library foundation records. ' + (err.message || ''));
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  // Handlers for Entity Creation
  const handleCreateLibrary = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await LibraryService.createLibrary(
        {
          tenantId: currentTenantId,
          campusId: 'campus_main',
          name: newLibForm.name,
          code: newLibForm.code.toUpperCase(),
          description: newLibForm.description,
          status: 'ACTIVE',
          libraryType: newLibForm.libraryType,
          openingHours: newLibForm.openingHours,
          policyVersion: newLibForm.policyVersion,
          createdBy: currentUser.id
        },
        currentUser
      );
      setLibraries([...libraries, created]);
      setSelectedLibraryId(created.id);
      setShowCreateLibModal(false);
      setNewLibForm({ name: '', code: '', description: '', libraryType: 'MAIN', openingHours: '08:00 AM - 05:00 PM', policyVersion: 'v1.0' });
      showToast(`Library profile '${created.name}' created successfully.`);
    } catch (err: any) {
      setError(err.message || 'Failed to create library');
    }
  };

  const handleCreateResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLibraryId) {
      setError('Please create or select a library profile first.');
      return;
    }
    try {
      const authorList = newResourceForm.authors.split(',').map(a => a.trim()).filter(Boolean);
      const created = await LibraryService.createResource(
        {
          tenantId: currentTenantId,
          campusId: 'campus_main',
          libraryId: selectedLibraryId,
          title: newResourceForm.title,
          subtitle: newResourceForm.subtitle,
          resourceType: newResourceForm.resourceType,
          authors: authorList,
          publisherName: newResourceForm.publisherName,
          publicationYear: Number(newResourceForm.publicationYear),
          isbn: newResourceForm.isbn,
          issn: newResourceForm.issn,
          doi: newResourceForm.doi,
          language: newResourceForm.language,
          categoryId: newResourceForm.categoryId,
          digitalResourceReference: newResourceForm.digitalResourceReference,
          description: newResourceForm.description,
          status: 'DRAFT',
          subjectIds: [],
          curriculumIds: [],
          createdBy: currentUser.id
        },
        currentUser
      );
      setResources([created, ...resources]);
      setShowCreateResourceModal(false);
      setNewResourceForm({
        title: '',
        subtitle: '',
        resourceType: 'BOOK',
        authors: '',
        publisherName: '',
        publicationYear: new Date().getFullYear(),
        isbn: '',
        issn: '',
        doi: '',
        language: 'English',
        categoryId: '',
        digitalResourceReference: '',
        description: ''
      });
      showToast(`Catalogue resource '${created.title}' added in DRAFT state.`);
    } catch (err: any) {
      setError(err.message || 'Failed to create resource');
    }
  };

  const handleCreateCopy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCopyForm.resourceId) {
      setError('Please select a resource for the physical copy.');
      return;
    }
    try {
      const res = resources.find(r => r.id === newCopyForm.resourceId);
      const created = await LibraryService.createCopy(
        {
          tenantId: currentTenantId,
          campusId: 'campus_main',
          libraryId: selectedLibraryId || (res ? res.libraryId : 'lib_main'),
          resourceId: newCopyForm.resourceId,
          copyStatus: 'AVAILABLE',
          condition: newCopyForm.condition,
          locationId: newCopyForm.locationId,
          cost: Number(newCopyForm.cost),
          fundingSource: newCopyForm.fundingSource,
          createdBy: currentUser.id
        },
        currentUser
      );
      setCopies([created, ...copies]);
      setShowCreateCopyModal(false);
      setNewCopyForm({ resourceId: '', condition: 'GOOD', locationId: '', cost: 0, fundingSource: 'Institutional Budget' });
      showToast(`Physical copy registered with Accession No: ${created.accessionNumber} & Barcode: ${created.barcode}.`);
      loadData(); // refresh counts
    } catch (err: any) {
      setError(err.message || 'Failed to register physical copy');
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await LibraryService.createCategory(
        {
          tenantId: currentTenantId,
          libraryId: selectedLibraryId,
          name: newCategoryForm.name,
          code: newCategoryForm.code.toUpperCase(),
          description: newCategoryForm.description,
          status: 'ACTIVE'
        },
        currentUser
      );
      setCategories([...categories, created]);
      setShowCreateCategoryModal(false);
      setNewCategoryForm({ name: '', code: '', description: '' });
      showToast(`Category '${created.name}' created.`);
    } catch (err: any) {
      setError(err.message || 'Failed to create category');
    }
  };

  const handleCreateLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLibraryId) {
      setError('Select a library profile first.');
      return;
    }
    try {
      const created = await LibraryService.createLocation(
        {
          tenantId: currentTenantId,
          campusId: 'campus_main',
          libraryId: selectedLibraryId,
          name: newLocationForm.name,
          code: newLocationForm.code.toUpperCase(),
          type: newLocationForm.type,
          capacity: Number(newLocationForm.capacity),
          description: newLocationForm.description,
          status: 'ACTIVE'
        },
        currentUser
      );
      setLocations([...locations, created]);
      setShowCreateLocationModal(false);
      setNewLocationForm({ name: '', code: '', type: 'MAIN_LIBRARY', capacity: 50, description: '' });
      showToast(`Location / Shelving section '${created.name}' created.`);
    } catch (err: any) {
      setError(err.message || 'Failed to create location');
    }
  };

  const handleCreateMembership = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLibraryId) {
      setError('Select a library profile first.');
      return;
    }
    try {
      const created = await LibraryService.createMembership(
        {
          tenantId: currentTenantId,
          campusId: 'campus_main',
          libraryId: selectedLibraryId,
          userId: newMembershipForm.userId || `user_${Date.now().toString().slice(-4)}`,
          studentId: newMembershipForm.studentId || undefined,
          membershipType: newMembershipForm.membershipType,
          status: 'ACTIVE',
          startDate: newMembershipForm.startDate,
          policyVersion: 'v1.0',
          eligibilityStatus: 'ELIGIBLE',
          notes: newMembershipForm.notes,
          createdBy: currentUser.id
        },
        currentUser
      );
      setMemberships([created, ...memberships]);
      setShowCreateMembershipModal(false);
      setNewMembershipForm({ userId: '', studentId: '', membershipType: 'STUDENT', startDate: new Date().toISOString().split('T')[0], notes: '' });
      showToast(`Library Membership issued with Card No: ${created.membershipNumber}.`);
    } catch (err: any) {
      setError(err.message || 'Failed to issue membership');
    }
  };

  const handleCreateAcquisition = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLibraryId) {
      setError('Select a library profile first.');
      return;
    }
    try {
      const qty = Number(newAcquisitionForm.quantity);
      const unitCost = Number(newAcquisitionForm.unitCost);
      const created = await LibraryService.createAcquisition(
        {
          tenantId: currentTenantId,
          campusId: 'campus_main',
          libraryId: selectedLibraryId,
          supplier: newAcquisitionForm.supplier,
          purchaseReference: newAcquisitionForm.purchaseReference || `PO-${Date.now().toString().slice(-6)}`,
          purchaseDate: newAcquisitionForm.purchaseDate,
          quantity: qty,
          unitCost: unitCost,
          totalCost: qty * unitCost,
          currency: newAcquisitionForm.currency,
          status: 'ORDERED',
          notes: newAcquisitionForm.notes,
          createdBy: currentUser.id
        },
        currentUser
      );
      setAcquisitions([created, ...acquisitions]);
      setShowCreateAcquisitionModal(false);
      setNewAcquisitionForm({ supplier: '', purchaseReference: '', purchaseDate: new Date().toISOString().split('T')[0], quantity: 5, unitCost: 20, currency: 'USD', notes: '' });
      showToast(`Acquisition purchase order '${created.purchaseReference}' created.`);
    } catch (err: any) {
      setError(err.message || 'Failed to create acquisition');
    }
  };

  const handleResourceStatusTransition = async (resourceId: string, targetStatus: ResourceStatus) => {
    try {
      const updated = await LibraryService.updateResourceStatus(
        resourceId,
        targetStatus,
        currentUser,
        currentTenantId,
        `Workflow state transition to ${targetStatus}`
      );
      setResources(resources.map(r => r.id === resourceId ? updated : r));
      showToast(`Resource '${updated.title}' updated to ${targetStatus}.`);
    } catch (err: any) {
      setError(err.message || 'Status transition failed');
    }
  };

  const handleExportData = async () => {
    try {
      const exportedData = await LibraryService.exportCatalogueData(currentTenantId);
      const blob = new Blob([JSON.stringify(exportedData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Library_Catalogue_Export_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      showToast('Catalogue export generated successfully.');
    } catch (err: any) {
      setError('Export failed: ' + err.message);
    }
  };

  // Filtered resources calculation
  const filteredResources = resources.filter(r => {
    if (selectedResourceType !== 'ALL' && r.resourceType !== selectedResourceType) return false;
    if (selectedStatusFilter !== 'ALL' && r.status !== selectedStatusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        r.title.toLowerCase().includes(q) ||
        r.isbn?.toLowerCase().includes(q) ||
        r.authors.some(a => a.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const digitalResources = resources.filter(r => r.digitalResourceReference || r.resourceType === 'EBOOK' || r.resourceType === 'DIGITAL_DOCUMENT');

  return (
    <div id="library-workspace-root" className="min-h-screen bg-slate-50 text-slate-900 p-6 space-y-6">
      
      {/* Header Bar */}
      <div id="library-header-bar" className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-blue-700 rounded-lg">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Library & Learning Resources</h1>
              <p className="text-sm text-slate-500">
                Phase 7.15A Foundation — Master Catalogue, Physical Copy Inventory & Accession Management
              </p>
            </div>
          </div>
        </div>

        {/* Profile Selector & Main Actions */}
        <div className="flex items-center gap-3">
          <select
            value={selectedLibraryId}
            onChange={(e) => setSelectedLibraryId(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 font-medium focus:ring-2 focus:ring-blue-500"
          >
            {libraries.length === 0 ? (
              <option value="">No Library Profiles Available</option>
            ) : (
              libraries.map(lib => (
                <option key={lib.id} value={lib.id}>
                  {lib.name} ({lib.code})
                </option>
              ))
            )}
          </select>

          <button
            onClick={() => setShowCreateLibModal(true)}
            className="inline-flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-sm font-medium transition"
          >
            <Plus className="w-4 h-4" />
            New Profile
          </button>

          <button
            onClick={() => setShowCreateResourceModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Catalogue Item
          </button>
        </div>
      </div>

      {/* Notifications / Feedback Messages */}
      {error && (
        <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-red-600 hover:text-red-800 font-bold">Dismiss</button>
        </div>
      )}

      {successMsg && (
        <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)} className="text-emerald-600 hover:text-emerald-800 font-bold">Dismiss</button>
        </div>
      )}

      {/* Workspace Navigation Tabs */}
      <div id="library-nav-tabs" className="space-y-2 border-b border-slate-200 pb-2">
        <div className="flex items-center gap-1 overflow-x-auto">
          <span className="text-xs font-bold uppercase text-slate-400 px-2 shrink-0">Foundation:</span>
          {[
            { id: 'overview', label: 'Overview', icon: Building },
            { id: 'catalogue', label: 'Catalogue', icon: BookOpen },
            { id: 'copies', label: 'Physical Copies', icon: Copy },
            { id: 'digital', label: 'Digital Resources', icon: FileText },
            { id: 'categories', label: 'Categories', icon: Layers },
            { id: 'locations', label: 'Locations', icon: MapPin },
            { id: 'memberships', label: 'Memberships', icon: Users },
            { id: 'acquisitions', label: 'Acquisitions', icon: ShoppingBag },
            { id: 'mappings', label: 'Curriculum & Subject', icon: BookMarked },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'governance', label: 'Audit & Export', icon: Shield }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1 overflow-x-auto">
          <span className="text-xs font-bold uppercase text-indigo-500 px-2 shrink-0">Circulation Desk:</span>
          {[
            { id: 'issue_scan', label: 'Issue & Scan', icon: Barcode },
            { id: 'returns', label: 'Return Check-In', icon: RotateCcw },
            { id: 'renewals', label: 'Loan Extensions', icon: RefreshCw },
            { id: 'reservations', label: 'Holds Queue', icon: Bookmark },
            { id: 'overdue', label: 'Overdue Register', icon: AlertTriangle },
            { id: 'fines', label: 'Fines & Waivers', icon: DollarSign },
            { id: 'lost_damaged', label: 'Lost & Damaged', icon: PackageX },
            { id: 'member_history', label: 'Member Ledger', icon: UserCheck },
            { id: 'policy_governance', label: 'Policy Versions', icon: Shield },
            { id: 'circulation_analytics', label: 'Circulation Analytics', icon: BarChart3 }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-indigo-50 text-indigo-800 hover:bg-indigo-100 border border-indigo-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Top KPI Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">Catalogue Resources</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{resources.length}</p>
                <p className="text-xs text-slate-500 mt-1">{resources.filter(r => r.status === 'ACTIVE').length} Active for circulation</p>
              </div>
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                <BookOpen className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">Physical Copies</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{copies.length}</p>
                <p className="text-xs text-emerald-600 mt-1 font-medium">{copies.filter(c => c.copyStatus === 'AVAILABLE').length} Available on shelf</p>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                <Copy className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">Digital Assets</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{digitalResources.length}</p>
                <p className="text-xs text-slate-500 mt-1">Document Registry artifacts</p>
              </div>
              <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                <FileText className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">Active Memberships</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{memberships.filter(m => m.status === 'ACTIVE').length}</p>
                <p className="text-xs text-slate-500 mt-1">Students & Staff</p>
              </div>
              <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
                <Users className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Active Library Profile Card & Recent Additions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b pb-4">
                <h2 className="text-lg font-bold text-slate-900">Active Library Facility Profile</h2>
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold">ACTIVE</span>
              </div>

              {libraries.find(l => l.id === selectedLibraryId) ? (
                (() => {
                  const currentLib = libraries.find(l => l.id === selectedLibraryId)!;
                  return (
                    <div className="space-y-4 text-sm">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-slate-500 uppercase font-medium">Facility Name</p>
                          <p className="font-semibold text-slate-800">{currentLib.name}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 uppercase font-medium">Facility Code</p>
                          <p className="font-semibold text-slate-800">{currentLib.code}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 uppercase font-medium">Type</p>
                          <p className="font-semibold text-slate-800">{currentLib.libraryType}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 uppercase font-medium">Opening Hours</p>
                          <p className="font-semibold text-slate-800">{currentLib.openingHours || 'Standard Hours'}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase font-medium">Policy Version</p>
                        <p className="text-slate-700">{currentLib.policyVersion}</p>
                      </div>
                    </div>
                  );
                })()
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <p>No library profiles configured.</p>
                  <button
                    onClick={() => setShowCreateLibModal(true)}
                    className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold"
                  >
                    Create First Profile
                  </button>
                </div>
              )}
            </div>

            {/* Quick Actions Panel */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-slate-900">Quick Actions</h2>
              <div className="space-y-2">
                <button
                  onClick={() => setShowCreateResourceModal(true)}
                  className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-lg text-sm font-medium text-slate-800 border transition"
                >
                  <span className="flex items-center gap-2">
                    <Plus className="w-4 h-4 text-blue-600" />
                    New Catalogue Record
                  </span>
                  <BookOpen className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  onClick={() => setShowCreateCopyModal(true)}
                  className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-lg text-sm font-medium text-slate-800 border transition"
                >
                  <span className="flex items-center gap-2">
                    <Barcode className="w-4 h-4 text-emerald-600" />
                    Register Copy & Barcode
                  </span>
                  <Copy className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  onClick={() => setShowCreateMembershipModal(true)}
                  className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-lg text-sm font-medium text-slate-800 border transition"
                >
                  <span className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-amber-600" />
                    Issue Library Membership
                  </span>
                  <CheckSquare className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  onClick={handleExportData}
                  className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-lg text-sm font-medium text-slate-800 border transition"
                >
                  <span className="flex items-center gap-2">
                    <Download className="w-4 h-4 text-purple-600" />
                    Export Catalogue JSON
                  </span>
                  <FileText className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MASTER CATALOGUE */}
      {activeTab === 'catalogue' && (
        <div className="space-y-4">
          {/* Search & Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search title, ISBN, author..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <select
                value={selectedResourceType}
                onChange={(e) => setSelectedResourceType(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800"
              >
                <option value="ALL">All Types</option>
                <option value="BOOK">Book</option>
                <option value="TEXTBOOK">Textbook</option>
                <option value="REFERENCE_BOOK">Reference Book</option>
                <option value="JOURNAL">Journal</option>
                <option value="EBOOK">E-Book</option>
              </select>

              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800"
              >
                <option value="ALL">All Statuses</option>
                <option value="DRAFT">Draft</option>
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="APPROVED">Approved</option>
                <option value="ACTIVE">Active</option>
                <option value="WITHDRAWN">Withdrawn</option>
              </select>
            </div>

            <button
              onClick={() => setShowCreateResourceModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition"
            >
              <Plus className="w-4 h-4" />
              Add Catalogue Item
            </button>
          </div>

          {/* Resources Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-semibold text-slate-500">
                <tr>
                  <th className="p-4">Title & Description</th>
                  <th className="p-4">Resource Type</th>
                  <th className="p-4">Authors / Publisher</th>
                  <th className="p-4">Identifiers (ISBN)</th>
                  <th className="p-4">Copies (Avail/Total)</th>
                  <th className="p-4">Status & Ver.</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredResources.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-slate-500">
                      No matching catalogue records found.
                    </td>
                  </tr>
                ) : (
                  filteredResources.map((res) => (
                    <tr key={res.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-4">
                        <p className="font-semibold text-slate-900">{res.title}</p>
                        {res.subtitle && <p className="text-xs text-slate-500">{res.subtitle}</p>}
                        <p className="text-xs text-slate-400 mt-0.5">ID: {res.id}</p>
                      </td>

                      <td className="p-4">
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded-md text-xs font-semibold">
                          {res.resourceType}
                        </span>
                      </td>

                      <td className="p-4">
                        <p className="text-slate-800 font-medium">{res.authors?.join(', ') || 'Unknown Author'}</p>
                        {res.publisherName && <p className="text-xs text-slate-500">{res.publisherName} ({res.publicationYear || 'N/A'})</p>}
                      </td>

                      <td className="p-4">
                        <p className="font-mono text-xs text-slate-800">{res.isbn || res.issn || 'N/A'}</p>
                      </td>

                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                          res.availableCopies > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {res.availableCopies} / {res.totalCopies} Available
                        </span>
                      </td>

                      <td className="p-4">
                        <div className="flex flex-col gap-1">
                          <span className={`inline-block px-2 py-0.5 text-xs font-semibold rounded ${
                            res.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' :
                            res.status === 'APPROVED' ? 'bg-blue-100 text-blue-800' :
                            res.status === 'UNDER_REVIEW' ? 'bg-amber-100 text-amber-800' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {res.status}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">v{res.version}</span>
                        </div>
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {res.status === 'DRAFT' && (
                            <button
                              onClick={() => handleResourceStatusTransition(res.id, 'UNDER_REVIEW')}
                              className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-medium rounded transition"
                            >
                              Submit Review
                            </button>
                          )}
                          {res.status === 'UNDER_REVIEW' && (
                            <button
                              onClick={() => handleResourceStatusTransition(res.id, 'APPROVED')}
                              className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium rounded transition"
                            >
                              Approve
                            </button>
                          )}
                          {res.status === 'APPROVED' && (
                            <button
                              onClick={() => handleResourceStatusTransition(res.id, 'ACTIVE')}
                              className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-medium rounded transition"
                            >
                              Publish
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PHYSICAL COPIES & BARCODES */}
      {activeTab === 'copies' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200">
            <div>
              <h3 className="font-bold text-slate-900">Physical Copy Inventory & Barcode Registry</h3>
              <p className="text-xs text-slate-500">Deterministic accession numbers, barcode IDs, shelving location, and condition tags</p>
            </div>
            <button
              onClick={() => setShowCreateCopyModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition"
            >
              <Barcode className="w-4 h-4" />
              Register Copy
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-semibold text-slate-500">
                <tr>
                  <th className="p-4">Accession Number</th>
                  <th className="p-4">Barcode / QR</th>
                  <th className="p-4">Parent Resource</th>
                  <th className="p-4">Condition</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Registered Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {copies.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-slate-500">
                      No physical copy inventory registered.
                    </td>
                  </tr>
                ) : (
                  copies.map((copy) => {
                    const parent = resources.find(r => r.id === copy.resourceId);
                    return (
                      <tr key={copy.id} className="hover:bg-slate-50/80 transition">
                        <td className="p-4 font-mono font-bold text-blue-700">{copy.accessionNumber}</td>
                        <td className="p-4">
                          <div className="flex flex-col font-mono text-xs text-slate-800">
                            <span>{copy.barcode}</span>
                            <span className="text-[10px] text-slate-400">{copy.qrCode}</span>
                          </div>
                        </td>
                        <td className="p-4 font-medium text-slate-900">{parent?.title || copy.resourceId}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                            copy.condition === 'NEW' || copy.condition === 'GOOD' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                          }`}>
                            {copy.condition}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            copy.copyStatus === 'AVAILABLE' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {copy.copyStatus}
                          </span>
                        </td>
                        <td className="p-4 text-xs text-slate-500">{new Date(copy.createdAt).toLocaleDateString()}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: DIGITAL RESOURCES */}
      {activeTab === 'digital' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <h3 className="font-bold text-slate-900">Digital Document & E-Resource Registry</h3>
            <p className="text-xs text-slate-500">Document Registry secure references for E-Books, PDF materials, and research digital files</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {digitalResources.length === 0 ? (
              <div className="col-span-full text-center py-12 bg-white rounded-xl border text-slate-500">
                No digital materials registered yet.
              </div>
            ) : (
              digitalResources.map(res => (
                <div key={res.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-xs font-semibold rounded">{res.resourceType}</span>
                    <span className="text-xs text-slate-400">v{res.version}</span>
                  </div>
                  <h4 className="font-bold text-slate-900">{res.title}</h4>
                  <p className="text-xs text-slate-500">{res.authors?.join(', ')}</p>
                  <p className="text-xs font-mono text-slate-400 truncate">Ref: {res.digitalResourceReference || 'DOC-REG-DEFAULT-REF'}</p>
                  <div className="pt-2 border-t flex justify-end">
                    <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded text-xs font-semibold transition">
                      <Eye className="w-3.5 h-3.5" />
                      View Digital Artifact
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 5: CATEGORIES */}
      {activeTab === 'categories' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200">
            <div>
              <h3 className="font-bold text-slate-900">Catalogue Category Hierarchy</h3>
              <p className="text-xs text-slate-500">Dewey / Custom classification category structure</p>
            </div>
            <button
              onClick={() => setShowCreateCategoryModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition"
            >
              <Plus className="w-4 h-4" />
              New Category
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.length === 0 ? (
              <div className="col-span-full text-center py-12 bg-white rounded-xl border text-slate-500">
                No categories created yet.
              </div>
            ) : (
              categories.map(cat => (
                <div key={cat.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-blue-600">{cat.code}</span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">{cat.status}</span>
                  </div>
                  <h4 className="font-bold text-slate-900">{cat.name}</h4>
                  <p className="text-xs text-slate-500">{cat.description || 'No description provided'}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 6: LOCATIONS */}
      {activeTab === 'locations' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200">
            <div>
              <h3 className="font-bold text-slate-900">Shelving & Storage Locations</h3>
              <p className="text-xs text-slate-500">Physical library sections, stacks, and shelf location codes</p>
            </div>
            <button
              onClick={() => setShowCreateLocationModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition"
            >
              <Plus className="w-4 h-4" />
              New Location
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {locations.length === 0 ? (
              <div className="col-span-full text-center py-12 bg-white rounded-xl border text-slate-500">
                No location sections created yet.
              </div>
            ) : (
              locations.map(loc => (
                <div key={loc.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-blue-600">{loc.code}</span>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-800 text-xs font-medium rounded">{loc.type}</span>
                  </div>
                  <h4 className="font-bold text-slate-900">{loc.name}</h4>
                  <p className="text-xs text-slate-500">Capacity: {loc.capacity || 'N/A'} items</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 7: MEMBERSHIPS */}
      {activeTab === 'memberships' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200">
            <div>
              <h3 className="font-bold text-slate-900">Library Memberships & Eligibility</h3>
              <p className="text-xs text-slate-500">Student and staff library borrowing profiles and eligibility records</p>
            </div>
            <button
              onClick={() => setShowCreateMembershipModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition"
            >
              <Plus className="w-4 h-4" />
              Issue Membership
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-semibold text-slate-500">
                <tr>
                  <th className="p-4">Membership Number</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">User ID</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Eligibility</th>
                  <th className="p-4">Start Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {memberships.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-slate-500">
                      No library memberships registered.
                    </td>
                  </tr>
                ) : (
                  memberships.map((mem) => (
                    <tr key={mem.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-4 font-mono font-bold text-blue-700">{mem.membershipNumber}</td>
                      <td className="p-4 font-medium text-slate-800">{mem.membershipType}</td>
                      <td className="p-4 font-mono text-xs text-slate-700">{mem.userId}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold">
                          {mem.status}
                        </span>
                      </td>
                      <td className="p-4 font-semibold text-emerald-600 text-xs">{mem.eligibilityStatus}</td>
                      <td className="p-4 text-xs text-slate-500">{mem.startDate}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 8: ACQUISITIONS */}
      {activeTab === 'acquisitions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200">
            <div>
              <h3 className="font-bold text-slate-900">Procurement & Acquisitions</h3>
              <p className="text-xs text-slate-500">Purchase orders for physical library resources and suppliers</p>
            </div>
            <button
              onClick={() => setShowCreateAcquisitionModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition"
            >
              <Plus className="w-4 h-4" />
              New Order
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-semibold text-slate-500">
                <tr>
                  <th className="p-4">Purchase Ref</th>
                  <th className="p-4">Supplier</th>
                  <th className="p-4">Quantity</th>
                  <th className="p-4">Total Cost</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {acquisitions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-slate-500">
                      No acquisitions orders recorded.
                    </td>
                  </tr>
                ) : (
                  acquisitions.map((acq) => (
                    <tr key={acq.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-4 font-mono font-bold text-blue-700">{acq.purchaseReference}</td>
                      <td className="p-4 font-medium text-slate-900">{acq.supplier}</td>
                      <td className="p-4">{acq.quantity} items</td>
                      <td className="p-4 font-bold text-slate-900">{acq.currency} {acq.totalCost}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                          {acq.status}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-slate-500">{acq.purchaseDate}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 9: CURRICULUM & SUBJECT MAPPING */}
      {activeTab === 'mappings' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2">
            <h3 className="font-bold text-slate-900">Curriculum & Authoritative Subject Mappings</h3>
            <p className="text-xs text-slate-500">Reference mappings anchoring catalogue materials directly to academic subjects, curriculum units, and learning outcomes without duplicating core academic structures.</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 text-center text-slate-600">
            <BookMarked className="w-10 h-10 text-blue-500 mx-auto mb-2" />
            <p className="font-medium text-slate-800">Resource Mappings Active</p>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              Resources reference authoritative Subject IDs (`subjectIds`) and Curriculum IDs (`curriculumIds`) safely by string reference.
            </p>
          </div>
        </div>
      )}

      {/* TAB 10: ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900">Library Foundation Metrics & Analytics</h3>
              <button
                onClick={async () => {
                  setLoading(true);
                  const newCache = await LibraryService.rebuildAnalyticsCache(currentTenantId);
                  setAnalyticsCache(newCache);
                  setLoading(false);
                  showToast('Analytics cache rebuilt.');
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-xs font-semibold transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Rebuild Cache
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 rounded-lg border">
                <p className="text-xs text-slate-500 uppercase font-semibold">Total Resources</p>
                <p className="text-2xl font-extrabold text-blue-600 mt-1">{analyticsCache?.totalResources || resources.length}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg border">
                <p className="text-xs text-slate-500 uppercase font-semibold">Physical Copies</p>
                <p className="text-2xl font-extrabold text-emerald-600 mt-1">{analyticsCache?.totalPhysicalCopies || copies.length}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg border">
                <p className="text-xs text-slate-500 uppercase font-semibold">Digital Resources</p>
                <p className="text-2xl font-extrabold text-purple-600 mt-1">{analyticsCache?.totalDigitalResources || digitalResources.length}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 11: GOVERNANCE & AUDIT */}
      {activeTab === 'governance' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200">
            <div>
              <h3 className="font-bold text-slate-900">Library Governance & Audit Log</h3>
              <p className="text-xs text-slate-500">Immutable record of resource approvals, copy status changes, and profile edits</p>
            </div>
            <button
              onClick={handleExportData}
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-semibold transition"
            >
              <Download className="w-4 h-4" />
              Export Audit & Catalogue
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-semibold text-slate-500">
                <tr>
                  <th className="p-4">Action</th>
                  <th className="p-4">Actor</th>
                  <th className="p-4">Resource ID</th>
                  <th className="p-4">Result</th>
                  <th className="p-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {auditLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-slate-500">
                      No library audit logs found.
                    </td>
                  </tr>
                ) : (
                  auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-4 font-mono font-bold text-slate-800 text-xs">{log.action}</td>
                      <td className="p-4 text-xs text-slate-700">{log.userDisplayName || log.userEmail}</td>
                      <td className="p-4 font-mono text-xs text-slate-500">{log.resourceId}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-bold">
                          {log.result}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-slate-500">{new Date(log.timestamp).toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PHASE 7.15B CIRCULATION DESK TABS */}
      {activeTab === 'issue_scan' && (
        <IssueScanTab
          currentTenantId={currentTenantId}
          currentUser={currentUser}
          onSuccess={showToast}
          onError={setError}
        />
      )}

      {activeTab === 'returns' && (
        <ReturnsTab
          currentTenantId={currentTenantId}
          currentUser={currentUser}
          onSuccess={showToast}
          onError={setError}
        />
      )}

      {activeTab === 'renewals' && (
        <RenewalsTab
          currentTenantId={currentTenantId}
          currentUser={currentUser}
          onSuccess={showToast}
          onError={setError}
        />
      )}

      {activeTab === 'reservations' && (
        <ReservationsTab
          currentTenantId={currentTenantId}
          currentUser={currentUser}
          onSuccess={showToast}
          onError={setError}
        />
      )}

      {activeTab === 'overdue' && (
        <OverdueTab
          currentTenantId={currentTenantId}
          currentUser={currentUser}
          onSuccess={showToast}
          onError={setError}
        />
      )}

      {activeTab === 'fines' && (
        <FinesTab
          currentTenantId={currentTenantId}
          currentUser={currentUser}
          onSuccess={showToast}
          onError={setError}
        />
      )}

      {activeTab === 'lost_damaged' && (
        <LostDamagedTab
          currentTenantId={currentTenantId}
          currentUser={currentUser}
          onSuccess={showToast}
          onError={setError}
        />
      )}

      {activeTab === 'member_history' && (
        <MemberCirculationHistoryTab
          currentTenantId={currentTenantId}
          currentUser={currentUser}
          onSuccess={showToast}
          onError={setError}
        />
      )}

      {activeTab === 'policy_governance' && (
        <PolicyGovernanceTab
          currentTenantId={currentTenantId}
          currentUser={currentUser}
          onSuccess={showToast}
          onError={setError}
        />
      )}

      {activeTab === 'circulation_analytics' && (
        <CirculationAnalyticsTab
          currentTenantId={currentTenantId}
          currentUser={currentUser}
          onSuccess={showToast}
          onError={setError}
        />
      )}

      {/* CREATE LIBRARY PROFILE MODAL */}
      {showCreateLibModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900">Create Library Facility Profile</h3>
              <button onClick={() => setShowCreateLibModal(false)} className="text-slate-400 hover:text-slate-600"><XCircle className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreateLibrary} className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Facility Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Central Campus Library"
                  value={newLibForm.name}
                  onChange={(e) => setNewLibForm({ ...newLibForm, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Facility Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. LIB-MAIN"
                  value={newLibForm.code}
                  onChange={(e) => setNewLibForm({ ...newLibForm, code: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg font-mono uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Type</label>
                <select
                  value={newLibForm.libraryType}
                  onChange={(e) => setNewLibForm({ ...newLibForm, libraryType: e.target.value as any })}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="MAIN">Main Library</option>
                  <option value="BRANCH">Branch Library</option>
                  <option value="DEPARTMENTAL">Departmental Library</option>
                  <option value="DIGITAL">Digital Repository</option>
                  <option value="REFERENCE">Reference Section</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Opening Hours</label>
                <input
                  type="text"
                  value={newLibForm.openingHours}
                  onChange={(e) => setNewLibForm({ ...newLibForm, openingHours: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button type="button" onClick={() => setShowCreateLibModal(false)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold">Create Profile</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE CATALOGUE RESOURCE MODAL */}
      {showCreateResourceModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900">Add Catalogue Record</h3>
              <button onClick={() => setShowCreateResourceModal(false)} className="text-slate-400 hover:text-slate-600"><XCircle className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreateResource} className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Resource Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Advanced Organic Chemistry"
                  value={newResourceForm.title}
                  onChange={(e) => setNewResourceForm({ ...newResourceForm, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Resource Type</label>
                  <select
                    value={newResourceForm.resourceType}
                    onChange={(e) => setNewResourceForm({ ...newResourceForm, resourceType: e.target.value as ResourceType })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="BOOK">Book</option>
                    <option value="TEXTBOOK">Textbook</option>
                    <option value="REFERENCE_BOOK">Reference Book</option>
                    <option value="JOURNAL">Journal</option>
                    <option value="EBOOK">E-Book</option>
                    <option value="DIGITAL_DOCUMENT">Digital Document</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Language</label>
                  <input
                    type="text"
                    value={newResourceForm.language}
                    onChange={(e) => setNewResourceForm({ ...newResourceForm, language: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Authors (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. John Smith, Prof. Jane Doe"
                  value={newResourceForm.authors}
                  onChange={(e) => setNewResourceForm({ ...newResourceForm, authors: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Publisher</label>
                  <input
                    type="text"
                    placeholder="e.g. Oxford Press"
                    value={newResourceForm.publisherName}
                    onChange={(e) => setNewResourceForm({ ...newResourceForm, publisherName: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Publication Year</label>
                  <input
                    type="number"
                    value={newResourceForm.publicationYear}
                    onChange={(e) => setNewResourceForm({ ...newResourceForm, publicationYear: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">ISBN</label>
                  <input
                    type="text"
                    placeholder="e.g. 978-3-16-148410-0"
                    value={newResourceForm.isbn}
                    onChange={(e) => setNewResourceForm({ ...newResourceForm, isbn: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Digital Doc Ref</label>
                  <input
                    type="text"
                    placeholder="e.g. DOC-REF-1002"
                    value={newResourceForm.digitalResourceReference}
                    onChange={(e) => setNewResourceForm({ ...newResourceForm, digitalResourceReference: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg font-mono text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button type="button" onClick={() => setShowCreateResourceModal(false)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold">Save Draft Item</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE PHYSICAL COPY MODAL */}
      {showCreateCopyModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900">Register Physical Copy & Barcode</h3>
              <button onClick={() => setShowCreateCopyModal(false)} className="text-slate-400 hover:text-slate-600"><XCircle className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreateCopy} className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Catalogue Resource *</label>
                <select
                  required
                  value={newCopyForm.resourceId}
                  onChange={(e) => setNewCopyForm({ ...newCopyForm, resourceId: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="">Select Resource...</option>
                  {resources.map(r => (
                    <option key={r.id} value={r.id}>{r.title} ({r.resourceType})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Initial Condition</label>
                <select
                  value={newCopyForm.condition}
                  onChange={(e) => setNewCopyForm({ ...newCopyForm, condition: e.target.value as CopyCondition })}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="NEW">New</option>
                  <option value="GOOD">Good</option>
                  <option value="FAIR">Fair</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Shelving Location</label>
                <select
                  value={newCopyForm.locationId}
                  onChange={(e) => setNewCopyForm({ ...newCopyForm, locationId: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="">Select Shelving Section...</option>
                  {locations.map(l => (
                    <option key={l.id} value={l.id}>{l.name} ({l.code})</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button type="button" onClick={() => setShowCreateCopyModal(false)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold">Register Copy</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE CATEGORY MODAL */}
      {showCreateCategoryModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900">Add Catalogue Category</h3>
              <button onClick={() => setShowCreateCategoryModal(false)} className="text-slate-400 hover:text-slate-600"><XCircle className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreateCategory} className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Computer Science & AI"
                  value={newCategoryForm.name}
                  onChange={(e) => setNewCategoryForm({ ...newCategoryForm, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Classification Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 004.0"
                  value={newCategoryForm.code}
                  onChange={(e) => setNewCategoryForm({ ...newCategoryForm, code: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg font-mono uppercase"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button type="button" onClick={() => setShowCreateCategoryModal(false)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold">Save Category</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE LOCATION MODAL */}
      {showCreateLocationModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900">Add Shelving Location</h3>
              <button onClick={() => setShowCreateLocationModal(false)} className="text-slate-400 hover:text-slate-600"><XCircle className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreateLocation} className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Location Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Science Stacks - Shelf B"
                  value={newLocationForm.name}
                  onChange={(e) => setNewLocationForm({ ...newLocationForm, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Location Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. LOC-SCI-B"
                  value={newLocationForm.code}
                  onChange={(e) => setNewLocationForm({ ...newLocationForm, code: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg font-mono uppercase"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button type="button" onClick={() => setShowCreateLocationModal(false)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold">Save Location</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE MEMBERSHIP MODAL */}
      {showCreateMembershipModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900">Issue Library Membership</h3>
              <button onClick={() => setShowCreateMembershipModal(false)} className="text-slate-400 hover:text-slate-600"><XCircle className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreateMembership} className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Membership Type</label>
                <select
                  value={newMembershipForm.membershipType}
                  onChange={(e) => setNewMembershipForm({ ...newMembershipForm, membershipType: e.target.value as MembershipType })}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="STUDENT">Student</option>
                  <option value="TEACHER">Teacher</option>
                  <option value="STAFF">Staff</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">User Identifier</label>
                <input
                  type="text"
                  placeholder="e.g. user_student_01"
                  value={newMembershipForm.userId}
                  onChange={(e) => setNewMembershipForm({ ...newMembershipForm, userId: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg font-mono text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button type="button" onClick={() => setShowCreateMembershipModal(false)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold">Issue Card</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE ACQUISITION MODAL */}
      {showCreateAcquisitionModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900">Create Acquisition Order</h3>
              <button onClick={() => setShowCreateAcquisitionModal(false)} className="text-slate-400 hover:text-slate-600"><XCircle className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreateAcquisition} className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Supplier Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Educational Books Distributors"
                  value={newAcquisitionForm.supplier}
                  onChange={(e) => setNewAcquisitionForm({ ...newAcquisitionForm, supplier: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={newAcquisitionForm.quantity}
                    onChange={(e) => setNewAcquisitionForm({ ...newAcquisitionForm, quantity: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Unit Cost</label>
                  <input
                    type="number"
                    min="0"
                    value={newAcquisitionForm.unitCost}
                    onChange={(e) => setNewAcquisitionForm({ ...newAcquisitionForm, unitCost: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button type="button" onClick={() => setShowCreateAcquisitionModal(false)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold">Create Order</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
