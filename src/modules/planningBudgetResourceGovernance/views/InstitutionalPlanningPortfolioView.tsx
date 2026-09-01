import React, { useState } from 'react';
import { 
  BarChart3, 
  ShieldCheck, 
  History, 
  PlayCircle,
  FileText,
  Target,
  Layers,
  ArrowUpRight,
  TrendingUp,
  Activity,
  Fingerprint,
  Wallet,
  Zap,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PlanningCycleManager } from '../components/PlanningCycleManager';
import { InitiativePortfolio } from '../components/InitiativePortfolio';
import { ResourceRequestDashboard } from '../components/ResourceRequestDashboard';
import { BudgetGovernanceWorkspace } from '../components/BudgetGovernanceWorkspace';
import { InvestmentCaseExplorer } from '../components/InvestmentCaseExplorer';
import { AllocationDecisionCenter } from '../components/AllocationDecisionCenter';
import { PortfolioRiskMap } from '../components/PortfolioRiskMap';
import { ResourceSimulationSandbox } from '../components/ResourceSimulationSandbox';
import { PlanningAuditLedger } from '../components/PlanningAuditLedger';

type TabType = 'cycles' | 'portfolio' | 'requests' | 'budget' | 'investments' | 'allocations' | 'risk' | 'simulations' | 'audit';

export const InstitutionalPlanningPortfolioView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('cycles');

  const tabs = [
    { id: 'cycles', label: 'Planning Cycles', icon: Target },
    { id: 'portfolio', label: 'Initiative Portfolio', icon: Layers },
    { id: 'requests', label: 'Resource Requests', icon: Zap },
    { id: 'budget', label: 'Budget Governance', icon: Wallet },
    { id: 'investments', label: 'Investment Cases', icon: FileText },
    { id: 'allocations', label: 'Allocations', icon: ShieldCheck },
    { id: 'risk', label: 'Portfolio Risk', icon: AlertTriangle },
    { id: 'simulations', label: 'What-If Sandbox', icon: PlayCircle },
    { id: 'audit', label: 'Audit Ledger', icon: History },
  ];

  return (
    <div className="flex flex-col h-full bg-[#fdfdfd] overflow-hidden">
      {/* Header */}
      <header className="px-6 py-4 bg-white border-b border-gray-100 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
            <BarChart3 size={24} />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Planning & Portfolio Governance</h1>
            <p className="text-sm text-gray-500 font-medium">Institutional Resource & Investment Assurance</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 rounded-lg text-indigo-700 text-xs font-bold uppercase tracking-wider border border-indigo-100">
            <ShieldCheck size={14} />
            Strategic Alignment Active
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-lg text-emerald-700 text-xs font-bold uppercase tracking-wider border border-emerald-100">
            <Fingerprint size={14} />
            Chain Verified
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="px-6 bg-white border-b border-gray-100 flex items-center gap-1 shrink-0 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`
              flex items-center gap-2 px-4 py-3 text-xs font-bold transition-all relative whitespace-nowrap uppercase tracking-widest
              ${activeTab === tab.id ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}
            `}
          >
            <tab.icon size={16} />
            {tab.label}
            {activeTab === tab.id && (
              <motion.div 
                layoutId="activeTabPlanning"
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
            {activeTab === 'cycles' && <PlanningCycleManager />}
            {activeTab === 'portfolio' && <InitiativePortfolio />}
            {activeTab === 'requests' && <ResourceRequestDashboard />}
            {activeTab === 'budget' && <BudgetGovernanceWorkspace />}
            {activeTab === 'investments' && <InvestmentCaseExplorer />}
            {activeTab === 'allocations' && <AllocationDecisionCenter />}
            {activeTab === 'risk' && <PortfolioRiskMap />}
            {activeTab === 'simulations' && <ResourceSimulationSandbox />}
            {activeTab === 'audit' && <PlanningAuditLedger />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* System Status Footer */}
      <footer className="px-6 py-2 bg-white border-t border-gray-100 flex items-center justify-between shrink-0 text-[10px] uppercase font-bold tracking-widest text-gray-400">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Portfolio Engine: Synchronized
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            Budget Context: Reference Only
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span>V9.6.0-BETA</span>
          <span>Hash: SHA-256-INT</span>
        </div>
      </footer>
    </div>
  );
};
