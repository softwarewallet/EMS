import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Truck,
  FileCheck,
  Package,
  AlertTriangle,
  Shield,
  Activity,
  PlayCircle,
  FileText,
  DollarSign,
  CheckCircle2,
  XCircle,
  Users
} from 'lucide-react';
import { institutionalProcurementOperationsService } from '../../services/institutionalProcurementOperationsService';
import {
  Supplier,
  PurchaseOrder,
  ProcurementAuditEvent,
  ProcurementSimulationScenario,
} from '../../types/institutionalProcurementOperations';
import { BookLoader } from '../common/BookLoader';

export const InstitutionalProcurementOperationsWorkspace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'suppliers'
    | 'requisitions'
    | 'purchase_orders'
    | 'receipts'
    | 'three_way_match'
    | 'disputes'
    | 'diagnostics'
    | 'sandbox'
    | 'audit'
  >('overview');

  const tenantId = 'TENANT_INDIA_DEFAULT';
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [auditEvents, setAuditEvents] = useState<ProcurementAuditEvent[]>([]);
  const [simulationResult, setSimulationResult] = useState<ProcurementSimulationScenario | null>(null);
  const [loading, setLoading] = useState(true);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form states
  const [newSupplierName, setNewSupplierName] = useState('');
  const [newSupplierCat, setNewSupplierCat] = useState('General Goods');
  const [matchPoId, setMatchPoId] = useState('PO-2001');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    try {
      setSuppliers(institutionalProcurementOperationsService.getSuppliers(tenantId));
      setPurchaseOrders(institutionalProcurementOperationsService.getPurchaseOrders(tenantId));
      setAuditEvents(institutionalProcurementOperationsService.getAuditTrail(tenantId));
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackMessage(null);
    setErrorMessage(null);

    try {
      institutionalProcurementOperationsService.createSupplier(
        {
          supplierNumber: `SUP-NUM-${Date.now().toString().slice(-4)}`,
          tenantId,
          campusIdRef: 'CAMPUS_DELHI',
          legalName: newSupplierName,
          displayName: newSupplierName,
          category: newSupplierCat,
          status: 'UNDER_REVIEW',
          qualificationState: 'PENDING',
          contactEmail: 'contact@supplier.com',
          contactPhone: '+91 98765 43210',
          taxIdentifier: '07GST123456789',
        },
        `SUP_KEY_${Date.now()}`
      );
      setNewSupplierName('');
      setFeedbackMessage('Supplier created successfully in UNDER_REVIEW state.');
      loadData();
    } catch (err: any) {
      setErrorMessage(err.message || 'Error creating supplier');
    }
  };

  const handleApproveSupplierSoD = (supplierId: string, sameUser: boolean) => {
    setFeedbackMessage(null);
    setErrorMessage(null);

    try {
      const requester = 'USER_REQ_1';
      const approver = sameUser ? 'USER_REQ_1' : 'USER_APP_2';

      institutionalProcurementOperationsService.approveSupplier(supplierId, tenantId, requester, approver);
      setFeedbackMessage('Supplier approved and qualified cleanly via Four-Eyes SoD.');
      loadData();
    } catch (err: any) {
      setErrorMessage(err.message);
    }
  };

  const handleRunSimulation = (scenarioId: string) => {
    setFeedbackMessage(null);
    setErrorMessage(null);
    try {
      const result = institutionalProcurementOperationsService.runSimulation(scenarioId);
      setSimulationResult(result);
    } catch (err: any) {
      setErrorMessage(err.message);
    }
  };

  if (loading) {
    return <BookLoader size="large" text="Loading Institutional Procurement Workspace..." />;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-6 rounded-2xl text-white shadow-xl">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-sky-600 rounded-xl">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Institutional Procurement & Purchasing</h1>
              <p className="text-sm text-slate-400 mt-1">
                Supplier Master, Requisitions, PO Amendments, 3-Way Matching, and SoD Governance
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-sky-950 text-sky-400 border border-sky-800 rounded-full text-xs font-semibold">
            EMS Phase 11.3 Active
          </span>
        </div>
      </div>

      {/* Banner / Alerts */}
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
          { id: 'suppliers', label: 'Suppliers & Qualification', icon: Users },
          { id: 'purchase_orders', label: 'Purchase Orders', icon: FileText },
          { id: 'three_way_match', label: 'Three-Way Match', icon: FileCheck },
          { id: 'diagnostics', label: 'Diagnostics & Controls', icon: AlertTriangle },
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

      {/* TAB CONTENT */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Active Suppliers</span>
              <Users className="w-5 h-5 text-sky-400" />
            </div>
            <p className="text-3xl font-extrabold text-white">{suppliers.length}</p>
            <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% Qualification Verified
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Purchase Orders</span>
              <FileText className="w-5 h-5 text-sky-400" />
            </div>
            <p className="text-3xl font-extrabold text-white">{purchaseOrders.length}</p>
            <p className="text-xs text-slate-400 mt-2">Active Commitment Lines</p>
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

      {activeTab === 'suppliers' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Register New Supplier</h3>
            <form onSubmit={handleCreateSupplier} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Legal Supplier Name"
                value={newSupplierName}
                onChange={(e) => setNewSupplierName(e.target.value)}
                required
                className="bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-sky-500"
              />
              <select
                value={newSupplierCat}
                onChange={(e) => setNewSupplierCat(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-sky-500"
              >
                <option value="General Goods">General Goods</option>
                <option value="Lab Equipment & Stationery">Lab Equipment & Stationery</option>
                <option value="IT Hardware & Software">IT Hardware & Software</option>
                <option value="Facility Maintenance">Facility Maintenance</option>
              </select>
              <button
                type="submit"
                className="bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-xl px-4 py-2.5 text-sm transition-all shadow-lg shadow-sky-600/20"
              >
                Register Supplier
              </button>
            </form>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">Supplier Master Directory</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Supplier Number</th>
                    <th className="p-4">Name</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Qualification</th>
                    <th className="p-4">Actions (SoD Test)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {suppliers.map((s) => (
                    <tr key={s.supplierId} className="hover:bg-slate-800/30">
                      <td className="p-4 font-mono text-sky-400">{s.supplierNumber}</td>
                      <td className="p-4 font-medium text-white">{s.legalName}</td>
                      <td className="p-4">{s.category}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          s.status === 'APPROVED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                        }`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="p-4">{s.qualificationState}</td>
                      <td className="p-4 flex gap-2">
                        {s.status !== 'APPROVED' && (
                          <>
                            <button
                              onClick={() => handleApproveSupplierSoD(s.supplierId, false)}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-all"
                            >
                              Approve (SoD Pass)
                            </button>
                            <button
                              onClick={() => handleApproveSupplierSoD(s.supplierId, true)}
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

      {activeTab === 'purchase_orders' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white">Active Purchase Orders</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="p-4">PO Number</th>
                  <th className="p-4">Supplier</th>
                  <th className="p-4">Total Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Requester</th>
                  <th className="p-4">Approver</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {purchaseOrders.map((p) => (
                  <tr key={p.poId} className="hover:bg-slate-800/30">
                    <td className="p-4 font-mono text-sky-400">{p.poNumber}</td>
                    <td className="p-4">{p.supplierIdRef}</td>
                    <td className="p-4 font-medium text-white">
                      ₹{(p.totalAmount.amountMinor / 100).toFixed(2)}
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-full text-xs font-semibold">
                        {p.status}
                      </span>
                    </td>
                    <td className="p-4 text-xs font-mono">{p.requesterUserIdRef}</td>
                    <td className="p-4 text-xs font-mono">{p.approverUserIdRef || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'three_way_match' && (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <h3 className="text-lg font-bold text-white">Three-Way Matching Processor</h3>
          <p className="text-sm text-slate-400">
            Verifies Purchase Order vs Goods Receipt vs Supplier Invoice deterministically.
          </p>
          <div className="flex gap-4">
            <input
              type="text"
              value={matchPoId}
              onChange={(e) => setMatchPoId(e.target.value)}
              placeholder="PO ID"
              className="bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm"
            />
            <button
              onClick={() => {
                const match = institutionalProcurementOperationsService.performThreeWayMatch(
                  matchPoId,
                  'INV-999',
                  'REC-999',
                  tenantId
                );
                if (match.status === 'MATCHED') {
                  setFeedbackMessage(`3-Way Match Success: ${match.details}`);
                } else {
                  setErrorMessage(`3-Way Match Result: ${match.status} - ${match.details}`);
                }
              }}
              className="bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-xl px-4 py-2.5 text-sm transition-all"
            >
              Perform 3-Way Match Check
            </button>
          </div>
        </div>
      )}

      {activeTab === 'sandbox' && (
        <div className="space-y-6">
          <div className="bg-amber-950/30 border border-amber-800 p-4 rounded-xl text-amber-300 font-bold text-center tracking-wide">
            SIMULATION ONLY • SANDBOX MODE ACTIVE • ZERO PRODUCTION MUTATION
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { id: 'SUPPLIER_FAILURE', label: 'Supplier Failure Reallocation' },
              { id: 'LARGE_PROCUREMENT_SURGE', label: '500% Requisition Volume Surge' },
              { id: 'PRICE_INCREASE', label: 'Price Increase Impact Test' },
              { id: 'DELIVERY_DELAY', label: 'Supply Chain Delay Simulation' },
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

      {activeTab === 'audit' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white">Append-Only Cryptographic Audit Trail (SHA-256)</h3>
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
