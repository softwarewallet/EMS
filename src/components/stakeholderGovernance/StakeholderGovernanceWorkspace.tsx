import React, { useState, useEffect } from 'react';
import { 
  Globe, Users, MessageSquare, AlertTriangle, 
  CheckCircle, FileText, Activity, Search
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTenant } from '../../context/TenantContext';
import { StakeholderGovernanceService } from '../../services/stakeholderGovernanceService';
import { 
  Stakeholder, StakeholderEngagementPlan, InstitutionalCommunication, 
  StakeholderComplaint, StakeholderRisk, StakeholderAuditEvent
} from '../../types/stakeholderGovernance';

export const StakeholderGovernanceWorkspace: React.FC = () => {
  const { currentUser } = useAuth();
  const { currentTenant } = useTenant();
  const tenantId = currentTenant?.id || 'tenant_main';

  const [activeTab, setActiveTab] = useState<'overview' | 'stakeholders' | 'engagement' | 'communications' | 'complaints' | 'risks' | 'audit'>('overview');
  
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([]);
  const [plans, setPlans] = useState<StakeholderEngagementPlan[]>([]);
  const [communications, setCommunications] = useState<InstitutionalCommunication[]>([]);
  const [complaints, setComplaints] = useState<StakeholderComplaint[]>([]);
  const [risks, setRisks] = useState<StakeholderRisk[]>([]);
  const [audits, setAudits] = useState<StakeholderAuditEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [tenantId]);

  const loadData = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      await StakeholderGovernanceService.seedBaselineGovernance(tenantId, currentUser);
      const [
        stk, 
        pln,
        comm,
        cmp,
        rsk,
        aud
      ] = await Promise.all([
        StakeholderGovernanceService.getStakeholders(tenantId),
        StakeholderGovernanceService.getEngagementPlans(tenantId),
        StakeholderGovernanceService.getCommunications(tenantId),
        StakeholderGovernanceService.getComplaints(tenantId),
        StakeholderGovernanceService.getStakeholderRisks(tenantId),
        StakeholderGovernanceService.getAuditLogs(tenantId)
      ]);
      setStakeholders(stk);
      setPlans(pln);
      setCommunications(comm);
      setComplaints(cmp);
      setRisks(rsk);
      setAudits(aud);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const pendingApprovals = communications.filter(c => c.status === 'APPROVAL_PENDING').length;
  const criticalRisks = risks.filter(r => r.severity === 'CRITICAL' && r.status !== 'CLOSED').length;
  const openComplaints = complaints.filter(c => c.status !== 'CLOSED' && c.status !== 'RESOLVED').length;
  
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Globe className="w-8 h-8 text-indigo-600" />
            Stakeholder & Reputation Governance
          </h1>
          <p className="text-gray-500 mt-1">Govern institutional relationships, communications, and public reputation.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={loadData} className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
            Refresh Data
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Plans</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{plans.length}</h3>
            </div>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Pending Comm Approvals</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{pendingApprovals}</h3>
            </div>
            <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Open Complaints</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{openComplaints}</h3>
            </div>
            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Critical Risks</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{criticalRisks}</h3>
            </div>
            <div className="p-2 bg-red-50 text-red-600 rounded-lg">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px px-6 gap-6">
            {(['overview', 'stakeholders', 'engagement', 'communications', 'complaints', 'risks', 'audit'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6 min-h-[400px]">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : activeTab === 'overview' ? (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Governance Command Center</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-5">
                  <h4 className="font-medium mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-gray-400" />
                    Reputation Analytics
                  </h4>
                  <p className="text-gray-500 text-sm">Sentiment and engagement volume visualization requires additional historical data.</p>
                  <div className="mt-4 p-4 bg-gray-50 border border-dashed border-gray-300 rounded text-center text-gray-500 text-sm">
                    INSUFFICIENT DATA
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg p-5">
                  <h4 className="font-medium mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-gray-400" />
                    Escalations & Critical Issues
                  </h4>
                  {risks.filter(r => r.severity === 'CRITICAL').length === 0 ? (
                    <div className="text-center p-6 bg-green-50 rounded-lg border border-green-100">
                      <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                      <p className="text-green-800 font-medium">No critical escalations or reputation risks detected.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {risks.filter(r => r.severity === 'CRITICAL').map(risk => (
                        <div key={risk.id} className="p-3 bg-red-50 border border-red-100 rounded flex justify-between items-center">
                          <span className="font-medium text-red-800">{risk.title}</span>
                          <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full">{risk.status}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : activeTab === 'risks' ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Stakeholder & Reputation Risks</h3>
              </div>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {risks.map((risk) => (
                      <tr key={risk.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{risk.title}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            risk.severity === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                            risk.severity === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {risk.severity}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{risk.status}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{risk.dueDate}</td>
                      </tr>
                    ))}
                    {risks.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">
                          No stakeholder risks identified.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : activeTab === 'engagement' ? (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Engagement Plans</h3>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Objective</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {plans.map((plan) => (
                      <tr key={plan.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{plan.title}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{plan.objective}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800`}>
                            {plan.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{plan.ownerName}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : activeTab === 'audit' ? (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Governance Audit Trail</h3>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actor ID</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {audits.slice(0, 20).map((audit) => (
                      <tr key={audit.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(audit.timestamp).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {audit.action}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {audit.entityType} ({audit.entityId})
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {audit.actorId}
                        </td>
                      </tr>
                    ))}
                    {audits.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">
                          No audit events recorded yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">This view is configured but currently empty. Seed configuration to view {activeTab}.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
