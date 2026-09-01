import React, { useState, useEffect } from 'react';
import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';
import { AdmissionsService } from '../../services/admissionsService';
import { AdmissionApplication } from '../../types/admissions';
import { CheckCircle2, ShieldCheck, Loader2, Eye, GraduationCap, AlertTriangle } from 'lucide-react';
import { ApplicationWorkspaceModal } from './ApplicationWorkspaceModal';

export const AdmissionsApprovalsView: React.FC = () => {
  const { currentTenant } = useTenant();
  const { user } = useAuth();
  const [applications, setApplications] = useState<AdmissionApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);

  const loadApprovalQueue = async () => {
    if (!currentTenant) return;
    setLoading(true);
    try {
      const data = await AdmissionsService.getApplications(currentTenant.id);
      // Filter applications that are SELECTED or APPROVED or ADMITTED
      const queue = data.filter(a => a.status === 'SELECTED' || a.status === 'APPROVED' || a.status === 'ADMITTED');
      setApplications(queue);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApprovalQueue();
  }, [currentTenant]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Principal Approval & Final Admission Roster</h2>
          <p className="text-sm text-slate-500">Review selected candidate files, sign off executive approval offers, and execute student creation and enrollment.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
          <span className="text-sm font-bold text-slate-800">Approved & Selected Applications Queue ({applications.length})</span>
        </div>

        {loading ? (
          <div className="p-16 flex justify-center">
            <Loader2 className="w-8 h-8 text-sky-600 animate-spin" />
          </div>
        ) : applications.length === 0 ? (
          <div className="p-16 text-center text-slate-400">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-emerald-500" />
            <p className="font-bold text-slate-700 text-base">No Applications Pending Approval</p>
            <p className="text-xs text-slate-500 mt-1">Committee shortlists will appear here for Principal sign-off.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs font-semibold border-b">
                <tr>
                  <th className="px-6 py-3">App Number</th>
                  <th className="px-6 py-3">Applicant Name</th>
                  <th className="px-6 py-3">Class</th>
                  <th className="px-6 py-3">Selection Date</th>
                  <th className="px-6 py-3">Approval Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {applications.map(app => (
                  <tr key={app.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-bold text-sky-700">{app.applicationNumber}</td>
                    <td className="px-6 py-4 font-semibold text-slate-900">{app.applicant.firstName} {app.applicant.lastName}</td>
                    <td className="px-6 py-4 uppercase font-semibold text-slate-600">{app.appliedClassId}</td>
                    <td className="px-6 py-4 text-slate-500">{app.selectionDecision?.date ? new Date(app.selectionDecision.date).toLocaleDateString() : 'N/A'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        app.status === 'ADMITTED' ? 'bg-green-100 text-green-800' :
                        app.status === 'APPROVED' ? 'bg-teal-100 text-teal-800' :
                        'bg-emerald-100 text-emerald-800'
                      }`}>
                        {app.status?.replace(/_/g, ' ') || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setSelectedAppId(app.id)}
                        className="bg-emerald-600 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors inline-flex items-center gap-1.5 shadow-sm"
                      >
                        <GraduationCap className="w-3.5 h-3.5" /> Open Sign-off & Admit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedAppId && (
        <ApplicationWorkspaceModal 
          applicationId={selectedAppId}
          onClose={() => setSelectedAppId(null)}
          onRefresh={loadApprovalQueue}
          currentUser={user}
        />
      )}
    </div>
  );
};
