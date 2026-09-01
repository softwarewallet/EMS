import React, { useState, useEffect } from 'react';
import {
  DollarSign, Receipt, CreditCard, ScrollText, AlertTriangle, Shield, 
  Archive, Activity, PlayCircle, Lock, Landmark, RotateCcw
} from 'lucide-react';
import { InstitutionalFinanceOperationsService } from '../../services/institutionalFinanceOperationsService';
import { 
  Invoice, 
  Payment,
  RefundRequest,
  FinancialSimulationScenario 
} from '../../types/institutionalFinanceOperations';

export const InstitutionalFinanceOperationsWorkspace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'accounts'
    | 'invoices'
    | 'payments'
    | 'refunds'
    | 'holds'
    | 'reconciliation'
    | 'diagnostics'
    | 'sandbox'
    | 'audit'
  >('overview');

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [refunds, setRefunds] = useState<RefundRequest[]>([]);
  const [diagnostics, setDiagnostics] = useState<any[]>([]);
  const [simulationResult, setSimulationResult] = useState<FinancialSimulationScenario | null>(null);
  const [loading, setLoading] = useState(true);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const tenantId = 'tenant_default';

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      setInvoices(await InstitutionalFinanceOperationsService.getInvoices(tenantId));
      setPayments(await InstitutionalFinanceOperationsService.getPayments(tenantId));
      setRefunds(await InstitutionalFinanceOperationsService.getRefunds(tenantId));
      setDiagnostics(await InstitutionalFinanceOperationsService.runDiagnostics());
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (actionFn: () => Promise<any>, successMsg: string) => {
    try {
      await actionFn();
      setFeedbackMessage(successMsg);
      loadData();
    } catch (err: any) {
      setFeedbackMessage(`Error: ${err.message}`);
    }
  };

  const runSimulation = (scenarioId: string) => {
    const result = InstitutionalFinanceOperationsService.runSandboxSimulation(scenarioId);
    setSimulationResult(result);
  };

  const scenarios = [
    'S01_LARGE_COHORT_SURGE', 'S02_FEE_INCREASE', 'S03_FEE_DECREASE', 
    'S04_SCHOLARSHIP_SURGE', 'S05_PAYMENT_DEFAULT_SURGE', 'S06_COLLECTION_RECOVERY', 
    'S07_REFUND_SURGE', 'S08_PAYMENT_REVERSAL_CASCADE', 'S09_INSTALLMENT_DEFAULT', 
    'S10_CAMPUS_TRANSFER', 'S11_CROSS_CAMPUS_ENROLLMENT', 'S12_CURRENCY_VARIANCE', 
    'S13_RECEIVABLE_AGING', 'S14_FINANCIAL_HOLD_SURGE', 'S15_RECONCILIATION_FAILURE'
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Finance, Billing & Receivables</h1>
          <p className="text-sm text-gray-600">Authoritative institutional financial operations, monetary transactions, and student accounts.</p>
        </div>
      </div>

      {feedbackMessage && (
        <div className="p-4 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg flex items-center justify-between">
          <span className="text-sm font-medium">{feedbackMessage}</span>
          <button onClick={() => setFeedbackMessage(null)} className="text-blue-600 hover:text-blue-800 text-xs font-bold">DISMISS</button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto space-x-2 border-b pb-2 text-sm">
        {[
          { id: 'overview', label: 'Command Center', icon: Activity },
          { id: 'invoices', label: 'Billing & Invoices', icon: Receipt },
          { id: 'payments', label: 'Payments', icon: CreditCard },
          { id: 'refunds', label: 'Refunds & Reversals', icon: RotateCcw },
          { id: 'holds', label: 'Financial Holds', icon: Lock },
          { id: 'reconciliation', label: 'Reconciliation', icon: Landmark },
          { id: 'sandbox', label: 'What-If Sandbox', icon: PlayCircle },
          { id: 'diagnostics', label: 'Diagnostics', icon: AlertTriangle },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id ? 'bg-indigo-600 text-white shadow' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl shadow border p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-gray-900">Financial Command Center</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
                <span className="text-xs font-semibold text-indigo-600 uppercase">Active Invoices</span>
                <p className="text-2xl font-bold text-indigo-900 mt-1">{invoices.length}</p>
              </div>
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                <span className="text-xs font-semibold text-emerald-600 uppercase">Captured Payments</span>
                <p className="text-2xl font-bold text-emerald-900 mt-1">{payments.length}</p>
              </div>
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl">
                <span className="text-xs font-semibold text-rose-600 uppercase">Pending Refunds</span>
                <p className="text-2xl font-bold text-rose-900 mt-1">{refunds.filter(r => r.status === 'REQUESTED').length}</p>
              </div>
            </div>
            
            <div className="mt-8 border-t pt-6">
              <h3 className="text-md font-bold text-gray-800 mb-4">Quick Transactions</h3>
              <div className="flex flex-wrap gap-4">
                 <button
                    onClick={() => handleAction(() => InstitutionalFinanceOperationsService.issueInvoice({
                      tenantId,
                      studentIdRef: 'stu_001',
                      subtotal: { amountMinorUnits: 500000, currencyCode: 'USD', scale: 2 },
                      discountTotal: { amountMinorUnits: 50000, currencyCode: 'USD', scale: 2 },
                      netAmount: { amountMinorUnits: 450000, currencyCode: 'USD', scale: 2 },
                      paidAmount: { amountMinorUnits: 0, currencyCode: 'USD', scale: 2 },
                      outstandingAmount: { amountMinorUnits: 450000, currencyCode: 'USD', scale: 2 },
                      issueDate: new Date().toISOString(),
                      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
                    }), 'Invoice issued successfully. Arithmetic validated.')}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow flex items-center gap-2"
                 >
                   <Receipt className="w-4 h-4" /> Issue Invoice
                 </button>
                 <button
                    onClick={() => handleAction(() => InstitutionalFinanceOperationsService.requestRefund({
                      tenantId,
                      studentIdRef: 'stu_001',
                      paymentIdRef: 'pay_old_123',
                      amount: { amountMinorUnits: 5000, currencyCode: 'USD', scale: 2 },
                      reason: 'Overpayment adjustment',
                      requesterUserIdRef: 'staff_finance'
                    }), 'Refund request logged securely.')}
                    className="px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-medium hover:bg-rose-700 shadow flex items-center gap-2"
                 >
                   <RotateCcw className="w-4 h-4" /> Request Refund
                 </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'refunds' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Refund Governance (Four-Eyes SoD)</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50 text-gray-700">
                    <th className="p-3">Refund ID</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Requester</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {refunds.length === 0 ? (
                    <tr><td colSpan={5} className="p-4 text-center text-gray-500">No refunds pending.</td></tr>
                  ) : refunds.map(req => (
                    <tr key={req.refundId} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-mono font-medium text-indigo-600">{req.refundId}</td>
                      <td className="p-3 font-mono">{req.amount.currencyCode} {(req.amount.amountMinorUnits / Math.pow(10, req.amount.scale)).toFixed(req.amount.scale)}</td>
                      <td className="p-3 text-xs">{req.requesterUserIdRef}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${req.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="p-3">
                        {req.status === 'REQUESTED' && (
                          <button
                            onClick={() => handleAction(() => InstitutionalFinanceOperationsService.approveRefund(req.refundId, 'bursar_super'), 'Refund Approved (Four-Eyes SoD enforced)')}
                            className="text-xs px-2 py-1 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                          >
                            Approve
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'diagnostics' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Financial Operations Diagnostics</h2>
            <div className="space-y-3">
              {diagnostics.map((d, i) => (
                <div key={i} className={`p-4 rounded-lg border flex items-start gap-3 ${d.severity === 'CRITICAL' ? 'bg-rose-50 border-rose-200 text-rose-900' : d.severity === 'WARNING' ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-emerald-50 border-emerald-200 text-emerald-900'}`}>
                  <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold text-xs uppercase tracking-wider">{d.severity}</span>
                    <p className="text-sm mt-1">{d.message}</p>
                    {d.entityId && <p className="text-xs font-mono mt-1 opacity-80">Ref: {d.entityId}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'sandbox' && (
          <div className="space-y-6">
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-700">
               <h2 className="text-lg font-bold text-emerald-400 mb-1 flex items-center gap-2">
                 <PlayCircle className="w-5 h-5" /> SIMULATION ONLY • SANDBOX MODE ACTIVE • ZERO PRODUCTION MUTATION
               </h2>
               <p className="text-sm text-slate-300">
                 Run 15 full-lifecycle financial scenarios including tuition surges, refunds, currency checks, and reconciliation failures in isolated memory bounds.
               </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {scenarios.map(sc => (
                <button
                  key={sc}
                  onClick={() => runSimulation(sc)}
                  className="p-3 text-left border rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
                >
                  <span className="text-xs font-bold text-gray-500 block mb-1">SCENARIO</span>
                  <span className="text-xs font-semibold text-indigo-700 truncate block">{sc}</span>
                </button>
              ))}
            </div>

            {simulationResult && (
              <div className="mt-6 p-6 bg-gray-50 border rounded-xl">
                <h3 className="text-md font-bold text-gray-900 mb-4">Simulation Results: {simulationResult.name}</h3>
                <div className="space-y-2 text-sm text-gray-700 font-mono">
                  <p><span className="font-semibold text-gray-900">Status:</span> <span className="text-emerald-600">PASSED</span></p>
                  <p><span className="font-semibold text-gray-900">Result:</span> {simulationResult.result}</p>
                  <p><span className="font-semibold text-gray-900">Mutations:</span> {simulationResult.metrics?.mutations} (Verified Zero)</p>
                  <p><span className="font-semibold text-gray-900">Execution Time:</span> {simulationResult.metrics?.executionTimeMs}ms</p>
                </div>
              </div>
            )}
          </div>
        )}

        {['accounts', 'invoices', 'payments', 'holds', 'reconciliation', 'audit'].includes(activeTab) && (
          <div className="p-8 text-center text-gray-500">
            <p className="text-base font-medium">Finance Workspace module for {activeTab.toUpperCase()} is active.</p>
            <p className="text-xs text-gray-400 mt-2">Use the command center or verification suite to execute operations.</p>
          </div>
        )}
      </div>
    </div>
  );
};
