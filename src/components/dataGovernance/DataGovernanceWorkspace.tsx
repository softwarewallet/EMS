import React, { useState } from 'react';
import { 
  Database, DatabaseZap, ShieldCheck, Activity, Search, 
  Layers, CheckCircle, Network, FileText, Share2, 
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTenant } from '../../context/TenantContext';

export const DataGovernanceWorkspace: React.FC = () => {
  const { currentUser } = useAuth();
  const { currentTenant } = useTenant();
  const tenantId = currentTenant?.id || 'tenant_main';
  
  const [activeTab, setActiveTab] = useState<'overview' | 'domains' | 'assets' | 'dictionary' | 'glossary' | 'lineage' | 'masterdata' | 'quality' | 'contracts' | 'sharing'>('overview');

  // Simulated metrics - would be fetched via service
  const kpis = {
    domains: 18,
    assets: 450,
    criticalAssets: 32,
    qualityRules: 120,
    openIssues: 15,
    remediations: 4,
    certifications: 85,
    duplicates: 12,
    expiredSharing: 1,
    healthScore: 92
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Left Navigation */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <DatabaseZap className="h-6 w-6 text-indigo-600" />
            <h2 className="text-lg font-semibold text-gray-800">Data Gov</h2>
          </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'overview' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Activity className="h-5 w-5" />
            <span>Command Center</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('domains')}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'domains' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Layers className="h-5 w-5" />
            <span>Data Domains</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('assets')}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'assets' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Database className="h-5 w-5" />
            <span>Data Assets</span>
          </button>

          <button 
            onClick={() => setActiveTab('dictionary')}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'dictionary' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <FileText className="h-5 w-5" />
            <span>Data Dictionary</span>
          </button>

          <button 
            onClick={() => setActiveTab('glossary')}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'glossary' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <BookOpenIcon className="h-5 w-5" />
            <span>Business Glossary</span>
          </button>

          <button 
            onClick={() => setActiveTab('lineage')}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'lineage' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Network className="h-5 w-5" />
            <span>Data Lineage</span>
          </button>

          <button 
            onClick={() => setActiveTab('masterdata')}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'masterdata' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <DatabaseZap className="h-5 w-5" />
            <span>Master Data</span>
          </button>

          <button 
            onClick={() => setActiveTab('quality')}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'quality' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <ShieldCheck className="h-5 w-5" />
            <span>Data Quality</span>
          </button>

          <button 
            onClick={() => setActiveTab('contracts')}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'contracts' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <FileText className="h-5 w-5" />
            <span>Data Contracts</span>
          </button>

          <button 
            onClick={() => setActiveTab('sharing')}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'sharing' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Share2 className="h-5 w-5" />
            <span>Data Sharing</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Institutional Data Governance</h1>
              <p className="text-sm text-gray-500 mt-1">Enterprise master data, quality, lineage, and data stewardship engine.</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search data assets..." 
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 w-64"
                />
              </div>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md shadow-sm text-sm font-medium">
                Register Asset
              </button>
            </div>
          </div>

          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Executive Command Center</h3>
              
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Database className="h-6 w-6 text-indigo-400" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Governed Data Assets</dt>
                          <dd className="flex items-baseline">
                            <div className="text-2xl font-semibold text-gray-900">{kpis.assets}</div>
                            <div className="ml-2 text-sm text-gray-500">({kpis.criticalAssets} critical)</div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <ShieldCheck className="h-6 w-6 text-green-400" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Quality Rules Active</dt>
                          <dd className="flex items-baseline">
                            <div className="text-2xl font-semibold text-gray-900">{kpis.qualityRules}</div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <AlertTriangle className="h-6 w-6 text-red-400" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Quality Issues</dt>
                          <dd className="flex items-baseline">
                            <div className="text-2xl font-semibold text-gray-900">{kpis.openIssues}</div>
                            <div className="ml-2 inline-flex items-baseline px-2.5 py-0.5 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                              {kpis.remediations} in remediation
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Activity className="h-6 w-6 text-blue-400" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Governance Health</dt>
                          <dd className="flex items-baseline">
                            <div className="text-2xl font-semibold text-gray-900">{kpis.healthScore}%</div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Meaningful empty state */}
              <div className="mt-8 bg-white shadow rounded-lg border border-gray-200">
                <div className="px-4 py-5 sm:p-6 text-center">
                  <DatabaseZap className="mx-auto h-12 w-12 text-gray-300" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No governed data assets have been registered.</h3>
                  <p className="mt-1 text-sm text-gray-500">Register the first data domain to establish the institutional data baseline.</p>
                  <div className="mt-6">
                    <button type="button" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                      Create Data Domain
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab !== 'overview' && (
            <div className="bg-white shadow rounded-lg border border-gray-200">
              <div className="px-4 py-5 sm:p-6 text-center">
                <Database className="mx-auto h-12 w-12 text-gray-300" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Insufficient Data</h3>
                <p className="mt-1 text-sm text-gray-500">No records found for this section.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper icon
const BookOpenIcon = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
  </svg>
);
