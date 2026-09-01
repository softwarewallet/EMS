import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Search,
  Filter,
  RefreshCw,
  Lock,
  Clock,
  User,
  CheckCircle,
  FileText
} from 'lucide-react';
import { AuditRecord, User as UserType } from '../../types';
import { AuditService } from '../../services/auditService';

interface GovernanceTabProps {
  tenantId: string;
  currentUser: UserType;
}

export const GovernanceTab: React.FC<GovernanceTabProps> = ({ tenantId, currentUser }) => {
  const [logs, setLogs] = useState<AuditRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const loadAuditLogs = async () => {
    setLoading(true);
    try {
      const records = await AuditService.getLogs(tenantId);
      // Filter for examination operations resources
      const examOpsLogs = records.filter(
        r =>
          r.resource === 'exam_session' ||
          r.resource === 'exam_paper' ||
          r.resource === 'exam_seating' ||
          r.resource === 'exam_invigilator' ||
          r.resource === 'exam_presence' ||
          r.resource === 'exam_incident' ||
          r.resource === 'exam_moderation' ||
          r.resource === 'exam_result_processing' ||
          r.resource === 'exam_exception'
      );
      setLogs(examOpsLogs);
    } catch (err) {
      console.error('Error loading audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAuditLogs();
  }, [tenantId]);

  const filtered = logs.filter(
    l =>
      l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.userDisplayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.resourceName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Examination Operations Governance & Audit Log</h2>
          <p className="text-sm text-slate-500">
            Immutable system audit trail tracking all state transitions, paper releases, seating allocations, invigilator shifts, and result locks.
          </p>
        </div>

        <button
          onClick={loadAuditLogs}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white font-semibold text-sm rounded-lg hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Audit Trail
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search audit actions, users, or resource names..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500 text-sm">Loading governance audit logs...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Lock className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-700">No Audit Logs Found</h3>
            <p className="text-xs text-slate-500">State-changing examination operations will automatically produce tamper-evident audit records here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Resource</th>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium font-mono">
                {filtered.map(l => (
                  <tr key={l.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                      {new Date(l.timestamp).toLocaleString()}
                    </td>

                    <td className="py-3 px-4 font-bold text-indigo-600 whitespace-nowrap">{l.action}</td>

                    <td className="py-3 px-4 text-slate-800">
                      <div>{l.resourceName || l.resourceId}</div>
                      <div className="text-[10px] text-slate-400 font-normal">Type: {l.resource}</div>
                    </td>

                    <td className="py-3 px-4 text-slate-700 font-sans whitespace-nowrap">
                      <div className="font-semibold">{l.userDisplayName || l.userId}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{l.userEmail}</div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap font-sans">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {l.result || 'SUCCESS'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
