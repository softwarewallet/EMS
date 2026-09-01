import { 
  FeeStructure, 
  FinancialAccount, 
  FinancialLedgerEntry, 
  FeeAssignment, 
  FeeCharge, 
  Invoice, 
  Payment, 
  PaymentAllocation, 
  Refund, 
  FinancialHold, 
  Concession, 
  Scholarship 
} from '../types/finance';
import { FirebaseService } from './firebaseService';
import { AuditService } from './auditService';

const FEE_STRUCTURES_COL = 'fee_structures';
const FINANCIAL_ACCOUNTS_COL = 'student_financial_accounts';
const FINANCIAL_LEDGER_COL = 'financial_ledger';
const FEE_ASSIGNMENTS_COL = 'fee_assignments';
const CHARGES_COL = 'fee_charges';
const INVOICES_COL = 'invoices';
const PAYMENTS_COL = 'payments';
const ALLOCATIONS_COL = 'payment_allocations';
const REFUNDS_COL = 'refunds';
const HOLDS_COL = 'financial_holds';
const CONCESSIONS_COL = 'concessions';
const SCHOLARSHIPS_COL = 'scholarships';

export class FinanceService {

  // --- Fee Structures ---
  static async getFeeStructures(tenantId: string, academicYearId?: string): Promise<FeeStructure[]> {
    let list = await FirebaseService.getTenantCollection<FeeStructure>(FEE_STRUCTURES_COL, tenantId);
    if (!list) return [];
    if (academicYearId) list = list.filter(f => f.academicYearId === academicYearId);
    return list;
  }

  static async saveFeeStructure(
    structure: Omit<FeeStructure, 'feeStructureId' | 'createdAt' | 'updatedAt'>,
    user: { id: string; email: string; displayName?: string }
  ): Promise<FeeStructure> {
    const feeStructureId = `fs_${Date.now()}`;
    const now = new Date().toISOString();
    const record: FeeStructure = { ...structure, feeStructureId, createdAt: now, updatedAt: now };

    await FirebaseService.setDocument(FEE_STRUCTURES_COL, feeStructureId, record);

    await AuditService.log({
      tenantId: structure.tenantId,
      userId: user.id,
      userEmail: user.email,
      userDisplayName: user.displayName || user.email,
      action: 'FEE_STRUCTURE_CREATED' as any,
      resource: 'fee_structure' as any,
      resourceId: feeStructureId,
      resourceName: structure.name,
      newValue: record,
      result: 'SUCCESS'
    });
    return record;
  }

  // --- Financial Accounts & Ledger ---
  static async getFinancialAccounts(tenantId: string, studentId?: string): Promise<FinancialAccount[]> {
    let list = await FirebaseService.getTenantCollection<FinancialAccount>(FINANCIAL_ACCOUNTS_COL, tenantId);
    if (!list) return [];
    if (studentId) list = list.filter(a => a.studentId === studentId);
    
    // Calculate current balance on the fly from the ledger (rebuildable read model concept)
    for (const acc of list) {
      acc.currentBalance = await this.calculateAccountBalance(tenantId, acc.financialAccountId);
    }
    return list;
  }

