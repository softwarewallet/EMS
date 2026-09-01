import React from 'react';
import { 
  AlertTriangle, 
  Activity, 
  TrendingUp, 
  Zap, 
  Target, 
  Layers,
  Search,
  Filter,
  ArrowUpRight
} from 'lucide-react';
import { motion } from 'motion/react';

export const PortfolioRiskMap: React.FC = () => {
  const risks = [
    { id: 'PR-001', category: 'Funding Concentration', score: 85, level: 'CRITICAL', trend: 'up' },
    { id: 'PR-002', category: 'Resource Scarcity', score: 62, level: 'HIGH', trend: 'stable' },
    { id: 'PR-003', category: 'Strategic Misalignment', score: 24, level: 'LOW', trend: 'down' },
    { id: 'PR-004', category: 'Dependency Complexity', score: 48, level: 'MODERATE', trend: 'up' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">Institutional Portfolio Risk Map</h2>
          <p className="text-xs text-gray-500 font-medium">Deterministic analysis of institutional investment and resource risks</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 transition-all uppercase tracking-widest">
            Export Risk Ledger
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 uppercase tracking-widest">
            Recalculate Exposure
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {risks.map((risk, i) => (
          <motion.div
            key={risk.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                risk.level === 'CRITICAL' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                risk.level === 'HIGH' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                'bg-indigo-50 text-indigo-600 border-indigo-100'
              }`}>
                <AlertTriangle size={20} />
              </div>
              <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-tighter">{risk.id}</span>
            </div>

            <div className="mb-4">
              <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-1">{risk.category}</h3>
              <div className="flex items-center gap-2">
                 <span className={`text-xl font-black ${
                    risk.level === 'CRITICAL' ? 'text-rose-600' : 
                    risk.level === 'HIGH' ? 'text-amber-600' : 
                    'text-indigo-600'
                 }`}>{risk.score}%</span>
                 <div className="flex items-center gap-1 px-1.5 py-0.5 bg-gray-50 rounded text-[8px] font-black uppercase tracking-widest text-gray-400">
                    {risk.trend === 'up' ? <TrendingUp size={10} className="text-rose-500" /> : <TrendingUp size={10} className="text-emerald-500 rotate-180" />}
                    {risk.trend}
                 </div>
              </div>
            </div>

            <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: `${risk.score}%` }}
                 transition={{ delay: 0.5 + (i * 0.1), duration: 1 }}
                 className={`h-full ${
                    risk.level === 'CRITICAL' ? 'bg-rose-500' : 
                    risk.level === 'HIGH' ? 'bg-amber-500' : 
                    'bg-indigo-500'
                 }`} 
               />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex flex-col items-center justify-center text-center">
           <div className="w-20 h-20 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 mb-6 border border-indigo-100">
              <Activity size={40} />
           </div>
           <h3 className="text-lg font-bold text-gray-900 mb-2">Dependency Exposure Visualization</h3>
           <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed mb-8">
              Analyze the institutional impact of initiative failures by traversing the portfolio dependency graph. Identify critical paths and resource bottlenecks.
           </p>
           <button className="px-8 py-3 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100">
              Open Dependency Graph
           </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
           <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/30 flex items-center justify-between">
              <h3 className="text-[10px] font-black text-gray-700 uppercase tracking-widest">Risk Concentration by Category</h3>
           </div>
           <div className="p-8 flex-1 flex flex-col justify-center space-y-6">
              {[
                { label: 'Technology Dependency', score: 72 },
                { label: 'Vendor Lock-in Exposure', score: 45 },
                { label: 'Workforce Capacity Strain', score: 88 },
                { label: 'Regulatory Compliance Risk', score: 32 },
              ].map((c, i) => (
                <div key={i} className="space-y-2">
                   <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                      <span className="text-gray-500">{c.label}</span>
                      <span className={c.score > 80 ? 'text-rose-600' : 'text-gray-700'}>{c.score}%</span>
                   </div>
                   <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${c.score}%` }}
                        transition={{ delay: 0.5 + (i * 0.1), duration: 1 }}
                        className={`h-full ${c.score > 80 ? 'bg-rose-500' : 'bg-indigo-500'}`} 
                      />
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};
