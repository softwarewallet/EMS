import React from 'react';
import { 
  Calendar, 
  ChevronRight, 
  Plus, 
  MoreVertical,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { PlanningLifecycleState } from '../../../types/planningBudgetResourceGovernance';

export const PlanningCycleManager: React.FC = () => {
  const cycles = [
    { id: 'PC-2025', name: 'FY2025 Institutional Plan', type: 'ANNUAL', state: PlanningLifecycleState.OPEN, start: '2025-01-01', end: '2025-12-31' },
    { id: 'PC-STRAT-30', name: 'Strategic Vision 2030', type: 'STRATEGIC', state: PlanningLifecycleState.REVIEW, start: '2024-01-01', end: '2030-12-31' },
    { id: 'PC-FORECAST-Q3', name: 'Q3 Rolling Forecast', type: 'ROLLING_FORECAST', state: PlanningLifecycleState.DEPARTMENT_INPUT, start: '2024-07-01', end: '2024-09-30' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">Institutional Planning Cycles</h2>
          <p className="text-xs text-gray-500 font-medium">Define and govern institutional planning horizons and lifecycles</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100">
          <Plus size={16} />
          Initialize Planning Cycle
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cycles.map((cycle, i) => (
          <motion.div
            key={cycle.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
                <Calendar size={20} />
              </div>
              <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                <MoreVertical size={16} />
              </button>
            </div>

            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-tighter">{cycle.id}</span>
                <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 text-[8px] font-bold uppercase tracking-wider">{cycle.type}</span>
              </div>
              <h3 className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors leading-tight">{cycle.name}</h3>
            </div>

            <div className="flex items-center justify-between py-3 border-t border-gray-50 mb-4">
              <div className="flex flex-col">
                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">State</span>
                <span className={`text-[10px] font-bold uppercase ${cycle.state === PlanningLifecycleState.OPEN ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {cycle.state.replace('_', ' ')}
                </span>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Ends</span>
                <span className="text-[10px] font-bold text-gray-700">{cycle.end}</span>
              </div>
            </div>

            <button className="w-full py-2 bg-gray-50 text-gray-600 rounded-lg text-xs font-bold hover:bg-indigo-50 hover:text-indigo-600 transition-all flex items-center justify-center gap-2">
              Manage Lifecycle <ChevronRight size={14} />
            </button>
          </motion.div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 mx-auto mb-4 border border-indigo-100">
          <Clock size={32} />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">Planning Timeline Visualization</h3>
        <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed mb-6">
          Visualize overlapping planning horizons across annual, multi-year, and strategic cycles to identify institutional synchronization requirements.
        </p>
        <button className="px-6 py-2 border-2 border-indigo-600 text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-600 hover:text-white transition-all uppercase tracking-widest">
          Open Timeline View
        </button>
      </div>
    </div>
  );
};
