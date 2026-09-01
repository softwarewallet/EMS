import React from 'react';
import { 
  FileText, 
  Search, 
  Award, 
  Target, 
  ShieldCheck, 
  TrendingUp, 
  AlertTriangle,
  ChevronRight,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';

export const InvestmentCaseExplorer: React.FC = () => {
  const cases = [
    { id: 'INV-101', title: 'Global Campus Expansion - Phase 9', score: 92, alignment: 'HIGH', impact: 'CRITICAL', author: 'Strategy Office' },
    { id: 'INV-102', title: 'Next-Gen LMS Migration', score: 78, alignment: 'MODERATE', impact: 'HIGH', author: 'IT Governance' },
    { id: 'INV-103', title: 'Institutional Sustainability Initiative', score: 65, alignment: 'HIGH', impact: 'MODERATE', author: 'Facilities' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">Institutional Investment Cases</h2>
          <p className="text-xs text-gray-500 font-medium">Evaluate and score institutional investments against strategic objectives</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100">
          <FileText size={16} />
          Author New Investment Case
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        <div className="md:col-span-4 space-y-3">
          {cases.map((inv, i) => (
            <motion.div
              key={inv.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-4 rounded-xl border border-gray-100 shadow-sm cursor-pointer transition-all ${i === 0 ? 'bg-white ring-2 ring-indigo-500 ring-offset-1' : 'bg-white hover:bg-gray-50'}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold text-gray-400 tracking-tighter uppercase">{inv.id}</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                  inv.score > 80 ? 'bg-emerald-50 text-emerald-600' : 
                  inv.score > 60 ? 'bg-indigo-50 text-indigo-600' : 
                  'bg-amber-50 text-amber-600'
                }`}>
                  Score: {inv.score}
                </span>
              </div>
              <h4 className="text-sm font-bold text-gray-900 mb-1 leading-tight">{inv.title}</h4>
              <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-3">
                <span className="flex items-center gap-1"><Target size={10} /> {inv.alignment}</span>
                <span>{inv.author}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="md:col-span-8 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
          <div className="p-8 border-b border-gray-100 bg-gray-50/20">
             <div className="flex items-center gap-3 mb-4">
                <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-black rounded uppercase border border-indigo-100 tracking-widest">Strat-Align: High</span>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-black rounded uppercase border border-emerald-100 tracking-widest">Confidence: 94.2%</span>
             </div>
             <h1 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">Global Campus Expansion - Phase 9</h1>
             <p className="text-sm text-gray-500 leading-relaxed font-medium">
               Comprehensive investment proposal for scaling institutional presence in the APAC region, focusing on digital infrastructure and localized research hubs.
             </p>
          </div>

          <div className="p-8 flex-1 grid grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Sparkles size={16} className="text-indigo-500" />
                Score Matrix
              </h3>
              {[
                { label: 'Strategic Alignment', value: 95, color: 'bg-emerald-500' },
                { label: 'Benefit Potential', value: 88, color: 'bg-emerald-500' },
                { label: 'Implementation Risk', value: 45, color: 'bg-amber-500' },
                { label: 'Financial Exposure', value: 62, color: 'bg-indigo-500' },
              ].map((m, i) => (
                <div key={i} className="space-y-2">
                   <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                      <span className="text-gray-500">{m.label}</span>
                      <span className="text-gray-900">{m.value}%</span>
                   </div>
                   <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${m.value}%` }}
                        transition={{ delay: 0.5 + (i * 0.1), duration: 1 }}
                        className={`h-full ${m.color}`} 
                      />
                   </div>
                </div>
              ))}
            </div>

            <div className="bg-indigo-900 rounded-3xl p-8 text-white relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
                  <Award size={120} />
               </div>
               <div className="relative z-10 flex flex-col h-full">
                  <h3 className="text-sm font-black uppercase tracking-widest mb-6 text-indigo-200">Executive Recommendation</h3>
                  <p className="text-sm leading-relaxed font-medium mb-8 text-indigo-50">
                    "This investment case demonstrates exceptional strategic fit. The risk-adjusted score of 92 suggests proceeding with Tier 1 allocation priority immediately upon Phase 9.6 cycle activation."
                  </p>
                  <button className="mt-auto w-full py-4 bg-white text-indigo-900 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 shadow-2xl">
                    Adopt Recommendation <ChevronRight size={18} />
                  </button>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
