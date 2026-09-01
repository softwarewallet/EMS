import React, { useState, useEffect } from 'react';
import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';
import { AdmissionsService } from '../../services/admissionsService';
import { AdmissionApplication, AdmissionDocument } from '../../types/admissions';
import { ShieldCheck, Loader2, CheckCircle2, AlertTriangle, Eye, Check, X } from 'lucide-react';
import { ApplicationWorkspaceModal } from './ApplicationWorkspaceModal';

export const AdmissionsVerificationView: React.FC = () => {
  const { currentTenant } = useTenant();
  const { user } = useAuth();
  const [applications, setApplications] = useState<AdmissionApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);

  const performedBy = {
    userId: user?.uid || 'usr_admin',
    email: user?.email || 'admin@school.edu',
    name: user?.displayName || 'Verification Officer'
  };

  const loadVerificationQueue = async () => {
    if (!currentTenant) return;
    setLoading(true);
    try {
      const data = await AdmissionsService.getApplications(currentTenant.id);
      // Filter applications that require verification
      const queue = data.filter(a => 
        a.status === 'SUBMITTED' || 
        a.status === 'UNDER_REVIEW' || 
        a.status === 'DOCUMENT_VERIFICATION' ||
        a.status === 'DOCUMENT_PENDING'
      );
      setApplications(queue);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVerificationQueue();
  }, [currentTenant]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Document Verification Queue</h2>
          <p className="text-sm text-slate-500">Inspect candidate credentials, verify certificates, and advance verified files to eligibility assessment.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
          <span className="text-sm font-bold text-slate-800">Applications Pending Document Verification ({applications.length})</span>
        </div>

        {loading ? (
          <div className="p-16 flex justify-center">
            <Loader2 className="w-8 h-8 text-sky-600 animate-spin" />
          </div>
        ) : applications.length === 0 ? (
          <div className="p-16 text-center text-slate-400">
            <ShieldCheck className="w-12 h-12 mx-auto mb-3 text-emerald-500" />
            <p className="font-bold text-slate-700 text-base">Verification Queue Clear!</p>
            <p className="text-xs text-slate-500 mt-1">All submitted applicant documents have been inspected.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs font-semibold border-b">
                <tr>
                  <th className="px-6 py-3">App Number</th>
                  <th className="px-6 py-3">Applicant Name</th>
                  <th className="px-6 py-3">Class</th>
                  <th className="px-6 py-3">Submission Date</th>
                  <th className="px-6 py-3">Verification Stage</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {applications.map(app => (
                  <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-sky-700">{app.applicationNumber}</td>
                    <td className="px-6 py-4 font-semibold text-slate-900">{app.applicant.firstName} {app.applicant.lastName}</td>
                    <td className="px-6 py-4 uppercase font-semibold text-slate-600">{app.appliedClassId}</td>
                    <td className="px-6 py-4 text-slate-500">{new Date(app.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold">
                        {app.status?.replace(/_/g, ' ') || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setSelectedAppId(app.id)}
                        className="bg-sky-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-sky-700 transition-colors inline-flex items-center gap-1"
                      >
                        Inspect & Verify <Eye className="w-3.5 h-3.5" />
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
          onRefresh={loadVerificationQueue}
          currentUser={user}
        />
      )}
    </div>
  );
};
