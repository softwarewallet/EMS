import React, { useState, useEffect } from 'react';
import { useTenant } from '../../context/TenantContext';
import { AdmissionsService } from '../../services/admissionsService';
import { AdmissionApplication, AdmissionEnquiry, AdmissionSession } from '../../types/admissions';
import { 
  Users, 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  Award, 
  Filter, 
  TrendingUp, 
  Loader2,
  GraduationCap
} from 'lucide-react';

export const AdmissionsDashboard: React.FC = () => {
  const { currentTenant } = useTenant();
  const [sessions, setSessions] = useState<AdmissionSession[]>([]);
  const [activeSession, setActiveSession] = useState<AdmissionSession | null>(null);
  const [applications, setApplications] = useState<AdmissionApplication[]>([]);
  const [enquiries, setEnquiries] = useState<AdmissionEnquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentTenant) {
      setLoading(true);
      Promise.all([
        AdmissionsService.getSessions(currentTenant.id),
        AdmissionsService.getApplications(currentTenant.id),
        AdmissionsService.getEnquiries(currentTenant.id)
      ]).then(([sessData, appData, enqData]) => {
        setSessions(sessData);
        const openSess = sessData.find(s => s.status === 'OPEN') || sessData[0] || null;
        setActiveSession(openSess);
        setApplications(appData);
        setEnquiries(enqData);
        setLoading(false);
      }).catch(err => {
        console.error(err);
        setLoading(false);
      });
    }
  }, [currentTenant]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 text-sky-600 animate-spin" />
      </div>
    );
  }

  // Calculate Funnel Metrics
  const totalEnquiries = enquiries.length;
  const totalApps = applications.length;
  const pendingVerification = applications.filter(a => a.status === 'SUBMITTED' || a.status === 'DOCUMENT_VERIFICATION' || a.status === 'UNDER_REVIEW').length;
  const readyForSelection = applications.filter(a => a.status === 'READY_FOR_SELECTION' || a.status === 'TEST_PENDING' || a.status === 'INTERVIEW_PENDING').length;
  const selectedCount = applications.filter(a => a.status === 'SELECTED' || a.status === 'APPROVED').length;
  const waitlistedCount = applications.filter(a => a.status === 'WAITLISTED').length;
  const admittedCount = applications.filter(a => a.status === 'ADMITTED').length;

  const funnelStages = [
    { label: 'Enquiries', count: totalEnquiries, color: 'bg-blue-500', pct: 100 },
    { label: 'Applications', count: totalApps, color: 'bg-indigo-500', pct: totalEnquiries > 0 ? Math.round((totalApps / totalEnquiries) * 100) : 0 },
    { label: 'Verified & Tested', count: readyForSelection, color: 'bg-cyan-500', pct: totalApps > 0 ? Math.round((readyForSelection / totalApps) * 100) : 0 },
    { label: 'Selected / Waitlist', count: selectedCount + waitlistedCount, color: 'bg-amber-500', pct: totalApps > 0 ? Math.round(((selectedCount + waitlistedCount) / totalApps) * 100) : 0 },
    { label: 'Final Admitted', count: admittedCount, color: 'bg-emerald-600', pct: totalApps > 0 ? Math.round((admittedCount / totalApps) * 100) : 0 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Admissions & Funnel Analytics</h2>
          <p className="text-sm text-slate-500">Real-time funnel conversion metrics, applicant stage distribution, and session overview.</p>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-slate-500 uppercase">Active Session:</label>
          <select 
            value={activeSession?.id || ''} 
            onChange={(e) => {
              const s = sessions.find(x => x.id === e.target.value);
              if (s) setActiveSession(s);
            }}
            className="text-sm font-semibold border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-none"
          >
            {sessions.map(s => (
              <option key={s.id} value={s.id}>{s.name} ({s.status})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>TOTAL ENQUIRIES</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900">{totalEnquiries}</span>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Leads</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>APPLICATIONS</span>
            <FileText className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900">{totalApps}</span>
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">Submitted</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>PENDING VERIFY</span>
            <ShieldCheck className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-amber-600">{pendingVerification}</span>
            <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">Action Req</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>SELECTED / MERIT</span>
            <Award className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-cyan-700">{selectedCount}</span>
            <span className="text-xs font-semibold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded">Shortlisted</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>FINAL ADMITTED</span>
            <GraduationCap className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-emerald-600">{admittedCount}</span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Enrolled</span>
          </div>
        </div>
      </div>

      {/* Funnel Visualizer Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
        <div className="flex justify-between items-center border-b pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-sky-600" /> Admission Lifecycle Conversion Funnel
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Stage progression from lead intake to final student enrollment.</p>
          </div>
        </div>

        <div className="space-y-4">
          {funnelStages.map((stage, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>{stage.label}</span>
                <span>{stage.count} ({stage.pct}% conversion)</span>
              </div>
              <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden flex">
                <div 
                  className={`h-full ${stage.color} transition-all duration-500 rounded-full`} 
                  style={{ width: `${Math.max(stage.pct, 4)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Applications Preview Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
          <h3 className="text-base font-bold text-slate-900">Recent Applications</h3>
          <span className="text-xs text-slate-500 font-medium">Showing latest submitted applications</span>
        </div>

        {applications.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <FileText className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            <p className="font-semibold text-slate-600">No applications registered yet.</p>
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
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {applications.slice(0, 5).map(app => (
                  <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-3.5 font-bold text-sky-700">{app.applicationNumber}</td>
                    <td className="px-6 py-3.5">{app.applicant.firstName} {app.applicant.lastName}</td>
                    <td className="px-6 py-3.5 uppercase">{app.appliedClassId}</td>
                    <td className="px-6 py-3.5 text-slate-500">{new Date(app.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-3.5">
                      <span className="px-2.5 py-1 bg-sky-50 text-sky-800 rounded-full text-xs font-semibold border border-sky-100">
                        {app.status?.replace(/_/g, ' ') || 'Unknown'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
