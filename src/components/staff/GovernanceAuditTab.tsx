import React, { useState } from 'react';
import { useStaffContext } from './StaffContext';
import { Shield, Clock, Search, Filter, CheckCircle2, User, FileText } from 'lucide-react';

interface AuditItem {
  id: string;
  action: string;
  staffTargetName: string;
  actorName: string;
  timestamp: string;
  details: string;
  category: 'ONBOARDING' | 'LEAVE' | 'COMPLIANCE' | 'PERFORMANCE' | 'OFFBOARDING';
}

export const GovernanceAuditTab: React.FC = () => {
  const { staffList, currentUser } = useStaffContext();

  const [auditLogs] = useState<AuditItem[]>([
    {
      id: 'aud_1',
      action: 'STAFF_ONBOARDED',
      staffTargetName: 'Dr. Arthur Pendelton',
      actorName: currentUser.displayName || 'Super Admin',
      timestamp: '2026-08-25 09:30:15',
      details: 'Created staff master profile and allocated standard leave quota.',
      category: 'ONBOARDING'
    },
    {
      id: 'aud_2',
      action: 'LEAVE_AUTHORIZED',
      staffTargetName: 'Ms. Clara Oswald',
      actorName: currentUser.displayName || 'Super Admin',
      timestamp: '2026-08-26 14:12:00',
      details: 'Approved 2 days of Casual Leave with cover allocation.',
      category: 'LEAVE'
    },
    {
      id: 'aud_3',
      action: 'DOCUMENT_VERIFIED',
      staffTargetName: 'Prof. Alistair Finch',
      actorName: currentUser.displayName || 'Super Admin',
      timestamp: '2026-08-27 10:05:44',
      details: 'Signed off verification stamp on Doctoral Degree transcript.',
      category: 'COMPLIANCE'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredLogs = auditLogs.filter((log) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      log.action.toLowerCase().includes(q) ||
      log.staffTargetName.toLowerCase().includes(q) ||
      log.actorName.toLowerCase().includes(q) ||
      log.details.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            Immutable Workforce Audit Trail & Governance Log
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Full non-repudiation logging of employee onboarding, lifecycle status changes, leave approvals, and credential verifications.
          </p>
        </div>

        <div className="w-full sm:w-72">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search audit trail..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Log List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="divide-y divide-slate-100">
          {filteredLogs.map((log) => (
            <div key={log.id} className="p-4 hover:bg-slate-50 transition-colors flex items-start gap-4 text-xs">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg mt-0.5">
                <Clock className="w-4 h-4" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{log.action}</span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[10px]">
                      {log.category}
                    </span>
                  </div>
                  <span className="text-slate-400 font-mono">{log.timestamp}</span>
                </div>

                <p className="text-slate-600">{log.details}</p>

                <div className="text-slate-400 flex items-center gap-3 pt-0.5">
                  <span>Target: <strong className="text-slate-700">{log.staffTargetName}</strong></span>
                  <span>•</span>
                  <span>Actor: <strong className="text-slate-700">{log.actorName}</strong></span>
                </div>
              </div>
            </div>
          ))}

          {filteredLogs.length === 0 && (
            <div className="text-center py-8 text-slate-400 text-xs italic">
              No matching audit records found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
