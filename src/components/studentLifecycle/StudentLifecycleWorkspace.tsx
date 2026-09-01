import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Users,
  FileText,
  AlertTriangle,
  CheckSquare,
  Clock,
  Shield,
  Send,
  Briefcase,
  UserCheck,
  Activity,
  Award
} from 'lucide-react';
import { StudentLifecycleService } from '../../services/studentLifecycleService';
import { Student, StudentProgramEnrollment, StudentHold, StudentServiceCase } from '../../types/studentLifecycle';

export const StudentLifecycleWorkspace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'registry'
    | 'profile'
    | 'lifecycle'
    | 'programs'
    | 'standing'
    | 'holds'
    | 'services'
    | 'requests'
    | 'advising'
    | 'leave'
    | 'suspension'
    | 'transfers'
    | 'withdrawals'
    | 'reactivation'
    | 'graduation'
    | 'diagnostics'
    | 'audit'
  >('overview');

  const [students, setStudents] = useState<Student[]>([]);
  const [diagnostics, setDiagnostics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const tenantId = 'tenant_default';

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const studs = await StudentLifecycleService.getStudents(tenantId);
      setStudents(studs);
      const diag = await StudentLifecycleService.runDiagnostics();
      setDiagnostics(diag);
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

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student Lifecycle & Records</h1>
          <p className="text-sm text-gray-600">Authoritative operations for student records, lifecycle states, holds, and student services.</p>
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
          { id: 'registry', label: 'Student Registry', icon: Users },
          { id: 'programs', label: 'Program History', icon: GraduationCap },
          { id: 'holds', label: 'Holds', icon: Shield },
          { id: 'services', label: 'Student Services', icon: Briefcase },
          { id: 'leave', label: 'Leave & Absence', icon: Clock },
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
            <h2 className="text-lg font-bold text-gray-900">Student Operations Command Center</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
                <span className="text-xs font-semibold text-indigo-600 uppercase">Total Students</span>
                <p className="text-2xl font-bold text-indigo-900 mt-1">{students.length}</p>
              </div>
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                <span className="text-xs font-semibold text-emerald-600 uppercase">Active Students</span>
                <p className="text-2xl font-bold text-emerald-900 mt-1">{students.filter(s => s.lifecycleState === 'ACTIVE').length}</p>
              </div>
              <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
                <span className="text-xs font-semibold text-amber-600 uppercase">Diagnostics Alerts</span>
                <p className="text-2xl font-bold text-amber-900 mt-1">{diagnostics.filter(d => d.severity !== 'INFORMATIONAL').length}</p>
              </div>
            </div>
            
            <div className="mt-8 border-t pt-6">
              <h3 className="text-md font-bold text-gray-800 mb-4">Quick Actions</h3>
              <div className="flex gap-4">
                 <button
                    onClick={() => handleAction(() => StudentLifecycleService.createStudent({
                      tenantId: 'tenant_default',
                      personReference: { firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com', phone: '1234567890', dateOfBirth: '2000-01-01' },
                      institutionIdRef: 'inst_1',
                      primaryCampusIdRef: 'campus_main',
                      studentType: 'UG',
                      studentStatus: 'ACTIVE',
                      lifecycleState: 'ACTIVE',
                      currentProgramIdRef: 'prog_bsc_cs',
                      currentProgramVersionIdRef: 'v1',
                      currentTermIdRef: 'term_1',
                      effectiveFrom: '2026-08-01',
                      createdBy: 'sys_admin',
                      updatedBy: 'sys_admin'
                    }), 'Student created successfully')}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow"
                 >
                   Provision Sample Student
                 </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'registry' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Student Registry</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50 text-gray-700">
                    <th className="p-3">Student #</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Program ID</th>
                    <th className="p-3">Lifecycle</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {students.length === 0 ? (
                    <tr><td colSpan={5} className="p-4 text-center text-gray-500">No students found.</td></tr>
                  ) : students.map(s => (
                    <tr key={s.studentId} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-mono font-medium text-indigo-600">{s.studentNumber}</td>
                      <td className="p-3">{s.personReference.firstName} {s.personReference.lastName}</td>
                      <td className="p-3 font-mono text-xs">{s.currentProgramIdRef}</td>
                      <td className="p-3">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-semibold">{s.lifecycleState}</span>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded text-xs font-semibold">{s.studentStatus}</span>
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
            <h2 className="text-lg font-bold text-gray-900">Student Operations Diagnostics</h2>
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

        {['profile', 'lifecycle', 'programs', 'standing', 'holds', 'services', 'requests', 'advising', 'leave', 'suspension', 'transfers', 'withdrawals', 'reactivation', 'graduation', 'audit'].includes(activeTab) && (
          <div className="p-8 text-center text-gray-500">
            <p className="text-base font-medium">Workspace module for {activeTab.toUpperCase()} is active and governed by authoritative domain rules.</p>
            <p className="text-xs text-gray-400 mt-2">Use the command center or verification suite to execute operations.</p>
          </div>
        )}
      </div>
    </div>
  );
};
