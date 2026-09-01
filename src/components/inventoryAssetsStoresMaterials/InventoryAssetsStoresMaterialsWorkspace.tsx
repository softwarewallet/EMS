import React, { useState, useEffect } from 'react';
import {
  Boxes,
  Package,
  Warehouse,
  ArrowRightLeft,
  FileCheck,
  TrendingDown,
  RotateCcw,
  ClipboardCheck,
  Sliders,
  ShieldAlert,
  History,
  Play,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Plus,
  Send,
  Building,
  UserCheck,
  PlusCircle,
  Clock,
  Sparkles,
  QrCode,
  Tag,
  ShieldCheck,
  Activity,
  Layers,
  Database,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { inventoryAssetsStoresMaterialsService } from '../../services/inventoryAssetsStoresMaterialsService';
import {
  InventoryItem,
  StoreLocation,
  StockBalance,
  InventoryReceipt,
  StockIssue,
  StockReturn,
  StockTransfer,
  StockReservation,
  StockAdjustment,
  InventoryCount,
  Asset,
  AssetAssignment,
  AssetDisposalRequest,
  InventoryMaterialsAuditEvent,
  InventorySimulationScenario
} from '../../types/inventoryAssetsStoresMaterials';

export const InventoryAssetsStoresMaterialsWorkspace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'items'
    | 'stores'
    | 'balances'
    | 'receipts'
    | 'issues'
    | 'returns'
    | 'transfers'
    | 'reservations'
    | 'adjustments'
    | 'counts'
    | 'assets'
    | 'assignments'
    | 'disposals'
    | 'diagnostics'
    | 'audit'
    | 'sandbox'
  >('overview');

  const tenantId = 'TENANT_INDIA_DEFAULT';
  const campusId = 'CAMPUS_DELHI';

  // --- STATE CACHES ---
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [stores, setStores] = useState<StoreLocation[]>([]);
  const [balances, setBalances] = useState<StockBalance[]>([]);
  const [receipts, setReceipts] = useState<InventoryReceipt[]>([]);
  const [issues, setIssues] = useState<StockIssue[]>([]);
  const [returns, setReturns] = useState<StockReturn[]>([]);
  const [transfers, setTransfers] = useState<StockTransfer[]>([]);
  const [reservations, setReservations] = useState<StockReservation[]>([]);
  const [adjustments, setAdjustments] = useState<StockAdjustment[]>([]);
  const [counts, setCounts] = useState<InventoryCount[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [assignments, setAssignments] = useState<AssetAssignment[]>([]);
  const [disposals, setDisposals] = useState<AssetDisposalRequest[]>([]);
  const [auditEvents, setAuditEvents] = useState<InventoryMaterialsAuditEvent[]>([]);
  const [diagnosticsResult, setDiagnosticsResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Notifications
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // --- FORM STATES ---
  // New Item Form
  const [newItemCode, setNewItemCode] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('CAT-STAT');
  const [newItemUom, setNewItemUom] = useState('UOM-EACH');
  const [newItemCost, setNewItemCost] = useState(100);
  const [newItemReorder, setNewItemReorder] = useState(50);
  const [newItemMin, setNewItemMin] = useState(20);
  const [newItemMax, setNewItemMax] = useState(500);
  const [newItemIsConsumable, setNewItemIsConsumable] = useState(true);
  const [newItemIsSerialized, setNewItemIsSerialized] = useState(false);
  const [newItemIsBatch, setNewItemIsBatch] = useState(false);

  // New Store Form
  const [newStoreCode, setNewStoreCode] = useState('');
  const [newStoreName, setNewStoreName] = useState('');
  const [newStoreCapacity, setNewStoreCapacity] = useState(5000);
  const [newStoreClassification, setNewStoreClassification] = useState<'STANDARD' | 'RESTRICTED' | 'HIGH_SECURITY' | 'HAZMAT'>('STANDARD');

  // New Receipt Form
  const [rcptStoreId, setRcptStoreId] = useState('STR-DEL-MAIN');
  const [rcptItemId, setRcptItemId] = useState('ITEM-A4-PAPER');
  const [rcptQty, setRcptQty] = useState(100);
  const [rcptUnitPrice, setRcptUnitPrice] = useState(280);
  const [rcptPO, setRcptPO] = useState('PO-2025-001');
  const [rcptSupplier, setRcptSupplier] = useState('SUP-ITC-PAPER');

  // New Issue Form
  const [issueStoreId, setIssueStoreId] = useState('STR-DEL-MAIN');
  const [issueItemId, setIssueItemId] = useState('ITEM-A4-PAPER');
  const [issueQty, setIssueQty] = useState(10);
  const [issueRecipientType, setIssueRecipientType] = useState<'EMPLOYEE' | 'STUDENT' | 'ORG_UNIT'>('EMPLOYEE');
  const [issueRecipientId, setIssueRecipientId] = useState('EMP-FACULTY-01');
  const [issuePurpose, setIssuePurpose] = useState('Mid-Term Examination Papers Printing');

  // New Adjustment Form
  const [adjStoreId, setAdjStoreId] = useState('STR-DEL-MAIN');
  const [adjItemId, setAdjItemId] = useState('ITEM-A4-PAPER');
  const [adjType, setAdjType] = useState<'INCREASE' | 'DECREASE' | 'DAMAGE' | 'WRITE_OFF'>('DAMAGE');
  const [adjQty, setAdjQty] = useState(5);
  const [adjReason, setAdjReason] = useState('Water leakage in storage rack damaged cartons');
  const [adjRequester, setAdjRequester] = useState('USER_STORE_OFFICER');

  // New Asset Form
  const [astCode, setAstCode] = useState('');
  const [astName, setAstName] = useState('');
  const [astCategory, setAstCategory] = useState('ACAT-COMP');
  const [astCost, setAstCost] = useState(75000);
  const [astSerial, setAstSerial] = useState('');
  const [astBarcode, setAstBarcode] = useState('');

  // Sandbox simulation state
  const [selectedScenario, setSelectedScenario] = useState<InventorySimulationScenario['type']>('DEMAND_SURGE');
  const [simResult, setSimResult] = useState<any>(null);

  const loadData = () => {
    try {
      setItems(inventoryAssetsStoresMaterialsService.getItems(tenantId));
      setStores(inventoryAssetsStoresMaterialsService.getStores(tenantId));
      setBalances(inventoryAssetsStoresMaterialsService.getStockBalances(tenantId));
      setReceipts(inventoryAssetsStoresMaterialsService.getReceipts(tenantId));
      setIssues(inventoryAssetsStoresMaterialsService.getIssues(tenantId));
      setReturns(inventoryAssetsStoresMaterialsService.getReturns(tenantId));
      setTransfers(inventoryAssetsStoresMaterialsService.getTransfers(tenantId));
      setReservations(inventoryAssetsStoresMaterialsService.getReservations(tenantId));
      setAdjustments(inventoryAssetsStoresMaterialsService.getAdjustments(tenantId));
      setCounts(inventoryAssetsStoresMaterialsService.getCounts(tenantId));
      setAssets(inventoryAssetsStoresMaterialsService.getAssets(tenantId));
      setAssignments(inventoryAssetsStoresMaterialsService.getAssignments(tenantId));
      setDisposals(inventoryAssetsStoresMaterialsService.getDisposals(tenantId));
      setAuditEvents(inventoryAssetsStoresMaterialsService.getAuditTrail(tenantId));
      setDiagnosticsResult(inventoryAssetsStoresMaterialsService.runDiagnostics(tenantId));
    } catch (e: any) {
      setErrorMsg(e.message);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      inventoryAssetsStoresMaterialsService.createItem({
        itemId: `ITEM-${Date.now()}`,
        itemCode: newItemCode,
        name: newItemName,
        description: newItemDesc,
        categoryIdRef: newItemCategory,
        uomIdRef: newItemUom,
        isConsumable: newItemIsConsumable,
        isSerialized: newItemIsSerialized,
        isBatchControlled: newItemIsBatch,
        reorderThreshold: Number(newItemReorder),
        minimumStock: Number(newItemMin),
        maximumStock: Number(newItemMax),
        safetyStock: Number(newItemMin),
        standardCost: Number(newItemCost),
        isActive: true,
        tenantId,
        permittedCampusScope: [campusId]
      }, 'USER_ADMIN');

      setSuccessMsg(`Inventory item '${newItemCode}' registered successfully.`);
      setNewItemCode('');
      setNewItemName('');
      setNewItemDesc('');
      loadData();
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const handleCreateStore = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      inventoryAssetsStoresMaterialsService.createStore({
        storeId: `STR-${Date.now()}`,
        storeCode: newStoreCode,
        name: newStoreName,
        tenantId,
        campusIdRef: campusId,
        capacityMax: Number(newStoreCapacity),
        currentUtilization: 0,
        status: 'ACTIVE',
        securityClassification: newStoreClassification,
        responsibleOfficerUserIdRef: 'USER_STORE_OFFICER',
        isCentralWarehouse: false
      }, 'USER_ADMIN');

      setSuccessMsg(`Store '${newStoreName}' created.`);
      setNewStoreCode('');
      setNewStoreName('');
      loadData();
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const handleCreateReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const rcpt = inventoryAssetsStoresMaterialsService.createReceipt({
        receiptId: `RCPT-${Date.now()}`,
        receiptNumber: `GRN-${Date.now().toString().slice(-4)}`,
        tenantId,
        campusIdRef: campusId,
        storeIdRef: rcptStoreId,
        supplierIdRef: rcptSupplier,
        purchaseOrderIdRef: rcptPO,
        receivingOfficerUserIdRef: 'USER_RECEIVING_OFFICER',
        status: 'DRAFT',
        lines: [
          {
            lineId: `L-${Date.now()}`,
            itemIdRef: rcptItemId,
            quantityExpected: Number(rcptQty),
            quantityReceived: Number(rcptQty),
            quantityRejected: 0,
            unitPrice: Number(rcptUnitPrice),
            uomIdRef: 'UOM-EACH'
          }
        ],
        totalAmount: Number(rcptQty) * Number(rcptUnitPrice),
        receivedAt: new Date().toISOString(),
        idempotencyKey: `IDEM-RCPT-${Date.now()}`
      }, 'USER_RECEIVING_OFFICER');

      // Post receipt immediately to credit stock
      inventoryAssetsStoresMaterialsService.postReceipt(rcpt.receiptId, tenantId, 'USER_VERIFYING_OFFICER');
      setSuccessMsg(`Goods Receipt Note ${rcpt.receiptNumber} posted. Stock balances credited atomically.`);
      loadData();
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const handleCreateIssue = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const issue = inventoryAssetsStoresMaterialsService.createIssueRequest({
        issueId: `ISS-${Date.now()}`,
        issueNumber: `REQ-${Date.now().toString().slice(-4)}`,
        tenantId,
        campusIdRef: campusId,
        storeIdRef: issueStoreId,
        recipientType: issueRecipientType,
        recipientIdRef: issueRecipientId,
        requestedByUserIdRef: 'USER_REQUISITIONER',
        status: 'REQUESTED',
        lines: [
          {
            lineId: `L-${Date.now()}`,
            itemIdRef: issueItemId,
            quantityRequested: Number(issueQty),
            quantityIssued: Number(issueQty),
            uomIdRef: 'UOM-EACH'
          }
        ],
        purpose: issuePurpose,
        idempotencyKey: `IDEM-ISS-${Date.now()}`
      }, 'USER_REQUISITIONER');

      setSuccessMsg(`Stock issue requisition ${issue.issueNumber} submitted for Four-Eyes approval.`);
      loadData();
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const handleApproveAndIssue = (issueId: string) => {
    try {
      // Four-Eyes: Approved by a distinct user
      inventoryAssetsStoresMaterialsService.approveIssue(issueId, tenantId, 'USER_DEPT_APPROVER');
      inventoryAssetsStoresMaterialsService.issueStock(issueId, tenantId, 'USER_STORE_KEEPER');
      setSuccessMsg(`Stock issue approved and fulfilled. Inventory on-hand balance decremented.`);
      loadData();
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const handleRequestAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const adj = inventoryAssetsStoresMaterialsService.requestAdjustment({
        adjustmentId: `ADJ-${Date.now()}`,
        adjustmentNumber: `ADJ-NUM-${Date.now().toString().slice(-4)}`,
        tenantId,
        storeIdRef: adjStoreId,
        itemIdRef: adjItemId,
        adjustmentType: adjType,
        quantity: Number(adjQty),
        previousQuantity: 0,
        newQuantity: 0,
        reason: adjReason,
        requestedByUserIdRef: adjRequester,
        status: 'REQUESTED',
        idempotencyKey: `IDEM-ADJ-${Date.now()}`
      }, adjRequester);

      setSuccessMsg(`Adjustment ${adj.adjustmentNumber} requested. Requires Four-Eyes approval from distinct officer.`);
      loadData();
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const handleApproveAdjustment = (adjustmentId: string, requester: string) => {
    try {
      // Distinct approver
      const approver = requester === 'USER_AUDITOR_MGR' ? 'USER_STORE_DIRECTOR' : 'USER_AUDITOR_MGR';
      inventoryAssetsStoresMaterialsService.approveAndPostAdjustment(adjustmentId, tenantId, approver);
      setSuccessMsg(`Adjustment approved by ${approver} and stock state updated.`);
      loadData();
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const handleCreateAsset = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      inventoryAssetsStoresMaterialsService.createAsset({
        assetId: `AST-${Date.now()}`,
        assetCode: astCode,
        name: astName,
        description: 'Institutional Fixed Asset',
        categoryIdRef: astCategory,
        tenantId,
        campusIdRef: campusId,
        status: 'ACQUIRED',
        purchaseCost: Number(astCost),
        currentBookValue: Number(astCost),
        serialNumber: astSerial || undefined,
        barCode: astBarcode || undefined,
        acquisitionDate: new Date().toISOString(),
        isDepreciated: false,
        isActive: true
      }, 'USER_ASSET_MGR');

      setSuccessMsg(`Asset '${astCode}' registered.`);
      setAstCode('');
      setAstName('');
      setAstSerial('');
      setAstBarcode('');
      loadData();
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const handleRunSimulation = () => {
    try {
      const res = inventoryAssetsStoresMaterialsService.runSimulation(selectedScenario);
      setSimResult(res);
      setSuccessMsg(`Simulation '${selectedScenario}' completed with zero production mutations.`);
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 min-h-screen">
      {/* Top Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-emerald-600/20 text-emerald-400 rounded-lg border border-emerald-500/30">
            <Boxes className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              Institutional Inventory, Assets &amp; Materials
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
                Phase 11.7
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Authoritative Store Locations, SKU Registers, Receipts, Issues, Stock Transfers, Physical Counts, Asset Lifecycle &amp; Provenance
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={loadData}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-md border border-slate-700 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh Data
          </button>
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-950 rounded border border-slate-800 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-slate-300 font-mono">Tenant: {tenantId}</span>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="bg-emerald-950/80 border-b border-emerald-800 text-emerald-200 px-6 py-2 text-xs flex justify-between items-center">
          <span className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            {successMsg}
          </span>
          <button onClick={() => setSuccessMsg(null)} className="text-emerald-400 hover:text-emerald-200">
            ✕
          </button>
        </div>
      )}
      {errorMsg && (
        <div className="bg-rose-950/80 border-b border-rose-800 text-rose-200 px-6 py-2 text-xs flex justify-between items-center">
          <span className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            {errorMsg}
          </span>
          <button onClick={() => setErrorMsg(null)} className="text-rose-400 hover:text-rose-200">
            ✕
          </button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="bg-slate-900/60 border-b border-slate-800 px-6 flex space-x-1 overflow-x-auto">
        {[
          { id: 'overview', label: 'Command Center', icon: Activity },
          { id: 'items', label: 'Item Master (SKUs)', icon: Package },
          { id: 'stores', label: 'Warehouses & Stores', icon: Warehouse },
          { id: 'balances', label: 'Stock Balances', icon: Layers },
          { id: 'receipts', label: 'Goods Receipts', icon: FileCheck },
          { id: 'issues', label: 'Requisitions & Issues', icon: Send },
          { id: 'returns', label: 'Returns & Inspection', icon: RotateCcw },
          { id: 'transfers', label: 'Inter-Store Transfers', icon: ArrowRightLeft },
          { id: 'reservations', label: 'Reservations', icon: Clock },
          { id: 'adjustments', label: 'Adjustments (SoD)', icon: Sliders },
          { id: 'counts', label: 'Physical Counts', icon: ClipboardCheck },
          { id: 'assets', label: 'Operational Assets', icon: Tag },
          { id: 'assignments', label: 'Asset Custody', icon: UserCheck },
          { id: 'disposals', label: 'Governed Disposals', icon: Trash2 },
          { id: 'diagnostics', label: 'Diagnostics Engine', icon: ShieldAlert },
          { id: 'audit', label: 'Cryptographic Audit', icon: History },
          { id: 'sandbox', label: 'What-If Sandbox', icon: Sparkles }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3 py-2.5 text-xs font-medium border-b-2 whitespace-nowrap transition-colors ${
                isActive
                  ? 'border-emerald-500 text-emerald-400 bg-slate-800/50'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 overflow-y-auto">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                <div className="text-slate-400 text-xs">Total Items (SKUs)</div>
                <div className="text-2xl font-bold text-slate-100 mt-1">{items.length}</div>
                <div className="text-emerald-400 text-[11px] mt-1 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Catalog active
                </div>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                <div className="text-slate-400 text-xs">Active Stores</div>
                <div className="text-2xl font-bold text-slate-100 mt-1">
                  {stores.filter(s => s.status === 'ACTIVE').length}
                </div>
                <div className="text-slate-400 text-[11px] mt-1">
                  {stores.filter(s => s.status === 'CLOSED').length} decommissioned
                </div>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                <div className="text-slate-400 text-xs">Stock Balances</div>
                <div className="text-2xl font-bold text-emerald-400 mt-1">
                  {balances.reduce((acc, b) => acc + b.onHand, 0)} units
                </div>
                <div className="text-slate-400 text-[11px] mt-1">
                  {balances.reduce((acc, b) => acc + b.available, 0)} available
                </div>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                <div className="text-slate-400 text-xs">Fixed Assets</div>
                <div className="text-2xl font-bold text-indigo-400 mt-1">{assets.length}</div>
                <div className="text-slate-400 text-[11px] mt-1">
                  {assets.filter(a => a.status === 'ASSIGNED').length} in custody
                </div>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                <div className="text-slate-400 text-xs">Pending Issues</div>
                <div className="text-2xl font-bold text-amber-400 mt-1">
                  {issues.filter(i => i.status === 'REQUESTED').length}
                </div>
                <div className="text-amber-400 text-[11px] mt-1">Awaiting SoD approval</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                <div className="text-slate-400 text-xs">System Health</div>
                <div className="text-2xl font-bold text-emerald-400 mt-1">
                  {diagnosticsResult?.status || 'HEALTHY'}
                </div>
                <div className="text-slate-400 text-[11px] mt-1">
                  {diagnosticsResult?.anomaliesCount || 0} anomalies
                </div>
              </div>
            </div>

            {/* Quick Summary Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Warehouse Inventory Levels */}
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
                  <Warehouse className="w-4 h-4 text-emerald-400" />
                  Warehouse Stock Distribution
                </h3>
                <div className="space-y-3">
                  {stores.map(st => {
                    const storeBalances = balances.filter(b => b.storeIdRef === st.storeId);
                    const totalUnits = storeBalances.reduce((acc, b) => acc + b.onHand, 0);
                    const pct = Math.min(100, Math.round((st.currentUtilization / st.capacityMax) * 100));
                    return (
                      <div key={st.storeId} className="bg-slate-950 p-3 rounded border border-slate-800/80">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-medium text-slate-200">{st.name}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                            st.status === 'ACTIVE' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-400'
                          }`}>
                            {st.status}
                          </span>
                        </div>
                        <div className="mt-2 text-xs text-slate-400 flex justify-between">
                          <span>Capacity: {st.currentUtilization} / {st.capacityMax} units</span>
                          <span>{pct}% utilized</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                          <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${pct}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent Material Movements */}
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
                  <ArrowRightLeft className="w-4 h-4 text-indigo-400" />
                  Recent Inventory Transactions
                </h3>
                <div className="space-y-2">
                  {auditEvents.slice(-5).reverse().map(ev => (
                    <div key={ev.eventId} className="bg-slate-950 p-2.5 rounded border border-slate-800/60 text-xs flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">
                          {ev.action}
                        </span>
                        <span className="text-slate-300">{ev.entityType}: {ev.entityId}</span>
                      </div>
                      <span className="text-slate-500 text-[10px] font-mono">
                        {new Date(ev.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                  {auditEvents.length === 0 && (
                    <div className="text-slate-500 text-xs italic py-4 text-center">No transactions recorded yet.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ITEMS TAB */}
        {activeTab === 'items' && (
          <div className="space-y-6">
            {/* Create Item Form */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
              <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-emerald-400" />
                Register New Inventory Item (SKU)
              </h3>
              <form onSubmit={handleCreateItem} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Item Code *</label>
                  <input
                    type="text"
                    required
                    value={newItemCode}
                    onChange={e => setNewItemCode(e.target.value)}
                    placeholder="e.g. MAT-CHEM-201"
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-100 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Item Name *</label>
                  <input
                    type="text"
                    required
                    value={newItemName}
                    onChange={e => setNewItemName(e.target.value)}
                    placeholder="e.g. Acetone AR Grade 2.5L"
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Category</label>
                  <select
                    value={newItemCategory}
                    onChange={e => setNewItemCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-100"
                  >
                    <option value="CAT-STAT">Stationery</option>
                    <option value="CAT-LAB">Lab Chemicals &amp; Reagents</option>
                    <option value="CAT-IT">IT Hardware</option>
                    <option value="CAT-MED">Medical Clinic</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Unit of Measure (UOM)</label>
                  <select
                    value={newItemUom}
                    onChange={e => setNewItemUom(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-100"
                  >
                    <option value="UOM-EACH">EACH (Units)</option>
                    <option value="UOM-BOX-10">BOX of 10</option>
                    <option value="UOM-PACK-50">PACK of 50</option>
                    <option value="UOM-KG">Kilograms (KG)</option>
                    <option value="UOM-L">Liters (L)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Standard Unit Cost (₹)</label>
                  <input
                    type="number"
                    value={newItemCost}
                    onChange={e => setNewItemCost(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-100 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Reorder Point</label>
                  <input
                    type="number"
                    value={newItemReorder}
                    onChange={e => setNewItemReorder(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-100 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Minimum Stock</label>
                  <input
                    type="number"
                    value={newItemMin}
                    onChange={e => setNewItemMin(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-100 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Maximum Stock</label>
                  <input
                    type="number"
                    value={newItemMax}
                    onChange={e => setNewItemMax(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-100 font-mono"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-slate-400 mb-1">Description</label>
                  <input
                    type="text"
                    value={newItemDesc}
                    onChange={e => setNewItemDesc(e.target.value)}
                    placeholder="Specification and usage guidelines"
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-100"
                  />
                </div>
                <div className="flex items-center gap-4 pt-4 md:col-span-2">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newItemIsConsumable}
                      onChange={e => setNewItemIsConsumable(e.target.checked)}
                      className="rounded bg-slate-950 border-slate-700 text-emerald-500"
                    />
                    <span className="text-slate-300">Consumable</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newItemIsSerialized}
                      onChange={e => setNewItemIsSerialized(e.target.checked)}
                      className="rounded bg-slate-950 border-slate-700 text-emerald-500"
                    />
                    <span className="text-slate-300">Serialized</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newItemIsBatch}
                      onChange={e => setNewItemIsBatch(e.target.checked)}
                      className="rounded bg-slate-950 border-slate-700 text-emerald-500"
                    />
                    <span className="text-slate-300">Batch/Lot Controlled</span>
                  </label>
                </div>
                <div className="md:col-span-4 flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-medium transition"
                  >
                    Save SKU to Catalog
                  </button>
                </div>
              </form>
            </div>

            {/* Items Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
              <div className="px-5 py-3 border-b border-slate-800 flex justify-between items-center">
                <h3 className="text-sm font-semibold text-slate-200">Registered SKU Inventory Items ({items.length})</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800">
                    <tr>
                      <th className="px-4 py-3">Item Code</th>
                      <th className="px-4 py-3">Name &amp; Description</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Cost</th>
                      <th className="px-4 py-3">Stock Limits (Min / Reorder / Max)</th>
                      <th className="px-4 py-3">Attributes</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {items.map(item => (
                      <tr key={item.itemId} className="hover:bg-slate-800/40 transition">
                        <td className="px-4 py-3 font-mono text-emerald-400 font-medium">{item.itemCode}</td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-200">{item.name}</div>
                          <div className="text-[11px] text-slate-400 truncate max-w-xs">{item.description}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">
                            {item.categoryIdRef}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono">₹{item.standardCost.toLocaleString()}</td>
                        <td className="px-4 py-3 font-mono">
                          {item.minimumStock} / <span className="text-amber-400 font-bold">{item.reorderThreshold}</span> / {item.maximumStock}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1 flex-wrap">
                            {item.isConsumable && (
                              <span className="px-1.5 py-0.2 rounded bg-blue-950 text-blue-300 text-[9px] border border-blue-800">
                                Consumable
                              </span>
                            )}
                            {item.isSerialized && (
                              <span className="px-1.5 py-0.2 rounded bg-purple-950 text-purple-300 text-[9px] border border-purple-800">
                                Serialized
                              </span>
                            )}
                            {item.isBatchControlled && (
                              <span className="px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 text-[9px] border border-amber-800">
                                Batch
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] border border-emerald-800 font-mono">
                            ACTIVE
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

        {/* STORES TAB */}
        {activeTab === 'stores' && (
          <div className="space-y-6">
            {/* Create Store */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
              <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
                <Warehouse className="w-4 h-4 text-emerald-400" />
                Configure New Store / Warehouse Location
              </h3>
              <form onSubmit={handleCreateStore} className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Store Code *</label>
                  <input
                    type="text"
                    required
                    value={newStoreCode}
                    onChange={e => setNewStoreCode(e.target.value)}
                    placeholder="e.g. DEL-STORE-CHEM"
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-100 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Store Name *</label>
                  <input
                    type="text"
                    required
                    value={newStoreName}
                    onChange={e => setNewStoreName(e.target.value)}
                    placeholder="e.g. Chemistry Hazardous Supplies Depot"
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Max Capacity (Units)</label>
                  <input
                    type="number"
                    value={newStoreCapacity}
                    onChange={e => setNewStoreCapacity(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-100 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Security Classification</label>
                  <select
                    value={newStoreClassification}
                    onChange={e => setNewStoreClassification(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-100"
                  >
                    <option value="STANDARD">Standard</option>
                    <option value="RESTRICTED">Restricted Access</option>
                    <option value="HIGH_SECURITY">High Security</option>
                    <option value="HAZMAT">Hazmat Chemical Zone</option>
                  </select>
                </div>
                <div className="md:col-span-4 flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-medium transition"
                  >
                    Create Warehouse Location
                  </button>
                </div>
              </form>
            </div>

            {/* Stores List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stores.map(st => (
                <div key={st.storeId} className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="font-mono text-emerald-400 text-xs font-bold">{st.storeCode}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                        st.status === 'ACTIVE'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-rose-950 text-rose-400 border border-rose-800'
                      }`}>
                        {st.status}
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-slate-100 mt-2">{st.name}</h4>
                    <div className="text-xs text-slate-400 mt-1">Campus: {st.campusIdRef}</div>
                    <div className="mt-3 text-xs text-slate-300 space-y-1">
                      <div>Security: <span className="text-amber-400 font-mono">{st.securityClassification}</span></div>
                      <div>Capacity: <span className="font-mono">{st.currentUtilization} / {st.capacityMax}</span> units</div>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-mono">Officer: {st.responsibleOfficerUserIdRef}</span>
                    {st.status === 'ACTIVE' ? (
                      <button
                        onClick={() => {
                          inventoryAssetsStoresMaterialsService.updateStoreStatus(st.storeId, tenantId, 'CLOSED', 'USER_ADMIN');
                          setSuccessMsg(`Store ${st.storeCode} marked CLOSED.`);
                          loadData();
                        }}
                        className="text-rose-400 hover:text-rose-300 font-medium"
                      >
                        Decommission
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          inventoryAssetsStoresMaterialsService.updateStoreStatus(st.storeId, tenantId, 'ACTIVE', 'USER_ADMIN');
                          setSuccessMsg(`Store ${st.storeCode} restored to ACTIVE.`);
                          loadData();
                        }}
                        className="text-emerald-400 hover:text-emerald-300 font-medium"
                      >
                        Reopen
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BALANCES TAB */}
        {activeTab === 'balances' && (
          <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-800 flex justify-between items-center">
              <h3 className="text-sm font-semibold text-slate-200">Authoritative Stock Balances &amp; Availability</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3">Item Reference</th>
                    <th className="px-4 py-3">Store Location</th>
                    <th className="px-4 py-3">On-Hand</th>
                    <th className="px-4 py-3">Reserved</th>
                    <th className="px-4 py-3">Quarantined</th>
                    <th className="px-4 py-3">Damaged</th>
                    <th className="px-4 py-3">In-Transit</th>
                    <th className="px-4 py-3">Available for Issue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono">
                  {balances.map(b => {
                    const item = items.find(i => i.itemId === b.itemIdRef);
                    const store = stores.find(s => s.storeId === b.storeIdRef);
                    return (
                      <tr key={b.balanceId} className="hover:bg-slate-800/40 transition">
                        <td className="px-4 py-3">
                          <div className="text-emerald-400 font-bold">{item?.itemCode || b.itemIdRef}</div>
                          <div className="text-[11px] text-slate-400 font-sans">{item?.name}</div>
                        </td>
                        <td className="px-4 py-3 text-slate-300 font-sans">{store?.name || b.storeIdRef}</td>
                        <td className="px-4 py-3 text-slate-100 font-bold">{b.onHand}</td>
                        <td className="px-4 py-3 text-amber-400">{b.reserved}</td>
                        <td className="px-4 py-3 text-rose-400">{b.quarantined}</td>
                        <td className="px-4 py-3 text-rose-500">{b.damaged}</td>
                        <td className="px-4 py-3 text-indigo-400">{b.inTransit}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                            b.available > 0 ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300 border border-rose-800'
                          }`}>
                            {b.available}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* RECEIPTS TAB */}
        {activeTab === 'receipts' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
              <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                Draft &amp; Post Goods Receipt Note (GRN)
              </h3>
              <form onSubmit={handleCreateReceipt} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Receiving Warehouse *</label>
                  <select
                    value={rcptStoreId}
                    onChange={e => setRcptStoreId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-100"
                  >
                    {stores.filter(s => s.status === 'ACTIVE').map(s => (
                      <option key={s.storeId} value={s.storeId}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Inventory Item *</label>
                  <select
                    value={rcptItemId}
                    onChange={e => setRcptItemId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-100"
                  >
                    {items.map(i => (
                      <option key={i.itemId} value={i.itemId}>{i.itemCode} - {i.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Quantity Received</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={rcptQty}
                    onChange={e => setRcptQty(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-100 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Unit Price (₹)</label>
                  <input
                    type="number"
                    value={rcptUnitPrice}
                    onChange={e => setRcptUnitPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-100 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Purchase Order Ref (Phase 11.3)</label>
                  <input
                    type="text"
                    value={rcptPO}
                    onChange={e => setRcptPO(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-100 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Supplier Ref (Phase 11.3)</label>
                  <input
                    type="text"
                    value={rcptSupplier}
                    onChange={e => setRcptSupplier(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-100 font-mono"
                  />
                </div>
                <div className="md:col-span-2 flex items-end justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-medium transition"
                  >
                    Post Goods Receipt
                  </button>
                </div>
              </form>
            </div>

            {/* Receipts Ledger */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
              <div className="px-5 py-3 border-b border-slate-800 flex justify-between items-center">
                <h3 className="text-sm font-semibold text-slate-200">Goods Receipt Notes (GRN) Ledger</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800">
                    <tr>
                      <th className="px-4 py-3">GRN #</th>
                      <th className="px-4 py-3">Store Location</th>
                      <th className="px-4 py-3">PO &amp; Supplier Ref</th>
                      <th className="px-4 py-3">Lines</th>
                      <th className="px-4 py-3">Total Amount</th>
                      <th className="px-4 py-3">Received At</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {receipts.map(r => (
                      <tr key={r.receiptId} className="hover:bg-slate-800/40 transition">
                        <td className="px-4 py-3 font-mono text-emerald-400 font-bold">{r.receiptNumber}</td>
                        <td className="px-4 py-3">{r.storeIdRef}</td>
                        <td className="px-4 py-3 font-mono text-[11px]">
                          <div>PO: {r.purchaseOrderIdRef || 'N/A'}</div>
                          <div className="text-slate-400">SUP: {r.supplierIdRef || 'N/A'}</div>
                        </td>
                        <td className="px-4 py-3 font-mono">{r.lines.length} items ({r.lines[0]?.quantityReceived} units)</td>
                        <td className="px-4 py-3 font-mono font-bold text-slate-100">₹{r.totalAmount.toLocaleString()}</td>
                        <td className="px-4 py-3 font-mono text-slate-400">{new Date(r.receivedAt).toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] border border-emerald-800 font-mono font-bold">
                            {r.status}
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

        {/* ISSUES TAB */}
        {activeTab === 'issues' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
              <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
                <Send className="w-4 h-4 text-emerald-400" />
                Submit Material Issue Requisition
              </h3>
              <form onSubmit={handleCreateIssue} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Issuing Store *</label>
                  <select
                    value={issueStoreId}
                    onChange={e => setIssueStoreId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-100"
                  >
                    {stores.filter(s => s.status === 'ACTIVE').map(s => (
                      <option key={s.storeId} value={s.storeId}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Item SKU *</label>
                  <select
                    value={issueItemId}
                    onChange={e => setIssueItemId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-100"
                  >
                    {items.map(i => (
                      <option key={i.itemId} value={i.itemId}>{i.itemCode} - {i.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Quantity Requested</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={issueQty}
                    onChange={e => setIssueQty(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-100 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Recipient Type</label>
                  <select
                    value={issueRecipientType}
                    onChange={e => setIssueRecipientType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-100"
                  >
                    <option value="EMPLOYEE">Employee / Faculty (Phase 11.1)</option>
                    <option value="STUDENT">Student (Phase 10.4)</option>
                    <option value="ORG_UNIT">Department / Unit (Phase 10.1)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Recipient Identifier Ref *</label>
                  <input
                    type="text"
                    required
                    value={issueRecipientId}
                    onChange={e => setIssueRecipientId(e.target.value)}
                    placeholder="e.g. EMP-FACULTY-01"
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-100 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Requisition Purpose</label>
                  <input
                    type="text"
                    value={issuePurpose}
                    onChange={e => setIssuePurpose(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-100"
                  />
                </div>
                <div className="md:col-span-3 flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-medium transition"
                  >
                    Submit Requisition
                  </button>
                </div>
              </form>
            </div>

            {/* Requisitions List */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
              <div className="px-5 py-3 border-b border-slate-800 flex justify-between items-center">
                <h3 className="text-sm font-semibold text-slate-200">Requisitions &amp; Stock Issues ({issues.length})</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800">
                    <tr>
                      <th className="px-4 py-3">Requisition #</th>
                      <th className="px-4 py-3">Recipient</th>
                      <th className="px-4 py-3">Store</th>
                      <th className="px-4 py-3">Requested Line</th>
                      <th className="px-4 py-3">Purpose</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {issues.map(iss => (
                      <tr key={iss.issueId} className="hover:bg-slate-800/40 transition">
                        <td className="px-4 py-3 font-mono text-emerald-400 font-bold">{iss.issueNumber}</td>
                        <td className="px-4 py-3">
                          <div className="font-mono text-slate-200">{iss.recipientIdRef}</div>
                          <div className="text-[10px] text-slate-400">{iss.recipientType}</div>
                        </td>
                        <td className="px-4 py-3">{iss.storeIdRef}</td>
                        <td className="px-4 py-3 font-mono">
                          {iss.lines[0]?.itemIdRef} ({iss.lines[0]?.quantityRequested} qty)
                        </td>
                        <td className="px-4 py-3 text-slate-400">{iss.purpose}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            iss.status === 'ISSUED'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-amber-950 text-amber-400 border border-amber-800'
                          }`}>
                            {iss.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {iss.status === 'REQUESTED' && (
                            <button
                              onClick={() => handleApproveAndIssue(iss.issueId)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-medium transition"
                            >
                              Approve &amp; Issue (SoD)
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

        {/* ADJUSTMENTS TAB */}
        {activeTab === 'adjustments' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
              <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-400" />
                Request Stock Adjustment (Four-Eyes SoD Mandated)
              </h3>
              <form onSubmit={handleRequestAdjustment} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Target Store *</label>
                  <select
                    value={adjStoreId}
                    onChange={e => setAdjStoreId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-100"
                  >
                    {stores.filter(s => s.status === 'ACTIVE').map(s => (
                      <option key={s.storeId} value={s.storeId}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Item SKU *</label>
                  <select
                    value={adjItemId}
                    onChange={e => setAdjItemId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-100"
                  >
                    {items.map(i => (
                      <option key={i.itemId} value={i.itemId}>{i.itemCode} - {i.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Adjustment Type</label>
                  <select
                    value={adjType}
                    onChange={e => setAdjType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-100"
                  >
                    <option value="DAMAGE">Damage Reclassification</option>
                    <option value="WRITE_OFF">Write-Off (Shrinkage/Loss)</option>
                    <option value="DECREASE">Quantity Decrease</option>
                    <option value="INCREASE">Quantity Increase (Surplus)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Quantity Impact</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={adjQty}
                    onChange={e => setAdjQty(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-100 font-mono"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-slate-400 mb-1">Auditable Reason / Incident Reference *</label>
                  <input
                    type="text"
                    required
                    value={adjReason}
                    onChange={e => setAdjReason(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Requester User ID</label>
                  <input
                    type="text"
                    value={adjRequester}
                    onChange={e => setAdjRequester(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-100 font-mono"
                  />
                </div>
                <div className="flex items-end justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-medium transition"
                  >
                    Submit Adjustment
                  </button>
                </div>
              </form>
            </div>

            {/* Adjustments Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
              <div className="px-5 py-3 border-b border-slate-800 flex justify-between items-center">
                <h3 className="text-sm font-semibold text-slate-200">Stock Adjustment Ledger &amp; SoD Sign-Offs</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800">
                    <tr>
                      <th className="px-4 py-3">Adjustment #</th>
                      <th className="px-4 py-3">Item &amp; Store</th>
                      <th className="px-4 py-3">Type &amp; Qty</th>
                      <th className="px-4 py-3">Previous &rarr; New</th>
                      <th className="px-4 py-3">Reason</th>
                      <th className="px-4 py-3">Requester &rarr; Approver</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {adjustments.map(adj => (
                      <tr key={adj.adjustmentId} className="hover:bg-slate-800/40 transition">
                        <td className="px-4 py-3 font-mono text-emerald-400 font-bold">{adj.adjustmentNumber}</td>
                        <td className="px-4 py-3">
                          <div className="font-mono text-slate-200">{adj.itemIdRef}</div>
                          <div className="text-[10px] text-slate-400">{adj.storeIdRef}</div>
                        </td>
                        <td className="px-4 py-3 font-mono">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            adj.adjustmentType === 'DAMAGE' ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-slate-800 text-slate-300'
                          }`}>
                            {adj.adjustmentType} ({adj.quantity})
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono text-slate-300">
                          {adj.previousQuantity} &rarr; <span className="text-emerald-400 font-bold">{adj.newQuantity}</span>
                        </td>
                        <td className="px-4 py-3 text-slate-400">{adj.reason}</td>
                        <td className="px-4 py-3 font-mono text-[11px]">
                          <div>Req: {adj.requestedByUserIdRef}</div>
                          <div className="text-slate-500">App: {adj.approvedByUserIdRef || 'Pending'}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            adj.status === 'POSTED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                          }`}>
                            {adj.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {adj.status === 'REQUESTED' && (
                            <button
                              onClick={() => handleApproveAdjustment(adj.adjustmentId, adj.requestedByUserIdRef)}
                              className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[11px] font-medium transition"
                            >
                              Approve SoD
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

        {/* OPERATIONAL ASSETS TAB */}
        {activeTab === 'assets' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
              <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
                <Tag className="w-4 h-4 text-emerald-400" />
                Register Institutional Operational / Fixed Asset
              </h3>
              <form onSubmit={handleCreateAsset} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Asset Code *</label>
                  <input
                    type="text"
                    required
                    value={astCode}
                    onChange={e => setAstCode(e.target.value)}
                    placeholder="e.g. AST-IT-2025-101"
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-100 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Asset Name *</label>
                  <input
                    type="text"
                    required
                    value={astName}
                    onChange={e => setAstName(e.target.value)}
                    placeholder="e.g. Dell Precision 7780 Workstation"
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Asset Category</label>
                  <select
                    value={astCategory}
                    onChange={e => setAstCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-100"
                  >
                    <option value="ACAT-COMP">Computing &amp; Workstations</option>
                    <option value="ACAT-LABEQ">Laboratory Research Equipment</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Acquisition Cost (₹)</label>
                  <input
                    type="number"
                    value={astCost}
                    onChange={e => setAstCost(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-100 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Serial Number</label>
                  <input
                    type="text"
                    value={astSerial}
                    onChange={e => setAstSerial(e.target.value)}
                    placeholder="Manufacturer Serial"
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-100 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Barcode / Asset Tag</label>
                  <input
                    type="text"
                    value={astBarcode}
                    onChange={e => setAstBarcode(e.target.value)}
                    placeholder="BC-AST-99"
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-100 font-mono"
                  />
                </div>
                <div className="md:col-span-2 flex items-end justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-medium transition"
                  >
                    Register Asset
                  </button>
                </div>
              </form>
            </div>

            {/* Assets Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
              <div className="px-5 py-3 border-b border-slate-800 flex justify-between items-center">
                <h3 className="text-sm font-semibold text-slate-200">Asset Register ({assets.length})</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800">
                    <tr>
                      <th className="px-4 py-3">Asset Code</th>
                      <th className="px-4 py-3">Asset Name &amp; Category</th>
                      <th className="px-4 py-3">Identifiers (SN / Tag)</th>
                      <th className="px-4 py-3">Cost &amp; Book Value</th>
                      <th className="px-4 py-3">Linked Space (Phase 11.5)</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {assets.map(ast => (
                      <tr key={ast.assetId} className="hover:bg-slate-800/40 transition">
                        <td className="px-4 py-3 font-mono text-emerald-400 font-bold">{ast.assetCode}</td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-200">{ast.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{ast.categoryIdRef}</div>
                        </td>
                        <td className="px-4 py-3 font-mono text-[11px]">
                          <div>SN: {ast.serialNumber || 'N/A'}</div>
                          <div className="text-slate-400">TAG: {ast.barCode || 'N/A'}</div>
                        </td>
                        <td className="px-4 py-3 font-mono">
                          <div className="text-slate-100 font-bold">₹{ast.purchaseCost.toLocaleString()}</div>
                          <div className="text-[10px] text-slate-400">Book: ₹{ast.currentBookValue.toLocaleString()}</div>
                        </td>
                        <td className="px-4 py-3 font-mono text-slate-300">{ast.facilitySpaceIdRef || 'General Pool'}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            ast.status === 'ASSIGNED'
                              ? 'bg-purple-950 text-purple-300 border border-purple-800'
                              : ast.status === 'IN_SERVICE'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : 'bg-slate-800 text-slate-300'
                          }`}>
                            {ast.status}
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

        {/* DIAGNOSTICS TAB */}
        {activeTab === 'diagnostics' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-emerald-400" />
                  Inventory Integrity &amp; Anomaly Diagnostics Engine
                </h3>
                <button
                  onClick={() => {
                    const res = inventoryAssetsStoresMaterialsService.runDiagnostics(tenantId);
                    setDiagnosticsResult(res);
                    setSuccessMsg('Diagnostics scan completed.');
                  }}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs rounded transition"
                >
                  Run Full Scan
                </button>
              </div>

              {diagnosticsResult && (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono">
                    <div className="bg-slate-950 p-3 rounded border border-slate-800">
                      <div className="text-slate-400 text-[11px]">Scan Verdict</div>
                      <div className={`text-lg font-bold ${diagnosticsResult.status === 'HEALTHY' ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {diagnosticsResult.status}
                      </div>
                    </div>
                    <div className="bg-slate-950 p-3 rounded border border-slate-800">
                      <div className="text-slate-400 text-[11px]">Total SKUs Checked</div>
                      <div className="text-lg font-bold text-slate-100">{diagnosticsResult.totalItems}</div>
                    </div>
                    <div className="bg-slate-950 p-3 rounded border border-slate-800">
                      <div className="text-slate-400 text-[11px]">Active Balances</div>
                      <div className="text-lg font-bold text-slate-100">{diagnosticsResult.totalBalances}</div>
                    </div>
                    <div className="bg-slate-950 p-3 rounded border border-slate-800">
                      <div className="text-slate-400 text-[11px]">Anomalies Found</div>
                      <div className="text-lg font-bold text-emerald-400">{diagnosticsResult.anomaliesCount}</div>
                    </div>
                  </div>

                  {diagnosticsResult.anomaliesCount === 0 ? (
                    <div className="p-4 bg-emerald-950/40 border border-emerald-800/80 rounded-lg text-emerald-300 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      Zero anomalies detected. Balances, lots, serials, and asset custody mappings are healthy and reconciled.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {diagnosticsResult.anomalies.map((an: string, idx: number) => (
                        <div key={idx} className="p-3 bg-amber-950/40 border border-amber-800/80 rounded text-amber-200 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-amber-400" />
                          {an}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* AUDIT TAB */}
        {activeTab === 'audit' && (
          <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-800 flex justify-between items-center">
              <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <History className="w-4 h-4 text-emerald-400" />
                Immutable SHA-256 Provenance &amp; Material Audit Trail
              </h3>
              <span className="text-xs text-slate-400 font-mono">{auditEvents.length} events logged</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3">Timestamp</th>
                    <th className="px-4 py-3">Actor User</th>
                    <th className="px-4 py-3">Action &amp; Target</th>
                    <th className="px-4 py-3">SHA-256 Block Hash</th>
                    <th className="px-4 py-3">Previous Block Hash</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono text-[11px]">
                  {auditEvents.map(ev => (
                    <tr key={ev.eventId} className="hover:bg-slate-800/40 transition">
                      <td className="px-4 py-3 text-slate-400">{new Date(ev.timestamp).toLocaleString()}</td>
                      <td className="px-4 py-3 text-slate-200">{ev.actorUserIdRef}</td>
                      <td className="px-4 py-3">
                        <span className="px-1.5 py-0.5 rounded bg-slate-800 text-emerald-300 font-bold">
                          {ev.action}
                        </span>{' '}
                        <span className="text-slate-400">{ev.entityType}:{ev.entityId}</span>
                      </td>
                      <td className="px-4 py-3 text-emerald-400">{ev.hash.substring(0, 16)}...</td>
                      <td className="px-4 py-3 text-slate-500">{ev.previousHash.substring(0, 16)}...</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* WHAT-IF SANDBOX TAB */}
        {activeTab === 'sandbox' && (
          <div className="space-y-6">
            {/* Prominent Sandbox Banner */}
            <div className="bg-amber-950/70 border border-amber-700/80 rounded-lg p-4 text-amber-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 animate-pulse" />
                <div>
                  <div className="font-bold text-sm">SIMULATION ONLY — SANDBOX MODE ACTIVE</div>
                  <div className="text-xs text-amber-300">
                    Runs against isolated in-memory cloned state. ZERO live database mutations or ledger modifications.
                  </div>
                </div>
              </div>
              <span className="px-3 py-1 bg-amber-900 text-amber-100 rounded text-xs font-mono font-bold">
                CLONE ISOLATION
              </span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
              <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                Execute Isolated What-If Stress Simulation (15 Scenarios)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs text-slate-400 mb-1">Select Scenario</label>
                  <select
                    value={selectedScenario}
                    onChange={e => setSelectedScenario(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-xs text-slate-100"
                  >
                    <option value="DEMAND_SURGE">1. Academic Exam &amp; Laboratory Demand Surge (+200%)</option>
                    <option value="STOCKOUT">2. Critical Reagent Stockout &amp; Rationing Protocol</option>
                    <option value="WAREHOUSE_CAPACITY_EXHAUSTION">3. Warehouse Capacity Exhaustion (95% full)</option>
                    <option value="CAMPUS_TRANSFER_SURGE">4. Inter-Campus Emergency Logistics Transfer Surge</option>
                    <option value="RESERVATION_SPIKE">5. Student Capstone Project Reservation Spike</option>
                    <option value="SUPPLIER_RECEIPT_DELAY">6. Tier-1 Supplier Delivery Schedule Delay (30 days)</option>
                    <option value="BATCH_EXPIRY_CASCADE">7. Chemical Batch Expiry Cascade &amp; Quarantine</option>
                    <option value="SERIAL_NUMBER_COLLISION">8. Barcode &amp; Serial Number Scanning Conflict</option>
                    <option value="PHYSICAL_COUNT_VARIANCE">9. High-Value IT Asset Physical Count Discrepancy</option>
                    <option value="EMERGENCY_STOCK_RELEASE">10. Campus Safety Emergency Materials Release</option>
                    <option value="ASSET_ASSIGNMENT_SURGE">11. New Faculty Cohort Laptop Batch Allocation</option>
                    <option value="ASSET_TRANSFER_CASCADE">12. Inter-Departmental Asset Relocation Cascade</option>
                    <option value="DISPOSAL_BACKLOG">13. Obsolete Computing Equipment Disposal Backlog</option>
                    <option value="NEGATIVE_STOCK_DETECTION">14. Unreconciled Negative Book Balance Detection</option>
                    <option value="PROCUREMENT_DISRUPTION">15. Global Materials Supply Chain Disruption</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={handleRunSimulation}
                    className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-medium flex items-center justify-center gap-2 transition"
                  >
                    <Play className="w-3.5 h-3.5" />
                    Run Simulation in Sandbox
                  </button>
                </div>
              </div>

              {simResult && (
                <div className="mt-6 pt-5 border-t border-slate-800 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm text-slate-100">{simResult.scenario.name}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 text-xs font-mono font-bold">
                      {simResult.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                    <div className="bg-slate-950 p-3 rounded border border-slate-800">
                      <div className="text-slate-400 text-[11px]">Stock Balance Delta</div>
                      <div className="text-lg font-bold text-amber-400">
                        {simResult.scenario.simulatedImpact.stockBalanceDelta || 0} units
                      </div>
                    </div>
                    <div className="bg-slate-950 p-3 rounded border border-slate-800">
                      <div className="text-slate-400 text-[11px]">Stockout Risk Index</div>
                      <div className="text-lg font-bold text-rose-400">
                        {simResult.scenario.simulatedImpact.stockoutRiskPercentage || 0}%
                      </div>
                    </div>
                    <div className="bg-slate-950 p-3 rounded border border-slate-800">
                      <div className="text-slate-400 text-[11px]">Projected Cost Impact</div>
                      <div className="text-lg font-bold text-slate-100">
                        ₹{(simResult.scenario.simulatedImpact.costImpact || 0).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-4 rounded border border-slate-800 text-xs space-y-2">
                    <div className="font-semibold text-slate-200">Recommended Governance Actions:</div>
                    <ul className="list-disc list-inside text-slate-400 space-y-1">
                      {simResult.scenario.simulatedImpact.recommendations.map((rec: string, i: number) => (
                        <li key={i}>{rec}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="text-[11px] text-slate-500 font-mono flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Verified 0 production records modified across {simResult.clonedItemCount} simulated SKUs.
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
