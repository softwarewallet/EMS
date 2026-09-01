import React, { useState } from 'react';
import { 
  Landmark, WalletCards, ChartNoAxesCombined, BadgeDollarSign, Target, 
  Layers, Cpu, ShieldCheck, AlertTriangle, Search, CheckCircle, 
  Activity, FileText, Lock, RefreshCw, Eye, PieChart, TrendingUp, Scale, AlertOctagon
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTenant } from '../../context/TenantContext';

export const FinancialGovernanceWorkspace: React.FC = () => {
  const { currentUser } = useAuth();
  const { currentTenant } = useTenant();
  const tenantId = currentTenant?.id || 'tenant_main';

  const [activeTab, setActiveTab] = useState<string>('overview');
  const [sandboxType, setSandboxType] = useState<string>('REVENUE_DECLINE');

  const kpis = {
    budgetCycleStatus: 'INSUFFICIENT DATA',
    varianceExposure: 'INSUFFICIENT DATA',
    revenueRisk: 'INSUFFICIENT DATA',
    fundingConcentration: 'INSUFFICIENT DATA',
    liquidityStatus: 'INSUFFICIENT DATA',
    capitalPipeline: 'INSUFFICIENT DATA',
    controlHealth: 'INSUFFICIENT DATA',
    resilienceRating: 'INSUFFICIENT DATA'
  };

  const tabs = [
    { id: 'overview', label: 'Command Center', icon: Landmark },
    { id: 'strategy', label: 'Financial Strategy', icon: Target },
    { id: 'plan', label: 'Multi-Year Plan', icon: FileText },
    { id: 'sandbox', label: 'What-If Sandbox', icon: Cpu },
    { id: 'framework', label: 'Budget Framework', icon: Layers },
    { id: 'cycles', label: 'Budget Cycles', icon: RefreshCw },
    { id: 'envelopes', label: 'Budget Envelopes', icon: WalletCards },
    { id: 'requests', label: 'Budget Requests', icon: BadgeDollarSign },
    { id: 'revisions', label: 'Budget Revisions', icon: Scale },
    { id: 'transfers', label: 'Budget Transfers', icon: TrendingUp },
    { id: 'cost', label: 'Cost Management', icon: PieChart },
    { id: 'revenue', label: 'Revenue Governance', icon: ChartNoAxesCombined },
    { id: 'funding', label: 'Funding Sources', icon: ShieldCheck },
    { id: 'cashflow', label: 'Cash Flow & Liquidity', icon: Activity },
    { id: 'treasury', label: 'Treasury Governance', icon: Landmark },
    { id: 'capital', label: 'Capital Planning', icon: Layers },
    { id: 'controls', label: 'Financial Controls', icon: Lock },
    { id: 'exceptions', label: 'Exceptions & Approvals', icon: CheckCircle },
    { id: 'risks', label: 'Financial Risks', icon: AlertTriangle },
    { id: 'resilience', label: 'Financial Resilience', icon: AlertOctagon },
    { id: 'diagnostics', label: 'Diagnostics', icon: Eye }
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Landmark className="h-6 w-6 text-emerald-600" />
            <h2 className="text-lg font-semibold text-gray-800">Financial Gov</h2>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <IconComponent className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Financial Governance, Budget, Treasury & Resilience</h1>
              <p className="text-sm text-gray-500 mt-1">Institutional oversight for financial strategies, multi-year plans, budget envelopes, cash liquidity, internal controls, and financial resilience.</p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search financial records..."
                  className="pl-9 pr-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-emerald-500 focus:border-emerald-500 w-64"
                />
              </div>
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md shadow-sm text-sm font-medium">
                New Strategy Plan
              </button>
            </div>
          </div>

          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Executive Financial Command Center</h3>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
                  <div className="p-5">
                    <div className="flex items-center">
                      <RefreshCw className="h-6 w-6 text-emerald-500" />
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Budget Cycle Status</dt>
                          <dd className="text-lg font-semibold text-gray-900">{kpis.budgetCycleStatus}</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
                  <div className="p-5">
                    <div className="flex items-center">
                      <Activity className="h-6 w-6 text-indigo-500" />
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Liquidity Status</dt>
                          <dd className="text-lg font-semibold text-gray-900">{kpis.liquidityStatus}</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
                  <div className="p-5">
                    <div className="flex items-center">
                      <Lock className="h-6 w-6 text-purple-500" />
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Financial Control Health</dt>
                          <dd className="text-lg font-semibold text-gray-900">{kpis.controlHealth}</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
                  <div className="p-5">
                    <div className="flex items-center">
                      <AlertOctagon className="h-6 w-6 text-amber-500" />
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Financial Resilience</dt>
                          <dd className="text-lg font-semibold text-gray-900">{kpis.resilienceRating}</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Banner */}
              <div className="bg-white shadow rounded-lg border border-gray-200">
                <div className="px-4 py-12 sm:p-6 text-center">
                  <Landmark className="mx-auto h-12 w-12 text-gray-300" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">INSUFFICIENT DATA</h3>
                  <p className="mt-1 text-sm text-gray-500">No active financial governance strategy or budget envelope records registered in the current tenant scope.</p>
                  <div className="mt-6">
                    <button type="button" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700">
                      Configure Budget Framework
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sandbox' && (
            <div className="bg-white shadow rounded-lg border border-gray-200 p-6 space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">What-If Financial Simulation Sandbox</h3>
                <p className="text-sm text-gray-500 mt-1">Simulate financial shocks and scenarios in an isolated sandbox. Production accounting and ledger records will not be mutated.</p>
              </div>

              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700">Scenario Type:</label>
                <select 
                  value={sandboxType}
                  onChange={(e) => setSandboxType(e.target.value)}
                  className="border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="REVENUE_DECLINE">Tuition / Revenue Decline (-15%)</option>
                  <option value="EXPENDITURE_INCREASE">Operational Expenditure Increase (+20%)</option>
                  <option value="FUNDING_REDUCTION">Government Funding Reduction (-25%)</option>
                  <option value="ENROLLMENT_SHOCK">Enrollment Shock (-18%)</option>
                  <option value="WORKFORCE_COST_SPIKE">Workforce Cost Spike (+14%)</option>
                  <option value="CAPEX_OVERRUN">Capital Project Overrun (+22%)</option>
                  <option value="INFLATION_SURGE">Inflation Surge (+12%)</option>
                  <option value="GRANT_SHORTFALL">Research Grant Shortfall (-16%)</option>
                  <option value="LIQUIDITY_STRESS">Liquidity Stress Scenario (-40%)</option>
                  <option value="EMERGENCY_EXPENDITURE">Emergency Disaster Expenditure (+28%)</option>
                  <option value="COST_OPTIMIZATION">Cost Optimization Strategy (-12%)</option>
                </select>

                <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                  Run Simulation
                </button>
              </div>

              <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-amber-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-amber-700 font-medium">
                      SANDBOX / SIMULATION MODE ACTIVE
                    </p>
                    <p className="text-xs text-amber-600 mt-1">
                      Calculations are generated for modeling budget impact, liquidity stress, and variance. All simulation outputs remain isolated from production accounting ledgers.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab !== 'overview' && activeTab !== 'sandbox' && (
            <div className="bg-white shadow rounded-lg border border-gray-200">
              <div className="px-4 py-12 sm:p-6 text-center">
                <Landmark className="mx-auto h-12 w-12 text-gray-300" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">INSUFFICIENT DATA</h3>
                <p className="mt-1 text-sm text-gray-500">No records registered for this financial governance section in the current tenant/campus scope.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
