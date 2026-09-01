import React from 'react';
import { 
  History, 
  ShieldCheck, 
  Fingerprint, 
  Download, 
  Search, 
  Filter, 
  ExternalLink,
  ChevronDown,
  Server
} from 'lucide-react';
import { motion } from 'motion/react';

export const DecisionAuditLedger: React.FC = () => {
  const auditEvents = [
    { 
      id: 'EVT-9.5-0452', 
      action: 'AUTHORIZATION', 
      subject: 'Global Campus Expansion - Phase 2', 
      actor: 'Executive Committee', 
      timestamp: '2024-08-31 09:12:44',
      hash: 'sha256:b512...f901',
      status: 'VERIFIED' 
    },
    { 
      id: 'EVT-9.5-0451', 
      action: 'DISSENT_SUBMISSION', 
      subject: 'Faculty Compensation Plan', 
      actor: 'Academic Union Rep', 
      timestamp: '2024-08-31 08:44:21',
      hash: 'sha256:a209...e442',
      status: 'VERIFIED' 
    },
    { 
      id: 'EVT-9.5-0450', 
      action: 'BRIEF_VERSION_COMMIT', 
      subject: 'Institutional AI Ethics Policy', 
      actor: 'Sarah Connor', 
      timestamp: '2024-08-31 07:12:02',
      hash: 'sha256:f112...c231',
      status: 'VERIFIED' 
    },
    { 
      id: 'EVT-9.5-0449', 
      action: 'REQUEST_INITIALIZED', 
      subject: 'Digital Infrastructure Upgrade', 
      actor: 'System Automation', 
      timestamp: '2024-08-31 06:05:11',
      hash: 'sha256:d901...a112',
      status: 'VERIFIED' 
    },
  ];

  return (
    <div className="flex flex-col gap-6 h-full pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Governance Provenance Ledger</h2>
          <p className="text-sm text-gray-500 font-medium">Immutable SHA-256 chain of all institutional decision lifecycle events</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50 transition-all">
            <Download size={18} />
            Export Evidence Package
          </button>
          <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-lg text-xs font-bold uppercase tracking-wider">
            <ShieldCheck size={16} />
            Integrity Check: Pass
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
          <div className="flex items-center gap-4">
             <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input 
                type="text" 
                placeholder="Search audit trail..." 
                className="pl-9 pr-4 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 min-w-[300px]"
              />
            </div>
            <button className="flex items-center gap-2 px-3 py-1.5 text-gray-500 text-xs font-bold uppercase tracking-wider hover:bg-white rounded-lg transition-colors">
              <Filter size={14} />
              Filters <ChevronDown size={14} />
            </button>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-indigo-100">
            <Server size={14} />
            Node: Ledger-Primary-01
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 bg-gray-50/30">
                <th className="px-6 py-3">Event ID / Action</th>
                <th className="px-6 py-3">Subject Institutional Decision</th>
                <th className="px-6 py-3">Governance Actor</th>
                <th className="px-6 py-3">Cryptographic Hash</th>
                <th className="px-6 py-3">Timestamp</th>
                <th className="px-6 py-3 text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {auditEvents.map((event, i) => (
                <tr key={event.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-tighter mb-1">{event.id}</div>
                      <div className="text-xs font-black text-indigo-900 uppercase tracking-widest">{event.action.replace('_', ' ')}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-gray-700 leading-tight">
                      {event.subject}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500 border border-gray-200 uppercase">
                        {event.actor.charAt(0)}
                      </div>
                      <span className="text-xs font-medium text-gray-600">{event.actor}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-400 group-hover:text-indigo-400 transition-colors">
                      <Fingerprint size={14} />
                      <span className="text-[10px] font-mono tracking-tighter uppercase">{event.hash}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-gray-500 whitespace-nowrap">
                    {event.timestamp}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 text-emerald-600 font-bold text-[10px] uppercase tracking-widest">
                       <ShieldCheck size={14} />
                       {event.status}
                       <button className="ml-2 p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-all">
                        <ExternalLink size={14} />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-8 bg-gray-50/50 flex flex-col items-center justify-center border-t border-gray-100">
          <div className="w-full max-w-2xl bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                <History size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">Blockchain-Inspired Immutable Lineage</h3>
                <p className="text-xs text-gray-500 leading-relaxed font-medium mb-4">
                   EduTech-SMS Phase 9.5 utilizes a hash-chained audit model. Each governance event contains a SHA-256 fingerprint of the previous record, ensuring that any modification to historic decision records is instantly detectable.
                </p>
                <div className="flex items-center gap-4">
                  <button className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 transition-colors uppercase tracking-widest flex items-center gap-1.5">
                    Verify Chain Integrity <ShieldCheck size={12} />
                  </button>
                  <button className="text-[10px] font-bold text-gray-400 hover:text-gray-600 transition-colors uppercase tracking-widest flex items-center gap-1.5">
                    View Network Status <Server size={12} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
