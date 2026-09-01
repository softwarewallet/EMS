import React from 'react';
import { 
  Zap, 
  ArrowUpRight, 
  TrendingDown, 
  TrendingUp, 
  ShieldAlert,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { GovImpactLevel } from '../../../types/planningBudgetResourceGovernance';

export const ResourceRequestDashboard: React.FC = () => {
  const requests = [
    { 
      id: 'REQ-901', 
      type: 'FINANCIAL', 
      amount: '$450,000', 
      initiative: 'Cloud-First Enterprise Transition', 
      urgency: GovImpactLevel.CRITICAL, 
      state: 'SUBMITTED', 
      requester: 'Dr. Sarah Chen' 
    },
    { 
      id: 'REQ-902', 
      type: 'WORKFORCE', 
      capacity: '4x Cloud Architects', 
      initiative: 'Cloud-First Enterprise Transition', 
      urgency: GovImpactLevel.HIGH, 
      state: 'REVIEW', 
      requester: 'James Wilson' 
    },
    { 
      id: 'REQ-903', 
      type: 'TECHNOLOGY', 
      capacity: 'High-Performance Cluster', 
      initiative: 'AI-Augmented Research Lab', 
      urgency: GovImpactLevel.HIGH, 
      state: 'APPROVED', 
      requester: 'Prof. Xavier' 
    },
    { 
      id: 'REQ-904', 
      type: 'INFRASTRUCTURE', 
      capacity: '5G Campus Nodes', 
      initiative: 'Digital Connectivity Phase 2', 
      urgency: GovImpactLevel.MODERATE, 
      state: 'ALLOCATED', 
      requester: 'Infrastructure Team' 
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">Institutional Resource Requests</h2>
          <p className="text-xs text-gray-500 font-medium">Govern requests for capital, workforce, and institutional capacity</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 tracking-widest uppercase">
            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-rose-500" /> 12 Urgent</span>
            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-500" /> 24 Routine</span>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100">
            <Zap size={16} />
            New Capacity Request
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
          <h3 className="text-xs font-black text-gray-700 uppercase tracking-widest flex items-center gap-2">
            <ShieldAlert size={16} className="text-indigo-600" />
            Request Intake Queue
          </h3>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={12} />
              <input 
                type="text" 
                placeholder="Search requests..." 
                className="pl-8 pr-4 py-1.5 bg-white border border-gray-200 rounded-lg text-[10px] font-bold focus:outline-none min-w-[200px]"
              />
            </div>
            <button className="p-1.5 bg-white border border-gray-200 rounded-lg text-gray-400">
              <Filter size={14} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 bg-gray-50/30">
                <th className="px-6 py-3">Request ID</th>
                <th className="px-6 py-3">Type / Subject</th>
                <th className="px-6 py-3">Capacity/Amount</th>
                <th className="px-6 py-3">Urgency</th>
                <th className="px-6 py-3">State</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-tighter">{req.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-xs font-black text-indigo-900 uppercase tracking-widest mb-0.5">{req.type}</div>
                      <div className="text-[10px] font-medium text-gray-500 truncate max-w-[200px]">{req.initiative}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-gray-700 uppercase">
                    {req.amount || req.capacity}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest ${
                      req.urgency === GovImpactLevel.CRITICAL ? 'text-rose-600' : 
                      req.urgency === GovImpactLevel.HIGH ? 'text-amber-600' : 
                      'text-indigo-600'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        req.urgency === GovImpactLevel.CRITICAL ? 'bg-rose-600' : 
                        req.urgency === GovImpactLevel.HIGH ? 'bg-amber-600' : 
                        'bg-indigo-600'
                      }`} />
                      {req.urgency}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      req.state === 'ALLOCATED' ? 'bg-emerald-50 text-emerald-700' :
                      req.state === 'APPROVED' ? 'bg-blue-50 text-blue-700' :
                      req.state === 'REVIEW' ? 'bg-amber-50 text-amber-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {req.state}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded transition-all">
                        <ArrowUpRight size={14} />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:bg-gray-100 rounded transition-all">
                        <Clock size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
