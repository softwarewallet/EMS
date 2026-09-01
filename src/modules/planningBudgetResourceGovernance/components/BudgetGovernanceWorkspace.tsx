import React from 'react';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle,
  FileSearch,
  ShieldCheck,
  Activity,
  ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';

export const BudgetGovernanceWorkspace: React.FC = () => {
  const observations = [
    { id: 'VO-001', department: 'Faculty of Science', planned: 1200000, actual: 1250000, variance: 50000, status: 'WARNING' },
    { id: 'VO-002', department: 'ICT Services', planned: 2500000, actual: 2450000, variance: -50000, status: 'WITHIN_TOLERANCE' },
    { id: 'VO-003', department: 'Student Affairs', planned: 800000, actual: 920000, variance: 120000, status: 'BREACH' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">Institutional Budget Governance</h2>
          <p className="text-xs text-gray-500 font-medium">Reference-only governance of allocations, variances, and funding scenarios</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-lg text-indigo-700 text-[10px] font-bold uppercase tracking-widest">
           <ShieldCheck size={14} />
           Finance System Linked: OK
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {observations.map((obs, i) => (
          <motion.div
            key={obs.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group"
          >
            <div className={`absolute top-0 right-0 w-16 h-16 opacity-5 flex items-center justify-center -mr-4 -mt-4 transition-transform group-hover:scale-110`}>
              <Wallet size={64} />
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-tighter">{obs.id}</span>
              <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                obs.status === 'BREACH' ? 'bg-rose-50 text-rose-700' :
                obs.status === 'WARNING' ? 'bg-amber-50 text-amber-700' :
                'bg-emerald-50 text-emerald-700'
              }`}>
                {obs.status.replace('_', ' ')}
              </span>
            </div>

            <h3 className="text-sm font-bold text-gray-900 mb-4">{obs.department}</h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                <span className="text-gray-400">Planned</span>
                <span className="text-gray-700">${obs.planned.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                <span className="text-gray-400">Actual (Obs)</span>
                <span className="text-gray-700">${obs.actual.toLocaleString()}</span>
              </div>
              <div className="pt-2 border-t border-gray-50 flex items-center justify-between font-black text-xs uppercase tracking-widest">
                <span className="text-gray-400">Variance</span>
                <span className={obs.variance > 0 ? 'text-rose-600' : 'text-emerald-600'}>
                   {obs.variance > 0 ? '+' : ''}${Math.abs(obs.variance).toLocaleString()}
                </span>
              </div>
            </div>

            <button className="w-full mt-5 py-2 bg-gray-50 text-gray-500 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-indigo-50 hover:text-indigo-600 transition-all flex items-center justify-center gap-1.5">
               Audit Decision Trail <ArrowRight size={14} />
            </button>
          </motion.div>
        ))}
      </div>

      <div className="bg-indigo-900 rounded-2xl p-8 text-white relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
          <Activity size={120} />
        </div>
        
        <div className="relative z-10 max-w-2xl">
          <h3 className="text-lg font-bold mb-2 uppercase tracking-widest">Funding Scenario Simulation</h3>
          <p className="text-sm text-indigo-200 leading-relaxed font-medium mb-6">
            Predict institutional capacity impact by simulating alternative funding scenarios. All simulations are performed in isolated memory and do not affect authoritative financial records.
          </p>
          <div className="flex items-center gap-4">
             <button className="px-6 py-2 bg-white text-indigo-900 rounded-xl text-xs font-bold hover:bg-indigo-50 transition-all uppercase tracking-widest shadow-xl">
               Execute Baseline Simulation
             </button>
             <button className="px-6 py-2 bg-indigo-800 text-indigo-200 rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all uppercase tracking-widest">
               Configure Parameters
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};
