import React, { useState, useEffect } from 'react';
import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';
import { AdmissionsService } from '../../services/admissionsService';
import { AdmissionApplication, ApplicationStatus } from '../../types/admissions';
import { ApplicationWorkspaceModal } from './ApplicationWorkspaceModal';
import { FileText, Search, Loader2, Filter, Eye, Plus, X } from 'lucide-react';

export const AdmissionsApplicationsView: React.FC = () => {
  const { currentTenant } = useTenant();
  const { user } = useAuth();
  const [applications, setApplications] = useState<AdmissionApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTabStatus, setActiveTabStatus] = useState<string>('ALL');

  // New App Modal State
  const [showNewModal, setShowNewModal] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('2012-08-15');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [guardianName, setGuardianName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [appliedClass, setAppliedClass] = useState('cls_viii');
  const [submitting, setSubmitting] = useState(false);

  const performedBy = {
    userId: user?.uid || 'usr_admin',
    email: user?.email || 'admin@school.edu',
    name: user?.displayName || 'Admission Officer'
  };

  const loadApplications = async () => {
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
    loadApplications();
  }, [currentTenant]);

  const handleCreateApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTenant || !firstName || !lastName || !guardianName || !contactNumber) return;

    setSubmitting(true);
    try {
      const activeSess = (await AdmissionsService.getSessions(currentTenant.id))[0];
      await AdmissionsService.createApplication({
        tenantId: currentTenant.id,
        sessionId: activeSess?.id || 'sess_default',
        applicationNumber: '',
        applicant: {
          firstName,
          lastName,
          dateOfBirth: dob,
          gender,
          address: 'Default Resident Address'
        },
        guardians: [{
          name: guardianName,
          relationship: 'parent' as any,
          contactNumber,
          isPrimaryContact: true
        }],
        appliedClassId: appliedClass,
        source: 'Direct Portal Registration',
        status: 'SUBMITTED',
        remarks: 'Direct application created via admissions workspace.'
      }, performedBy);

      setShowNewModal(false);
      setFirstName('');
      setLastName('');
      setGuardianName('');
      setContactNumber('');
      loadApplications();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredApps = applications.filter(app => {
    const candidateName = `${app.applicant.firstName} ${app.applicant.lastName}`.toLowerCase();
    const matchesSearch = candidateName.includes(searchTerm.toLowerCase()) ||
                          app.applicationNumber.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeTabStatus === 'ALL') return matchesSearch;
    if (activeTabStatus === 'VERIFICATION') return matchesSearch && (app.status === 'SUBMITTED' || app.status === 'DOCUMENT_VERIFICATION' || app.status === 'UNDER_REVIEW');
    if (activeTabStatus === 'TESTING') return matchesSearch && (app.status === 'TEST_PENDING' || app.status === 'INTERVIEW_PENDING');
    if (activeTabStatus === 'SELECTION') return matchesSearch && (app.status === 'READY_FOR_SELECTION' || app.status === 'SELECTED' || app.status === 'WAITLISTED');
    if (activeTabStatus === 'APPROVED') return matchesSearch && (app.status === 'APPROVED');
    if (activeTabStatus === 'ADMITTED') return matchesSearch && (app.status === 'ADMITTED');

    return matchesSearch;
  });

  const getBadgeStyle = (status: ApplicationStatus) => {
    switch (status) {
      case 'SUBMITTED': return 'bg-blue-100 text-blue-800';
      case 'UNDER_REVIEW': return 'bg-amber-100 text-amber-800';
      case 'DOCUMENT_VERIFICATION': return 'bg-purple-100 text-purple-800';
      case 'TEST_PENDING': return 'bg-indigo-100 text-indigo-800';
      case 'INTERVIEW_PENDING': return 'bg-cyan-100 text-cyan-800';
      case 'READY_FOR_SELECTION': return 'bg-yellow-100 text-yellow-800';
      case 'SELECTED': return 'bg-emerald-100 text-emerald-800';
      case 'WAITLISTED': return 'bg-orange-100 text-orange-800';
      case 'APPROVED': return 'bg-teal-100 text-teal-800';
      case 'ADMITTED': return 'bg-green-100 text-green-800 font-bold';
      case 'REJECTED': return 'bg-rose-100 text-rose-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Admission Applications Directory</h2>
          <p className="text-sm text-slate-500">Manage candidate files across all 10 admission stages. Click any record to inspect and manage.</p>
        </div>
        <button 
          onClick={() => setShowNewModal(true)}
          className="bg-sky-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-sky-700 transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" /> New Application
        </button>
      </div>

      {/* Directory Component */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Status Filter Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50/50 px-4 overflow-x-auto text-xs font-semibold text-slate-600">
          {[
            { id: 'ALL', label: 'All Applications' },
            { id: 'VERIFICATION', label: 'Pending Verification' },
            { id: 'TESTING', label: 'Tests & Interviews' },
            { id: 'SELECTION', label: 'Selection & Merit' },
            { id: 'APPROVED', label: 'Approved Offers' },
            { id: 'ADMITTED', label: 'Final Admitted' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTabStatus(tab.id)}
              className={`py-3 px-4 border-b-2 whitespace-nowrap transition-colors ${
                activeTabStatus === tab.id ? 'border-sky-600 text-sky-600 font-bold bg-white' : 'border-transparent hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/30">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search candidate name or app #..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-16 flex justify-center">
            <Loader2 className="w-8 h-8 text-sky-600 animate-spin" />
          </div>
        ) : filteredApps.length === 0 ? (
          <div className="p-16 text-center text-slate-400">
            <FileText className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="font-semibold text-slate-700">No Admission Applications Found</p>
            <p className="text-xs text-slate-500 mt-1">Select a different filter or create a new application.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs font-semibold border-b">
                <tr>
                  <th className="px-6 py-3">App Number</th>
                  <th className="px-6 py-3">Applicant Name</th>
                  <th className="px-6 py-3">Applied Class</th>
                  <th className="px-6 py-3">Submission Date</th>
                  <th className="px-6 py-3">Lifecycle Stage</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredApps.map(app => (
                  <tr 
                    key={app.id} 
                    onClick={() => setSelectedAppId(app.id)}
                    className="hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 font-bold text-sky-700">{app.applicationNumber}</td>
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      {app.applicant.firstName} {app.applicant.lastName}
                    </td>
                    <td className="px-6 py-4 uppercase font-semibold text-slate-600">{app.appliedClassId}</td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getBadgeStyle(app.status)}`}>
                        {app.status?.replace(/_/g, ' ') || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAppId(app.id);
                        }}
                        className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Application Unified Workspace Modal */}
      {selectedAppId && (
        <ApplicationWorkspaceModal 
          applicationId={selectedAppId}
          onClose={() => setSelectedAppId(null)}
          onRefresh={loadApplications}
          currentUser={user}
        />
      )}

      {/* New Application Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="bg-slate-900 text-white p-5 flex justify-between items-center">
              <h3 className="font-bold text-lg">Create New Admission Application</h3>
              <button onClick={() => setShowNewModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateApplication} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600">First Name *</label>
                  <input 
                    type="text" 
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="e.g. Ananya" 
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 mt-1 focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">Last Name *</label>
                  <input 
                    type="text" 
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="e.g. Verma" 
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 mt-1 focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600">Date of Birth</label>
                  <input 
                    type="date" 
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">Gender</label>
                  <select 
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 mt-1"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600">Primary Guardian *</label>
                  <input 
                    type="text" 
                    required
                    value={guardianName}
                    onChange={(e) => setGuardianName(e.target.value)}
                    placeholder="e.g. Ramesh Verma" 
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">Contact Number *</label>
                  <input 
                    type="text" 
                    required
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    placeholder="+91 9876543210" 
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600">Applying For Class Grade</label>
                <select 
                  value={appliedClass}
                  onChange={(e) => setAppliedClass(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 mt-1"
                >
                  <option value="cls_viii">Class VIII</option>
                  <option value="cls_ix">Class IX</option>
                  <option value="cls_x">Class X</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t">
                <button 
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-xs font-bold bg-sky-600 text-white hover:bg-sky-700 rounded-lg shadow-sm"
                >
                  Register Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
