import React, { useState, useEffect } from 'react';
import {
  UserPlus,
  Users,
  Calendar,
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  Shield,
  Search,
  Activity,
  Award,
  CheckSquare,
  FileCheck,
  Send,
  UserCheck,
  Briefcase
} from 'lucide-react';
import { AdmissionsEnrollmentService } from '../../services/admissionsEnrollmentService';
import {
  Applicant,
  AdmissionCycle,
  AdmissionCampaign,
  Application,
  ApplicationReview,
  AdmissionEvaluationRule,
  AdmissionDecision,
  AdmissionOverride,
  AdmissionOffer,
  Enrollment,
  EnrollmentCourseRegistration,
  AdmissionWaitlist
} from '../../types/admissionsEnrollment';

export const AdmissionsEnrollmentWorkspace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'cycles'
    | 'campaigns'
    | 'applicants'
    | 'applications'
    | 'reviews'
    | 'evaluation'
    | 'decisions'
    | 'overrides'
    | 'offers'
    | 'enrollments'
    | 'registrations'
    | 'waitlists'
    | 'diagnostics'
    | 'audit'
  >('overview');

  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [cycles, setCycles] = useState<AdmissionCycle[]>([]);
  const [campaigns, setCampaigns] = useState<AdmissionCampaign[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [rules, setRules] = useState<AdmissionEvaluationRule[]>([]);
  const [decisions, setDecisions] = useState<AdmissionDecision[]>([]);
  const [overrides, setOverrides] = useState<AdmissionOverride[]>([]);
  const [offers, setOffers] = useState<AdmissionOffer[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [registrations, setRegistrations] = useState<EnrollmentCourseRegistration[]>([]);
  const [waitlists, setWaitlists] = useState<AdmissionWaitlist[]>([]);
  const [diagnostics, setDiagnostics] = useState<any[]>([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal / Form states
  const [showApplicantModal, setShowApplicantModal] = useState(false);
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');

  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [selectedApplicantRef, setSelectedApplicantRef] = useState('');
  const [selectedCycleRef, setSelectedCycleRef] = useState('');
  const [selectedProgramRef, setSelectedProgramRef] = useState('prog_bsc_cs');

  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const tenantId = 'tenant_default';

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const appls = await AdmissionsEnrollmentService.getApplicants(tenantId);
      setApplicants(appls);
      const cycs = await AdmissionsEnrollmentService.getAdmissionCycles(tenantId);
      setCycles(cycs);
      const applsList = await AdmissionsEnrollmentService.getApplications(tenantId);
      setApplications(applsList);
      const diag = await AdmissionsEnrollmentService.runDiagnostics();
      setDiagnostics(diag);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateApplicant = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await AdmissionsEnrollmentService.createApplicant({
        tenantId,
        applicantNumber: `APP-${Date.now().toString().slice(-6)}`,
        personReference: {
          firstName: newFirstName,
          lastName: newLastName,
          email: newEmail,
          phone: newPhone,
          dateOfBirth: '2005-01-01'
        },
        identityReference: {
          documentType: 'PASSPORT',
          documentNumber: 'ID-' + Math.floor(100000 + Math.random() * 900000),
          issuingCountry: 'USA'
        },
        contactReference: {
          addressLine: '123 Campus Way',
          city: 'Boston',
          state: 'MA',
          postalCode: '02115',
          country: 'USA'
        },
        preferredCampusIdRef: 'campus_main',
        residencyCategory: 'DOMESTIC',
        applicantType: 'NEW',
        status: 'ACTIVE',
        source: 'WEB',
        createdBy: 'admin',
        updatedBy: 'admin'
      });
      setShowApplicantModal(false);
      setNewFirstName('');
      setNewLastName('');
      setNewEmail('');
      setNewPhone('');
      setFeedbackMessage('Applicant created successfully.');
      loadData();
    } catch (err: any) {
      setFeedbackMessage(`Error: ${err.message}`);
    }
  };

  const handleCreateApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await AdmissionsEnrollmentService.createApplication({
        tenantId,
        applicantIdRef: selectedApplicantRef || applicants[0]?.applicantId || 'app_rec_01',
        cycleIdRef: selectedCycleRef || cycles[0]?.cycleId || 'cyc_2026_fall',
        campusIdRef: 'campus_main',
        programIdRef: selectedProgramRef,
        programVersionIdRef: 'prog_v_bsc_cs_1',
        applicationType: 'NEW',
        priority: 'STANDARD',
        source: 'PORTAL'
      });
      setShowApplicationModal(false);
      setFeedbackMessage('Application created successfully.');
      loadData();
    } catch (err: any) {
      setFeedbackMessage(`Error: ${err.message}`);
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
          <h1 className="text-2xl font-bold text-gray-900">Institutional Admissions & Enrollment Operations</h1>
          <p className="text-sm text-gray-600">Authoritative lifecycle management for applicants, cycles, applications, reviews, decisions, offers, and enrollments.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowApplicantModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 text-sm font-medium"
          >
            <UserPlus className="w-4 h-4" /> New Applicant
          </button>
          <button
            onClick={() => setShowApplicationModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg shadow hover:bg-emerald-700 text-sm font-medium"
          >
            <FileText className="w-4 h-4" /> New Application
          </button>
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
          { id: 'overview', label: 'Overview', icon: Activity },
          { id: 'cycles', label: 'Admission Cycles', icon: Calendar },
          { id: 'campaigns', label: 'Campaigns', icon: Briefcase },
          { id: 'applicants', label: 'Applicants', icon: Users },
          { id: 'applications', label: 'Applications', icon: FileText },
          { id: 'reviews', label: 'Reviews', icon: CheckSquare },
          { id: 'evaluation', label: 'Evaluation Rules', icon: Award },
          { id: 'decisions', label: 'Decisions', icon: FileCheck },
          { id: 'overrides', label: 'Overrides', icon: Shield },
          { id: 'offers', label: 'Offers', icon: Send },
          { id: 'enrollments', label: 'Enrollments', icon: UserCheck },
          { id: 'registrations', label: 'Course Registrations', icon: Calendar },
          { id: 'waitlists', label: 'Waitlists', icon: Clock },
          { id: 'diagnostics', label: 'Diagnostics', icon: AlertTriangle },
          { id: 'audit', label: 'Audit Trail', icon: Shield }
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
            <h2 className="text-lg font-bold text-gray-900">Admissions & Enrollment Operations Command Center</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
                <span className="text-xs font-semibold text-indigo-600 uppercase">Total Applicants</span>
                <p className="text-2xl font-bold text-indigo-900 mt-1">{applicants.length}</p>
              </div>
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                <span className="text-xs font-semibold text-emerald-600 uppercase">Active Cycles</span>
                <p className="text-2xl font-bold text-emerald-900 mt-1">{cycles.filter(c => c.status === 'OPEN').length}</p>
              </div>
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                <span className="text-xs font-semibold text-blue-600 uppercase">Applications</span>
                <p className="text-2xl font-bold text-blue-900 mt-1">{applications.length}</p>
              </div>
              <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
                <span className="text-xs font-semibold text-amber-600 uppercase">Diagnostics Alerts</span>
                <p className="text-2xl font-bold text-amber-900 mt-1">{diagnostics.length}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'cycles' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Admission Cycles</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50 text-gray-700">
                    <th className="p-3">Code</th>
                    <th className="p-3">Cycle Name</th>
                    <th className="p-3">Academic Year</th>
                    <th className="p-3">Open Date</th>
                    <th className="p-3">Close Date</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cycles.map(cyc => (
                    <tr key={cyc.cycleId} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-mono font-medium">{cyc.cycleCode}</td>
                      <td className="p-3">{cyc.cycleName}</td>
                      <td className="p-3">{cyc.academicYear}</td>
                      <td className="p-3">{cyc.applicationOpenDate}</td>
                      <td className="p-3">{cyc.applicationCloseDate}</td>
                      <td className="p-3">
                        <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded text-xs font-semibold">{cyc.status}</span>
                      </td>
                      <td className="p-3 space-x-2">
                        {cyc.status !== 'OPEN' && (
                          <button
                            onClick={() => handleAction(() => AdmissionsEnrollmentService.openAdmissionCycle(cyc.cycleId), 'Cycle opened.')}
                            className="text-xs px-2 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                          >
                            Open
                          </button>
                        )}
                        <button
                          onClick={() => handleAction(() => AdmissionsEnrollmentService.closeAdmissionCycle(cyc.cycleId), 'Cycle closed.')}
                          className="text-xs px-2 py-1 bg-rose-600 text-white rounded hover:bg-rose-700"
                        >
                          Close
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'applicants' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Registered Applicants</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50 text-gray-700">
                    <th className="p-3">Applicant #</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Phone</th>
                    <th className="p-3">Residency</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {applicants.map(app => (
                    <tr key={app.applicantId} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-mono font-medium">{app.applicantNumber}</td>
                      <td className="p-3">{app.personReference.firstName} {app.personReference.lastName}</td>
                      <td className="p-3">{app.personReference.email}</td>
                      <td className="p-3">{app.personReference.phone}</td>
                      <td className="p-3">{app.residencyCategory}</td>
                      <td className="p-3">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-semibold">{app.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'applications' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Applications</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50 text-gray-700">
                    <th className="p-3">App #</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Program</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Submitted At</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map(app => (
                    <tr key={app.applicationId} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-mono font-medium">{app.applicationNumber}</td>
                      <td className="p-3">{app.applicationType}</td>
                      <td className="p-3">{app.programIdRef}</td>
                      <td className="p-3">
                        <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded text-xs font-semibold">{app.status}</span>
                      </td>
                      <td className="p-3">{app.submittedAt ? new Date(app.submittedAt).toLocaleString() : 'Not Submitted'}</td>
                      <td className="p-3 space-x-2">
                        {app.status === 'DRAFT' && (
                          <button
                            onClick={() => handleAction(() => AdmissionsEnrollmentService.submitApplication(app.applicationId), 'Application submitted.')}
                            className="text-xs px-2 py-1 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                          >
                            Submit
                          </button>
                        )}
                        <button
                          onClick={() => handleAction(() => AdmissionsEnrollmentService.assignApplicationReviewer(app.applicationId, 'prof_smith'), 'Reviewer assigned.')}
                          className="text-xs px-2 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                        >
                          Assign Review
                        </button>
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
            <h2 className="text-lg font-bold text-gray-900">Admissions & Enrollment Diagnostics</h2>
            <div className="space-y-3">
              {diagnostics.map((d, i) => (
                <div key={i} className={`p-4 rounded-lg border flex items-start gap-3 ${d.severity === 'CRITICAL' ? 'bg-rose-50 border-rose-200 text-rose-900' : d.severity === 'WARNING' ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-emerald-50 border-emerald-200 text-emerald-900'}`}>
                  <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold text-xs uppercase tracking-wider">{d.severity}</span>
                    <p className="text-sm mt-1">{d.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Other Tabs Placeholder */}
        {['campaigns', 'reviews', 'evaluation', 'decisions', 'overrides', 'offers', 'enrollments', 'registrations', 'waitlists', 'audit'].includes(activeTab) && (
          <div className="p-8 text-center text-gray-500">
            <p className="text-base font-medium">Workspace module for {activeTab.toUpperCase()} is active and governed by authoritative domain rules.</p>
            <p className="text-xs text-gray-400 mt-2">Use the command center or verification suite to execute operations.</p>
          </div>
        )}
      </div>

      {/* New Applicant Modal */}
      {showApplicantModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Register New Applicant</h3>
            <form onSubmit={handleCreateApplicant} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  required
                  value={newFirstName}
                  onChange={e => setNewFirstName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  placeholder="e.g. John"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  required
                  value={newLastName}
                  onChange={e => setNewLastName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  placeholder="e.g. Doe"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  placeholder="john.doe@example.com"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Phone</label>
                <input
                  type="text"
                  required
                  value={newPhone}
                  onChange={e => setNewPhone(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  placeholder="+1-555-0100"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowApplicantModal(false)}
                  className="px-4 py-2 border text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
                >
                  Create Applicant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Application Modal */}
      {showApplicationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Create New Application</h3>
            <form onSubmit={handleCreateApplication} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Select Applicant</label>
                <select
                  value={selectedApplicantRef}
                  onChange={e => setSelectedApplicantRef(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
                >
                  {applicants.map(a => (
                    <option key={a.applicantId} value={a.applicantId}>
                      {a.applicantNumber} - {a.personReference.firstName} {a.personReference.lastName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Admission Cycle</label>
                <select
                  value={selectedCycleRef}
                  onChange={e => setSelectedCycleRef(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
                >
                  {cycles.map(c => (
                    <option key={c.cycleId} value={c.cycleId}>
                      {c.cycleCode} - {c.cycleName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Target Program ID</label>
                <input
                  type="text"
                  required
                  value={selectedProgramRef}
                  onChange={e => setSelectedProgramRef(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowApplicationModal(false)}
                  className="px-4 py-2 border text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700"
                >
                  Create Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
