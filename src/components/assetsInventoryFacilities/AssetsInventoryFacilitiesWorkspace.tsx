import React, { useState, useEffect } from 'react';
import {
  Package,
  Boxes,
  Building2,
  Wrench,
  Calendar,
  CheckSquare,
  ArrowRightLeft,
  Trash2,
  AlertTriangle,
  PlayCircle,
  Shield,
  Activity,
  CheckCircle2,
  XCircle,
  Users,
  Plus
} from 'lucide-react';
import { assetsInventoryFacilitiesService } from '../../services/assetsInventoryFacilitiesService';
import {
  Asset,
  InventoryItem,
  MaintenanceWorkOrder,
  AssetAuditEvent,
  AssetSimulationScenario
} from '../../types/assetsInventoryFacilities';
import { BookLoader } from '../common/BookLoader';

export const AssetsInventoryFacilitiesWorkspace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'assets'
    | 'assignments'
    | 'transfers'
    | 'inventory'
    | 'movements'
    | 'facilities'
    | 'maintenance'
    | 'pm'
    | 'inspections'
    | 'disposal'
    | 'diagnostics'
    | 'sandbox'
    | 'audit'
  >('overview');

  const tenantId = 'TENANT_INDIA_DEFAULT';
  const campusId = 'CAMPUS_DELHI';
  const [assets, setAssets] = useState<Asset[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [workOrders, setWorkOrders] = useState<MaintenanceWorkOrder[]>([]);
  const [auditEvents, setAuditEvents] = useState<AssetAuditEvent[]>([]);
  const [simulationResult, setSimulationResult] = useState<AssetSimulationScenario | null>(null);
  const [diagnostics, setDiagnostics] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form inputs
  const [newAssetIdentifier, setNewAssetIdentifier] = useState('');
  const [newAssetCat, setNewAssetCat] = useState('Lab Equipment');
  const [newAssetDesc, setNewAssetDesc] = useState('');
  const [stockItemRef, setStockItemRef] = useState('');
  const [stockQty, setStockQty] = useState(10);
  const [disposalReason, setDisposalReason] = useState('End of Lifecycle / Damaged beyond repair');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    try {
      setAssets(assetsInventoryFacilitiesService.getAssets(tenantId));
      setInventory(assetsInventoryFacilitiesService.getInventoryItems(tenantId));
      setWorkOrders(assetsInventoryFacilitiesService.getWorkOrders(tenantId));
      setAuditEvents(assetsInventoryFacilitiesService.getAuditTrail(tenantId));
      setDiagnostics(assetsInventoryFacilitiesService.runDiagnostics(tenantId));
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAsset = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackMessage(null);
    setErrorMessage(null);

    try {
      assetsInventoryFacilitiesService.createAsset(
        {
          assetIdentifier: newAssetIdentifier,
          tenantId,
          campusIdRef: campusId,
          organizationUnitIdRef: 'ORG_DEPT_PHYSICS',
          assetCategory: newAssetCat,
          assetClass: 'Scientific Instrument',
          description: newAssetDesc || 'High precision lab unit',
          manufacturer: 'OptiTech Precision',
          model: 'OPT-500',
          serialNumber: `SN-${Date.now().toString().slice(-6)}`,
          operationalStatus: 'OPERATIONAL',
          lifecycleState: 'RECEIVED',
        },
        `AST_KEY_${Date.now()}`
      );
      setNewAssetIdentifier('');
      setNewAssetDesc('');
      setFeedbackMessage('Asset registered successfully in RECEIVED state.');
      loadData();
    } catch (err: any) {
      setErrorMessage(err.message);
    }
  };

  const handleDisposalWithSoD = (assetId: string, sameUser: boolean) => {
    setFeedbackMessage(null);
    setErrorMessage(null);

    try {
      const requester = 'USER_REQ_ASSET_1';
      const approver = sameUser ? 'USER_REQ_ASSET_1' : 'USER_APP_ASSET_2';

      const disp = assetsInventoryFacilitiesService.requestDisposal(
        assetId,
        tenantId,
        disposalReason,
        'SCRAPPED',
        requester
      );

      assetsInventoryFacilitiesService.approveDisposal(disp.disposalId, tenantId, approver);
      setFeedbackMessage('Asset disposal approved and state updated via Four-Eyes SoD.');
      loadData();
    } catch (err: any) {
      setErrorMessage(err.message);
    }
  };

  const handleRecordStockMovement = (type: 'RECEIPT' | 'ISSUE') => {
    setFeedbackMessage(null);
    setErrorMessage(null);

    if (!stockItemRef && inventory.length > 0) {
      setStockItemRef(inventory[0].itemId);
    }
    const targetItem = stockItemRef || (inventory.length > 0 ? inventory[0].itemId : '');
    if (!targetItem) {
      setErrorMessage('No inventory item selected');
      return;
    }

    try {
      assetsInventoryFacilitiesService.recordStockMovement({
        tenantId,
        campusIdRef: campusId,
        itemIdRef: targetItem,
        movementType: type,
        quantity: stockQty,
        actorUserIdRef: 'USER_INV_MGR',
        idempotencyKey: `MOV_KEY_${type}_${Date.now()}`,
      });
      setFeedbackMessage(`Stock ${type} of ${stockQty} units processed cleanly.`);
      loadData();
    } catch (err: any) {
      setErrorMessage(err.message);
    }
  };

  const handleRunSimulation = (scenarioId: string) => {
    setFeedbackMessage(null);
    setErrorMessage(null);
    try {
      const res = assetsInventoryFacilitiesService.runSimulation(scenarioId);
      setSimulationResult(res);
    } catch (err: any) {
      setErrorMessage(err.message);
    }
  };

  if (loading) {
    return <BookLoader size="large" text="Loading Assets, Inventory & Facilities Workspace..." />;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-6 rounded-2xl text-white shadow-xl">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-sky-600 rounded-xl">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Assets, Inventory, Facilities & Maintenance</h1>
              <p className="text-sm text-slate-400 mt-1">
                Lifecycle State Engine, Stock Movements, Facility Hierarchy, Work Orders, and SoD Governance
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-sky-950 text-sky-400 border border-sky-800 rounded-full text-xs font-semibold">
            EMS Phase 11.4 Active
          </span>
        </div>
      </div>

      {/* Banner Notifications */}
      {feedbackMessage && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-800 text-emerald-300 rounded-xl flex items-center gap-3 text-sm">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-rose-950/40 border border-rose-800 text-rose-300 rounded-xl flex items-center gap-3 text-sm">
          <XCircle className="w-5 h-5 shrink-0 text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto gap-2 border-b border-slate-800 pb-2 scrollbar-thin">
        {[
          { id: 'overview', label: 'Command Center', icon: Activity },
          { id: 'assets', label: 'Assets Master', icon: Package },
          { id: 'inventory', label: 'Inventory & Stock', icon: Boxes },
          { id: 'facilities', label: 'Facilities & Rooms', icon: Building2 },
          { id: 'maintenance', label: 'Work Orders', icon: Wrench },
          { id: 'pm', label: 'Preventive Maint.', icon: Calendar },
          { id: 'diagnostics', label: 'Diagnostics', icon: AlertTriangle },
          { id: 'sandbox', label: 'What-If Sandbox', icon: PlayCircle },
          { id: 'audit', label: 'Audit Trail', icon: Shield },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/20'
                  : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Assets</span>
              <Package className="w-5 h-5 text-sky-400" />
            </div>
            <p className="text-3xl font-extrabold text-white">{assets.length}</p>
            <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Tracked in Lifecycle Engine
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Inventory SKUs</span>
              <Boxes className="w-5 h-5 text-sky-400" />
            </div>
            <p className="text-3xl font-extrabold text-white">{inventory.length}</p>
            <p className="text-xs text-slate-400 mt-2">Deterministic Movement Engine</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Active Work Orders</span>
              <Wrench className="w-5 h-5 text-amber-400" />
            </div>
            <p className="text-3xl font-extrabold text-white">{workOrders.length}</p>
            <p className="text-xs text-amber-400 mt-2">Controlled State Workflow</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">SoD Governance</span>
              <Shield className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-3xl font-extrabold text-emerald-400">Enforced</p>
            <p className="text-xs text-slate-400 mt-2">Four-Eyes Requester ≠ Approver</p>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Assets */}
      {activeTab === 'assets' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Register New Institutional Asset</h3>
            <form onSubmit={handleCreateAsset} className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="Asset Identifier (e.g. AST-DEL-LAB-02)"
                value={newAssetIdentifier}
                onChange={(e) => setNewAssetIdentifier(e.target.value)}
                required
                className="bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-sky-500"
              />
              <select
                value={newAssetCat}
                onChange={(e) => setNewAssetCat(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-sky-500"
              >
                <option value="Lab Equipment">Lab Equipment</option>
                <option value="IT Hardware">IT Hardware</option>
                <option value="Furniture">Furniture</option>
                <option value="HVAC & Utilities">HVAC & Utilities</option>
              </select>
              <input
                type="text"
                placeholder="Description"
                value={newAssetDesc}
                onChange={(e) => setNewAssetDesc(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-sky-500"
              />
              <button
                type="submit"
                className="bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-xl px-4 py-2.5 text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-sky-600/20"
              >
                <Plus className="w-4 h-4" /> Register Asset
              </button>
            </form>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">Institutional Asset Master Directory</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Identifier</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Serial Number</th>
                    <th className="p-4">Lifecycle State</th>
                    <th className="p-4">Custodian</th>
                    <th className="p-4">Disposal Governance (SoD)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {assets.map((a) => (
                    <tr key={a.assetId} className="hover:bg-slate-800/30">
                      <td className="p-4 font-mono text-sky-400">{a.assetIdentifier}</td>
                      <td className="p-4">{a.assetCategory}</td>
                      <td className="p-4 font-mono text-xs">{a.serialNumber}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 bg-sky-950 text-sky-400 border border-sky-800 rounded-full text-xs font-semibold">
                          {a.lifecycleState}
                        </span>
                      </td>
                      <td className="p-4 text-xs font-mono">{a.custodianEmployeeIdRef || 'Unassigned'}</td>
                      <td className="p-4 flex gap-2">
                        {a.lifecycleState !== 'DISPOSED' && (
                          <>
                            <button
                              onClick={() => handleDisposalWithSoD(a.assetId, false)}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-all"
                            >
                              Dispose (SoD Pass)
                            </button>
                            <button
                              onClick={() => handleDisposalWithSoD(a.assetId, true)}
                              className="px-3 py-1 bg-rose-900/50 hover:bg-rose-900 border border-rose-700 text-rose-200 text-xs font-semibold rounded-lg transition-all"
                            >
                              Self-Approve (SoD Fail)
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

      {/* TAB CONTENT: Inventory */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Stock Movement Control Engine</h3>
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <select
                value={stockItemRef}
                onChange={(e) => setStockItemRef(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm"
              >
                {inventory.map((inv) => (
                  <option key={inv.itemId} value={inv.itemId}>
                    {inv.name} (SKU: {inv.itemCode}) - Available: {inv.availableQuantity}
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={stockQty}
                onChange={(e) => setStockQty(Number(e.target.value))}
                placeholder="Quantity"
                className="bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm w-32"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleRecordStockMovement('RECEIPT')}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl transition-all"
                >
                  Record Stock Receipt (+)
                </button>
                <button
                  onClick={() => handleRecordStockMovement('ISSUE')}
                  className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold rounded-xl transition-all"
                >
                  Record Stock Issue (-)
                </button>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">Inventory Balance Register</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="p-4">SKU Code</th>
                    <th className="p-4">Item Name</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Available Qty</th>
                    <th className="p-4">Min Threshold</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {inventory.map((i) => (
                    <tr key={i.itemId} className="hover:bg-slate-800/30">
                      <td className="p-4 font-mono text-sky-400">{i.itemCode}</td>
                      <td className="p-4 font-medium text-white">{i.name}</td>
                      <td className="p-4">{i.category}</td>
                      <td className="p-4 font-extrabold text-white">{i.availableQuantity} {i.unitOfMeasure}</td>
                      <td className="p-4 text-slate-400">{i.minimumThreshold}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          i.availableQuantity > i.minimumThreshold
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : 'bg-rose-950 text-rose-400 border border-rose-800'
                        }`}>
                          {i.availableQuantity > i.minimumThreshold ? 'SUFFICIENT' : 'LOW STOCK'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Diagnostics */}
      {activeTab === 'diagnostics' && (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <h3 className="text-lg font-bold text-white">Operational Diagnostics Engine</h3>
          <div className="space-y-3">
            {diagnostics.map((diag, index) => (
              <div key={index} className="p-4 bg-slate-800/50 border border-slate-700 text-slate-200 rounded-xl flex items-center gap-3 text-sm">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                <span>{diag}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: What-If Sandbox */}
      {activeTab === 'sandbox' && (
        <div className="space-y-6">
          <div className="bg-amber-950/30 border border-amber-800 p-4 rounded-xl text-amber-300 font-bold text-center tracking-wide">
            SIMULATION ONLY • SANDBOX MODE ACTIVE • ZERO PRODUCTION MUTATION
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { id: 'ASSET_ACQUISITION_SURGE', label: 'Asset Acquisition Surge' },
              { id: 'INVENTORY_SHORTAGE', label: '80% Supply Chain Shortage' },
              { id: 'CAMPUS_TRANSFER', label: 'Inter-Campus Bulk Asset Transfer' },
              { id: 'MAINTENANCE_BACKLOG', label: 'Emergency Maintenance Backlog' },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => handleRunSimulation(s.id)}
                className="bg-slate-900 border border-slate-800 hover:border-sky-600 p-4 rounded-xl text-left text-white font-semibold flex items-center justify-between transition-all"
              >
                <span>{s.label}</span>
                <PlayCircle className="w-5 h-5 text-sky-400" />
              </button>
            ))}
          </div>

          {simulationResult && (
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-slate-200">
              <h4 className="text-md font-bold text-white mb-2">Simulation Result: {simulationResult.name}</h4>
              <p className="text-sm text-emerald-400 font-medium mb-4">{simulationResult.result}</p>
              <div className="grid grid-cols-3 gap-4 text-xs bg-slate-800/50 p-4 rounded-xl font-mono">
                <div>Processed: {simulationResult.metrics?.processed}</div>
                <div>Production Mutations: {simulationResult.metrics?.mutations}</div>
                <div>Execution Time: {simulationResult.metrics?.executionTimeMs}ms</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: Audit Trail */}
      {activeTab === 'audit' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white">Append-Only SHA-256 Cryptographic Audit Trail</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/50 text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="p-4">Event ID</th>
                  <th className="p-4">Action</th>
                  <th className="p-4">Entity</th>
                  <th className="p-4">Actor</th>
                  <th className="p-4">Current SHA-256 Hash</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono">
                {auditEvents.map((a) => (
                  <tr key={a.eventId} className="hover:bg-slate-800/30">
                    <td className="p-4 text-sky-400">{a.eventId}</td>
                    <td className="p-4 text-white font-sans">{a.action}</td>
                    <td className="p-4">{a.entityType}:{a.entityId}</td>
                    <td className="p-4">{a.actorUserIdRef}</td>
                    <td className="p-4 text-slate-400 truncate max-w-xs">{a.currentHash}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
