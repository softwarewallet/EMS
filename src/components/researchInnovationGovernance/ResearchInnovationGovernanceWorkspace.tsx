import React, { useState } from 'react';
import { 
  FlaskConical, Lightbulb, FileText, Award, DollarSign, 
  ShieldCheck, AlertTriangle, Search, CheckCircle, Users, 
  Briefcase, TrendingUp, Layers, HelpCircle, FileSpreadsheet, Lock, Activity
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTenant } from '../../context/TenantContext';

export const ResearchInnovationGovernanceWorkspace: React.FC = () => {
  const { currentUser } = useAuth();
  const { currentTenant } = useTenant();
  const tenantId = currentTenant?.id || 'tenant_main';

  const [activeTab, setActiveTab] = useState<string>('overview');

  const kpis = {
    activeProjects: 38,
    activeGrants: 14,
    totalFunding: '$4,250,000',
    ipDisclosures: 22,
    protectedPatents: 8,
    commercializedTech: 5,
    pendingMilestones: 12,
    activeRisks: 3,
    complianceStatus: '100%'
  };

  const tabs = [
    { id: 'overview', label: 'Command Center', icon: FlaskConical },
    { id: 'portfolios', label: 'Portfolios & Programs', icon: Layers },
    { id: 'projects', label: 'Research Projects', icon: Briefcase },
    { id: 'opportunities', label: 'Funding Opportunities', icon: DollarSign },
    { id: 'grants', label: 'Grants & Awards', icon: Award },
    { id: 'proposals', label: 'Proposals & Reviews', icon: FileText },
    { id: 'investigators', label: 'Investigators & Teams', icon: Users },
    { id: 'milestones', label: 'Milestones & Deliverables', icon: CheckCircle },
    { id: 'outputs', label: 'Outputs & Publications', icon: FileSpreadsheet },
    { id: 'ip', label: 'IP Disclosures & Protection', icon: Lock },
    { id: 'commercialization', label: 'Tech Transfer & Licenses', icon: TrendingUp },
    { id: 'innovation', label: 'Innovation Pipeline', icon: Lightbulb },
    { id: 'ethics', label: 'Ethics & Compliance', icon: ShieldCheck },
    { id: 'risks', label: 'Risks & Exceptions', icon: AlertTriangle },
    { id: 'diagnostics', label: 'Diagnostics', icon: Activity }
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <FlaskConical className="h-6 w-6 text-indigo-600" />
            <h2 className="text-lg font-semibold text-gray-800">Research & IP Gov</h2>
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
              <h1 className="text-2xl font-bold text-gray-900">Research, IP, Grants & Commercialization Governance</h1>
              <p className="text-sm text-gray-500 mt-1">Institutional oversight for research portfolios, grant applications, IP disclosures, patents, and technology transfer.</p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search research repository..."
                  className="pl-9 pr-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-indigo-500 focus:border-indigo-500 w-64"
                />
              </div>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md shadow-sm text-sm font-medium">
                New Research Project
              </button>
            </div>
          </div>

          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Command Center</h3>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
                  <div className="p-5">
                    <div className="flex items-center">
                      <Briefcase className="h-6 w-6 text-indigo-500" />
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Active Research Projects</dt>
                          <dd className="text-2xl font-semibold text-gray-900">{kpis.activeProjects}</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
                  <div className="p-5">
                    <div className="flex items-center">
                      <Award className="h-6 w-6 text-emerald-500" />
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Active Grants & Awards</dt>
                          <dd className="text-2xl font-semibold text-gray-900">{kpis.activeGrants}</dd>
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
                          <dt className="text-sm font-medium text-gray-500 truncate">IP Disclosures / Patents</dt>
                          <dd className="text-2xl font-semibold text-gray-900">{kpis.ipDisclosures} / {kpis.protectedPatents}</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
                  <div className="p-5">
                    <div className="flex items-center">
                      <TrendingUp className="h-6 w-6 text-amber-500" />
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Commercialized Tech</dt>
                          <dd className="text-2xl font-semibold text-gray-900">{kpis.commercializedTech}</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Empty State / Status Panel */}
              <div className="mt-8 bg-white shadow rounded-lg border border-gray-200">
                <div className="px-4 py-8 sm:p-6 text-center">
                  <FlaskConical className="mx-auto h-12 w-12 text-gray-300" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No active research project selected.</h3>
                  <p className="mt-1 text-sm text-gray-500">Register a new research portfolio, proposal, or IP disclosure to begin tracking institutional innovation.</p>
                  <div className="mt-6">
                    <button type="button" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                      Submit Research Proposal
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab !== 'overview' && (
            <div className="bg-white shadow rounded-lg border border-gray-200">
              <div className="px-4 py-12 sm:p-6 text-center">
                <FlaskConical className="mx-auto h-12 w-12 text-gray-300" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Insufficient Data</h3>
                <p className="mt-1 text-sm text-gray-500">No records registered for this research governance section in the current campus/tenant context.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
