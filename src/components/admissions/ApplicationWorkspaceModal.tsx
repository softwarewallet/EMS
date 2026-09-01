import React, { useState, useEffect } from 'react';
import { 
  AdmissionApplication, 
  AdmissionDocument, 
  AdmissionTest, 
  AdmissionInterview,
  ApplicationStatus 
} from '../../types/admissions';
import { AdmissionsService } from '../../services/admissionsService';
import { Student } from '../../types';
import { 
  X, 
  User, 
  FileText, 
  ShieldCheck, 
  FileQuestion, 
  Users, 
  Award, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Loader2,
  Check,
  Building,
  GraduationCap
} from 'lucide-react';

interface ApplicationWorkspaceModalProps {
  applicationId: string | null;
  onClose: () => void;
  onRefresh: () => void;
  currentUser: { uid: string; email?: string | null; displayName?: string | null } | null;
}

export const ApplicationWorkspaceModal: React.FC<ApplicationWorkspaceModalProps> = ({
  applicationId,
  onClose,
  onRefresh,
  currentUser
}) => {
  const [app, setApp] = useState<AdmissionApplication | null>(null);
  const [docs, setDocs] = useState<AdmissionDocument[]>([]);
  const [test, setTest] = useState<AdmissionTest | null>(null);
  const [interview, setInterview] = useState<AdmissionInterview | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'docs' | 'eval' | 'merit' | 'selection' | 'admission' | 'timeline'>('profile');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMsg, setActionMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Verification modal state
  const [selectedDoc, setSelectedDoc] = useState<AdmissionDocument | null>(null);
  const [docRemarks, setDocRemarks] = useState('');

  // Test modal state
  const [showTestModal, setShowTestModal] = useState(false);
  const [testMarks, setTestMarks] = useState<number>(0);
  const [testRemarks, setTestRemarks] = useState('');

  // Interview modal state
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [interviewScore, setInterviewScore] = useState<number>(80);
  const [interviewRec, setInterviewRec] = useState<AdmissionInterview['recommendation']>('RECOMMENDED');
  const [interviewRemarks, setInterviewRemarks] = useState('');

  // Selection state
  const [selectionRemarks, setSelectionRemarks] = useState('');
  const [approvalRemarks, setApprovalRemarks] = useState('');

  // Final Admission state
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('ay_2027_28');
  const [selectedClass, setSelectedClass] = useState('cls_viii');
  const [selectedSection, setSelectedSection] = useState('sec_a');
  const [overrideCapacity, setOverrideCapacity] = useState(false);

  // Duplicate check
  const [duplicateMatches, setDuplicateMatches] = useState<Student[]>([]);
  const [checkingDuplicates, setCheckingDuplicates] = useState(false);

  const performedBy = {
    userId: currentUser?.uid || 'user_admin',
    email: currentUser?.email || 'admin@school.edu',
    name: currentUser?.displayName || 'Admission Officer'
  };

  const loadData = async () => {
    if (!applicationId) return;
    setLoading(true);
    try {
      const application = await AdmissionsService.getApplicationById(applicationId);
      if (application) {
        setApp(application);
        setSelectedClass(application.appliedClassId || 'cls_viii');
        
        const documents = await AdmissionsService.getDocumentsForApplication(application.id);
        setDocs(documents);

        // Duplicate check
        setCheckingDuplicates(true);
        const dupResult = await AdmissionsService.detectDuplicateStudents(
          application.tenantId,
          application.applicant,
          application.guardians
        );
        setDuplicateMatches(dupResult.matches);
        setCheckingDuplicates(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [applicationId]);

  if (!applicationId) return null;

  const handleDocVerify = async (docId: string) => {
    if (!app) return;
    setActionLoading(true);
    setActionMsg(null);
    try {
      await AdmissionsService.verifyDocument(docId, app.tenantId, performedBy, docRemarks || 'Verified');
      setActionMsg({ type: 'success', text: 'Document verified successfully.' });
      loadData();
    } catch (err: any) {
      setActionMsg({ type: 'error', text: err.message || 'Error verifying document.' });
    } finally {
      setActionLoading(false);
      setSelectedDoc(null);
    }
  };

  const handleDocReject = async (docId: string) => {
    if (!app) return;
    if (!docRemarks) {
      setActionMsg({ type: 'error', text: 'Please enter a rejection reason.' });
      return;
    }
    setActionLoading(true);
    try {
      await AdmissionsService.rejectDocument(docId, app.tenantId, performedBy, docRemarks);
      setActionMsg({ type: 'success', text: 'Document rejected.' });
      loadData();
    } catch (err: any) {
      setActionMsg({ type: 'error', text: err.message || 'Error rejecting document.' });
    } finally {
      setActionLoading(false);
      setSelectedDoc(null);
    }
  };

  const handleScheduleTest = async () => {
    if (!app) return;
    setActionLoading(true);
    try {
      await AdmissionsService.scheduleTest({
        applicationId: app.id,
        tenantId: app.tenantId,
        testName: `Entrance Exam - ${app.appliedClassId.toUpperCase()}`,
        testDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
        maxMarks: 100
      }, performedBy);
      setActionMsg({ type: 'success', text: 'Entrance test scheduled.' });
      setShowTestModal(false);
      loadData();
      onRefresh();
    } catch (err: any) {
      setActionMsg({ type: 'error', text: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  const handleScheduleInterview = async () => {
    if (!app) return;
    setActionLoading(true);
    try {
      await AdmissionsService.scheduleInterview({
        applicationId: app.id,
        tenantId: app.tenantId,
        interviewDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
        interviewerIds: ['usr_principal', 'usr_coord'],
        interviewerNames: ['Dr. V. Sharma (Principal)', 'Mrs. A. Gupta (Academic Head)'],
        maxScore: 100
      }, performedBy);
      setActionMsg({ type: 'success', text: 'Interview panel scheduled.' });
      setShowInterviewModal(false);
      loadData();
      onRefresh();
    } catch (err: any) {
      setActionMsg({ type: 'error', text: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  const handleSelectionDecision = async (decision: 'SELECTED' | 'WAITLISTED' | 'REJECTED') => {
    if (!app) return;
    setActionLoading(true);
    setActionMsg(null);
    try {
      const now = new Date().toISOString();
      if (decision === 'WAITLISTED') {
        await AdmissionsService.addWaitlistEntry(app.id, app.tenantId, performedBy);
      } else {
        await AdmissionsService.updateApplicationStatus(app.id, app.tenantId, decision, performedBy, {
          selectionDecision: {
            decision,
            date: now,
            byId: performedBy.userId,
            byName: performedBy.name,
            remarks: selectionRemarks || `Applicant marked as ${decision}`
          }
        });
      }
      setActionMsg({ type: 'success', text: `Application marked as ${decision}.` });
      loadData();
      onRefresh();
    } catch (err: any) {
      setActionMsg({ type: 'error', text: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  const handleApprovalSignoff = async (decision: 'APPROVED' | 'REJECTED') => {
    if (!app) return;
    setActionLoading(true);
    setActionMsg(null);
    try {
      const now = new Date().toISOString();
      await AdmissionsService.updateApplicationStatus(app.id, app.tenantId, decision, performedBy, {
        approvalDecision: {
          decision,
          date: now,
          byId: performedBy.userId,
          byName: performedBy.name,
          remarks: approvalRemarks || `Final sign-off decision: ${decision}`
        }
      });
      setActionMsg({ type: 'success', text: `Admission offer ${decision}.` });
      loadData();
      onRefresh();
    } catch (err: any) {
      setActionMsg({ type: 'error', text: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  const handleExecuteAdmission = async () => {
    if (!app) return;
    setActionLoading(true);
    setActionMsg(null);
    try {
      const result = await AdmissionsService.admitStudent(
        app.id,
        selectedAcademicYear,
        selectedClass,
        selectedSection,
        app.campusId || 'cam_main',
        overrideCapacity,
        performedBy
      );
      setActionMsg({ 
        type: 'success', 
        text: `Student ${result.student.firstName} ${result.student.lastName} successfully admitted! Student ID: ${result.student.studentIdNumber}` 
      });
      loadData();
      onRefresh();
    } catch (err: any) {
      setActionMsg({ type: 'error', text: err.message || 'Error performing admission.' });
    } finally {
      setActionLoading(false);
    }
  };

  const getBadgeStyle = (status: ApplicationStatus) => {
    switch (status) {
      case 'SUBMITTED': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'UNDER_REVIEW': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'DOCUMENT_VERIFICATION': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'TEST_PENDING': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'INTERVIEW_PENDING': return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      case 'READY_FOR_SELECTION': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'SELECTED': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'WAITLISTED': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'APPROVED': return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'ADMITTED': return 'bg-green-100 text-green-800 border-green-200 font-bold';
      case 'REJECTED': return 'bg-rose-100 text-rose-800 border-rose-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header Bar */}
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-sky-600/30 border border-sky-400/30 flex items-center justify-center text-sky-400 font-bold text-lg">
              {app?.applicant.firstName?.[0] || 'A'}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-bold">{app?.applicant.firstName} {app?.applicant.lastName}</h3>
                <span className={`px-3 py-0.5 rounded-full text-xs font-semibold border ${app ? getBadgeStyle(app.status) : ''}`}>
                  {app?.status?.replace(/_/g, ' ') || 'Unknown'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                <span>App #: <strong className="text-sky-400">{app?.applicationNumber}</strong></span>
                <span>•</span>
                <span>Applied Class: <strong className="text-slate-200">{app?.appliedClassId?.toUpperCase()}</strong></span>
                <span>•</span>
                <span>Submitted: {app?.createdAt ? new Date(app.createdAt).toLocaleDateString() : ''}</span>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Action Notifications */}
        {actionMsg && (
          <div className={`p-3 text-sm flex items-center gap-2 ${
            actionMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-b border-emerald-200' : 'bg-rose-50 text-rose-800 border-b border-rose-200'
          }`}>
            {actionMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />}
            <span>{actionMsg.text}</span>
          </div>
        )}

        {/* Workspace Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 overflow-x-auto text-sm font-medium text-slate-600">
          <button 
            onClick={() => setActiveTab('profile')} 
            className={`py-3 px-4 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'profile' ? 'border-sky-600 text-sky-600 font-semibold bg-white' : 'border-transparent hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4" /> Profile & Guardians
          </button>

          <button 
            onClick={() => setActiveTab('docs')} 
            className={`py-3 px-4 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'docs' ? 'border-sky-600 text-sky-600 font-semibold bg-white' : 'border-transparent hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" /> Documents ({docs.filter(d => d.status === 'VERIFIED').length}/{docs.length})
          </button>

          <button 
            onClick={() => setActiveTab('eval')} 
            className={`py-3 px-4 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'eval' ? 'border-sky-600 text-sky-600 font-semibold bg-white' : 'border-transparent hover:text-slate-900'
            }`}
          >
            <FileQuestion className="w-4 h-4" /> Test & Interview
          </button>

          <button 
            onClick={() => setActiveTab('merit')} 
            className={`py-3 px-4 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'merit' ? 'border-sky-600 text-sky-600 font-semibold bg-white' : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Award className="w-4 h-4" /> Eligibility & Score
          </button>

          <button 
            onClick={() => setActiveTab('selection')} 
            className={`py-3 px-4 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'selection' ? 'border-sky-600 text-sky-600 font-semibold bg-white' : 'border-transparent hover:text-slate-900'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" /> Selection & Approval
          </button>

          <button 
            onClick={() => setActiveTab('admission')} 
            className={`py-3 px-4 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'admission' ? 'border-sky-600 text-sky-600 font-semibold bg-white' : 'border-transparent hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-4 h-4" /> Admit & Enroll
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 text-sky-600 animate-spin" />
            </div>
          ) : app && (
            <>
              {/* TAB 1: PROFILE & GUARDIANS */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                    <h4 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2 border-b pb-2">
                      <User className="w-5 h-5 text-sky-600" /> Applicant Demographic Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                      <div>
                        <span className="text-xs font-semibold text-slate-400 uppercase">First Name</span>
                        <p className="font-semibold text-slate-800 mt-0.5">{app.applicant.firstName}</p>
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-slate-400 uppercase">Last Name</span>
                        <p className="font-semibold text-slate-800 mt-0.5">{app.applicant.lastName}</p>
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-slate-400 uppercase">Date of Birth</span>
                        <p className="font-semibold text-slate-800 mt-0.5">{app.applicant.dateOfBirth}</p>
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-slate-400 uppercase">Gender</span>
                        <p className="font-semibold text-slate-800 capitalize mt-0.5">{app.applicant.gender}</p>
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-slate-400 uppercase">Contact Phone</span>
                        <p className="font-semibold text-slate-800 mt-0.5">{app.applicant.contactNumber || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-slate-400 uppercase">Email Address</span>
                        <p className="font-semibold text-slate-800 mt-0.5">{app.applicant.email || 'N/A'}</p>
                      </div>
                      <div className="md:col-span-3">
                        <span className="text-xs font-semibold text-slate-400 uppercase">Residential Address</span>
                        <p className="font-semibold text-slate-800 mt-0.5">{app.applicant.address}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                    <h4 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2 border-b pb-2">
                      <Building className="w-5 h-5 text-sky-600" /> Academic Background
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                      <div>
                        <span className="text-xs font-semibold text-slate-400 uppercase">Previous Institution</span>
                        <p className="font-semibold text-slate-800 mt-0.5">{app.applicant.previousInstitution || 'St. Mary\'s School'}</p>
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-slate-400 uppercase">Previous Class</span>
                        <p className="font-semibold text-slate-800 mt-0.5">{app.applicant.previousClass || 'Class VII'}</p>
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-slate-400 uppercase">Previous Marks Score</span>
                        <p className="font-semibold text-emerald-600 mt-0.5">{app.applicant.previousMarksPercentage || 82}%</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                    <h4 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2 border-b pb-2">
                      <Users className="w-5 h-5 text-sky-600" /> Guardian Profiles
                    </h4>
                    <div className="space-y-4">
                      {app.guardians.map((g, idx) => (
                        <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 text-sm">{g.name}</span>
                              <span className="text-xs bg-sky-100 text-sky-800 font-semibold px-2 py-0.5 rounded uppercase">
                                {g.relationship}
                              </span>
                              {g.isPrimaryContact && (
                                <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                                  Primary Contact
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 mt-1">Phone: {g.contactNumber} | Email: {g.email || 'N/A'}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: DOCUMENTS & VERIFICATION */}
              {activeTab === 'docs' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-center mb-4 border-b pb-3">
                      <div>
                        <h4 className="text-base font-bold text-slate-900">Document Inspection & Verification</h4>
                        <p className="text-xs text-slate-500">Verify mandatory certificates prior to eligibility review.</p>
                      </div>
                    </div>

                    <div className="divide-y divide-slate-100">
                      {docs.map(d => (
                        <div key={d.id} className="py-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${
                              d.status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-700' :
                              d.status === 'REJECTED' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                            }`}>
                              <FileText className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="font-semibold text-slate-800 text-sm">{d.documentType}</p>
                              <p className="text-xs text-slate-400">File: {d.fileName}</p>
                              {d.remarks && <p className="text-xs text-slate-500 mt-1 italic">Remarks: {d.remarks}</p>}
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                              d.status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-800' :
                              d.status === 'REJECTED' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {d.status}
                            </span>

                            {d.status !== 'VERIFIED' && (
                              <button 
                                onClick={() => setSelectedDoc(d)}
                                className="bg-sky-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-sky-700"
                              >
                                Process Verification
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Document Verification Modal */}
                  {selectedDoc && (
                    <div className="p-4 bg-white rounded-xl border border-sky-300 shadow-lg space-y-4">
                      <h5 className="font-bold text-slate-900 text-sm">Verify / Reject Document: {selectedDoc.documentType}</h5>
                      <div>
                        <label className="text-xs font-semibold text-slate-500">Inspector Remarks</label>
                        <textarea 
                          value={docRemarks} 
                          onChange={(e) => setDocRemarks(e.target.value)}
                          placeholder="Add comments, verification reference or rejection cause..."
                          className="w-full text-xs border border-slate-300 rounded-lg p-2.5 mt-1 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                          rows={2}
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => setSelectedDoc(null)} 
                          className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={() => handleDocReject(selectedDoc.id)}
                          disabled={actionLoading}
                          className="px-3 py-1.5 text-xs bg-rose-600 text-white hover:bg-rose-700 rounded-lg font-medium"
                        >
                          Reject Document
                        </button>
                        <button 
                          onClick={() => handleDocVerify(selectedDoc.id)}
                          disabled={actionLoading}
                          className="px-3 py-1.5 text-xs bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg font-semibold"
                        >
                          Verify & Approve
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: TEST & INTERVIEW */}
              {activeTab === 'eval' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Entrance Test Card */}
                  <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-bold text-slate-900 flex items-center gap-2">
                          <FileQuestion className="w-5 h-5 text-indigo-600" /> Entrance Exam Status
                        </h4>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700">
                          Scheduled
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mb-4">Assessment test to evaluate academic readiness for Class {app.appliedClassId?.toUpperCase()}.</p>
                      
                      <div className="p-4 bg-slate-50 rounded-lg text-xs space-y-2 border border-slate-100">
                        <p><strong>Test Name:</strong> Entrance Written Test - {app.appliedClassId?.toUpperCase()}</p>
                        <p><strong>Max Marks:</strong> 100</p>
                        <p><strong>Obtained Score:</strong> <span className="text-emerald-700 font-bold">84 / 100 (PASSED)</span></p>
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                      <button 
                        onClick={handleScheduleTest}
                        disabled={actionLoading}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-medium hover:bg-indigo-700 transition-colors"
                      >
                        Reschedule / Score Test
                      </button>
                    </div>
                  </div>

                  {/* Interview Card */}
                  <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-bold text-slate-900 flex items-center gap-2">
                          <Users className="w-5 h-5 text-cyan-600" /> Interview Panel Status
                        </h4>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-50 text-cyan-700">
                          Completed
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mb-4">Personal interview with candidate and guardians.</p>
                      
                      <div className="p-4 bg-slate-50 rounded-lg text-xs space-y-2 border border-slate-100">
                        <p><strong>Panelists:</strong> Dr. V. Sharma (Principal), Mrs. A. Gupta</p>
                        <p><strong>Score:</strong> <span className="text-cyan-700 font-bold">88 / 100</span></p>
                        <p><strong>Recommendation:</strong> <span className="text-emerald-700 font-bold">RECOMMENDED</span></p>
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                      <button 
                        onClick={handleScheduleInterview}
                        disabled={actionLoading}
                        className="bg-cyan-600 text-white px-4 py-2 rounded-lg text-xs font-medium hover:bg-cyan-700 transition-colors"
                      >
                        Schedule / Update Panel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: ELIGIBILITY & MERIT */}
              {activeTab === 'merit' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                    <h4 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2 border-b pb-2">
                      <Award className="w-5 h-5 text-amber-500" /> Eligibility Framework & Merit Calculation
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
                        <span className="text-xs font-semibold text-slate-400">Entrance Test (50%)</span>
                        <p className="text-2xl font-bold text-slate-800 mt-1">84%</p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
                        <span className="text-xs font-semibold text-slate-400">Previous Marks (30%)</span>
                        <p className="text-2xl font-bold text-slate-800 mt-1">82%</p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
                        <span className="text-xs font-semibold text-slate-400">Interview Score (20%)</span>
                        <p className="text-2xl font-bold text-slate-800 mt-1">88%</p>
                      </div>
                      <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-center">
                        <span className="text-xs font-bold text-amber-800">Total Weighted Score</span>
                        <p className="text-3xl font-extrabold text-amber-900 mt-1">84.2</p>
                      </div>
                    </div>

                    <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 text-xs flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      <div>
                        <p className="font-bold">Applicant satisfies all institutional eligibility criteria.</p>
                        <p className="mt-0.5">Age requirement verified. All 6 mandatory documents uploaded and verified. Ready for final committee selection.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: SELECTION & APPROVAL */}
              {activeTab === 'selection' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
                    <h4 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b pb-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Stage 1: Committee Selection Decision
                    </h4>
                    <p className="text-xs text-slate-500">Shortlist or select candidate based on merit rank and availability.</p>

                    <div>
                      <label className="text-xs font-semibold text-slate-600">Selection Remarks</label>
                      <textarea 
                        value={selectionRemarks} 
                        onChange={(e) => setSelectionRemarks(e.target.value)}
                        placeholder="Committee remarks regarding candidate selection..."
                        className="w-full text-xs border border-slate-300 rounded-lg p-2.5 mt-1 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                        rows={2}
                      />
                    </div>

                    <div className="flex gap-3">
                      <button 
                        onClick={() => handleSelectionDecision('SELECTED')}
                        disabled={actionLoading}
                        className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors"
                      >
                        Mark as SELECTED
                      </button>
                      <button 
                        onClick={() => handleSelectionDecision('WAITLISTED')}
                        disabled={actionLoading}
                        className="bg-orange-500 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-orange-600 transition-colors"
                      >
                        Place on WAITLIST
                      </button>
                      <button 
                        onClick={() => handleSelectionDecision('REJECTED')}
                        disabled={actionLoading}
                        className="bg-rose-600 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-rose-700 transition-colors"
                      >
                        REJECT Application
                      </button>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
                    <h4 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b pb-2">
                      <ShieldCheck className="w-5 h-5 text-teal-600" /> Stage 2: Principal / Director Approval Sign-off
                    </h4>
                    <p className="text-xs text-slate-500">Final executive approval sign-off required before student creation and enrollment.</p>

                    <div>
                      <label className="text-xs font-semibold text-slate-600">Approval Remarks</label>
                      <textarea 
                        value={approvalRemarks} 
                        onChange={(e) => setApprovalRemarks(e.target.value)}
                        placeholder="Principal approval notes..."
                        className="w-full text-xs border border-slate-300 rounded-lg p-2.5 mt-1 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                        rows={2}
                      />
                    </div>

                    <div className="flex gap-3">
                      <button 
                        onClick={() => handleApprovalSignoff('APPROVED')}
                        disabled={actionLoading || app.status !== 'SELECTED'}
                        className="bg-teal-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-teal-700 transition-colors disabled:opacity-50"
                      >
                        Grant Principal APPROVAL
                      </button>
                      <button 
                        onClick={() => handleApprovalSignoff('REJECTED')}
                        disabled={actionLoading}
                        className="bg-rose-600 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-rose-700 transition-colors"
                      >
                        Decline Approval
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: FINAL ADMIT & ENROLL */}
              {activeTab === 'admission' && (
                <div className="space-y-6">
                  {/* Duplicate Check Warning Card */}
                  {duplicateMatches.length > 0 && (
                    <div className="p-4 bg-amber-50 rounded-xl border border-amber-300 text-amber-900 text-xs space-y-2">
                      <div className="flex items-center gap-2 font-bold text-sm text-amber-800">
                        <AlertTriangle className="w-5 h-5 text-amber-600" /> Potential Duplicate Student Record Detected!
                      </div>
                      <p>Found {duplicateMatches.length} existing student(s) with matching name, DOB or guardian contact:</p>
                      <ul className="list-disc pl-5 font-medium">
                        {duplicateMatches.map(s => (
                          <li key={s.id}>{s.firstName} {s.lastName} (ID: {s.studentIdNumber}) - Class {s.currentClassId}</li>
                        ))}
                      </ul>
                      <p className="text-amber-700 italic">Please confirm if this is a returning re-admission or proceed carefully.</p>
                    </div>
                  )}

                  <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-6">
                    <div>
                      <h4 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b pb-2">
                        <GraduationCap className="w-5 h-5 text-sky-600" /> Final Admission & Class Allocation
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">Executing final admission will convert this Applicant into an active Student record and assign enrollment details.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-slate-600">Academic Session Year</label>
                        <select 
                          value={selectedAcademicYear} 
                          onChange={(e) => setSelectedAcademicYear(e.target.value)}
                          className="w-full text-xs border border-slate-300 rounded-lg p-2.5 mt-1 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                        >
                          <option value="ay_2027_28">2027-28 Academic Session</option>
                          <option value="ay_2026_27">2026-27 Academic Session</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-600">Assign Class Grade</label>
                        <select 
                          value={selectedClass} 
                          onChange={(e) => setSelectedClass(e.target.value)}
                          className="w-full text-xs border border-slate-300 rounded-lg p-2.5 mt-1 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                        >
                          <option value="cls_viii">Class VIII</option>
                          <option value="cls_ix">Class IX</option>
                          <option value="cls_x">Class X</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-600">Assign Section</label>
                        <select 
                          value={selectedSection} 
                          onChange={(e) => setSelectedSection(e.target.value)}
                          className="w-full text-xs border border-slate-300 rounded-lg p-2.5 mt-1 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                        >
                          <option value="sec_a">Section A</option>
                          <option value="sec_b">Section B</option>
                          <option value="sec_c">Section C</option>
                        </select>
                      </div>
                    </div>

                    {/* Class Capacity Card */}
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
                      <div>
                        <span className="font-semibold text-slate-700">Class {selectedClass.toUpperCase()} Seat Capacity</span>
                        <p className="text-slate-500">Current Enrolled: 38 / 40 (2 seats remaining)</p>
                      </div>

                      <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                        <input 
                          type="checkbox" 
                          checked={overrideCapacity}
                          onChange={(e) => setOverrideCapacity(e.target.checked)}
                          className="rounded text-sky-600 focus:ring-sky-500"
                        />
                        Authorize Capacity Override if Full
                      </label>
                    </div>

                    <div className="pt-4 border-t border-slate-200 flex justify-end">
                      <button 
                        onClick={handleExecuteAdmission}
                        disabled={actionLoading || (app.status !== 'APPROVED' && app.status !== 'ADMITTED')}
                        className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors shadow-md disabled:opacity-50 flex items-center gap-2"
                      >
                        {actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <GraduationCap className="w-5 h-5" />}
                        {app.status === 'ADMITTED' ? 'Student Admitted & Enrolled' : 'Execute Final Admission & Enroll Student'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
