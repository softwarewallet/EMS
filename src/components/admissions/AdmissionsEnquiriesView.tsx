import React, { useState, useEffect } from 'react';
import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';
import { AdmissionsService } from '../../services/admissionsService';
import { AdmissionEnquiry, AdmissionSession } from '../../types/admissions';
import { Phone, Mail, User, Search, Loader2, ArrowRight, Plus, X, MessageSquare, CheckCircle2 } from 'lucide-react';

export const AdmissionsEnquiriesView: React.FC = () => {
  const { currentTenant } = useTenant();
  const { user } = useAuth();
  const [enquiries, setEnquiries] = useState<AdmissionEnquiry[]>([]);
  const [sessions, setSessions] = useState<AdmissionSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // New Enquiry Modal State
  const [showNewModal, setShowNewModal] = useState(false);
  const [newApplicantName, setNewApplicantName] = useState('');
  const [newGuardianName, setNewGuardianName] = useState('');
  const [newContactNumber, setNewContactNumber] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newInterestedClass, setNewInterestedClass] = useState('cls_viii');
  const [newSource, setNewSource] = useState<AdmissionEnquiry['source']>('Walk-in');
  const [newRemarks, setNewRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Convert Modal State
  const [convertingEnquiry, setConvertingEnquiry] = useState<AdmissionEnquiry | null>(null);

  const performedBy = {
    userId: user?.uid || 'usr_admin',
    email: user?.email || 'admin@school.edu',
    name: user?.displayName || 'Admission Officer'
  };

  const loadEnquiries = async () => {
    if (!currentTenant) return;
    setLoading(true);
    try {
      const data = await AdmissionsService.getEnquiries(currentTenant.id);
      const sessData = await AdmissionsService.getSessions(currentTenant.id);
      setEnquiries(data);
      setSessions(sessData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnquiries();
  }, [currentTenant]);

  const handleCreateEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTenant || !newApplicantName || !newGuardianName || !newContactNumber) return;

    setSubmitting(true);
    try {
      const activeSess = sessions.find(s => s.status === 'OPEN') || sessions[0];
      await AdmissionsService.createEnquiry({
        tenantId: currentTenant.id,
        sessionId: activeSess?.id || 'sess_default',
        enquiryNumber: '',
        applicantName: newApplicantName,
        guardianName: newGuardianName,
        contactNumber: newContactNumber,
        email: newEmail,
        interestedClassId: newInterestedClass,
        source: newSource,
        remarks: newRemarks,
        status: 'NEW'
      }, performedBy);

      setShowNewModal(false);
      setNewApplicantName('');
      setNewGuardianName('');
      setNewContactNumber('');
      setNewEmail('');
      setNewRemarks('');
      loadEnquiries();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleConvertEnquiry = async (enquiry: AdmissionEnquiry) => {
    if (!currentTenant) return;
    setSubmitting(true);
    try {
      const nameParts = enquiry.applicantName.trim().split(' ');
      const firstName = nameParts[0] || enquiry.applicantName;
      const lastName = nameParts.slice(1).join(' ') || 'Candidate';

      await AdmissionsService.convertEnquiryToApplication(enquiry.id, {
        tenantId: currentTenant.id,
        sessionId: enquiry.sessionId,
        applicationNumber: '',
        applicant: {
          firstName,
          lastName,
          dateOfBirth: '2012-05-10',
          gender: 'male',
          address: 'Main Street Address',
          contactNumber: enquiry.contactNumber,
          email: enquiry.email
        },
        guardians: [{
          name: enquiry.guardianName,
          relationship: 'parent' as any,
          contactNumber: enquiry.contactNumber,
          email: enquiry.email,
          isPrimaryContact: true
        }],
        appliedClassId: enquiry.interestedClassId,
        source: enquiry.source,
        status: 'SUBMITTED',
        remarks: `Converted from enquiry ${enquiry.enquiryNumber}. ${enquiry.remarks}`
      }, performedBy);

      setConvertingEnquiry(null);
      loadEnquiries();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredEnquiries = enquiries.filter(enq => {
    const matchesSearch = enq.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          enq.guardianName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          enq.enquiryNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || enq.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Admission Enquiries & Leads</h2>
          <p className="text-sm text-slate-500">Log incoming enquiries, assign officers, and convert qualified leads to official applications.</p>
        </div>
        <button 
          onClick={() => setShowNewModal(true)}
          className="bg-sky-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-sky-700 transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" /> Log New Enquiry
        </button>
      </div>

      {/* Directory Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-slate-50/50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by candidate name, guardian, or enquiry #..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div className="flex gap-2">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white"
            >
              <option value="">All Enquiry Statuses</option>
              <option value="NEW">New</option>
              <option value="CONTACTED">Contacted</option>
              <option value="FOLLOW_UP">Follow Up</option>
              <option value="CONVERTED">Converted</option>
              <option value="NOT_INTERESTED">Not Interested</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="p-16 flex justify-center">
            <Loader2 className="w-8 h-8 text-sky-600 animate-spin" />
          </div>
        ) : filteredEnquiries.length === 0 ? (
          <div className="p-16 text-center text-slate-400">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="font-semibold text-slate-700">No Admission Enquiries Found</p>
            <p className="text-xs text-slate-500 mt-1">Log an enquiry to begin lead tracking.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs font-semibold border-b">
                <tr>
                  <th className="px-6 py-3">Enquiry No</th>
                  <th className="px-6 py-3">Applicant Name</th>
                  <th className="px-6 py-3">Interested Class</th>
                  <th className="px-6 py-3">Guardian Contact</th>
                  <th className="px-6 py-3">Lead Source</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredEnquiries.map(enq => (
                  <tr key={enq.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">{enq.enquiryNumber}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-sky-600" />
                        <span className="font-semibold text-slate-800">{enq.applicantName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 uppercase font-semibold text-slate-600">{enq.interestedClassId}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-slate-900 font-semibold">{enq.guardianName}</span>
                        <span className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-slate-400" /> {enq.contactNumber}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-semibold">
                        {enq.source}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        enq.status === 'NEW' ? 'bg-blue-100 text-blue-800' :
                        enq.status === 'CONVERTED' ? 'bg-emerald-100 text-emerald-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {enq.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {enq.status !== 'CONVERTED' ? (
                        <button 
                          onClick={() => setConvertingEnquiry(enq)}
                          className="text-sky-600 hover:text-sky-800 font-bold text-xs inline-flex items-center gap-1"
                        >
                          Convert to App <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <span className="text-xs text-emerald-600 font-semibold inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Application Created
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* New Enquiry Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="bg-slate-900 text-white p-5 flex justify-between items-center">
              <h3 className="font-bold text-lg">Log New Admission Enquiry</h3>
              <button onClick={() => setShowNewModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateEnquiry} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600">Applicant Full Name *</label>
                <input 
                  type="text" 
                  required
                  value={newApplicantName}
                  onChange={(e) => setNewApplicantName(e.target.value)}
                  placeholder="e.g. Rahul Sharma" 
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 mt-1 focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600">Guardian Name *</label>
                  <input 
                    type="text" 
                    required
                    value={newGuardianName}
                    onChange={(e) => setNewGuardianName(e.target.value)}
                    placeholder="e.g. Vikram Sharma" 
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 mt-1 focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">Contact Number *</label>
                  <input 
                    type="text" 
                    required
                    value={newContactNumber}
                    onChange={(e) => setNewContactNumber(e.target.value)}
                    placeholder="+91 9876543210" 
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 mt-1 focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600">Interested Class Grade</label>
                  <select 
                    value={newInterestedClass}
                    onChange={(e) => setNewInterestedClass(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 mt-1"
                  >
                    <option value="cls_viii">Class VIII</option>
                    <option value="cls_ix">Class IX</option>
                    <option value="cls_x">Class X</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">Lead Source</label>
                  <select 
                    value={newSource}
                    onChange={(e) => setNewSource(e.target.value as any)}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 mt-1"
                  >
                    <option value="Walk-in">Walk-in</option>
                    <option value="Phone">Phone</option>
                    <option value="Website">Website</option>
                    <option value="Referral">Referral</option>
                    <option value="Advertisement">Advertisement</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600">Remarks / Requirements</label>
                <textarea 
                  value={newRemarks}
                  onChange={(e) => setNewRemarks(e.target.value)}
                  placeholder="Parent requested hostel/transport details..."
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 mt-1"
                  rows={2}
                />
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
                  Save & Register Enquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Convert Enquiry Modal Prompt */}
      {convertingEnquiry && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Convert Enquiry to Admission Application</h3>
            <p className="text-xs text-slate-600">
              Converting enquiry <strong>{convertingEnquiry.enquiryNumber}</strong> ({convertingEnquiry.applicantName}) will pre-fill candidate data into a formal admission application.
            </p>

            <div className="p-3 bg-sky-50 rounded-xl text-xs space-y-1 border border-sky-100">
              <p><strong>Candidate:</strong> {convertingEnquiry.applicantName}</p>
              <p><strong>Guardian:</strong> {convertingEnquiry.guardianName} ({convertingEnquiry.contactNumber})</p>
              <p><strong>Applied Class:</strong> {convertingEnquiry.interestedClassId.toUpperCase()}</p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button 
                onClick={() => setConvertingEnquiry(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleConvertEnquiry(convertingEnquiry)}
                disabled={submitting}
                className="px-4 py-2 text-xs font-bold bg-sky-600 text-white hover:bg-sky-700 rounded-lg shadow-sm"
              >
                Confirm & Create Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
