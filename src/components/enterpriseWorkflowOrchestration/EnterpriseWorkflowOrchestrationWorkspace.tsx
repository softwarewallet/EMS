import React, { useState, useEffect } from 'react';
import { Shield, FileText, CheckCircle, Clock, AlertTriangle, Play, RefreshCw, XCircle } from 'lucide-react';
import { EnterpriseWorkflowOrchestrationService } from '../../services/enterpriseWorkflowOrchestrationService';
import { EnterpriseWorkflowInstance, EnterpriseWorkflowStep, EnterpriseWorkflowException } from '../../types';

export const EnterpriseWorkflowOrchestrationWorkspace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'COMMAND' | 'INSTANCES' | 'QUEUE' | 'SIMULATION'>('COMMAND');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationImpact, setSimulationImpact] = useState<string[]>([]);

  // Mock data for display
  const [mockInstances] = useState<EnterpriseWorkflowInstance[]>([
    {
      id: 'wf-1001',
      tenantId: 'tenant-1',
      definitionIdRef: 'def-risk-assessment-v2',
      version: 2,
      status: 'RUNNING',
      triggerType: 'MANUAL',
      actorIdRef: 'user-77',
      correlationId: 'corr-1001',
      idempotencyKey: 'idemp-1001',
      priority: 'HIGH',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]);

  const [mockSteps] = useState<EnterpriseWorkflowStep[]>([
    {
      id: 'step-5001',
      tenantId: 'tenant-1',
      instanceIdRef: 'wf-1001',
      definitionStepIdRef: 'step-def-1',
      status: 'WAITING_APPROVAL',
      slaStatus: 'ON_TRACK',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]);

  const runSandbox = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const result = EnterpriseWorkflowOrchestrationService.runSimulation('SLA_BREACH', mockInstances, mockSteps);
      setSimulationImpact(result.impacts);
      setIsSimulating(false);
    }, 800);
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Enterprise Workflow & Orchestration</h1>
            <p className="text-sm text-slate-500">Governed execution layer for institutional processes</p>
          </div>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Engine Active</span>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">Four-Eyes Enforced</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 border-b border-slate-200 bg-white shrink-0 flex gap-6">
        {(['COMMAND', 'INSTANCES', 'QUEUE', 'SIMULATION'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab 
                ? 'border-indigo-600 text-indigo-700' 
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {activeTab === 'COMMAND' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Orchestration Control Tower</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <p className="text-sm text-slate-500 font-medium">Active Definitions</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">42</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <p className="text-sm text-slate-500 font-medium">Running Instances</p>
                    <p className="text-2xl font-bold text-indigo-600 mt-1">1,204</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <p className="text-sm text-slate-500 font-medium">Pending Approvals</p>
                    <p className="text-2xl font-bold text-amber-600 mt-1">87</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <p className="text-sm text-slate-500 font-medium">SLA Breaches</p>
                    <p className="text-2xl font-bold text-red-600 mt-1">3</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
               <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Diagnostic Scanner</h3>
                <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-start gap-3 border border-red-100">
                  <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">Escalation Alert</p>
                    <p className="text-xs mt-1">3 instances breached SLA and triggered Level 2 Escalations.</p>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-lg flex items-start gap-3 border border-green-100">
                  <Shield className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">Authorization Scope</p>
                    <p className="text-xs mt-1">All 1,204 active instances respect cross-tenant boundaries.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'SIMULATION' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
             <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">What-If Execution Sandbox</h3>
                <p className="text-sm text-amber-600 font-medium">SIMULATION ONLY - ZERO PRODUCTION MUTATION</p>
              </div>
              <button 
                onClick={runSandbox}
                disabled={isSimulating}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-lg flex items-center gap-2 transition-colors disabled:bg-indigo-400"
              >
                {isSimulating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                Run Sandbox
              </button>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <h4 className="text-sm font-semibold text-slate-900 mb-3">Simulation Impact Results</h4>
              {simulationImpact.length > 0 ? (
                <ul className="space-y-2">
                  {simulationImpact.map((imp, idx) => (
                    <li key={idx} className="text-sm text-slate-700 flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-red-500" />
                      {imp}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-500 italic">Run a scenario to view orchestration impacts.</p>
              )}
            </div>
          </div>
        )}

        {(activeTab === 'INSTANCES' || activeTab === 'QUEUE') && (
           <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col items-center justify-center min-h-[400px] text-center">
            <FileText className="w-12 h-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-900">INSUFFICIENT DATA</h3>
            <p className="text-sm text-slate-500 max-w-md mt-2">
              No authoritative source telemetry available for the current tenant boundary.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
