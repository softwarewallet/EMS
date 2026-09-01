import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  FileSearch,
  MoreVertical,
  ShieldAlert,
  BarChart2,
  Lock
} from 'lucide-react';
import { motion } from 'motion/react';

export const ExecutiveDecisionWorkspace: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    { label: 'Pending Authorization', value: '12', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Strategic Directives', value: '45', icon: BarChart2, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Dissent/Challenges', value: '03', icon: ShieldAlert, color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: 'Resolved (30d)', value: '128', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  const recentDecisions = [
    { 
      id: 'DEC-2024-001', 
      title: 'Global Campus Expansion - Phase 2', 
      type: 'STRATEGIC', 
      status: 'PENDING_APPROVAL', 
      impact: 'HIGH', 
      proposer: 'Dr. Sarah Chen', 
      date: '2024-08-30' 
    },
    { 
      id: 'DEC-2024-002', 
      title: 'Institutional AI Ethics Policy Adoption', 
      type: 'POLICY', 
      status: 'IN_REVIEW', 
      impact: 'CRITICAL', 
      proposer: 'Prof. James Wilson', 
      date: '2024-08-29' 
    },
    { 
      id: 'DEC-2024-003', 
      title: 'Digital Infrastructure Upgrade (EMEA)', 
      type: 'OPERATIONAL', 
      status: 'APPROVED', 
      impact: 'MEDIUM', 
      proposer: 'Mark Stevens', 
      date: '2024-08-28' 
    },
    { 
      id: 'DEC-2024-004', 
      title: 'Faculty Compensation Adjustment Plan', 
      type: 'HUMAN_CAPITAL', 
      status: 'CHALLENGED', 
      impact: 'HIGH', 
      proposer: 'HR Governance Committee', 
      date: '2024-08-27' 
    },
  ];

  if (loading) {
    return (
      <div className="flex flex-col gap-6 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-white rounded-xl border border-gray-100" />
          ))}
        </div>
        <div className="h-[400px] bg-white rounded-xl border border-gray-100" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 h-full pb-10">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between"
          >
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
            <div className={`w-12 h-12 rounded-lg ${stat.bg} ${stat.color} flex items-center justify-center`}>
              <stat.icon size={24} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Table Area */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
          <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
            <Lock size={16} className="text-indigo-500" />
            Executive Decision Queue
          </h2>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input 
                type="text" 
                placeholder="Search queue..." 
                className="pl-9 pr-4 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors">
              <Filter size={14} />
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200">
              <Plus size={14} />
              New Request
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 bg-gray-50/30">
                <th className="px-6 py-3">Decision Record</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Proposer</th>
                <th className="px-6 py-3">Impact</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentDecisions.map((decision) => (
                <tr key={decision.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                        {decision.title}
                      </div>
                      <div className="text-[10px] font-mono text-gray-400 uppercase tracking-tighter">
                        {decision.id}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-[10px] font-bold uppercase">
                      {decision.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-gray-600">
                    {decision.proposer}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`
                      flex items-center gap-1.5 text-[10px] font-bold uppercase
                      ${decision.impact === 'CRITICAL' ? 'text-rose-600' : decision.impact === 'HIGH' ? 'text-amber-600' : 'text-indigo-600'}
                    `}>
                      <div className={`w-1.5 h-1.5 rounded-full ${decision.impact === 'CRITICAL' ? 'bg-rose-600' : decision.impact === 'HIGH' ? 'bg-amber-600' : 'bg-indigo-600'}`} />
                      {decision.impact}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`
                      px-2 py-1 rounded-full text-[10px] font-bold uppercase
                      ${decision.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 
                        decision.status === 'PENDING_APPROVAL' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                        decision.status === 'CHALLENGED' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                        'bg-blue-50 text-blue-700 border border-blue-100'}
                    `}>
                      {decision.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-gray-500">
                    {decision.date}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                        <FileSearch size={14} />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all">
                        <ShieldAlert size={14} />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
                        <MoreVertical size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-3 bg-gray-50/30 border-t border-gray-100 flex items-center justify-between">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Showing 4 of 128 authorized records
          </p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 bg-white border border-gray-200 rounded text-[10px] font-bold text-gray-500 hover:bg-gray-50 transition-colors">
              PREVIOUS
            </button>
            <button className="px-3 py-1 bg-white border border-gray-200 rounded text-[10px] font-bold text-gray-500 hover:bg-gray-50 transition-colors">
              NEXT
            </button>
          </div>
        </div>
      </div>
      
      {/* Lower Details / Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm border-l-4 border-l-amber-500">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <AlertCircle size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-1">Action Required: Separation of Duties</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                3 decisions in the queue require an independent secondary approver as per the Institutional Four-Eyes Policy. Proposers cannot authorize their own requests.
              </p>
              <button className="mt-3 flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors uppercase tracking-wider">
                Review Conflicts <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-indigo-900 p-5 rounded-xl border border-indigo-800 shadow-sm text-white">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-indigo-800 text-indigo-300 rounded-lg">
              <ShieldAlert size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold mb-1 uppercase tracking-wider">Decision Provenance: OK</h3>
              <p className="text-xs text-indigo-200 leading-relaxed opacity-90">
                The cryptographic audit chain for all active decisions has been verified. No tampering detected in the immutable ledger for the current fiscal period.
              </p>
              <div className="mt-3 flex items-center gap-3">
                <div className="h-1.5 flex-1 bg-indigo-800 rounded-full overflow-hidden">
                  <div className="h-full w-full bg-emerald-500" />
                </div>
                <span className="text-[10px] font-mono font-bold tracking-tighter">INTEGRITY: 100.0%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
