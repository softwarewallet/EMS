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
  Table,
  ShieldAlert
} from 'lucide-react';
import { motion } from 'motion/react';

export const ResourceSimulationSandbox: React.FC = () => {
  const [isSimulating, setIsSimulating] = useState(false);

  const scenarios = [
    '10% Institutional Budget Reduction',
    'Enrollment Revenue Shock',
    'Major Research Funding Reduction',
    'Workforce Capacity Reduction',
    'Emergency Capital Requirement',
  ];

  const runSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => setIsSimulating(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">Institutional What-If Sandbox</h2>
          <p className="text-xs text-gray-500 font-medium">Isolated predictive modeling for resource and budget planning</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors">
            <RotateCcw size={18} />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-xs font-bold hover:bg-gray-50 transition-all uppercase tracking-widest">
            <Settings2 size={18} />
            Parameters
          </button>
          <button 
            onClick={runSimulation}
            disabled={isSimulating}
            className={`
              flex items-center gap-2 px-6 py-2 rounded-lg text-xs font-black transition-all shadow-md uppercase tracking-widest
              ${isSimulating ? 'bg-indigo-400 cursor-not-allowed opacity-70' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100'}
            `}
          >
            {isSimulating ? <Cpu className="animate-spin" size={16} /> : <PlayCircle size={16} />}
            {isSimulating ? 'Synthesizing...' : 'Run Simulation'}
          </button>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-center justify-center gap-4">
         <ShieldAlert className="text-amber-600 animate-pulse" size={24} />
         <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-900">
            SIMULATION ONLY • SANDBOX MODE ACTIVE • ZERO PRODUCTION MUTATION
         </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
        {/* Scenario Selection */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-6">
            <Layers size={16} className="text-indigo-500" />
            Governance Scenarios
          </h3>
          
          <div className="space-y-2 flex-1">
            {scenarios.map((s, i) => (
              <button 
                key={i} 
                className={`w-full p-4 rounded-xl text-left border transition-all ${i === 0 ? 'bg-indigo-50 border-indigo-200 ring-1 ring-indigo-500' : 'bg-gray-50 border-gray-50 hover:border-indigo-100'}`}
              >
                <div className="text-xs font-black text-gray-900 mb-1">{s}</div>
                <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Scenario 0{i+1}</div>
              </button>
            ))}
          </div>

          <button className="mt-8 py-3 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all">
            Upload Custom Scenario JSON
          </button>
        </div>

        {/* Real-time Visualization */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col relative min-h-[500px]">
          {isSimulating && (
            <div className="absolute inset-0 z-20 bg-indigo-900/5 backdrop-blur-[2px] flex items-center justify-center">
              <motion.div 
                animate={{ scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="flex flex-col items-center gap-4"
              >
                <div className="w-20 h-20 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin" />
                <span className="text-xs font-black text-indigo-900 uppercase tracking-[0.3em]">Synthesizing Resource Nodes</span>
              </motion.div>
            </div>
          )}

          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
            <h3 className="text-[10px] font-black text-gray-700 uppercase tracking-widest flex items-center gap-2">
              <Activity size={16} className="text-indigo-500" />
              Resource Probability Projection
            </h3>
            <div className="flex gap-2">
              <button className="p-1.5 bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors text-gray-400">
                <BarChart2 size={16} />
              </button>
              <button className="p-1.5 bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors text-gray-400">
                <Table size={16} />
              </button>
            </div>
          </div>
          
          <div className="flex-1 flex items-center justify-center p-12 bg-gray-50/10">
            <div className="w-full h-full border-2 border-dashed border-gray-100 rounded-3xl flex flex-col items-center justify-center text-gray-300">
               <TrendingUp size={64} className="mb-6 opacity-30" />
               <p className="text-xs font-black uppercase tracking-[0.5em] opacity-30">Simulation Output Visualizer</p>
            </div>
          </div>

          <div className="p-8 border-t border-gray-100 grid grid-cols-3 gap-8">
            <div className="text-center">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Portfolio Impact</p>
              <p className="text-2xl font-black text-gray-900">-12.4%</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Resource Strain</p>
              <p className="text-2xl font-black text-rose-600">HIGH</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Risk Variance</p>
              <p className="text-2xl font-black text-amber-600">+8.2%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
