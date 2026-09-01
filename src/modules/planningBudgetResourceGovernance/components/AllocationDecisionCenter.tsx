import React from 'react';
import { 
  ShieldCheck, 
  User, 
  Clock, 
  ArrowRight, 
  Fingerprint, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  FileSearch,
  Lock,
  MoreVertical
} from 'lucide-react';
import { motion } from 'motion/react';

export const AllocationDecisionCenter: React.FC = () => {
  const allocations = [
    { id: 'ALC-001', initiative: 'Cloud-First Enterprise Transition', resource: 'Capital Allocation: $450k', proposer: 'Dr. Sarah Chen', approver: 'Executive Committee', timestamp: '2024-08-30 09:12', status: 'AUTHORIZED' },
    { id: 'ALC-002', initiative: 'AI Research Lab', resource: 'Workforce: 4x Senior Engineers', proposer: 'Prof. Wilson', approver: 'VP Research', timestamp: '2024-08-29 14:45', status: 'PENDING_APPROVAL' },
    { id: 'ALC-003', initiative: 'Student Success Hub', resource: 'Facilities: Block C, Level 4', proposer: 'Dean of Students', approver: 'Provost Office', timestamp: '2024-08-28 11:20', status: 'AUTHORIZED' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">Institutional Allocation Decision Center</h2>
          <p className="text-xs text-gray-500 font-medium">Executive authorization and provenance governance for resource allocations</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-rose-50 border border-rose-100 rounded-lg text-rose-700 text-[10px] font-bold uppercase tracking-widest">
             <Lock size={14} />
             Four-Eyes Enforced
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/30 flex items-center justify-between">
          <h3 className="text-xs font-black text-gray-700 uppercase tracking-widest flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-500" />
            Decision Authorization Ledger
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 bg-gray-50/30">
                <th className="px-6 py-3">Decision ID</th>
                <th className="px-6 py-3">Initiative / Resource</th>
                <th className="px-6 py-3">Proposer / Approver</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Provenance</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {allocations.map((alc) => (
                <tr key={alc.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-tighter">{alc.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-xs font-black text-indigo-900 uppercase tracking-widest mb-0.5 truncate max-w-[200px]">{alc.initiative}</div>
                      <div className="text-[10px] font-medium text-emerald-600 uppercase tracking-widest">{alc.resource}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                        <User size={10} /> {alc.proposer}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                        <CheckCircle2 size={10} /> {alc.approver}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      alc.status === 'AUTHORIZED' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {alc.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-gray-300 group-hover:text-indigo-400 transition-colors">
                      <Fingerprint size={14} />
                      <span className="text-[9px] font-mono tracking-tighter">SHA-256 Verified</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                       <button className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-all">
                        <FileSearch size={14} />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-all">
                        <MoreVertical size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm border-l-4 border-l-rose-500">
           <div className="flex items-start gap-4">
              <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
                 <AlertCircle size={24} />
              </div>
              <div>
                 <h3 className="text-sm font-black text-gray-900 mb-1 uppercase tracking-widest">Separation of Duties Alert</h3>
                 <p className="text-xs text-gray-500 leading-relaxed font-medium">
                    2 pending allocations currently violate the Institutional Four-Eyes Policy. The proposer and the approver must be distinct governance actors for all Tier 1 resource authorizations.
                 </p>
                 <button className="mt-4 flex items-center gap-1 text-xs font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-700">
                    Review Conflict Reports <ArrowRight size={14} />
                 </button>
              </div>
           </div>
        </div>

        <div className="bg-emerald-900 p-6 rounded-2xl border border-emerald-800 shadow-sm text-white relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
              <ShieldCheck size={120} />
           </div>
           <div className="relative z-10">
              <h3 className="text-sm font-black mb-1 uppercase tracking-widest">Allocation Assurance: OK</h3>
              <p className="text-xs text-emerald-100 leading-relaxed font-medium opacity-90">
                 The cryptographic integrity of all authorized allocations has been verified against the institutional provenance chain. 100% of allocation records are immutable and validated.
              </p>
              <div className="mt-4 flex items-center justify-between py-2 border-t border-emerald-800">
                 <span className="text-[10px] font-black uppercase tracking-widest text-emerald-200">Cycle Integrity</span>
                 <span className="text-[10px] font-mono text-emerald-300">99.999% VERIFIED</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
