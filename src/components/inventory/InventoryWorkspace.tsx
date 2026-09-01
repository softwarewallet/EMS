import React, { useState, useEffect } from 'react';
import { Badge } from '../common/Badge';
import { useAuth } from '../../context/AuthContext';
import { InventoryService } from '../../services/inventoryService';
import { BookLoader } from '../common/BookLoader';
import { 
  Package, Box, MapPin, ClipboardList, ArrowLeftRight, 
  Settings, Tags, CheckCircle2, TrendingUp, AlertTriangle, MonitorSmartphone
} from 'lucide-react';

type TabType = 
  | 'dashboard' 
  | 'catalogue' 
  | 'stores' 
  | 'stock' 
  | 'receipts' 
  | 'issues' 
  | 'transfers' 
  | 'adjustments' 
  | 'assets' 
  | 'assignments' 
  | 'audits' 
  | 'maintenance' 
  | 'disposal' 
  | 'reports' 
  | 'settings';

export const InventoryWorkspace: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Stats / state placeholders
  const [totalItems, setTotalItems] = useState(0);
  const [totalStores, setTotalStores] = useState(0);
  const [totalAssets, setTotalAssets] = useState(0);

  useEffect(() => {
    if (user?.tenantId) {
      loadInitialData();
    }
  }, [user]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      const items = await InventoryService.getItems(user!.tenantId);
      const stores = await InventoryService.getStores(user!.tenantId);
      const assets = await InventoryService.getAssets(user!.tenantId);
      
      setTotalItems(items.length);
      setTotalStores(stores.length);
      setTotalAssets(assets.length);
    } catch (err: any) {
      setError(err.message || 'Failed to load inventory data');
    } finally {
      setLoading(false);
    }
  };

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Command Center', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'catalogue', label: 'Item Catalogue', icon: <Tags className="w-4 h-4" /> },
    { id: 'stores', label: 'Stores & Locations', icon: <MapPin className="w-4 h-4" /> },
    { id: 'stock', label: 'Stock Register', icon: <Box className="w-4 h-4" /> },
    { id: 'receipts', label: 'Receive Stock', icon: <CheckCircle2 className="w-4 h-4" /> },
    { id: 'issues', label: 'Issue & Return', icon: <ArrowLeftRight className="w-4 h-4" /> },
    { id: 'transfers', label: 'Transfers', icon: <ArrowLeftRight className="w-4 h-4" /> },
    { id: 'assets', label: 'Capital Assets', icon: <MonitorSmartphone className="w-4 h-4" /> },
    { id: 'assignments', label: 'Asset Assignments', icon: <ClipboardList className="w-4 h-4" /> },
    { id: 'audits', label: 'Physical Audit', icon: <ClipboardList className="w-4 h-4" /> },
    { id: 'adjustments', label: 'Adjustments', icon: <Settings className="w-4 h-4" /> },
    { id: 'maintenance', label: 'Maintenance', icon: <Settings className="w-4 h-4" /> },
    { id: 'disposal', label: 'Disposal & Write-Off', icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'reports', label: 'Reports', icon: <ClipboardList className="w-4 h-4" /> },
  ];

  if (loading && totalItems === 0) {
    return <BookLoader size="small" text="Loading" />;
  }

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Package className="w-6 h-6 text-indigo-600" />
            Asset &amp; Inventory Management
          </h1>
          <p className="text-slate-500 text-sm mt-1">Authoritative governance for institutional assets and stock</p>
        </div>
        
        {/* Quick Stats */}
        <div className="flex gap-4">
          <div className="bg-slate-50 px-4 py-2 rounded-lg border border-slate-100 flex flex-col items-end">
            <span className="text-xs text-slate-500 font-medium">Total Stores</span>
            <span className="text-lg font-semibold text-slate-700">{totalStores}</span>
          </div>
          <div className="bg-slate-50 px-4 py-2 rounded-lg border border-slate-100 flex flex-col items-end">
            <span className="text-xs text-slate-500 font-medium">Catalogue Items</span>
            <span className="text-lg font-semibold text-slate-700">{totalItems}</span>
          </div>
          <div className="bg-slate-50 px-4 py-2 rounded-lg border border-slate-100 flex flex-col items-end">
            <span className="text-xs text-slate-500 font-medium">Capital Assets</span>
            <span className="text-lg font-semibold text-slate-700">{totalAssets}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-64 bg-white border-r border-slate-200 flex flex-col overflow-y-auto">
          <nav className="flex-1 p-4 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <main className="flex-1 p-6 overflow-y-auto">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium">Error</h3>
                <p className="text-sm mt-1">{error}</p>
              </div>
            </div>
          )}

          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <h3 className="text-sm font-medium text-slate-500 mb-1">Stock Value</h3>
                  <p className="text-2xl font-bold text-slate-800">$0.00</p>
                  <p className="text-xs text-slate-400 mt-2">Valuation across all stores</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <h3 className="text-sm font-medium text-slate-500 mb-1">Low Stock Alerts</h3>
                  <p className="text-2xl font-bold text-amber-600">0</p>
                  <p className="text-xs text-slate-400 mt-2">Items below reorder level</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <h3 className="text-sm font-medium text-slate-500 mb-1">Pending Receipts</h3>
                  <p className="text-2xl font-bold text-blue-600">0</p>
                  <p className="text-xs text-slate-400 mt-2">Awaiting processing from GRN</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 flex flex-col items-center justify-center text-center">
                <Package className="w-16 h-16 text-slate-300 mb-4" />
                <h2 className="text-xl font-semibold text-slate-700 mb-2">Inventory System Initialized</h2>
                <p className="text-slate-500 max-w-md">
                  Welcome to the Asset and Inventory Management command center. 
                  Start by configuring your Stores &amp; Locations, then populate the Item Catalogue.
                </p>
              </div>
            </div>
          )}

          {activeTab !== 'dashboard' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <Package className="w-8 h-8 text-slate-400" />
              </div>
              <h2 className="text-xl font-semibold text-slate-700 mb-2">No Records Found</h2>
              <p className="text-slate-500 max-w-md mb-6">
                There are currently no records for {tabs.find(t => t.id === activeTab)?.label.toLowerCase()} in this tenant.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
