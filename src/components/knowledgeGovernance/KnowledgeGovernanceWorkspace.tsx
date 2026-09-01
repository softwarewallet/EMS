import React, { useState } from 'react';
import { 
  Library, FileText, CheckCircle, AlertTriangle, 
  Search, BookOpen, Users, Shield, Network,
  Brain, Layers, Tag, HelpCircle, FileCheck, Award
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTenant } from '../../context/TenantContext';

export const KnowledgeGovernanceWorkspace: React.FC = () => {
  const { currentUser } = useAuth();
  const { currentTenant } = useTenant();
  const tenantId = currentTenant?.id || 'tenant_main';

  const [activeTab, setActiveTab] = useState<string>('overview');

  const kpis = {
    totalAssets: 142,
    publishedArticles: 68,
    institutionalPractices: 24,
    lessonsLearned: 31,
    expertiseProfiles: 52,
    researchReferences: 19,
    certifications: 88,
    knowledgeGaps: 4,
    activeRisks: 2,
    knowledgeHealth: '94%'
  };

  const tabs = [
    { id: 'overview', label: 'Command Center', icon: Library },
    { id: 'domains', label: 'Knowledge Domains', icon: Layers },
    { id: 'assets', label: 'Knowledge Assets', icon: BookOpen },
    { id: 'articles', label: 'Articles & Guidance', icon: FileText },
    { id: 'taxonomy', label: 'Taxonomy & Tags', icon: Tag },
    { id: 'evidence', label: 'Evidence & References', icon: FileCheck },
    { id: 'practices', label: 'Institutional Practices', icon: CheckCircle },
    { id: 'lessons', label: 'Lessons Learned', icon: Brain },
    { id: 'memory', label: 'Organizational Memory', icon: BookOpen },
    { id: 'expertise', label: 'Expertise Directory', icon: Users },
    { id: 'research', label: 'Research Knowledge', icon: Library },
    { id: 'qa', label: 'Questions & Answers', icon: HelpCircle },
    { id: 'search', label: 'Knowledge Discovery', icon: Search },
    { id: 'lineage', label: 'Knowledge Lineage', icon: Network },
    { id: 'certifications', label: 'Certifications', icon: Award },
    { id: 'risks', label: 'Risks & Gaps', icon: AlertTriangle },
    { id: 'audit', label: 'Audit Trail', icon: Shield }
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Left Navigation Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Library className="h-6 w-6 text-indigo-600" />
            <h2 className="text-lg font-semibold text-gray-800">Knowledge Gov</h2>
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

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Institutional Knowledge & Organizational Intelligence</h1>
              <p className="text-sm text-gray-500 mt-1">Authoritative governance for institutional assets, lessons learned, practices, research, and organizational memory.</p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search knowledge repository..."
                  className="pl-9 pr-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-indigo-500 focus:border-indigo-500 w-64"
                />
              </div>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md shadow-sm text-sm font-medium">
                Register Knowledge Asset
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
                      <BookOpen className="h-6 w-6 text-indigo-500" />
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Governed Knowledge Assets</dt>
                          <dd className="text-2xl font-semibold text-gray-900">{kpis.totalAssets}</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
                  <div className="p-5">
                    <div className="flex items-center">
                      <Brain className="h-6 w-6 text-purple-500" />
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Lessons Learned & Memory</dt>
                          <dd className="text-2xl font-semibold text-gray-900">{kpis.lessonsLearned}</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
                  <div className="p-5">
                    <div className="flex items-center">
                      <Award className="h-6 w-6 text-green-500" />
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Certifications</dt>
                          <dd className="text-2xl font-semibold text-gray-900">{kpis.certifications}</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
                  <div className="p-5">
                    <div className="flex items-center">
                      <AlertTriangle className="h-6 w-6 text-amber-500" />
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Knowledge Gaps / Risks</dt>
                          <dd className="text-2xl font-semibold text-gray-900">{kpis.knowledgeGaps}</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Meaningful Empty State */}
              <div className="mt-8 bg-white shadow rounded-lg border border-gray-200">
                <div className="px-4 py-8 sm:p-6 text-center">
                  <Library className="mx-auto h-12 w-12 text-gray-300" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No governed knowledge assets registered.</h3>
                  <p className="mt-1 text-sm text-gray-500">Register the first institutional knowledge domain or asset to start building organizational memory.</p>
                  <div className="mt-6">
                    <button type="button" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                      Create Knowledge Domain
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab !== 'overview' && (
            <div className="bg-white shadow rounded-lg border border-gray-200">
              <div className="px-4 py-12 sm:p-6 text-center">
                <Library className="mx-auto h-12 w-12 text-gray-300" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Insufficient Data</h3>
                <p className="mt-1 text-sm text-gray-500">No records found for this section in the current campus/tenant context.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
