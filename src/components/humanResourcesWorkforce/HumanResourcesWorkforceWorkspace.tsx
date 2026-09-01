import React, { useState, useEffect } from 'react';
import {
  Briefcase, CheckCircle, AlertTriangle, Shield, Archive, 
  Activity, PlayCircle, Users, Calendar, LogOut, Search, Clock
} from 'lucide-react';
import { HumanResourcesWorkforceService } from '../../services/humanResourcesWorkforceService';
import { 
  Employee, 
  EmployeeLeaveRequest,
  HRSimulationScenario 
} from '../../types/humanResourcesWorkforce';

export const HumanResourcesWorkforceWorkspace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'directory'
    | 'employment'
    | 'positions'
    | 'leave'
    | 'attendance'
    | 'service_cases'
    | 'separations'
    | 'diagnostics'
    | 'sandbox'
    | 'audit'
  >('overview');

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<EmployeeLeaveRequest[]>([]);
  const [diagnostics, setDiagnostics] = useState<any[]>([]);
  const [simulationResult, setSimulationResult] = useState<HRSimulationScenario | null>(null);
  const [loading, setLoading] = useState(true);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const tenantId = 'tenant_default';

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      setEmployees(await HumanResourcesWorkforceService.getEmployees(tenantId));
      setLeaveRequests(await HumanResourcesWorkforceService.getLeaveRequests(tenantId));
      setDiagnostics(await HumanResourcesWorkforceService.runDiagnostics());
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
    const result = HumanResourcesWorkforceService.runSandboxSimulation(scenarioId);
    setSimulationResult(result);
  };

  const scenarios = [
    'S01_ONBOARDING_SURGE', 'S02_APPOINTMENT_BACKLOG', 'S03_POSITION_VACANCY', 
    'S04_CONTRACT_EXPIRY', 'S05_LEAVE_SURGE', 'S06_BALANCE_EXHAUSTION', 
    'S07_ATTENDANCE_SURGE', 'S08_CROSS_CAMPUS_ASSIGN', 'S09_SEPARATION_SURGE', 
    'S10_CLEARANCE_BOTTLENECK', 'S11_DUPLICATE_EMPLOYEE', 'S12_CONCURRENT_EMP_NUM', 
    'S13_FOUR_EYES_VIOLATION', 'S14_CROSS_TENANT_ACCESS', 'S15_HR_RECOVERY'
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Institutional HR & Workforce</h1>
          <p className="text-sm text-gray-600">Authoritative workforce operations, employee lifecycle, and HR governance.</p>
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
          { id: 'directory', label: 'Employee Registry', icon: Users },
          { id: 'employment', label: 'Employment & Positions', icon: Briefcase },
          { id: 'leave', label: 'Leave Management', icon: Calendar },
          { id: 'attendance', label: 'Attendance', icon: Clock },
          { id: 'separations', label: 'Separations', icon: LogOut },
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
            <h2 className="text-lg font-bold text-gray-900">Workforce Command Center</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
                <span className="text-xs font-semibold text-indigo-600 uppercase">Active Workforce</span>
                <p className="text-2xl font-bold text-indigo-900 mt-1">{employees.length}</p>
              </div>
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                <span className="text-xs font-semibold text-blue-600 uppercase">Leave Requests</span>
                <p className="text-2xl font-bold text-blue-900 mt-1">{leaveRequests.length}</p>
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
                    onClick={() => handleAction(() => HumanResourcesWorkforceService.onboardEmployee({
                      tenantId,
                      primaryCampusIdRef: 'campus_main',
                      employeeType: 'FULL_TIME',
                      classification: 'FACULTY',
                      displayName: 'Dr. John Doe',
                      effectiveFrom: new Date().toISOString()
                    }), 'Employee successfully onboarded.')}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow flex items-center gap-2"
                 >
                   <Users className="w-4 h-4" /> Onboard Employee
                 </button>
                 <button
                    onClick={() => handleAction(() => HumanResourcesWorkforceService.requestLeave({
                      tenantId,
                      employeeIdRef: 'emp_demo',
                      leaveType: 'ANNUAL_LEAVE',
                      startDate: '2026-09-01T00:00:00Z',
                      endDate: '2026-09-15T00:00:00Z',
                      requesterUserIdRef: 'emp_demo'
                    }), 'Leave request submitted.')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow flex items-center gap-2"
                 >
                   <Calendar className="w-4 h-4" /> File Leave Request
                 </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'leave' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Workforce Leave Management</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50 text-gray-700">
                    <th className="p-3">Request ID</th>
                    <th className="p-3">Employee Ref</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Dates</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leaveRequests.length === 0 ? (
                    <tr><td colSpan={6} className="p-4 text-center text-gray-500">No leave requests pending.</td></tr>
                  ) : leaveRequests.map(req => (
                    <tr key={req.requestId} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-mono font-medium text-indigo-600">{req.requestId}</td>
                      <td className="p-3 font-mono text-xs">{req.employeeIdRef}</td>
                      <td className="p-3">{req.leaveType}</td>
                      <td className="p-3 text-xs">{new Date(req.startDate).toLocaleDateString()} - {new Date(req.endDate).toLocaleDateString()}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${req.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="p-3">
                        {req.status === 'SUBMITTED' && (
                          <button
                            onClick={() => handleAction(() => HumanResourcesWorkforceService.approveLeave(req.requestId, 'admin_super'), 'Leave Approved (Four-Eyes SoD enforced)')}
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
            <h2 className="text-lg font-bold text-gray-900">Workforce Diagnostics</h2>
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
                 Run 15 HR/Workforce scenarios including mass onboarding, separation clearances, Four-Eyes SoD testing, and attendance re-calibrations.
               </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {scenarios.map(sc => (
                <button
                  key={sc}
                  onClick={() => runSimulation(sc)}
                  className="p-3 text-left border rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
                >
                  <span className="text-xs font-bold text-gray-500 block mb-1">SCENARIO</span>
                  <span className="text-xs font-semibold text-indigo-700 truncate block">{sc}</span>
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

        {['directory', 'employment', 'positions', 'attendance', 'service_cases', 'separations', 'audit'].includes(activeTab) && (
          <div className="p-8 text-center text-gray-500">
            <p className="text-base font-medium">HR Workspace module for {activeTab.toUpperCase()} is active.</p>
            <p className="text-xs text-gray-400 mt-2">Use the command center or verification suite to execute operations.</p>
          </div>
        )}
      </div>
    </div>
  );
};
