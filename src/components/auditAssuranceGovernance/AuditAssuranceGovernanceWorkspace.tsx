import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, FileCheck2, Activity, Settings2, BarChart2 } from 'lucide-react';

export const AuditAssuranceGovernanceWorkspace: React.FC = () => {
  const [activeTab, setActiveTab] = useState('executive');

  const tabs = [
    { id: 'executive', label: 'Executive Assurance Command' },
    { id: 'universe', label: 'Audit Universe' },
    { id: 'planning', label: 'Risk-Based Planning' },
    { id: 'engagements', label: 'Engagements' },
    { id: 'controls', label: 'Internal Controls' },
    { id: 'findings', label: 'Findings' },
    { id: 'capa', label: 'CAPA & Remediation' },
    { id: 'committee', label: 'Audit Committee' },
    { id: 'sandbox', label: 'What-If Sandbox' },
    { id: 'diagnostics', label: 'Diagnostics' },
    { id: 'audit', label: 'Audit Trail' }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Enterprise Assurance</h1>
          <p className="text-slate-500 mt-1 text-sm">Institutional Audit, Internal Controls, Inspection & Findings Governance</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className={`px-4 py-2 border border-slate-300 rounded-lg text-slate-700 bg-white hover:bg-slate-50 font-medium flex items-center`}><Settings2 className="w-4 h-4 mr-2" /> Configure</button>
          <button className={`px-4 py-2 rounded-lg font-medium flex items-center bg-blue-600 hover:bg-blue-700 text-white`}><ShieldCheck className="w-4 h-4 mr-2" /> Start Assurance Review</button>
        </div>
      </div>

      <div className="flex space-x-2 border-b border-slate-200 overflow-x-auto pb-px">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.id 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {activeTab === 'executive' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                <div className="p-6 flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Audit Coverage</p>
                    <h3 className="text-2xl font-bold text-slate-900">86%</h3>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                <div className="p-6 flex items-center space-x-4">
                  <div className="p-3 bg-rose-100 text-rose-600 rounded-lg">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Critical Findings</p>
                    <h3 className="text-2xl font-bold text-slate-900">2</h3>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                <div className="p-6 flex items-center space-x-4">
                  <div className="p-3 bg-amber-100 text-amber-600 rounded-lg">
                    <Activity className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Overdue CAPA</p>
                    <h3 className="text-2xl font-bold text-slate-900">5</h3>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                <div className="p-6 flex items-center space-x-4">
                  <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
                    <FileCheck2 className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Effective Controls</p>
                    <h3 className="text-2xl font-bold text-slate-900">92%</h3>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                <div className="p-6 border-b border-slate-100">
                  <h3 className="text-lg font-semibold flex items-center"><BarChart2 className="w-5 h-5 mr-2 text-slate-500" /> Assurance Heatmap</h3>
                </div>
                <div className="p-6">
                  <div className="h-64 bg-slate-50 rounded flex items-center justify-center text-slate-400">
                    [Deterministic Heatmap Visualization]
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                <div className="p-6 border-b border-slate-100">
                  <h3 className="text-lg font-semibold text-slate-900 flex items-center"><AlertTriangle className="w-5 h-5 mr-2 text-amber-500" /> Assurance Gap Analysis</h3>
                </div>
                <div className="p-6">
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-rose-500 mr-3"></div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">UNTESTED_CRITICAL_CONTROL</p>
                        <p className="text-xs text-slate-500">Financial reconciliation control ACCT-041 is 14 days overdue for testing.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-amber-500 mr-3"></div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">OVERDUE_CAPA</p>
                        <p className="text-xs text-slate-500">CAPA-2026-11 (Data Privacy Remediation) target date exceeded.</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sandbox' && (
          <div className={`bg-white rounded-xl shadow-sm border border-slate-200 border-amber-200 bg-amber-50/30`}>
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-lg font-semibold text-amber-800">What-If Assurance Sandbox</h3>
              <p className="text-sm text-amber-600">SIMULATION ONLY - ZERO PRODUCTION MUTATION</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <button className={`px-4 py-2 border border-slate-300 rounded-lg text-slate-700 bg-white hover:bg-slate-50 font-medium w-full justify-start font-mono text-sm border-amber-200 hover:bg-amber-100`}>RUN SCENARIO: CRITICAL_CONTROL_FAILURE</button>
                <button className={`px-4 py-2 border border-slate-300 rounded-lg text-slate-700 bg-white hover:bg-slate-50 font-medium w-full justify-start font-mono text-sm border-amber-200 hover:bg-amber-100`}>RUN SCENARIO: MAJOR_AUDIT_FINDING</button>
                <button className={`px-4 py-2 border border-slate-300 rounded-lg text-slate-700 bg-white hover:bg-slate-50 font-medium w-full justify-start font-mono text-sm border-amber-200 hover:bg-amber-100`}>RUN SCENARIO: MULTI_DOMAIN_ASSURANCE_CASCADE</button>
              </div>
            </div>
          </div>
        )}
        
        {activeTab !== 'executive' && activeTab !== 'sandbox' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="p-12 text-center text-slate-500">
              Select a specific governance domain to view its deterministic records and lifecycle states.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
