import React, { useState } from 'react';
import { useStaffContext } from './StaffContext';
import { StaffHRCase, HRCasePriority, HRCaseCategory } from '../../types';
import { ShieldAlert, Plus, Lock } from 'lucide-react';

export const HRCasesTab: React.FC = () => {
  const { staffList } = useStaffContext();

  const [cases, setCases] = useState<StaffHRCase[]>([
    {
      id: 'case_1',
      tenantId: 'tenant_default',
      campusId: 'campus_main',
      caseNumber: 'HRC-2026-001',
      category: 'GRIEVANCE',
      priority: 'MEDIUM',
      confidentialityLevel: 'CONFIDENTIAL',
      status: 'INVESTIGATION',
      staffId: staffList[0]?.id || 'staff_1',
      staffName: staffList[0]?.fullName || 'Faculty Member',
      department: staffList[0]?.department || 'Science',
      assignedOfficerId: 'admin_1',
      assignedOfficerName: 'HR Compliance Lead',
      title: 'Inter-departmental Resource Allocation Dispute',
      summary: 'Formal dispute raised regarding scheduling conflicts and equitable lab access.',
      version: 1,
      createdAt: '2026-08-10T09:00:00Z',
      updatedAt: '2026-08-10T09:00:00Z'
    }
  ]);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [caseTitle, setCaseTitle] = useState<string>('');
  const [category, setCategory] = useState<HRCaseCategory>('GRIEVANCE');
  const [priority, setPriority] = useState<HRCasePriority>('MEDIUM');
  const [staffId, setStaffId] = useState<string>(staffList[0]?.id || '');
  const [summary, setSummary] = useState<string>('');

  const handleCreateCase = (e: React.FormEvent) => {
    e.preventDefault();
    const staff = staffList.find((s) => s.id === staffId);
    const newCase: StaffHRCase = {
      id: `case_${Date.now()}`,
      tenantId: 'tenant_default',
      campusId: staff?.campusId || 'campus_main',
      caseNumber: `HRC-2026-${(cases.length + 1).toString().padStart(3, '0')}`,
      category,
      priority,
      confidentialityLevel: 'CONFIDENTIAL',
      status: 'OPEN',
      staffId: staffId || 'staff_unknown',
      staffName: staff?.fullName || 'Faculty Member',
      department: staff?.department || 'General',
      assignedOfficerId: 'admin_1',
      assignedOfficerName: 'HR Compliance Lead',
      title: caseTitle.trim(),
      summary: summary.trim(),
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setCases([newCase, ...cases]);
    setShowModal(false);
    setCaseTitle('');
    setSummary('');
  };

  const getPriorityBadge = (p: HRCasePriority) => {
    switch (p) {
      case 'URGENT':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'HIGH':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'MEDIUM':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            Confidential HR Cases, Grievances & Inquiries
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Log workplace concerns, manage formal investigations, and document disciplinary resolutions with confidentiality.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-medium rounded-lg text-sm shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Log HR Case
        </button>
      </div>

      {/* Cases List */}
      <div className="space-y-3">
        {cases.map((c) => {
          return (
            <div
              key={c.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-rose-200 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-slate-600">{c.caseNumber}</span>
                  <span className="font-bold text-slate-900 text-sm">{c.title}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getPriorityBadge(c.priority)}`}>
                    {c.priority}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                    {c.status}
                  </span>
                </div>

                <p className="text-xs text-slate-600">{c.summary}</p>

                <div className="text-[11px] text-slate-400 flex items-center gap-3 pt-1">
                  <span>Subject: {c.staffName} ({c.department})</span>
                  <span>•</span>
                  <span>Reported: {c.createdAt.split('T')[0]}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-amber-700 font-medium">
                    <Lock className="w-3 h-3" /> Confidential
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg text-xs transition-colors cursor-pointer">
                  View Investigation
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 text-rose-700">
              <ShieldAlert className="w-5 h-5" />
              Log Confidential HR Incident
            </h3>

            <form onSubmit={handleCreateCase} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Subject Employee</label>
                <select
                  value={staffId}
                  onChange={(e) => setStaffId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                >
                  {staffList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.fullName} ({s.department})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Case Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as HRCaseCategory)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                >
                  <option value="GRIEVANCE">Grievance</option>
                  <option value="POLICY_VIOLATION">Policy Violation</option>
                  <option value="DISCIPLINARY">Disciplinary</option>
                  <option value="COMPLIANCE_BREACH">Compliance Breach</option>
                  <option value="WORKPLACE_INCIDENT">Workplace Incident</option>
                  <option value="ATTENDANCE_ISSUE">Attendance Issue</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Priority Rating</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as HRCasePriority)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Case Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Investigation regarding unauthorized absences"
                  value={caseTitle}
                  onChange={(e) => setCaseTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Incident Summary</label>
                <textarea
                  rows={3}
                  required
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Factual summary of circumstances..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm font-medium shadow-xs cursor-pointer"
                >
                  Log Incident
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
