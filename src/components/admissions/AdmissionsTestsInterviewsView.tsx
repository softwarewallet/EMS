import React, { useState, useEffect } from 'react';
import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';
import { AdmissionsService } from '../../services/admissionsService';
import { AdmissionApplication } from '../../types/admissions';
import { FileQuestion, Users, Loader2, Eye } from 'lucide-react';
import { ApplicationWorkspaceModal } from './ApplicationWorkspaceModal';

export const AdmissionsTestsInterviewsView: React.FC = () => {
  const { currentTenant } = useTenant();
  const { user } = useAuth();
  const [applications, setApplications] = useState<AdmissionApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'tests' | 'interviews'>('tests');
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);

  const loadData = async () => {
    if (!currentTenant) return;
    setLoading(true);
    try {
      const data = await AdmissionsService.getApplications(currentTenant.id);
      setApplications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentTenant]);

  const testQueue = applications.filter(a => a.status === 'TEST_PENDING' || a.status === 'DOCUMENT_VERIFICATION' || a.status === 'READY_FOR_SELECTION');
  const interviewQueue = applications.filter(a => a.status === 'INTERVIEW_PENDING' || a.status === 'READY_FOR_SELECTION');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Entrance Tests & Interview Panels</h2>
          <p className="text-sm text-slate-500">Schedule written evaluation exams, conduct interview panel evaluations, and log candidate marks.</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-2xl px-4 text-xs font-semibold text-slate-600">
        <button 
          onClick={() => setActiveTab('tests')}
          className={`py-3 px-5 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'tests' ? 'border-indigo-600 text-indigo-600 font-bold' : 'border-transparent hover:text-slate-900'
          }`}
        >
          <FileQuestion className="w-4 h-4" /> Written Entrance Exams ({testQueue.length})
        </button>
        <button 
          onClick={() => setActiveTab('interviews')}
          className={`py-3 px-5 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'interviews' ? 'border-cyan-600 text-cyan-600 font-bold' : 'border-transparent hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" /> Interview Panels ({interviewQueue.length})
        </button>
      </div>

      <div className="bg-white rounded-b-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 flex justify-center">
            <Loader2 className="w-8 h-8 text-sky-600 animate-spin" />
          </div>
        ) : activeTab === 'tests' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs font-semibold border-b">
                <tr>
                  <th className="px-6 py-3">App Number</th>
                  <th className="px-6 py-3">Applicant Name</th>
                  <th className="px-6 py-3">Class Grade</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {testQueue.map(app => (
                  <tr key={app.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-bold text-indigo-700">{app.applicationNumber}</td>
                    <td className="px-6 py-4 font-semibold text-slate-900">{app.applicant.firstName} {app.applicant.lastName}</td>
                    <td className="px-6 py-4 uppercase font-semibold text-slate-600">{app.appliedClassId}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold">
                        {app.status?.replace(/_/g, ' ') || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setSelectedAppId(app.id)}
                        className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-indigo-700 transition-colors inline-flex items-center gap-1"
                      >
                        Score Exam <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs font-semibold border-b">
                <tr>
                  <th className="px-6 py-3">App Number</th>
                  <th className="px-6 py-3">Applicant Name</th>
                  <th className="px-6 py-3">Class Grade</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {interviewQueue.map(app => (
                  <tr key={app.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-bold text-cyan-700">{app.applicationNumber}</td>
                    <td className="px-6 py-4 font-semibold text-slate-900">{app.applicant.firstName} {app.applicant.lastName}</td>
                    <td className="px-6 py-4 uppercase font-semibold text-slate-600">{app.appliedClassId}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-cyan-50 text-cyan-700 rounded-full text-xs font-bold">
                        {app.status?.replace(/_/g, ' ') || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setSelectedAppId(app.id)}
                        className="bg-cyan-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-cyan-700 transition-colors inline-flex items-center gap-1"
                      >
                        Interview Workspace <Eye className="w-3.5 h-3.5" />
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
          onRefresh={loadData}
          currentUser={user}
        />
      )}
    </div>
  );
};
