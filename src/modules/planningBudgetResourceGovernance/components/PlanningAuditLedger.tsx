import React from 'react';
import { 
  Fingerprint, 
  Search, 
  Filter, 
  History, 
  CheckCircle2, 
  ShieldCheck,
  MoreVertical,
  Activity,
  ArrowUpRight,
  Database
} from 'lucide-react';
import { motion } from 'motion/react';

export const PlanningAuditLedger: React.FC = () => {
  const audits = [
    { id: 'EV-8821', actor: 'sarah.admin@edu.ems', action: 'DECISION_AUTHORIZED', entity: 'AllocationDecision', entityId: 'ALC-001', timestamp: '2024-08-30 09:12', hash: '8a2f...1e3d' },
    { id: 'EV-8820', actor: 'james.strat@edu.ems', action: 'INITIATIVE_PROPOSED', entity: 'InstitutionalInitiative', entityId: 'INIT-002', timestamp: '2024-08-30 08:45', hash: 'c5d1...b9a2' },
    { id: 'EV-8819', actor: 'system.engine@edu.ems', action: 'PLANNING_CYCLE_OPENED', entity: 'PlanningCycle', entityId: 'PC-2025', timestamp: '2024-08-30 00:01', hash: '9e4b...d2f1' },
    { id: 'EV-8818', actor: 'provost.office@edu.ems', action: 'EXCEPTION_APPROVED', entity: 'PlanningException', entityId: 'EXC-005', timestamp: '2024-08-29 16:30', hash: 'f2a7...c8e4' },
  ];

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">Institutional Planning Audit Ledger</h2>
          <p className="text-xs text-gray-500 font-medium">Immutable governance provenance for institutional planning activities</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-700 text-[10px] font-bold uppercase tracking-widest">
              <ShieldCheck size={14} />
              Chain Integrity: VERIFIED
           </div>
           <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 uppercase tracking-widest">
             Validate Full Chain
           </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex-1 flex flex-col">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
          <div className="flex items-center gap-2 text-xs font-black text-gray-700 uppercase tracking-widest">
            <History size={16} className="text-indigo-600" />
            Governance Events
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={12} />
              <input 
                type="text" 
                placeholder="Search audit trail..." 
                className="pl-8 pr-4 py-1.5 bg-white border border-gray-200 rounded-lg text-[10px] font-bold focus:outline-none min-w-[240px]"
              />
            </div>
            <button className="p-1.5 bg-white border border-gray-200 rounded-lg text-gray-400">
              <Filter size={14} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 bg-gray-50/30 sticky top-0 z-10">
                <th className="px-6 py-3">Event ID</th>
                <th className="px-6 py-3">Actor</th>
                <th className="px-6 py-3">Action</th>
                <th className="px-6 py-3">Entity Reference</th>
                <th className="px-6 py-3">Timestamp</th>
                <th className="px-6 py-3 text-right">Provenance Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {audits.map((audit) => (
                <tr key={audit.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-tighter">{audit.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs font-bold text-gray-700">{audit.actor}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[9px] font-black uppercase tracking-widest rounded">
                      {audit.action}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                       <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{audit.entity}</div>
                       <div className="text-[11px] font-black text-gray-900 uppercase tracking-tighter">{audit.entityId}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{audit.timestamp}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 text-emerald-600 font-mono text-[10px] font-black">
                       <Fingerprint size={12} />
                       {audit.hash}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-3 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
           <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5"><Database size={12} className="text-indigo-400" /> 1.2M Records Sealed</span>
              <span className="flex items-center gap-1.5"><Activity size={12} className="text-emerald-400" /> Real-time Hashing Active</span>
           </div>
           <div className="flex items-center gap-2">
              <button className="hover:text-indigo-600">Previous</button>
              <div className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded">Page 1</div>
              <button className="hover:text-indigo-600">Next</button>
           </div>
        </div>
      </div>
    </div>
  );
};
