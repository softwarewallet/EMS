import React, { useState, useEffect } from 'react';
import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';
import { AdmissionsService } from '../../services/admissionsService';
import { AdmissionMeritEntry, AdmissionWaitlistEntry } from '../../types/admissions';
import { Award, Clock, Loader2, CheckCircle2, ArrowRight } from 'lucide-react';
import { ApplicationWorkspaceModal } from './ApplicationWorkspaceModal';

export const AdmissionsSelectionMeritView: React.FC = () => {
  const { currentTenant } = useTenant();
  const { user } = useAuth();
  const [meritEntries, setMeritEntries] = useState<AdmissionMeritEntry[]>([]);
  const [waitlistEntries, setWaitlistEntries] = useState<AdmissionWaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'merit' | 'waitlist'>('merit');
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);

  const performedBy = {
    userId: user?.uid || 'usr_admin',
    email: user?.email || 'admin@school.edu',
    name: user?.displayName || 'Selection Officer'
  };

  const loadData = async () => {
    if (!currentTenant) return;
    setLoading(true);
    try {
      const merit = await AdmissionsService.calculateMeritList(currentTenant.id, selectedClass || undefined);
      const waitlist = await AdmissionsService.getWaitlist(currentTenant.id);
      setMeritEntries(merit);
      setWaitlistEntries(waitlist);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentTenant, selectedClass]);

  const handlePromoteWaitlist = async (appId: string) => {
    if (!currentTenant) return;
    try {
      await AdmissionsService.updateApplicationStatus(appId, currentTenant.id, 'SELECTED', performedBy, {
        selectionDecision: {
          decision: 'SELECTED',
          date: new Date().toISOString(),
          byId: performedBy.userId,
          byName: performedBy.name,
          remarks: 'Promoted from Waitlist'
        }
      });
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Selection Committee & Merit Engine</h2>
          <p className="text-sm text-slate-500">Calculate weighted academic ranks, evaluate candidate shortlists, and manage the waitlist queue.</p>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-slate-500">Filter Class:</label>
          <select 
            value={selectedClass} 
            onChange={(e) => setSelectedClass(e.target.value)}
            className="text-sm border border-slate-300 rounded-lg px-3 py-1.5 bg-white font-semibold"
          >
            <option value="">All Classes</option>
            <option value="cls_viii">Class VIII</option>
            <option value="cls_ix">Class IX</option>
            <option value="cls_x">Class X</option>
          </select>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-2xl px-4 text-xs font-semibold text-slate-600">
        <button 
          onClick={() => setActiveTab('merit')}
          className={`py-3 px-5 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'merit' ? 'border-amber-600 text-amber-700 font-bold' : 'border-transparent hover:text-slate-900'
          }`}
        >
          <Award className="w-4 h-4" /> Calculated Merit Ranks ({meritEntries.length})
        </button>
        <button 
          onClick={() => setActiveTab('waitlist')}
          className={`py-3 px-5 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'waitlist' ? 'border-orange-600 text-orange-700 font-bold' : 'border-transparent hover:text-slate-900'
          }`}
        >
          <Clock className="w-4 h-4" /> Waitlist Queue ({waitlistEntries.length})
        </button>
      </div>

      <div className="bg-white rounded-b-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 flex justify-center">
            <Loader2 className="w-8 h-8 text-sky-600 animate-spin" />
          </div>
        ) : activeTab === 'merit' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs font-semibold border-b">
                <tr>
                  <th className="px-6 py-3">Rank</th>
                  <th className="px-6 py-3">App Number</th>
                  <th className="px-6 py-3">Applicant Name</th>
                  <th className="px-6 py-3">Class</th>
                  <th className="px-6 py-3 text-center">Entrance (50%)</th>
                  <th className="px-6 py-3 text-center">Past Marks (30%)</th>
                  <th className="px-6 py-3 text-center">Interview (20%)</th>
                  <th className="px-6 py-3 text-center">Weighted Score</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {meritEntries.map(e => (
                  <tr key={e.applicationId} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-black text-slate-900 text-base">#{e.rank}</td>
                    <td className="px-6 py-4 font-bold text-sky-700">{e.applicationNumber}</td>
                    <td className="px-6 py-4 font-semibold text-slate-900">{e.applicantName}</td>
                    <td className="px-6 py-4 uppercase font-semibold text-slate-600">{e.appliedClassId}</td>
                    <td className="px-6 py-4 text-center font-bold text-indigo-700">{e.entranceScore}%</td>
                    <td className="px-6 py-4 text-center font-bold text-slate-700">{e.previousMarksScore}%</td>
                    <td className="px-6 py-4 text-center font-bold text-cyan-700">{e.interviewScore}%</td>
                    <td className="px-6 py-4 text-center font-extrabold text-amber-700 text-base bg-amber-50/50">{e.totalWeightedScore}</td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setSelectedAppId(e.applicationId)}
                        className="bg-sky-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-sky-700 transition-colors"
                      >
                        Select & Decision
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
                  <th className="px-6 py-3">Position</th>
                  <th className="px-6 py-3">App Number</th>
                  <th className="px-6 py-3">Applicant Name</th>
                  <th className="px-6 py-3">Class</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {waitlistEntries.map(w => (
                  <tr key={w.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-black text-orange-600 text-base">Waitlist #{w.position}</td>
                    <td className="px-6 py-4 font-bold text-slate-900">{w.applicationNumber}</td>
                    <td className="px-6 py-4 font-semibold text-slate-900">{w.applicantName}</td>
                    <td className="px-6 py-4 uppercase font-semibold text-slate-600">{w.classId}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-bold">
                        {w.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handlePromoteWaitlist(w.applicationId)}
                        className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors inline-flex items-center gap-1"
                      >
                        Promote to SELECTED <ArrowRight className="w-3.5 h-3.5" />
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
