import React, { useState, useEffect } from 'react';
import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';
import { AuditService } from '../../services/auditService';
import { DataTable, Column } from '../common/DataTable';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { AuditRecord } from '../../types';
import { FileText, ShieldAlert, CheckCircle2, Lock, Eye, RefreshCw, Layers } from 'lucide-react';

export const AuditLogView: React.FC = () => {
  const { currentTenant } = useTenant();
  const { currentUser } = useAuth();

  const [logs, setLogs] = useState<AuditRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<AuditRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [scopeMode, setScopeMode] = useState<'current_tenant' | 'all_tenants'>('current_tenant');

  const loadLogs = async () => {
    setIsLoading(true);
    try {
      const tenantIdParam = scopeMode === 'all_tenants' ? 'ALL' : (currentTenant?.id || 'ALL');
      const data = await AuditService.getLogs(tenantIdParam, 150);
      setLogs(data);
    } catch (e) {
      console.error('Failed to load audit logs:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [currentTenant, scopeMode]);

  const columns: Column<AuditRecord>[] = [
    {
      header: 'Timestamp',
      accessor: (r) => (
        <span className="font-mono text-2xs text-slate-500 whitespace-nowrap">
          {new Date(r.timestamp).toLocaleString()}
        </span>
      )
    },
    {
      header: 'Action / Event',
      accessor: (r) => (
        <div>
          <Badge variant="primary" size="sm">
            {r.action}
          </Badge>
          {r.resourceName && (
            <p className="text-2xs text-slate-600 dark:text-slate-400 mt-1 font-medium truncate max-w-[200px]">
              {r.resourceName}
            </p>
          )}
        </div>
      )
    },
    {
      header: 'Actor (User)',
      accessor: (r) => (
        <div>
          <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">{r.userDisplayName}</p>
          <p className="text-2xs text-slate-400">{r.userEmail}</p>
        </div>
      )
    },
    {
      header: 'Tenant Boundary',
      accessor: (r) => (
        <span className="text-xs font-mono text-slate-600 dark:text-slate-400">
          {r.tenantName || r.tenantId}
        </span>
      )
    },
    {
      header: 'Result',
      accessor: (r) => (
        <Badge variant={r.result === 'SUCCESS' ? 'success' : 'danger'} size="sm">
          {r.result}
        </Badge>
      )
    },
    {
      header: 'Details',
      accessor: (r) => (
        <button
          onClick={() => setSelectedRecord(r)}
          className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Inspect Payload"
        >
          <Eye className="w-4 h-4" />
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            Immutable Security & Event Audit Logs
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Every administrative mutation, role assignment, student enrollment, and module toggle generates tamper-evident audit records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {currentUser?.isPlatformSuperAdmin && (
            <select
              value={scopeMode}
              onChange={(e) => setScopeMode(e.target.value as any)}
              className="text-xs py-1.5 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300"
            >
              <option value="current_tenant">Current Tenant Only ({currentTenant?.name})</option>
              <option value="all_tenants">Platform-Wide Cross-Tenant Logs</option>
            </select>
          )}

          <button
            onClick={loadLogs}
            disabled={isLoading}
            className="px-3 py-1.5 text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg transition-colors border border-slate-200 dark:border-slate-700 flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Logs Table */}
      <DataTable
        data={logs}
        columns={columns}
        keyExtractor={(r) => r.id}
        searchPlaceholder="Search by action, user email, or resource..."
        searchFilter={(r, q) =>
          r.action.toLowerCase().includes(q) ||
          r.userDisplayName.toLowerCase().includes(q) ||
          r.userEmail.toLowerCase().includes(q) ||
          (r.resourceName && r.resourceName.toLowerCase().includes(q))
        }
      />

      {/* Modal: JSON / Details Inspector */}
      {selectedRecord && (
        <Modal
          isOpen={!!selectedRecord}
          onClose={() => setSelectedRecord(null)}
          title={`Audit Event: ${selectedRecord.action}`}
          subtitle={`Event ID: ${selectedRecord.id} • ${new Date(selectedRecord.timestamp).toUTCString()}`}
          maxWidth="xl"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800">
                <span className="text-2xs text-slate-400 block">Actor / User</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">{selectedRecord.userDisplayName}</span>
                <span className="text-2xs text-slate-500 block">{selectedRecord.userEmail}</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800">
                <span className="text-2xs text-slate-400 block">Tenant & Scope</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">{selectedRecord.tenantName || selectedRecord.tenantId}</span>
                <span className="text-2xs text-slate-500 block">Resource: {selectedRecord.resource} ({selectedRecord.resourceId})</span>
              </div>
            </div>

            {selectedRecord.notes && (
              <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 rounded-lg text-xs text-indigo-900 dark:text-indigo-200">
                <span className="font-semibold">Event Notes: </span> {selectedRecord.notes}
              </div>
            )}

            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Event Delta & Mutation Payload
              </p>
              <div className="bg-slate-950 text-slate-200 p-4 rounded-xl font-mono text-xs overflow-x-auto max-h-64 border border-slate-800">
                <pre>{JSON.stringify({
                  previousValue: selectedRecord.previousValue,
                  newValue: selectedRecord.newValue,
                  userAgent: selectedRecord.userAgent,
                  ipAddress: selectedRecord.ipAddress
                }, null, 2)}</pre>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 text-xs font-medium bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-300"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
