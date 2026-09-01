import React, { useState, useEffect } from 'react';
import { BarChart3, Download, RefreshCw, BookOpen, AlertTriangle, DollarSign, Clock, CheckCircle2 } from 'lucide-react';
import { LibraryCirculationService } from '../../../services/libraryCirculationService';
import { LibraryCirculationAnalyticsCache } from '../../../types/library';

interface CirculationAnalyticsTabProps {
  currentTenantId: string;
  currentUser: {
    id: string;
    email: string;
    displayName: string;
    role?: string;
  };
  onSuccess: (msg: string) => void;
  onError: (msg: string) => void;
}

export const CirculationAnalyticsTab: React.FC<CirculationAnalyticsTabProps> = ({
  currentTenantId,
  currentUser,
  onSuccess,
  onError
}) => {
  const [analytics, setAnalytics] = useState<LibraryCirculationAnalyticsCache | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadAnalytics();
  }, [currentTenantId]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const data = await LibraryCirculationService.getCirculationAnalytics(currentTenantId);
      setAnalytics(data);
    } catch (err) {
      console.warn('Failed to load circulation analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      const loans = await LibraryCirculationService.getLoans(currentTenantId);
      const csvHeader = 'TransactionRef,ResourceTitle,AccessionNumber,MemberCard,IssuedAt,DueAt,Status\n';
      const csvRows = loans.map(l =>
        `"${l.transactionReference}","${l.resourceTitle}","${l.accessionNumber}","${l.membershipNumber}","${l.issuedAt}","${l.dueAt}","${l.status}"`
      ).join('\n');

      const blob = new Blob([csvHeader + csvRows], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `library_circulation_register_${currentTenantId}_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      onSuccess('Circulation register exported successfully to CSV.');
    } catch (err: any) {
      onError('Failed to export circulation data.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-indigo-600" />
            Circulation Performance & Analytics Register
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Real-time projections of loan velocity, return rates, fine collections, inventory utilization, and CSV data downloads.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadAnalytics}
            className="px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh Analytics
          </button>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-4 h-4" />
            Export CSV Register
          </button>
        </div>
      </div>

      {loading || !analytics ? (
        <div className="p-12 bg-white rounded-xl border border-slate-200 text-center text-slate-500 flex items-center justify-center gap-2">
          <RefreshCw className="w-5 h-5 animate-spin text-indigo-600" />
          Rebuilding circulation projections...
        </div>
      ) : (
        <div className="space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-xs uppercase font-medium text-slate-400">Active Loans</span>
              <p className="text-2xl font-bold text-slate-800 mt-1">{analytics.activeLoansCount}</p>
              <p className="text-xs text-indigo-600 mt-1 font-medium">{analytics.copyUtilizationRate.toFixed(1)}% Copy Utilization</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-xs uppercase font-medium text-slate-400">Overdue Loans</span>
              <p className="text-2xl font-bold text-rose-600 mt-1">{analytics.overdueLoansCount}</p>
              <p className="text-xs text-rose-500 mt-1 font-medium">Borrowing blocks active</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-xs uppercase font-medium text-slate-400">Total Fines Generated</span>
              <p className="text-2xl font-bold text-slate-800 mt-1">${analytics.totalFinesGenerated.toFixed(2)}</p>
              <p className="text-xs text-emerald-600 mt-1 font-medium">${analytics.totalFinesWaived.toFixed(2)} Waived</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-xs uppercase font-medium text-slate-400">Lost / Damaged Items</span>
              <p className="text-2xl font-bold text-amber-600 mt-1">{analytics.lostItemsCount + analytics.damagedItemsCount}</p>
              <p className="text-xs text-slate-500 mt-1">
                Lost: {analytics.lostItemsCount} | Damaged: {analytics.damagedItemsCount}
              </p>
            </div>
          </div>

          {/* Most Borrowed Resources */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              Most Popular Borrowed Titles Ranking
            </h3>

            {analytics.mostBorrowedResources.length === 0 ? (
              <p className="text-sm text-slate-500 italic">No resource borrow activity recorded yet.</p>
            ) : (
              <div className="space-y-2">
                {analytics.mostBorrowedResources.map((res, index) => (
                  <div key={res.resourceId} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg text-sm border border-slate-100">
                    <span className="font-semibold text-slate-800">#{index + 1}. {res.title}</span>
                    <span className="px-2.5 py-1 bg-indigo-100 text-indigo-800 font-bold text-xs rounded-full">
                      {res.borrowCount} Loans
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
