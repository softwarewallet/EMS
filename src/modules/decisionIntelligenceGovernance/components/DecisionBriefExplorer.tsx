import React from 'react';
import { 
  FileText, 
  Search, 
  BookOpen, 
  ShieldCheck, 
  GitBranch, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  Award
} from 'lucide-react';
import { motion } from 'motion/react';

export const DecisionBriefExplorer: React.FC = () => {
  const briefs = [
    {
      id: 'DB-24-081',
      title: 'Institutional Cloud Migration Strategy',
      owner: 'CTO Office',
      lastUpdate: '2h ago',
      options: 3,
      risk: 'Medium',
      alignment: 'High'
    },
    {
      id: 'DB-24-079',
      title: 'Remote Assessment Integrity Framework',
      owner: 'Academic Senate',
      lastUpdate: '1d ago',
      options: 2,
      risk: 'High',
      alignment: 'Critical'
    },
    {
      id: 'DB-24-075',
      title: 'Multi-Language Support Deployment',
      owner: 'Product Governance',
      lastUpdate: '3d ago',
      options: 4,
      risk: 'Low',
      alignment: 'Medium'
    }
  ];

  return (
    <div className="flex flex-col gap-6 h-full pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Decision Brief Explorer</h2>
          <p className="text-sm text-gray-500 font-medium">Detailed analysis, evidence gathering and recommendation modeling</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input 
              type="text" 
              placeholder="Filter briefs..." 
              className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 min-w-[240px]"
            />
          </div>
          <button className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors">
            <BookOpen size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-full items-start">
        {/* Sidebar List */}
        <div className="md:col-span-4 flex flex-col gap-3">
          {briefs.map((brief, i) => (
            <motion.div
              key={brief.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-4 rounded-xl border border-gray-100 shadow-sm cursor-pointer transition-all ${i === 0 ? 'bg-white ring-2 ring-indigo-500 ring-offset-1' : 'bg-white hover:bg-gray-50'}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold text-gray-400 tracking-tighter uppercase">{brief.id}</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${brief.risk === 'High' ? 'bg-rose-50 text-rose-600' : brief.risk === 'Medium' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                  {brief.risk} Risk
                </span>
              </div>
              <h4 className="text-sm font-bold text-gray-900 mb-1 leading-tight">{brief.title}</h4>
              <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-3">
                <span className="flex items-center gap-1"><BookOpen size={10} /> {brief.owner}</span>
                <span>{brief.lastUpdate}</span>
              </div>
            </motion.div>
          ))}
          <button className="py-4 border-2 border-dashed border-gray-200 rounded-xl text-xs font-bold text-gray-400 hover:border-indigo-300 hover:text-indigo-500 transition-all uppercase tracking-widest mt-2">
            Archive Explorer
          </button>
        </div>

        {/* Detailed View */}
        <div className="md:col-span-8 bg-white rounded-xl border border-gray-100 shadow-sm h-full flex flex-col min-h-[600px]">
          <div className="p-8 border-b border-gray-100 flex items-start justify-between">
            <div className="max-w-xl">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded uppercase border border-indigo-100">Strat-Align: High</span>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded uppercase border border-emerald-100">Evidence Verified</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2 leading-tight tracking-tight">Institutional Cloud Migration Strategy</h1>
              <p className="text-sm text-gray-500 leading-relaxed font-medium">
                Comprehensive proposal for transitioning core institutional workloads from legacy on-premise infrastructure to a unified hybrid cloud environment for Phase 9.5 operational readiness.
              </p>
            </div>
            <button className="p-3 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border border-gray-100">
              <ExternalLink size={20} />
            </button>
          </div>

          <div className="p-8 flex-1 grid grid-cols-2 gap-8">
            {/* Options Comparison */}
            <div className="space-y-6">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <GitBranch size={16} className="text-indigo-500" />
                Strategic Options (3)
              </h3>
              {[
                { label: 'Aggressive Transition', detail: '100% Migration within 12 months', selected: true },
                { label: 'Phased Multi-Cloud', detail: 'Selective workloads across 24 months', selected: false },
                { label: 'Cloud-First New Dev', detail: 'Only new services in cloud environment', selected: false },
              ].map((opt, i) => (
                <div key={i} className={`p-4 rounded-xl border transition-all ${opt.selected ? 'bg-indigo-50 border-indigo-200 shadow-sm ring-1 ring-indigo-500' : 'bg-gray-50 border-gray-100 opacity-60'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-gray-900">{opt.label}</span>
                    {opt.selected && <ShieldCheck size={16} className="text-indigo-600" />}
                  </div>
                  <p className="text-xs text-gray-500 font-medium">{opt.detail}</p>
                </div>
              ))}
            </div>

            {/* AI Recommendation Intelligence */}
            <div className="bg-indigo-900 rounded-2xl p-6 text-white flex flex-col h-full overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
                <Sparkles size={120} />
              </div>
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-indigo-800 flex items-center justify-center text-indigo-300">
                    <Award size={24} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider">Intel Recommendation</h3>
                    <p className="text-[10px] text-indigo-300 font-mono tracking-tighter uppercase">Confidence: 94.2%</p>
                  </div>
                </div>
                
                <div className="flex-1 space-y-4">
                  <p className="text-sm leading-relaxed text-indigo-100 font-medium">
                    "Option A (Aggressive Transition) demonstrates the highest strategic alignment and provides a 24% reduction in long-term operational technical debt. The governance diagnostic suggests proceeding with mandatory Phase 1 oversight."
                  </p>
                  
                  <div className="pt-4 border-t border-indigo-800 space-y-3">
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-indigo-300">
                      <span>ROI Potential</span>
                      <span>+18.4%</span>
                    </div>
                    <div className="h-1 bg-indigo-800 rounded-full overflow-hidden">
                      <div className="h-full w-[18.4%] bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                    </div>
                  </div>
                </div>

                <button className="mt-8 w-full py-3 bg-white text-indigo-900 rounded-xl text-xs font-bold hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 uppercase tracking-widest shadow-xl shadow-indigo-950/20">
                  Adopt Recommendation <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="p-8 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-gray-400" />
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">12 Evidence Records</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-gray-400" />
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Provenance: Validated</span>
              </div>
            </div>
            <p className="text-[10px] font-mono text-gray-400 uppercase">Audit Hash: B12-C9F-782</p>
          </div>
        </div>
      </div>
    </div>
  );
};
