import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AssetService } from '../../services/assetService';
import { BookLoader } from '../common/BookLoader';
import { 
  Settings, Tags, CheckCircle2, TrendingUp, AlertTriangle, MonitorSmartphone, ClipboardList
} from 'lucide-react';

type TabType = 
  | 'dashboard' 
  | 'register' 
  | 'scanner' 
  | 'categories' 
  | 'locations' 
  | 'assignments' 
  | 'inventory' 
  | 'movements' 
  | 'maintenance' 
  | 'preventive' 
  | 'facility' 
  | 'inspections' 
  | 'warranty' 
  | 'incidents' 
  | 'disposal' 
  | 'analytics' 
  | 'governance';

export const AssetManagementWorkspace: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [totalWorkOrders, setTotalWorkOrders] = useState(0);
  const [totalFacilityRequests, setTotalFacilityRequests] = useState(0);

  useEffect(() => {
    if (user?.tenantId) {
      loadInitialData();
    }
  }, [user]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      const workOrders = await AssetService.getWorkOrders(user!.tenantId);
      const facilityReqs = await AssetService.getFacilityRequests(user!.tenantId);
      
      setTotalWorkOrders(workOrders.length);
      setTotalFacilityRequests(facilityReqs.length);
    } catch (err: any) {
      setError(err.message || 'Failed to load asset context data');
    } finally {
      setLoading(false);
    }
  };

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Command Center', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'register', label: 'Asset Register', icon: <MonitorSmartphone className="w-4 h-4" /> },
    { id: 'scanner', label: 'Asset Scanner', icon: <Tags className="w-4 h-4" /> },
    { id: 'categories', label: 'Categories', icon: <Tags className="w-4 h-4" /> },
    { id: 'locations', label: 'Locations', icon: <Tags className="w-4 h-4" /> },
    { id: 'assignments', label: 'Assignments & Transfers', icon: <ClipboardList className="w-4 h-4" /> },
    { id: 'inventory', label: 'Inventory', icon: <Settings className="w-4 h-4" /> },
    { id: 'movements', label: 'Stock Movements', icon: <ClipboardList className="w-4 h-4" /> },
    { id: 'maintenance', label: 'Maintenance', icon: <Settings className="w-4 h-4" /> },
    { id: 'preventive', label: 'Preventive Maintenance', icon: <CheckCircle2 className="w-4 h-4" /> },
    { id: 'facility', label: 'Facility Requests', icon: <Settings className="w-4 h-4" /> },
    { id: 'inspections', label: 'Inspections', icon: <CheckCircle2 className="w-4 h-4" /> },
    { id: 'warranty', label: 'Warranty & Contracts', icon: <ClipboardList className="w-4 h-4" /> },
    { id: 'incidents', label: 'Loss & Damage', icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'disposal', label: 'Disposal & Retirement', icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'governance', label: 'Governance & Audit', icon: <ClipboardList className="w-4 h-4" /> },
  ];

  if (loading && totalWorkOrders === 0 && totalFacilityRequests === 0) {
    return <BookLoader size="small" text="Loading" />;
  }

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Settings className="w-6 h-6 text-indigo-600" />
            Asset, Facilities &amp; Maintenance
          </h1>
          <p className="text-slate-500 text-sm mt-1">Authoritative governance for assets, facilities, and maintenance lifecycles</p>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-slate-50 px-4 py-2 rounded-lg border border-slate-100 flex flex-col items-end">
            <span className="text-xs text-slate-500 font-medium">Work Orders</span>
            <span className="text-lg font-semibold text-slate-700">{totalWorkOrders}</span>
          </div>
          <div className="bg-slate-50 px-4 py-2 rounded-lg border border-slate-100 flex flex-col items-end">
            <span className="text-xs text-slate-500 font-medium">Facility Requests</span>
            <span className="text-lg font-semibold text-slate-700">{totalFacilityRequests}</span>
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
                  <h3 className="text-sm font-medium text-slate-500 mb-1">Open Work Orders</h3>
                  <p className="text-2xl font-bold text-slate-800">0</p>
                  <p className="text-xs text-slate-400 mt-2">Active maintenance tasks</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <h3 className="text-sm font-medium text-slate-500 mb-1">Pending Facility Requests</h3>
                  <p className="text-2xl font-bold text-amber-600">0</p>
                  <p className="text-xs text-slate-400 mt-2">Awaiting assignment</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <h3 className="text-sm font-medium text-slate-500 mb-1">Disposals Pending</h3>
                  <p className="text-2xl font-bold text-blue-600">0</p>
                  <p className="text-xs text-slate-400 mt-2">Awaiting approval</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 flex flex-col items-center justify-center text-center">
                <Settings className="w-16 h-16 text-slate-300 mb-4" />
                <h2 className="text-xl font-semibold text-slate-700 mb-2">Facilities &amp; Maintenance System Initialized</h2>
                <p className="text-slate-500 max-w-md">
                  Welcome to the Command Center. Manage your asset lifecycles, preventative maintenance schedules, and facility requests from here.
                </p>
              </div>
            </div>
          )}

          {activeTab !== 'dashboard' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <Settings className="w-8 h-8 text-slate-400" />
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
