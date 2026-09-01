import React, { useState } from 'react';
import { 
  Brain, 
  ShieldCheck, 
  History, 
  MessageSquareWarning, 
  PlayCircle,
  FileText,
  BarChart3,
  Gavel,
  AlertTriangle,
  Fingerprint
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ExecutiveDecisionWorkspace } from '../components/ExecutiveDecisionWorkspace';
import { DecisionIntakeDashboard } from '../components/DecisionIntakeDashboard';
import { DecisionBriefExplorer } from '../components/DecisionBriefExplorer';
import { DecisionSimulationSandbox } from '../components/DecisionSimulationSandbox';
import { DecisionAuditLedger } from '../components/DecisionAuditLedger';

type TabType = 'workspace' | 'intake' | 'briefs' | 'simulations' | 'audit';

export const InstitutionalDecisionGovernanceView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('workspace');

  const tabs = [
    { id: 'workspace', label: 'Executive Workspace', icon: Gavel },
    { id: 'intake', label: 'Decision Intake', icon: MessageSquareWarning },
    { id: 'briefs', label: 'Brief Explorer', icon: FileText },
    { id: 'simulations', label: 'What-If Sandbox', icon: PlayCircle },
    { id: 'audit', label: 'Provenance Ledger', icon: History },
  ];

  return (
    <div className="flex flex-col h-full bg-[#fdfdfd] overflow-hidden">
      {/* Header */}
      <header className="px-6 py-4 bg-white border-b border-gray-100 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
            <Brain size={24} />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Decision Intelligence & Governance</h1>
            <p className="text-sm text-gray-500 font-medium">Institutional Action Assurance Control Plane</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 rounded-lg text-indigo-700 text-xs font-bold uppercase tracking-wider border border-indigo-100">
            <ShieldCheck size={14} />
            Four-Eyes Enforced
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-lg text-emerald-700 text-xs font-bold uppercase tracking-wider border border-emerald-100">
            <Fingerprint size={14} />
            Provenance Active
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="px-6 bg-white border-b border-gray-100 flex items-center gap-1 shrink-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`
              flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-all relative
              ${activeTab === tab.id ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'}
            `}
          >
            <tab.icon size={18} />
            {tab.label}
            {activeTab === tab.id && (
              <motion.div 
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" 
              />
            )}
          </button>
        ))}
      </nav>

      {/* Content Area */}
      <main className="flex-1 overflow-y-auto bg-gray-50/50 p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="max-w-7xl mx-auto h-full"
          >
            {activeTab === 'workspace' && <ExecutiveDecisionWorkspace />}
            {activeTab === 'intake' && <DecisionIntakeDashboard />}
            {activeTab === 'briefs' && <DecisionBriefExplorer />}
            {activeTab === 'simulations' && <DecisionSimulationSandbox />}
            {activeTab === 'audit' && <DecisionAuditLedger />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* System Status Footer */}
      <footer className="px-6 py-2 bg-white border-t border-gray-100 flex items-center justify-between shrink-0 text-[10px] uppercase font-bold tracking-widest text-gray-400">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Governance Engine: Operational
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            Decision Intel: Syncing
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span>V9.5.0-ALPHA</span>
          <span>Hash: SHA-256-VLD</span>
        </div>
      </footer>
    </div>
  );
};
