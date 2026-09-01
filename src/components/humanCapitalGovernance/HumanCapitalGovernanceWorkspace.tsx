import React, { useState } from 'react';
import { 
  UsersRound, Briefcase, Layers, Cpu, ShieldCheck, 
  Award, TrendingUp, AlertTriangle, Search, CheckCircle, 
  UserCheck, Activity, Target, HelpCircle, FileText, Lock, RefreshCw, Eye
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTenant } from '../../context/TenantContext';

export const HumanCapitalGovernanceWorkspace: React.FC = () => {
  const { currentUser } = useAuth();
  const { currentTenant } = useTenant();
  const tenantId = currentTenant?.id || 'tenant_main';

  const [activeTab, setActiveTab] = useState<string>('overview');
  const [sandboxType, setSandboxType] = useState<string>('HIRING_FREEZE');

  const kpis = {
    workforcePlans: 'INSUFFICIENT DATA',
    criticalRoleCoverage: 'INSUFFICIENT DATA',
    successionCoverage: 'INSUFFICIENT DATA',
    activePerformanceCycles: 'INSUFFICIENT DATA',
    talentPoolMembers: 'INSUFFICIENT DATA',
    overdueDevelopments: 'INSUFFICIENT DATA',
    workforceRisks: 'INSUFFICIENT DATA',
    resilienceRating: 'INSUFFICIENT DATA'
  };

  const tabs = [
    { id: 'overview', label: 'Command Center', icon: UsersRound },
    { id: 'strategy', label: 'Workforce Strategy', icon: Target },
    { id: 'sandbox', label: 'What-If Sandbox', icon: Cpu },
    { id: 'positions', label: 'Positions & Roles', icon: Briefcase },
    { id: 'capacity', label: 'Capacity & Capability', icon: Layers },
    { id: 'competency', label: 'Competencies & Skills', icon: ShieldCheck },
    { id: 'talent', label: 'Talent & Potential', icon: Award },
    { id: 'career', label: 'Career & Development', icon: TrendingUp },
    { id: 'training', label: 'Training Governance', icon: FileText },
    { id: 'performance', label: 'Performance Cycles', icon: Activity },
    { id: 'succession', label: 'Succession & Critical Roles', icon: UserCheck },
    { id: 'promotion', label: 'Promotion & Tenure', icon: CheckCircle },
    { id: 'pip', label: 'Performance Improvement', icon: AlertTriangle },
    { id: 'risks', label: 'Risks & Resilience', icon: Lock },
    { id: 'offboarding', label: 'Knowledge & Offboarding', icon: RefreshCw },
    { id: 'diagnostics', label: 'Diagnostics', icon: Eye }
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <UsersRound className="h-6 w-6 text-indigo-600" />
            <h2 className="text-lg font-semibold text-gray-800">Human Capital Gov</h2>
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
                  isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'
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
              <h1 className="text-2xl font-bold text-gray-900">Human Capital, Workforce, Talent & Performance Governance</h1>
              <p className="text-sm text-gray-500 mt-1">Institutional oversight for workforce strategy, competency frameworks, performance calibration, succession planning, and organizational development.</p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search workforce records..."
                  className="pl-9 pr-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-indigo-500 focus:border-indigo-500 w-64"
                />
              </div>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md shadow-sm text-sm font-medium">
                New Strategy Plan
              </button>
            </div>
          </div>

          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Workforce Command Center</h3>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
                  <div className="p-5">
                    <div className="flex items-center">
                      <Target className="h-6 w-6 text-indigo-500" />
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Workforce Plan Status</dt>
                          <dd className="text-lg font-semibold text-gray-900">{kpis.workforcePlans}</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
                  <div className="p-5">
                    <div className="flex items-center">
                      <UserCheck className="h-6 w-6 text-emerald-500" />
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Critical Role Coverage</dt>
                          <dd className="text-lg font-semibold text-gray-900">{kpis.criticalRoleCoverage}</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
                  <div className="p-5">
                    <div className="flex items-center">
                      <Activity className="h-6 w-6 text-purple-500" />
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Performance Cycles</dt>
                          <dd className="text-lg font-semibold text-gray-900">{kpis.activePerformanceCycles}</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
                  <div className="p-5">
                    <div className="flex items-center">
                      <ShieldCheck className="h-6 w-6 text-amber-500" />
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Resilience Rating</dt>
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
                  <UsersRound className="mx-auto h-12 w-12 text-gray-300" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">INSUFFICIENT DATA</h3>
                  <p className="mt-1 text-sm text-gray-500">No active workforce strategy or performance cycle records registered in the current tenant scope.</p>
                  <div className="mt-6">
                    <button type="button" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                      Configure Competency Framework
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sandbox' && (
            <div className="bg-white shadow rounded-lg border border-gray-200 p-6 space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">What-If Workforce Simulation Sandbox</h3>
                <p className="text-sm text-gray-500 mt-1">Simulate workforce scenarios in an isolated sandbox. Production workforce records will not be mutated.</p>
              </div>

              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700">Scenario Type:</label>
                <select 
                  value={sandboxType}
                  onChange={(e) => setSandboxType(e.target.value)}
                  className="border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="HIRING_FREEZE">Hiring Freeze</option>
                  <option value="EXPANSION">Campus Workforce Expansion</option>
                  <option value="SKILL_SHORTAGE">Critical Skill Shortage</option>
                  <option value="RETIREMENT_CONCENTRATION">Retirement Concentration</option>
                  <option value="VACANCY_EXPOSURE">Key Person Vacancy Exposure</option>
                  <option value="RESTRUCTURING">Organizational Restructuring</option>
                </select>

                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium">
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
                      Calculations are generated for modeling capacity gaps and critical role exposures. All simulation outputs remain isolated from authoritative HR and workforce records.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab !== 'overview' && activeTab !== 'sandbox' && (
            <div className="bg-white shadow rounded-lg border border-gray-200">
              <div className="px-4 py-12 sm:p-6 text-center">
                <UsersRound className="mx-auto h-12 w-12 text-gray-300" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">INSUFFICIENT DATA</h3>
                <p className="mt-1 text-sm text-gray-500">No records registered for this human capital governance section in the current tenant/campus scope.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