  static async getLedgerEntries(tenantId: string, financialAccountId: string): Promise<FinancialLedgerEntry[]> {
    let list = await FirebaseService.getTenantCollection<FinancialLedgerEntry>(FINANCIAL_LEDGER_COL, tenantId);
    if (!list) return [];
    return list.filter(l => l.financialAccountId === financialAccountId && l.status === 'POSTED')
               .sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime());
  }

  static async calculateAccountBalance(tenantId: string, financialAccountId: string): Promise<number> {
    const entries = await this.getLedgerEntries(tenantId, financialAccountId);
    let balance = 0;
    for (const entry of entries) {
      // Balance perspective: debit increases what student owes, credit decreases it.
      balance += entry.debit;
      balance -= entry.credit;
    }
    return balance;
  }

  // --- Invoices & Charges ---
  static async getInvoices(tenantId: string, financialAccountId?: string): Promise<Invoice[]> {
    let list = await FirebaseService.getTenantCollection<Invoice>(INVOICES_COL, tenantId);
    if (!list) return [];
    if (financialAccountId) list = list.filter(i => i.financialAccountId === financialAccountId);
    return list;
  }

  static async getCharges(tenantId: string, invoiceId?: string): Promise<FeeCharge[]> {
    let list = await FirebaseService.getTenantCollection<FeeCharge>(CHARGES_COL, tenantId);
    if (!list) return [];
    // simplified filter
    return list;
  }

  static async createInvoice(
    invoice: Omit<Invoice, 'invoiceId' | 'invoiceNumber' | 'createdAt' | 'updatedAt'>,
    user: { id: string; email: string; displayName?: string }
  ): Promise<Invoice> {
    const invoiceId = `inv_${Date.now()}`;
    const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date().toISOString();
    
    const record: Invoice = { ...invoice, invoiceId, invoiceNumber, createdAt: now, updatedAt: now };

    await FirebaseService.setDocument(INVOICES_COL, invoiceId, record);

    // Add ledger entry
    const ledgerEntry: FinancialLedgerEntry = {
      ledgerEntryId: `ledg_${Date.now()}`,
      tenantId: invoice.tenantId,
      campusId: invoice.campusId,
      financialAccountId: invoice.financialAccountId,
      studentId: invoice.studentId,
      enrollmentId: invoice.enrollmentId,
      academicYearId: invoice.academicYearId,
      transactionType: 'CHARGE',
      referenceType: 'INVOICE',
      referenceId: invoiceId,
      debit: invoice.total,
      credit: 0,
      currency: invoice.currency,
      description: `Invoice ${invoiceNumber} issued`,
      transactionDate: now,
      effectiveDate: invoice.issueDate,
      status: 'POSTED',
      createdBy: user.id,
      createdAt: now,
      version: '1.0'
    };
    await FirebaseService.setDocument(FINANCIAL_LEDGER_COL, ledgerEntry.ledgerEntryId, ledgerEntry);

    await AuditService.log({
      tenantId: invoice.tenantId,
      userId: user.id,
      userEmail: user.email,
      userDisplayName: user.displayName || user.email,
      action: 'INVOICE_CREATED' as any,
      resource: 'invoice' as any,
      resourceId: invoiceId,
      resourceName: invoiceNumber,
      newValue: record,
      result: 'SUCCESS'
    });
    return record;
  }

  // --- Payments ---
  static async getPayments(tenantId: string, financialAccountId?: string): Promise<Payment[]> {
    let list = await FirebaseService.getTenantCollection<Payment>(PAYMENTS_COL, tenantId);
    if (!list) return [];
    if (financialAccountId) list = list.filter(p => p.financialAccountId === financialAccountId);
    return list;
  }

  static async processPayment(
    payment: Omit<Payment, 'paymentId' | 'createdAt' | 'updatedAt' | 'receiptNumber'>,
    user: { id: string; email: string; displayName?: string }
  ): Promise<Payment> {
    // Idempotency check
    const existing = await this.getPayments(payment.tenantId);
    const idempotent = existing.find(p => p.paymentReference === payment.paymentReference);
    if (idempotent) {
      return idempotent; // Idempotent return
    }

    const paymentId = `pay_${Date.now()}`;
    const receiptNumber = `RCP-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date().toISOString();

    const record: Payment = { ...payment, paymentId, receiptNumber, createdAt: now, updatedAt: now };
    await FirebaseService.setDocument(PAYMENTS_COL, paymentId, record);

    if (record.status === 'SUCCESS') {
      const ledgerEntry: FinancialLedgerEntry = {
        ledgerEntryId: `ledg_${Date.now()}`,
        tenantId: payment.tenantId,
        campusId: payment.campusId,
        financialAccountId: payment.financialAccountId,
        studentId: payment.studentId,
        enrollmentId: payment.enrollmentId,
        academicYearId: payment.academicYearId,
        transactionType: 'PAYMENT',
        referenceType: 'PAYMENT',
        referenceId: paymentId,
        debit: 0,
        credit: payment.amount,
        currency: payment.currency,
        description: `Payment received via ${payment.paymentMethod} (Ref: ${payment.paymentReference})`,
        transactionDate: now,
        effectiveDate: now,
        status: 'POSTED',
        createdBy: user.id,
        createdAt: now,
        version: '1.0'
      };
      await FirebaseService.setDocument(FINANCIAL_LEDGER_COL, ledgerEntry.ledgerEntryId, ledgerEntry);
    }

    await AuditService.log({
      tenantId: payment.tenantId,
      userId: user.id,
      userEmail: user.email,
      userDisplayName: user.displayName || user.email,
      action: 'PAYMENT_CREATED' as any,
      resource: 'payment' as any,
      resourceId: paymentId,
      resourceName: receiptNumber,
      newValue: record,
      result: 'SUCCESS'
    });

    return record;
  }

  // --- Financial Holds ---
  static async getFinancialHolds(tenantId: string, studentId?: string): Promise<FinancialHold[]> {
    let list = await FirebaseService.getTenantCollection<FinancialHold>(HOLDS_COL, tenantId);
    if (!list) return [];
    if (studentId) list = list.filter(h => h.studentId === studentId && h.status === 'ACTIVE');
    return list;
  }
}
