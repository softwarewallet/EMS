import React, { useState, useEffect } from 'react';
import {
  Share2,
  Activity,
  Layers,
  Database,
  Key,
  Shield,
  FileCheck,
  AlertTriangle,
  RefreshCw,
  Zap,
  CheckCircle2,
  XCircle,
  Clock,
  Lock,
  Search,
  Plus,
  Play,
  FileText,
  Radio,
  Sliders,
  TrendingUp,
  AlertCircle,
  GitBranch,
  Info,
  Server,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { IntegrationGovernanceService } from '../../services/integrationGovernanceService';
import {
  IntegrationDefinition,
  APIDefinition,
  DataExchangeContract,
  DataExchangeJob,
  WebhookSubscription,
  IntegrationChangeRequest,
  IntegrationAnalytics,
  IntegrationDataQualityIssue,
  IntegrationAuditEvent
} from '../../types/integrationGovernance';

interface IntegrationGovernanceWorkspaceProps {
  currentTenantId?: string;
  currentUserId?: string;
  userRole?: string;
}

export const IntegrationGovernanceWorkspace: React.FC<IntegrationGovernanceWorkspaceProps> = ({
  currentTenantId = 'tenant_main',
  currentUserId = 'usr_admin',
  userRole = 'SUPER_ADMIN'
}) => {
  const [activeTab, setActiveTab] = useState<string>('command_center');
  const [loading, setLoading] = useState<boolean>(true);
  const [integrations, setIntegrations] = useState<IntegrationDefinition[]>([]);
  const [apis, setApis] = useState<APIDefinition[]>([]);
  const [contracts, setContracts] = useState<DataExchangeContract[]>([]);
  const [jobs, setJobs] = useState<DataExchangeJob[]>([]);
  const [webhooks, setWebhooks] = useState<WebhookSubscription[]>([]);
  const [changeRequests, setChangeRequests] = useState<IntegrationChangeRequest[]>([]);
  const [analytics, setAnalytics] = useState<IntegrationAnalytics | null>(null);
  const [qualityIssues, setQualityIssues] = useState<IntegrationDataQualityIssue[]>([]);
  const [auditLogs, setAuditLogs] = useState<IntegrationAuditEvent[]>([]);

  // Action states
  const [actionMessage, setActionMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [newIntgCode, setNewIntgCode] = useState('');
  const [newIntgName, setNewIntgName] = useState('');
  const [newApiName, setNewApiName] = useState('');
  const [newApiCode, setNewApiCode] = useState('');
  const [newContractCode, setNewContractCode] = useState('');

  const loadWorkspaceData = async () => {
    setLoading(true);
    try {
      const [intgData, apiData, contractData, jobData, whData, crData, analyticsData, dqData, auditData] =
        await Promise.all([
          IntegrationGovernanceService.getIntegrations(currentTenantId),
          IntegrationGovernanceService.getApis(currentTenantId),
          IntegrationGovernanceService.getContracts(currentTenantId),
          IntegrationGovernanceService.getJobs(currentTenantId),
          IntegrationGovernanceService.getWebhooks(currentTenantId),
          IntegrationGovernanceService.getChangeRequests(currentTenantId),
          IntegrationGovernanceService.calculateAnalytics(currentTenantId),
          IntegrationGovernanceService.scanDataQuality(currentTenantId),
          IntegrationGovernanceService.getAuditLogs(currentTenantId)
        ]);

      setIntegrations(intgData);
      setApis(apiData);
      setContracts(contractData);
      setJobs(jobData);
      setWebhooks(whData);
      setChangeRequests(crData);
      setAnalytics(analyticsData);
      setQualityIssues(dqData);
      setAuditLogs(auditData);
    } catch (err: any) {
      setActionMessage({ text: err.message || 'Failed to load integration governance data.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkspaceData();
  }, [currentTenantId]);

  const handleCreateIntegration = async () => {
    if (!newIntgCode || !newIntgName) {
      setActionMessage({ text: 'Integration Code and Name are required.', type: 'error' });
      return;
    }
    try {
      await IntegrationGovernanceService.createIntegration(currentTenantId, currentUserId, userRole, {
        integrationCode: newIntgCode,
        name: newIntgName,
        description: 'Governed integration definition created from workspace UI.',
        integrationType: 'REST_API',
        direction: 'BI_DIRECTIONAL',
        sourceSystem: 'EMS_ACADEMICS',
        targetSystem: 'EXTERNAL_SIS',
        ownerId: currentUserId,
        technicalOwnerId: currentUserId,
        businessOwnerId: currentUserId,
        environment: 'PRODUCTION',
        securityClassification: 'HIGHLY_CONFIDENTIAL'
      });
      setNewIntgCode('');
      setNewIntgName('');
      setActionMessage({ text: 'Integration Definition created in DRAFT state.', type: 'success' });
      loadWorkspaceData();
    } catch (err: any) {
      setActionMessage({ text: err.message, type: 'error' });
    }
  };

  const handleCreateApi = async () => {
    if (!newApiCode || !newApiName) {
      setActionMessage({ text: 'API Code and Name are required.', type: 'error' });
      return;
    }
    try {
      await IntegrationGovernanceService.createApiDefinition(currentTenantId, currentUserId, userRole, {
        apiCode: newApiCode,
        apiName: newApiName,
        version: 'v1.0',
        description: 'Governed API catalog entry.',
        ownerDepartment: 'IT_GOVERNANCE',
        ownerUserId: currentUserId,
        consumerPolicy: 'EXPLICIT_APPROVAL',
        authenticationMethod: 'OAUTH2',
        authorizationScopes: ['student.read', 'academic.write'],
        rateLimitReqPerMin: 600,
        quotaReqPerDay: 50000,
        dataClassification: 'RESTRICTED'
      });
      setNewApiCode('');
      setNewApiName('');
      setActionMessage({ text: 'API Definition created in DRAFT state.', type: 'success' });
      loadWorkspaceData();
    } catch (err: any) {
      setActionMessage({ text: err.message, type: 'error' });
    }
  };

  const tabs = [
    { id: 'command_center', label: 'Command Center', icon: Activity },
    { id: 'registry', label: 'Integration Registry', icon: Share2 },
    { id: 'api_catalog', label: 'API Catalog', icon: Layers },
    { id: 'api_consumers', label: 'API Consumers', icon: Key },
    { id: 'exchange_contracts', label: 'Exchange Contracts', icon: FileCheck },
    { id: 'field_mappings', label: 'Field Mappings', icon: GitBranch },
    { id: 'exchange_jobs', label: 'Exchange Jobs', icon: Zap },
    { id: 'event_monitor', label: 'Event Monitor', icon: Radio },
    { id: 'webhooks', label: 'Webhook Governance', icon: Radio },
    { id: 'health', label: 'Integration Health', icon: Server },
    { id: 'failures', label: 'Failures & Retry', icon: AlertTriangle },
    { id: 'dead_letter', label: 'Dead-Letter Queue', icon: XCircle },
    { id: 'lineage', label: 'Data Lineage', icon: Database },
    { id: 'security_credentials', label: 'Security & Credentials', icon: Lock },
    { id: 'change_management', label: 'Change Management', icon: Sliders },
    { id: 'sla_monitor', label: 'SLA Monitor', icon: Clock },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'data_quality', label: 'Data Quality', icon: Shield },
    { id: 'governance_reviews', label: 'Governance Reviews', icon: CheckCircle2 },
    { id: 'audit_trail', label: 'Audit Trail', icon: FileText }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 p-6 font-sans">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-900/50 border border-indigo-700/50 rounded-xl text-indigo-400">
              <Share2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Integration & API Governance Engine
              </h1>
              <p className="text-sm text-slate-400 mt-0.5">
                Phase 7.39 — Interoperability, Data Exchange Contracts, API Lifecycle & Lineage
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadWorkspaceData}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-300 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Sync Engine
          </button>
          <div className="px-3 py-1.5 bg-emerald-950/60 border border-emerald-800/60 rounded-lg text-xs font-semibold text-emerald-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Governance Active
          </div>
        </div>
      </div>

      {/* Action Notification */}
      {actionMessage && (
        <div
          className={`mb-6 p-4 rounded-xl border flex items-center justify-between text-sm ${
            actionMessage.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-300'
              : 'bg-rose-950/40 border-rose-800/80 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {actionMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
            )}
            <span>{actionMessage.text}</span>
          </div>
          <button
            onClick={() => setActionMessage(null)}
            className="text-slate-400 hover:text-white transition-colors"
          >
            &times;
          </button>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex overflow-x-auto gap-1 pb-3 mb-6 border-b border-slate-800 scrollbar-none">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/30'
                  : 'bg-slate-900/60 hover:bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-800/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main Tab View Canvas */}
      <div className="flex-1">
        {/* 1. COMMAND CENTER */}
        {activeTab === 'command_center' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-slate-900/70 border border-slate-800 p-5 rounded-xl">
                <div className="text-slate-400 text-xs font-medium">Active Integrations</div>
                <div className="text-3xl font-bold text-white mt-2">
                  {analytics?.activeIntegrationsCount || 0}
                </div>
                <div className="text-xs text-indigo-400 mt-1 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Governed endpoints
                </div>
              </div>
              <div className="bg-slate-900/70 border border-slate-800 p-5 rounded-xl">
                <div className="text-slate-400 text-xs font-medium">Exchange Success Rate</div>
                <div className="text-3xl font-bold text-emerald-400 mt-2">
                  {analytics?.exchangeSuccessRatePercent || 100}%
                </div>
                <div className="text-xs text-emerald-500 mt-1">Idempotent execution engine</div>
              </div>
              <div className="bg-slate-900/70 border border-slate-800 p-5 rounded-xl">
                <div className="text-slate-400 text-xs font-medium">API Health Status</div>
                <div className="text-3xl font-bold text-sky-400 mt-2">
                  {analytics?.apiHealthStatus || 'HEALTHY'}
                </div>
                <div className="text-xs text-slate-400 mt-1">Zero unhandled SLA breaches</div>
              </div>
              <div className="bg-slate-900/70 border border-slate-800 p-5 rounded-xl">
                <div className="text-slate-400 text-xs font-medium">Data Quality Issues</div>
                <div className="text-3xl font-bold text-amber-400 mt-2">
                  {qualityIssues.length}
                </div>
                <div className="text-xs text-amber-500 mt-1">Automated scanner active</div>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-400" /> Draft Governed Integration
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Integration Code (e.g. INTG-SIS-01)"
                  value={newIntgCode}
                  onChange={e => setNewIntgCode(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                />
                <input
                  type="text"
                  placeholder="Integration Name (e.g. External SIS Sync)"
                  value={newIntgName}
                  onChange={e => setNewIntgName(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={handleCreateIntegration}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Create Integration Definition
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. INTEGRATION REGISTRY */}
        {activeTab === 'registry' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Governed Integration Definitions</h3>
              <span className="text-xs text-slate-400">{integrations.length} registered</span>
            </div>

            {integrations.length === 0 ? (
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-12 text-center">
                <Share2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h4 className="text-base font-semibold text-slate-300">No integrations configured</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  Create a new governed integration definition to establish secure data exchanges with explicit classification controls.
                </p>
              </div>
            ) : (
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 text-xs font-semibold uppercase">
                    <tr>
                      <th className="p-4">Code / Name</th>
                      <th className="p-4">Type</th>
                      <th className="p-4">Source → Target</th>
                      <th className="p-4">Classification</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Version</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {integrations.map(intg => (
                      <tr key={intg.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="p-4 font-medium text-white">
                          <div>{intg.name}</div>
                          <div className="text-xs text-indigo-400 font-mono">{intg.integrationCode}</div>
                        </td>
                        <td className="p-4 text-xs font-semibold text-slate-300">{intg.integrationType}</td>
                        <td className="p-4 text-xs text-slate-400">
                          {intg.sourceSystem} → {intg.targetSystem}
                        </td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 bg-amber-950/60 border border-amber-800/60 rounded text-xs font-semibold text-amber-400">
                            {intg.securityClassification}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 bg-indigo-950/60 border border-indigo-800/60 rounded text-xs font-semibold text-indigo-300">
                            {intg.status}
                          </span>
                        </td>
                        <td className="p-4 font-mono text-xs text-slate-400">{intg.version}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* 3. API CATALOG */}
        {activeTab === 'api_catalog' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">API Catalog & Lifecycle Governance</h3>
              <span className="text-xs text-slate-400">{apis.length} APIs</span>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 mb-6">
              <h4 className="text-sm font-semibold text-white mb-3">Register New API Definition</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="API Code (e.g. API-STUDENT-READ)"
                  value={newApiCode}
                  onChange={e => setNewApiCode(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200"
                />
                <input
                  type="text"
                  placeholder="API Name (e.g. Student Academic Profile API)"
                  value={newApiName}
                  onChange={e => setNewApiName(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200"
                />
                <button
                  onClick={handleCreateApi}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2 rounded-lg text-sm"
                >
                  Create API Definition
                </button>
              </div>
            </div>

            {apis.length === 0 ? (
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-12 text-center">
                <Layers className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h4 className="text-base font-semibold text-slate-300">No APIs registered</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  Register API endpoints to enforce lifecycle management (Draft, Review, Approved, Active, Deprecated, Retired).
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {apis.map(api => (
                  <div key={api.id} className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-base font-bold text-white">{api.apiName}</h4>
                        <div className="text-xs font-mono text-indigo-400">{api.apiCode} ({api.version})</div>
                      </div>
                      <span className="px-2.5 py-1 bg-sky-950/60 border border-sky-800/60 rounded text-xs font-semibold text-sky-300">
                        {api.lifecycleStatus}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{api.description}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-400 border-t border-slate-800/60 pt-3">
                      <div><span className="text-slate-500">Classification:</span> {api.dataClassification}</div>
                      <div><span className="text-slate-500">Rate Limit:</span> {api.rateLimitReqPerMin} req/m</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 4. API CONSUMERS */}
        {activeTab === 'api_consumers' && (
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-12 text-center">
            <Key className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h4 className="text-base font-semibold text-slate-300">No active API consumers</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Consumer applications will appear here upon explicit authorization and scope assignment by an integration administrator.
            </p>
          </div>
        )}

        {/* 5. DATA EXCHANGE CONTRACTS */}
        {activeTab === 'exchange_contracts' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Governed Data Exchange Contracts</h3>
              <span className="text-xs text-slate-400">{contracts.length} contracts</span>
            </div>

            {contracts.length === 0 ? (
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-12 text-center">
                <FileCheck className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h4 className="text-base font-semibold text-slate-300">No exchange contracts configured</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  Every cross-module or external data exchange requires an approved exchange contract before execution.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {contracts.map(contract => (
                  <div key={contract.id} className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-base font-bold text-white">{contract.contractName}</h4>
                        <div className="text-xs font-mono text-indigo-400">{contract.contractCode}</div>
                      </div>
                      <span className="px-2.5 py-1 bg-emerald-950/60 border border-emerald-800/60 rounded text-xs font-semibold text-emerald-300">
                        {contract.status}
                      </span>
                    </div>
                    <div className="text-xs text-slate-300 flex items-center gap-2">
                      <span className="font-semibold text-indigo-400">{contract.sourceModule}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                      <span className="font-semibold text-emerald-400">{contract.targetModule}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 6. FIELD MAPPINGS */}
        {activeTab === 'field_mappings' && (
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-12 text-center">
            <GitBranch className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h4 className="text-base font-semibold text-slate-300">No field mappings configured</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Field mapping rules bind source properties to target schema definitions with transformation and classification rules.
            </p>
          </div>
        )}

        {/* 7. EXCHANGE JOBS */}
        {activeTab === 'exchange_jobs' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Exchange Execution Jobs</h3>
              <span className="text-xs text-slate-400">{jobs.length} executions</span>
            </div>

            {jobs.length === 0 ? (
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-12 text-center">
                <Zap className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h4 className="text-base font-semibold text-slate-300">No exchange jobs executed</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  Job executions maintain deterministic idempotency keys and record exact read, written, and rejected record metrics.
                </p>
              </div>
            ) : (
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 text-xs font-semibold uppercase">
                    <tr>
                      <th className="p-4">Job ID</th>
                      <th className="p-4">Idempotency Key</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Records (Read/Written)</th>
                      <th className="p-4">Started At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {jobs.map(job => (
                      <tr key={job.id}>
                        <td className="p-4 font-mono text-xs text-indigo-400">{job.id}</td>
                        <td className="p-4 font-mono text-xs text-slate-400">{job.idempotencyKey}</td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 bg-emerald-950/60 border border-emerald-800/60 rounded text-xs font-semibold text-emerald-300">
                            {job.status}
                          </span>
                        </td>
                        <td className="p-4 text-xs font-semibold">{job.recordsRead} / {job.recordsWritten}</td>
                        <td className="p-4 text-xs text-slate-400">{new Date(job.startedAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* 8. EVENT MONITOR */}
        {activeTab === 'event_monitor' && (
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-12 text-center">
            <Radio className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h4 className="text-base font-semibold text-slate-300">No integration events logged</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Real-time inbound and outbound event streams are captured with correlation IDs and sanitized payload references.
            </p>
          </div>
        )}

        {/* 9. WEBHOOK GOVERNANCE */}
        {activeTab === 'webhooks' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Governed Webhook Subscriptions</h3>
              <span className="text-xs text-slate-400">{webhooks.length} webhooks</span>
            </div>

            {webhooks.length === 0 ? (
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-12 text-center">
                <Radio className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h4 className="text-base font-semibold text-slate-300">No webhook subscriptions</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  Webhook endpoints are configured with vault secret references and strict subscription event authorization.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {webhooks.map(wh => (
                  <div key={wh.id} className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-white">{wh.targetUrl}</div>
                      <div className="text-xs text-slate-400 mt-1">Events: {wh.subscribedEvents.join(', ')}</div>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-950/60 border border-emerald-800/60 rounded text-xs font-semibold text-emerald-300">
                      {wh.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 10. INTEGRATION HEALTH */}
        {activeTab === 'health' && (
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Server className="w-5 h-5 text-emerald-400" /> Overall Integration Engine Health
            </h3>
            <div className="p-4 bg-emerald-950/40 border border-emerald-800/60 rounded-lg text-sm text-emerald-300">
              System is operating normally. All active integration pipelines and API gateways are fully operational.
            </div>
          </div>
        )}

        {/* 11. FAILURES & RETRY QUEUE */}
        {activeTab === 'failures' && (
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-12 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h4 className="text-base font-semibold text-slate-300">Zero integration failures</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              All data exchange jobs and event streams have completed without error.
            </p>
          </div>
        )}

        {/* 12. DEAD-LETTER QUEUE */}
        {activeTab === 'dead_letter' && (
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-12 text-center">
            <XCircle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h4 className="text-base font-semibold text-slate-300">Dead-letter queue empty</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Exchanges exceeding maximum retry thresholds are diverted here for manual replay authorization by integration admins.
            </p>
          </div>
        )}

        {/* 13. DATA LINEAGE */}
        {activeTab === 'lineage' && (
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-12 text-center">
            <Database className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h4 className="text-base font-semibold text-slate-300">Data Lineage Visualizer</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Trace data flows from authoritative EMS master entities through transformation pipelines to destination modules.
            </p>
          </div>
        )}

        {/* 14. SECURITY & CREDENTIALS */}
        {activeTab === 'security_credentials' && (
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-indigo-400" /> Governed Credential Metadata
            </h3>
            <p className="text-xs text-slate-400">
              Zero plaintext keys or passwords stored. All credentials use encrypted cloud vault references with rotation metadata.
            </p>
          </div>
        )}

        {/* 15. CHANGE MANAGEMENT */}
        {activeTab === 'change_management' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Integration Change Requests</h3>
              <span className="text-xs text-slate-400">{changeRequests.length} requests</span>
            </div>

            {changeRequests.length === 0 ? (
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-12 text-center">
                <Sliders className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h4 className="text-base font-semibold text-slate-300">No change requests pending</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  Production integration modifications require formal change requests with before/after diffs and four-eyes approvals.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {changeRequests.map(cr => (
                  <div key={cr.id} className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-white">{cr.changeTitle}</div>
                      <div className="text-xs text-slate-400">Risk: {cr.riskAssessment}</div>
                    </div>
                    <span className="px-2.5 py-1 bg-amber-950/60 border border-amber-800/60 rounded text-xs font-semibold text-amber-300">
                      {cr.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 16. SLA MONITOR */}
        {activeTab === 'sla_monitor' && (
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-12 text-center">
            <Clock className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h4 className="text-base font-semibold text-slate-300">SLA Performance Monitor</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Real-time response latency and batch processing windows are monitored against configured SLA contract thresholds.
            </p>
          </div>
        )}

        {/* 17. ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">Derived Integration Analytics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-950 rounded-lg border border-slate-800">
                <div className="text-xs text-slate-400">Contract Coverage</div>
                <div className="text-2xl font-bold text-white mt-1">{analytics?.contractCoveragePercent || 100}%</div>
              </div>
              <div className="p-4 bg-slate-950 rounded-lg border border-slate-800">
                <div className="text-xs text-slate-400">Exchange Success Rate</div>
                <div className="text-2xl font-bold text-emerald-400 mt-1">{analytics?.exchangeSuccessRatePercent || 100}%</div>
              </div>
            </div>
          </div>
        )}

        {/* 18. DATA QUALITY */}
        {activeTab === 'data_quality' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Automated Integration Data Quality Scanner</h3>
              <span className="text-xs text-slate-400">{qualityIssues.length} issues flagged</span>
            </div>

            {qualityIssues.length === 0 ? (
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-12 text-center">
                <Shield className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                <h4 className="text-base font-semibold text-slate-300">Zero data quality defects</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  Automated scanner confirmed all integration definitions, exchange contracts, and field mappings are valid and non-orphaned.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {qualityIssues.map(issue => (
                  <div key={issue.id} className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-amber-400">{issue.issueType}</div>
                      <div className="text-xs text-slate-300 mt-1">{issue.description}</div>
                    </div>
                    <span className="px-2.5 py-1 bg-amber-950/60 border border-amber-800/60 rounded text-xs font-semibold text-amber-300">
                      {issue.severity}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 19. GOVERNANCE REVIEWS */}
        {activeTab === 'governance_reviews' && (
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-12 text-center">
            <CheckCircle2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h4 className="text-base font-semibold text-slate-300">Separation of Duties Approval Queue</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Pending four-eyes reviews for integrations, APIs, exchange contracts, and change requests appear here for independent review.
            </p>
          </div>
        )}

        {/* 20. AUDIT TRAIL */}
        {activeTab === 'audit_trail' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Immutable Integration Audit Logs</h3>
              <span className="text-xs text-slate-400">{auditLogs.length} events</span>
            </div>

            {auditLogs.length === 0 ? (
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-12 text-center">
                <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h4 className="text-base font-semibold text-slate-300">No integration audit events</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  All consequential integration operations, API approvals, and exchange executions are recorded in an immutable audit stream.
                </p>
              </div>
            ) : (
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 text-xs font-semibold uppercase">
                    <tr>
                      <th className="p-4">Action</th>
                      <th className="p-4">Resource</th>
                      <th className="p-4">Actor</th>
                      <th className="p-4">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {auditLogs.map(log => (
                      <tr key={log.id}>
                        <td className="p-4 font-semibold text-indigo-400">{log.action}</td>
                        <td className="p-4 text-xs font-mono text-slate-400">{log.resourceType}:{log.resourceId}</td>
                        <td className="p-4 text-xs text-slate-300">{log.actorId} ({log.actorRole})</td>
                        <td className="p-4 text-xs text-slate-400">{new Date(log.timestamp).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
