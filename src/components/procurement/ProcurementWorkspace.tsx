import React from 'react';
import { ProcurementProvider, useProcurementContext } from './ProcurementContext';
import { ProcurementCommandCenterTab } from './ProcurementCommandCenterTab';
import { VendorsTab } from './VendorsTab';
import { ProcurementRequestsTab } from './ProcurementRequestsTab';
import { PurchaseRequisitionsTab } from './PurchaseRequisitionsTab';
import { RFQsTab } from './RFQsTab';
import { QuotationsTab } from './QuotationsTab';
import { ComparativeStatementsTab } from './ComparativeStatementsTab';
import { PurchaseOrdersTab } from './PurchaseOrdersTab';
import { GoodsReceiptsTab } from './GoodsReceiptsTab';
import { QualityInspectionsTab } from './QualityInspectionsTab';
import { ProcurementReturnsTab } from './ProcurementReturnsTab';
import { ContractsTab } from './ContractsTab';
import { ExceptionsTab } from './ExceptionsTab';
import { VendorPerformanceTab } from './VendorPerformanceTab';
import { ProcurementAnalyticsTab } from './ProcurementAnalyticsTab';
import { ProcurementGovernanceTab } from './ProcurementGovernanceTab';
import { UserActor } from '../../services/procurementService';
import {
  ShoppingBag,
  LayoutDashboard,
  Users,
  ClipboardCheck,
  FileText,
  Send,
  BarChart3,
  Truck,
  ShieldCheck,
  RotateCcw,
  AlertTriangle,
  Building,
  Shield
} from 'lucide-react';

interface ProcurementWorkspaceProps {
  tenantId: string;
  currentUser: UserActor;
}

const ProcurementWorkspaceInner: React.FC = () => {
  const {
    campuses,
    selectedCampusId,
    setSelectedCampusId,
    activeTab,
    setActiveTab,
    isLoading
  } = useProcurementContext();

  const tabs = [
    { id: 'command_center', label: 'Command Center', icon: LayoutDashboard },
    { id: 'vendors', label: 'Vendor Directory', icon: Users },
    { id: 'requests', label: 'Requests', icon: ClipboardCheck },
    { id: 'requisitions', label: 'Requisitions', icon: FileText },
    { id: 'rfqs', label: 'RFQs', icon: Send },
    { id: 'quotations', label: 'Quotations', icon: FileText },
    { id: 'comparative', label: 'Comparative Statements', icon: BarChart3 },
    { id: 'purchase_orders', label: 'Purchase Orders', icon: ShoppingBag },
    { id: 'receipts', label: 'Goods Receipts', icon: Truck },
    { id: 'inspections', label: 'Quality Inspections', icon: ShieldCheck },
    { id: 'returns', label: 'Returns', icon: RotateCcw },
    { id: 'contracts', label: 'Contracts', icon: ShieldCheck },
    { id: 'exceptions', label: 'Exceptions', icon: AlertTriangle },
    { id: 'performance', label: 'Vendor Performance', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'governance', label: 'Governance', icon: Shield }
  ];

  return (
    <div className="space-y-6">
      {/* Top Controls: Campus Switcher & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-xs">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 leading-tight">
              Procurement, Vendor & Purchase Management
            </h1>
            <p className="text-xs text-slate-500">Phase 7.18 Enterprise Purchasing & Inventory Inward Engine</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {campuses.length > 0 && (
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-slate-400" />
              <select
                value={selectedCampusId}
                onChange={e => setSelectedCampusId(e.target.value)}
                className="px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold bg-white text-slate-700"
              >
                <option value="all">All Campuses</option>
                {campuses.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto gap-2 border-b border-slate-200 pb-2 scrollbar-none">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content Area */}
      <div>
        {activeTab === 'command_center' && <ProcurementCommandCenterTab />}
        {activeTab === 'vendors' && <VendorsTab />}
        {activeTab === 'requests' && <ProcurementRequestsTab />}
        {activeTab === 'requisitions' && <PurchaseRequisitionsTab />}
        {activeTab === 'rfqs' && <RFQsTab />}
        {activeTab === 'quotations' && <QuotationsTab />}
        {activeTab === 'comparative' && <ComparativeStatementsTab />}
        {activeTab === 'purchase_orders' && <PurchaseOrdersTab />}
        {activeTab === 'receipts' && <GoodsReceiptsTab />}
        {activeTab === 'inspections' && <QualityInspectionsTab />}
        {activeTab === 'returns' && <ProcurementReturnsTab />}
        {activeTab === 'contracts' && <ContractsTab />}
        {activeTab === 'exceptions' && <ExceptionsTab />}
        {activeTab === 'performance' && <VendorPerformanceTab />}
        {activeTab === 'analytics' && <ProcurementAnalyticsTab />}
        {activeTab === 'governance' && <ProcurementGovernanceTab />}
      </div>
    </div>
  );
};

export const ProcurementWorkspace: React.FC<ProcurementWorkspaceProps> = ({ tenantId, currentUser }) => {
  return (
    <ProcurementProvider tenantId={tenantId} currentUser={currentUser}>
      <ProcurementWorkspaceInner />
    </ProcurementProvider>
  );
};
