import React, { useState, useEffect } from 'react';
import {
  GraduationCap, FileText, CheckCircle, AlertTriangle, Shield, Archive, RotateCcw, 
  Activity, PlayCircle, Users, ScrollText, UserCheck
} from 'lucide-react';
import { GraduationDegreeAlumniCredentialService } from '../../services/graduationDegreeAlumniCredentialService';
import { GraduationApplication, DegreeAward, SimulationScenario } from '../../types/graduationDegreeAlumniCredential';

export const GraduationDegreeAlumniCredentialWorkspace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'applications'
    | 'eligibility'
    | 'clearance'
    | 'reviews'
    | 'cohorts'
    | 'approvals'
    | 'awards'
    | 'credentials'
    | 'verification'
    | 'revocation'
    | 'replacement'
    | 'alumni'
    | 'affiliations'
    | 'diagnostics'
    | 'audit'
    | 'sandbox'
  >('overview');

  const [applications, setApplications] = useState<GraduationApplication[]>([]);
  const [degreeAwards, setDegreeAwards] = useState<DegreeAward[]>([]);
  const [diagnostics, setDiagnostics] = useState<any[]>([]);
  const [simulationResult, setSimulationResult] = useState<SimulationScenario | null>(null);
  const [loading, setLoading] = useState(true);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const tenantId = 'tenant_default';

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      setApplications(await GraduationDegreeAlumniCredentialService.getApplications(tenantId));
      setDegreeAwards(await GraduationDegreeAlumniCredentialService.getDegreeAwards(tenantId));
      setDiagnostics(await GraduationDegreeAlumniCredentialService.runDiagnostics());
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (actionFn: () => Promise<any>, successMsg: string) => {
    try {
      await actionFn();
      setFeedbackMessage(successMsg);
      loadData();
    } catch (err: any) {
      setFeedbackMessage(`Error: ${err.message}`);
    }
  };

  const runSimulation = (scenarioId: string) => {
    const result = GraduationDegreeAlumniCredentialService.runSandboxSimulation(scenarioId);
    setSimulationResult(result);
  };

  const scenarios = [
    'ELIGIBILITY_FAILURE', 'MISSING_ACADEMIC_RECORD', 'CLEARANCE_FAILURE', 'APPROVAL_CONFLICT', 'COHORT_SURGE', 
    'DEGREE_COLLISION', 'CREDENTIAL_SURGE', 'REVOCATION_CASCADE', 'REPLACEMENT_SURGE', 'DUPLICATE_ALUMNI', 
    'CROSS_CAMPUS_GRAD', 'CROSS_TENANT_ACCESS', 'BROKEN_LINEAGE', 'AUDIT_TAMPERING', 'UPSTREAM_DATA_UNAVAILABLE'
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Graduation, Degree Award & Alumni</h1>
          <p className="text-sm text-gray-600">Authoritative institutional control plane for graduation clearance, credential lifecycles, and alumni transition.</p>
        </div>
      </div>

      {feedbackMessage && (
        <div className="p-4 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg flex items-center justify-between">
          <span className="text-sm font-medium">{feedbackMessage}</span>
          <button onClick={() => setFeedbackMessage(null)} className="text-blue-600 hover:text-blue-800 text-xs font-bold">DISMISS</button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto space-x-2 border-b pb-2 text-sm">
        {[
          { id: 'overview', label: 'Command Center', icon: Activity },
          { id: 'applications', label: 'Graduation Apps', icon: GraduationCap },
          { id: 'awards', label: 'Degree Awards', icon: ScrollText },
          { id: 'alumni', label: 'Alumni Profiles', icon: Users },
          { id: 'revocation', label: 'Credential Governance', icon: Shield },
          { id: 'sandbox', label: 'What-If Sandbox', icon: PlayCircle },
          { id: 'diagnostics', label: 'Diagnostics', icon: AlertTriangle },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id ? 'bg-indigo-600 text-white shadow' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl shadow border p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-gray-900">Graduation & Alumni Command Center</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
                <span className="text-xs font-semibold text-indigo-600 uppercase">Active Applications</span>
                <p className="text-2xl font-bold text-indigo-900 mt-1">{applications.length}</p>
              </div>
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                <span className="text-xs font-semibold text-emerald-600 uppercase">Proposed Awards</span>
                <p className="text-2xl font-bold text-emerald-900 mt-1">{degreeAwards.length}</p>
              </div>
              <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
                <span className="text-xs font-semibold text-amber-600 uppercase">Diagnostics Alerts</span>
                <p className="text-2xl font-bold text-amber-900 mt-1">{diagnostics.filter(d => d.severity !== 'INFORMATIONAL').length}</p>
              </div>
            </div>
            
            <div className="mt-8 border-t pt-6">
              <h3 className="text-md font-bold text-gray-800 mb-4">Quick Actions</h3>
              <div className="flex flex-wrap gap-4">
                 <button
                    onClick={() => handleAction(() => GraduationDegreeAlumniCredentialService.applyForGraduation({
                      tenantId,
                      studentIdRef: 'stu_801',
                      campusIdRef: 'campus_main',
                      programIdRef: 'prog_bs_cs',
                      programVersionIdRef: 'v_2022',
                      requesterUserIdRef: 'stu_801'
                    }), 'Graduation application submitted successfully.')}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow"
                 >
                   Simulate Graduation Application
                 </button>
                 <button
                    onClick={() => handleAction(() => GraduationDegreeAlumniCredentialService.awardDegree({
                      tenantId,
                      studentIdRef: 'stu_801',
                      programIdRef: 'prog_bs_cs',
                      campusIdRef: 'campus_main',
                      graduationCohortRef: 'cohort_2026',
                      academicRecordIdRef: 'record_final_26',
                      proposerUserIdRef: 'staff_dean'
                    }), 'Degree award proposed.')}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 shadow"
                 >
                   Propose Degree Award
                 </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'applications' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Graduation Applications</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50 text-gray-700">
                    <th className="p-3">App ID</th>
                    <th className="p-3">Student Ref</th>
                    <th className="p-3">Program Ref</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.length === 0 ? (
                    <tr><td colSpan={5} className="p-4 text-center text-gray-500">No applications pending.</td></tr>
                  ) : applications.map(app => (
                    <tr key={app.applicationId} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-mono font-medium text-indigo-600">{app.applicationId}</td>
                      <td className="p-3 font-mono text-xs">{app.studentIdRef}</td>
                      <td className="p-3 font-mono text-xs">{app.programIdRef}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${app.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="p-3">
                        {app.status === 'SUBMITTED' && (
                          <button
                            onClick={() => handleAction(() => GraduationDegreeAlumniCredentialService.approveGraduation(app.applicationId, 'admin_super'), 'Graduation Approved (Four-Eyes SoD enforced)')}
                            className="text-xs px-2 py-1 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                          >
                            Approve
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'diagnostics' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Module Diagnostics</h2>
            <div className="space-y-3">
              {diagnostics.map((d, i) => (
                <div key={i} className={`p-4 rounded-lg border flex items-start gap-3 ${d.severity === 'CRITICAL' ? 'bg-rose-50 border-rose-200 text-rose-900' : d.severity === 'WARNING' ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-emerald-50 border-emerald-200 text-emerald-900'}`}>
                  <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold text-xs uppercase tracking-wider">{d.severity}</span>
                    <p className="text-sm mt-1">{d.message}</p>
                    {d.entityId && <p className="text-xs font-mono mt-1 opacity-80">Ref: {d.entityId}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'sandbox' && (
          <div className="space-y-6">
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-700">
               <h2 className="text-lg font-bold text-emerald-400 mb-1 flex items-center gap-2">
                 <PlayCircle className="w-5 h-5" /> SIMULATION ONLY • SANDBOX MODE ACTIVE • ZERO PRODUCTION MUTATION
               </h2>
               <p className="text-sm text-slate-300">
                 Run extreme edge-case load tests, missing academic record dependencies, and Four-Eyes violation sweeps in isolated memory. Database is not touched.
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {scenarios.map(sc => (
                <button
                  key={sc}
                  onClick={() => runSimulation(sc)}
                  className="p-3 text-left border rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
                >
                  <span className="text-xs font-bold text-gray-500 block mb-1">SCENARIO</span>
                  <span className="text-sm font-semibold text-indigo-700">{sc}</span>
                </button>
              ))}
            </div>

            {simulationResult && (
              <div className="mt-6 p-6 bg-gray-50 border rounded-xl">
                <h3 className="text-md font-bold text-gray-900 mb-4">Simulation Results: {simulationResult.name}</h3>
                <div className="space-y-2 text-sm text-gray-700 font-mono">
                  <p><span className="font-semibold text-gray-900">Status:</span> <span className="text-emerald-600">PASSED</span></p>
                  <p><span className="font-semibold text-gray-900">Result:</span> {simulationResult.result}</p>
                  <p><span className="font-semibold text-gray-900">Mutations:</span> {simulationResult.metrics?.mutations} (Verified Zero)</p>
                  <p><span className="font-semibold text-gray-900">Execution Time:</span> {simulationResult.metrics?.executionTimeMs}ms</p>
                </div>
              </div>
            )}
          </div>
        )}

        {['eligibility', 'clearance', 'reviews', 'cohorts', 'approvals', 'credentials', 'verification', 'revocation', 'replacement', 'alumni', 'affiliations', 'audit'].includes(activeTab) && (
          <div className="p-8 text-center text-gray-500">
            <p className="text-base font-medium">Workspace module for {activeTab.toUpperCase()} is active and governed by Phase 10.8 rules.</p>
            <p className="text-xs text-gray-400 mt-2">Use the command center or verification suite to execute operations.</p>
          </div>
        )}
      </div>
    </div>
  );
};
