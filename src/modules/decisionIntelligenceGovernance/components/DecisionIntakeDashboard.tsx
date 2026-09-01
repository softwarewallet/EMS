import React from 'react';
import { 
  PlusCircle, 
  Target, 
  Zap, 
  Layers, 
  ArrowUpRight,
  TrendingUp,
  Activity,
  Compass
} from 'lucide-react';
import { motion } from 'motion/react';

export const DecisionIntakeDashboard: React.FC = () => {
  return (
    <div className="flex flex-col gap-6 h-full pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Institutional Intelligence Intake</h2>
          <p className="text-sm text-gray-500 font-medium">Gathering signals and strategic objectives for decision modeling</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100">
          <PlusCircle size={18} />
          Register Strategy Objective
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Signal Monitor */}
        <div className="col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
              <Activity size={16} className="text-emerald-500" />
              Strategic Signal Monitor
            </h3>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded tracking-widest uppercase">Live Analysis</span>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {[
                { label: 'Market Demand Shifts (LMS)', impact: '+12.4%', status: 'RISING', trend: 'up' },
                { label: 'Regulatory Compliance - Phase 9', impact: 'CRITICAL', status: 'REQUIRED', trend: 'stable' },
                { label: 'Infrastructure Latency (APAC)', impact: '-8.2%', status: 'CONCERNING', trend: 'down' },
                { label: 'Student Retention Index', impact: '+4.1%', status: 'OPTIMIZING', trend: 'up' },
              ].map((signal, i) => (
                <div key={i} className="flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                      <Zap size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{signal.label}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{signal.status}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${signal.trend === 'up' ? 'text-emerald-600' : signal.trend === 'down' ? 'text-rose-600' : 'text-indigo-600'}`}>
                      {signal.impact}
                    </p>
                    <div className="flex items-center justify-end">
                      {signal.trend === 'up' ? <ArrowUpRight size={14} className="text-emerald-500" /> : <TrendingUp size={14} className="text-indigo-500" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-3 border-2 border-dashed border-gray-200 rounded-xl text-xs font-bold text-gray-400 hover:border-indigo-300 hover:text-indigo-500 transition-all uppercase tracking-widest">
              Scan For New Intelligence Signals
            </button>
          </div>
        </div>

        {/* Active Objectives */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/30">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
              <Target size={16} className="text-indigo-500" />
              Strategic Objectives
            </h3>
          </div>
          <div className="p-6 flex-1 space-y-4">
            {[
              { title: 'Campus Zero-Paper Initiative', progress: 65, color: 'bg-indigo-600' },
              { title: 'AI-Driven Curriculum Model', progress: 30, color: 'bg-emerald-600' },
              { title: 'Global Faculty Exchange', progress: 85, color: 'bg-amber-600' },
              { title: 'Latency Reduction (EMEA)', progress: 45, color: 'bg-indigo-600' },
            ].map((obj, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                  <span className="text-gray-600 truncate mr-2">{obj.title}</span>
                  <span className="text-indigo-600">{obj.progress}%</span>
                </div>
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${obj.progress}%` }}
                    transition={{ delay: 0.5 + (i * 0.1), duration: 1 }}
                    className={`h-full ${obj.color}`} 
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 bg-indigo-50 border-t border-indigo-100 m-4 rounded-xl">
            <div className="flex items-center gap-3">
              <Compass size={20} className="text-indigo-600 shrink-0" />
              <div>
                <p className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">Strategy Alignment Score</p>
                <p className="text-lg font-black text-indigo-900">88.4%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decision Requests Queue */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
            <Layers size={16} className="text-indigo-500" />
            Decision Request Intake Queue
          </h3>
          <div className="flex items-center gap-4 text-xs font-bold text-gray-400 tracking-widest uppercase">
            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-indigo-500" /> 8 Urgent</span>
            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-gray-300" /> 14 Routine</span>
          </div>
        </div>
        <div className="p-6 text-center py-20">
          <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 mx-auto mb-4 border border-indigo-100">
            <Layers size={32} />
          </div>
          <h4 className="text-lg font-bold text-gray-900 mb-1">Inbound Request Processing</h4>
          <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
            New decision requests are automatically categorized by the intelligence engine based on policy impact and strategic alignment.
          </p>
          <button className="mt-6 px-6 py-2 border-2 border-indigo-600 text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-600 hover:text-white transition-all uppercase tracking-widest">
            View All Open Requests
          </button>
        </div>
      </div>
    </div>
  );
};
