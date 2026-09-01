import React, { useState, useEffect } from 'react';
import { formatCurrency } from '../../lib/currency';
import { 
  CreditCard, 
  FileText, 
  Receipt, 
  AlertTriangle, 
  Plus,
  CheckCircle2,
  DollarSign,
  Briefcase
} from 'lucide-react';
import { 
  FeeStructure, 
  FinancialAccount, 
  Invoice, 
  Payment,
  FinancialHold,
  FinancialLedgerEntry
} from '../../types/finance';
import { FinanceService } from '../../services/financeService';
import { BookLoader } from '../common/BookLoader';

interface Props {
  tenantId: string;
  user: { id: string; email: string; displayName?: string; role?: string };
}

export const FinanceWorkspace: React.FC<Props> = ({ tenantId, user }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'accounts' | 'invoices' | 'payments' | 'structures' | 'holds'>('dashboard');
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');

  const [accounts, setAccounts] = useState<FinancialAccount[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [structures, setStructures] = useState<FeeStructure[]>([]);
  const [holds, setHolds] = useState<FinancialHold[]>([]);

  useEffect(() => {
    loadData();
  }, [tenantId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [accs, invs, pays, structs, hlds] = await Promise.all([
        FinanceService.getFinancialAccounts(tenantId),
        FinanceService.getInvoices(tenantId),
        FinanceService.getPayments(tenantId),
        FinanceService.getFeeStructures(tenantId),
        FinanceService.getFinancialHolds(tenantId)
      ]);
      setAccounts(accs);
      setInvoices(invs);
      setPayments(pays);
      setStructures(structs);
      setHolds(hlds);
    } catch (error) {
      console.error('Error loading finance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalOutstanding = accounts.reduce((acc, a) => acc + a.currentBalance, 0);
  const totalCollected = payments.filter(p => p.status === 'SUCCESS').reduce((acc, p) => acc + p.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 tracking-tight">Finance & Billing</h2>
          <p className="text-sm text-slate-500">Phase 7.10 Authoritative Financial Ledger, Invoicing, and Payment Management.</p>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl w-fit text-xs font-medium overflow-x-auto">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${activeTab === 'dashboard' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Command Center
        </button>
        <button
          onClick={() => setActiveTab('accounts')}
          className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${activeTab === 'accounts' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Accounts ({accounts.length})
        </button>
        <button
          onClick={() => setActiveTab('invoices')}
          className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${activeTab === 'invoices' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Invoices ({invoices.length})
        </button>
        <button
          onClick={() => setActiveTab('payments')}
          className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${activeTab === 'payments' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Payments ({payments.length})
        </button>
        <button
          onClick={() => setActiveTab('structures')}
          className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${activeTab === 'structures' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Fee Structures ({structures.length})
        </button>
      </div>

      {loading ? (
        <BookLoader size="small" text="Loading" />
      ) : (
        <>
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-slate-600">Total Collected</h3>
                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-emerald-600" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-slate-900">{formatCurrency(totalCollected)}</p>
                  <p className="text-xs text-slate-500 mt-1">Minor units calculated</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-slate-600">Total Outstanding</h3>
                    <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-amber-600" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-slate-900">{formatCurrency(totalOutstanding)}</p>
                  <p className="text-xs text-slate-500 mt-1">Derived directly from ledger</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-slate-600">Issued Invoices</h3>
                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-indigo-600" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-slate-900">{invoices.length}</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-slate-600">Active Holds</h3>
                    <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-rose-600" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-slate-900">{holds.length}</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-center text-slate-500">
                <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-slate-900 mb-1">Financial Reconciliation Hub</h3>
                <p className="text-sm">Use tabs above to navigate authoritative financial ledgers, process payments, or define fee structures.</p>
              </div>
            </div>
          )}

          {activeTab === 'accounts' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-900">Student Financial Accounts</h3>
              </div>
              <div className="divide-y divide-slate-100">
                {accounts.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-sm">No financial accounts found.</div>
                ) : (
                  accounts.map(acc => (
                    <div key={acc.financialAccountId} className="p-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-900">Student ID: {acc.studentId}</p>
                        <p className="text-xs text-slate-500">Account ID: {acc.financialAccountId}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-slate-900">{formatCurrency(acc.currentBalance, acc.currency)}</p>
                        <p className="text-xs text-slate-500">Current Balance</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'invoices' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-900">Issued Invoices</h3>
              </div>
              <div className="divide-y divide-slate-100">
                {invoices.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-sm">No invoices found.</div>
                ) : (
                  invoices.map(inv => (
                    <div key={inv.invoiceId} className="p-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-900">{inv.invoiceNumber}</p>
                        <p className="text-xs text-slate-500">Student ID: {inv.studentId}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-bold text-slate-900">{formatCurrency(inv.total, inv.currency)}</p>
                          <p className="text-xs text-slate-500">Due: {inv.dueDate}</p>
                        </div>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
                          inv.status === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {inv.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-900">Payment Ledger</h3>
              </div>
              <div className="divide-y divide-slate-100">
                {payments.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-sm">No payments recorded.</div>
                ) : (
                  payments.map(pay => (
                    <div key={pay.paymentId} className="p-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-900">Receipt: {pay.receiptNumber}</p>
                        <p className="text-xs text-slate-500">Method: {pay.paymentMethod} | Ref: {pay.paymentReference}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-emerald-600">+{formatCurrency(pay.amount, pay.currency)}</p>
                        <p className="text-xs text-slate-500">{new Date(pay.initiatedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'structures' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-900">Fee Structures</h3>
              </div>
              <div className="divide-y divide-slate-100">
                {structures.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-sm">No fee structures defined.</div>
                ) : (
                  structures.map(fs => (
                    <div key={fs.feeStructureId} className="p-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-900">{fs.name} (v{fs.version})</p>
                        <p className="text-xs text-slate-500">Code: {fs.code} | Currency: {fs.currency}</p>
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg">
                        {fs.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'holds' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-900">Active Financial Holds</h3>
              </div>
              <div className="divide-y divide-slate-100">
                {holds.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-sm">No active holds found.</div>
                ) : (
                  holds.map(hold => (
                    <div key={hold.holdId} className="p-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-rose-700">{hold.type}</p>
                        <p className="text-xs text-slate-500">Reason: {hold.reason}</p>
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-1 bg-rose-100 text-rose-800 rounded-lg">
                        {hold.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
