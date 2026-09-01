import React from 'react';
import { 
  Layers, 
  Search, 
  Filter, 
  Plus, 
  ArrowUpRight,
  Target,
  User,
  ShieldCheck,
  AlertTriangle,
  MoreVertical,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'motion/react';
import { InitiativeLifecycleState, GovImpactLevel } from '../../../types/planningBudgetResourceGovernance';

export const InitiativePortfolio: React.FC = () => {
  const initiatives = [
    { 
      id: 'INIT-001', 
      name: 'Cloud-First Enterprise Transition', 
      state: InitiativeLifecycleState.ACTIVE, 
      priority: GovImpactLevel.CRITICAL, 
      owner: 'Sarah Connor',
      alignment: 'ALIGNED',
      progress: 65 
    },
    { 
      id: 'INIT-002', 
      name: 'AI-Augmented Research Lab', 
      state: InitiativeLifecycleState.PRIORITIZATION, 
      priority: GovImpactLevel.HIGH, 
      owner: 'James Wilson',
      alignment: 'ALIGNED',
      progress: 30 
    },
    { 
      id: 'INIT-003', 
      name: 'Global Faculty Exchange Program', 
      state: InitiativeLifecycleState.APPROVED, 
      priority: GovImpactLevel.MODERATE, 
      owner: 'Dr. Emily Blunt',
      alignment: 'PARTIALLY_ALIGNED',
      progress: 0 
    },
    { 
      id: 'INIT-004', 
      name: 'Campus Zero-Paper Policy', 
      state: InitiativeLifecycleState.ON_HOLD, 
      priority: GovImpactLevel.LOW, 
      owner: 'Mark Stevens',
      alignment: 'ALIGNED',
      progress: 85 
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">Institutional Initiative Portfolio</h2>
          <p className="text-xs text-gray-500 font-medium">Govern strategic investments and initiative lifecycles</p>
        </div>
        <div className="flex items-center gap-2">
           <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input 
              type="text" 
              placeholder="Filter portfolio..." 
              className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 min-w-[240px]"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100">
            <Plus size={16} />
            Register Initiative
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {initiatives.map((initiative, i) => (
          <motion.div
            key={initiative.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group flex items-center gap-6"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
              initiative.priority === GovImpactLevel.CRITICAL ? 'bg-rose-50 text-rose-600 border-rose-100' :
              initiative.priority === GovImpactLevel.HIGH ? 'bg-amber-50 text-amber-600 border-amber-100' :
              'bg-indigo-50 text-indigo-600 border-indigo-100'
            }`}>
              <Layers size={24} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-tighter">{initiative.id}</span>
                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                   initiative.state === InitiativeLifecycleState.ACTIVE ? 'bg-emerald-50 text-emerald-700' :
                   initiative.state === InitiativeLifecycleState.ON_HOLD ? 'bg-amber-50 text-amber-700' :
                   'bg-indigo-50 text-indigo-700'
                }`}>
                  {initiative.state.replace('_', ' ')}
                </span>
              </div>
              <h3 className="text-sm font-bold text-gray-900 truncate group-hover:text-indigo-600 transition-colors">{initiative.name}</h3>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  <User size={12} /> {initiative.owner}
                </div>
                <div className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest ${
                  initiative.alignment === 'ALIGNED' ? 'text-emerald-600' : 'text-amber-600'
                }`}>
                  <Target size={12} /> {initiative.alignment.replace('_', ' ')}
                </div>
              </div>
            </div>

            <div className="w-48 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <span>Progress</span>
                <span className="text-indigo-600">{initiative.progress}%</span>
              </div>
              <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${initiative.progress}%` }}
                  transition={{ delay: 0.5 + (i * 0.1), duration: 1 }}
                  className="h-full bg-indigo-600" 
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
               <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                <ArrowUpRight size={18} />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all">
                <MoreVertical size={18} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
