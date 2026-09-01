import React, { useState } from 'react';
import { 
  PlayCircle, 
  RotateCcw, 
  Settings2, 
  Zap, 
  TrendingUp, 
  AlertTriangle,
  Layers,
  Activity,
  Cpu,
  BarChart2,
  Table
} from 'lucide-react';
import { motion } from 'motion/react';

export const DecisionSimulationSandbox: React.FC = () => {
  const [isSimulating, setIsSimulating] = useState(false);

  const runSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => setIsSimulating(false), 3000);
  };

  return (
    <div className="flex flex-col gap-6 h-full pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">What-If Decision Sandbox</h2>
          <p className="text-sm text-gray-500 font-medium">Predictive modeling and impact simulations for proposed institutional changes</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors">
            <RotateCcw size={18} />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-indigo-200 text-indigo-600 rounded-lg text-sm font-bold hover:bg-indigo-50 transition-all">
            <Settings2 size={18} />
            Config Parameters
          </button>
          <button 
            onClick={runSimulation}
            disabled={isSimulating}
            className={`
              flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all shadow-md
              ${isSimulating ? 'bg-indigo-400 cursor-not-allowed opacity-70' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100'}
            `}
          >
            {isSimulating ? <Cpu className="animate-spin" size={18} /> : <PlayCircle size={18} />}
            {isSimulating ? 'Processing...' : 'Run Simulation'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
        {/* Scenario Controls */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col gap-6">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-2">
            <Layers size={16} className="text-indigo-500" />
            Active Scenario Variables
          </h3>
          
          {[
            { label: 'Budget Allocation Delta', value: '+15%', type: 'CURRENCY' },
            { label: 'Implementation Velocity', value: 'AGGRESSIVE', type: 'SPEED' },
            { label: 'Risk Tolerance Buffer', value: 'LOW (10%)', type: 'RISK' },
            { label: 'Faculty Adoption Coefficient', value: '0.82', type: 'HUMAN' },
          ].map((v, i) => (
            <div key={i} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{v.label}</span>
                <span className="text-xs font-bold text-indigo-600">{v.value}</span>
              </div>
              <div className="h-1.5 w-full bg-gray-200 rounded-full mt-2" />
            </div>
          ))}
          
          <div className="mt-auto p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-3">
            <AlertTriangle className="text-amber-600 shrink-0" size={20} />
            <p className="text-[10px] font-bold text-amber-800 leading-relaxed uppercase tracking-wider">
              Simulation environment is isolated. Outcomes do not affect production state or institutional records.
            </p>
          </div>
        </div>

        {/* Real-time Visualization */}
        <div className="md:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col relative">
          {isSimulating && (
            <div className="absolute inset-0 z-20 bg-indigo-900/5 backdrop-blur-[1px] flex items-center justify-center">
              <motion.div 
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="flex flex-col items-center gap-3"
              >
                <div className="w-16 h-16 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin" />
                <span className="text-xs font-bold text-indigo-900 uppercase tracking-widest">Synthesizing Decision Nodes</span>
              </motion.div>
            </div>
          )}

          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
              <Activity size={16} className="text-indigo-500" />
              Outcome Probability Projection
            </h3>
            <div className="flex gap-2">
              <button className="p-1.5 bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors text-gray-400">
                <BarChart2 size={14} />
              </button>
              <button className="p-1.5 bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors text-gray-400">
                <Table size={14} />
              </button>
            </div>
          </div>
          
          <div className="flex-1 flex items-center justify-center p-12 bg-gray-50/20">
            <div className="w-full h-64 border-2 border-dashed border-gray-100 rounded-3xl flex flex-col items-center justify-center text-gray-300">
               <TrendingUp size={48} className="mb-4 opacity-50" />
               <p className="text-sm font-bold uppercase tracking-widest opacity-50">Simulation Graph Placeholder</p>
            </div>
          </div>

          <div className="p-6 border-t border-gray-100 grid grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Strategic Fit</p>
              <p className="text-xl font-bold text-gray-900">92.4%</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Resource Drain</p>
              <p className="text-xl font-bold text-emerald-600">LOW</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Risk Exposure</p>
              <p className="text-xl font-bold text-rose-600">MODERATE</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
