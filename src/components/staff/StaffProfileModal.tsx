import React, { useState, useEffect } from 'react';
import { useStaffContext } from './StaffContext';
import { StaffService } from '../../services/staffService';
import { useNotification } from '../../context/NotificationContext';
import {
  StaffProfile,
  StaffAssignment,
  StaffQualification,
  StaffCertification,
  StaffDocument,
  StaffLeaveBalance,
  StaffEmploymentHistory,
  StaffStatus
} from '../../types';
import {
  X,
  User,
  Mail,
  Phone,
  Building,
  Calendar,
  Award,
  FileText,
  Clock,
  Briefcase,
  CheckCircle2,
  AlertTriangle,
  History,
  Shield,
  Download
} from 'lucide-react';

interface StaffProfileModalProps {
  staff: StaffProfile | null;
  onClose: () => void;
}

export const StaffProfileModal: React.FC<StaffProfileModalProps> = ({ staff, onClose }) => {
  const { tenantId, currentUser, refreshAll, departments } = useStaffContext();
  const { notify } = useNotification();

  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'assignments' | 'qualifications' | 'documents' | 'leave' | 'history'>('overview');
  const [assignments, setAssignments] = useState<StaffAssignment[]>([]);
  const [qualifications, setQualifications] = useState<StaffQualification[]>([]);
  const [certifications, setCertifications] = useState<StaffCertification[]>([]);
  const [documents, setDocuments] = useState<StaffDocument[]>([]);
  const [leaveBalances, setLeaveBalances] = useState<StaffLeaveBalance[]>([]);
  const [history, setHistory] = useState<StaffEmploymentHistory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Status transition state
  const [showStatusChange, setShowStatusChange] = useState<boolean>(false);
  const [newStatus, setNewStatus] = useState<StaffStatus>(staff?.status || 'ACTIVE');
  const [statusReason, setStatusReason] = useState<string>('');

  useEffect(() => {
    if (!staff) return;
    setLoading(true);
    Promise.all([
      StaffService.getStaffAssignments(tenantId, staff.id),
      StaffService.getQualifications(tenantId, staff.id),
      StaffService.getCertifications(tenantId, staff.id),
      StaffService.getStaffDocuments(tenantId, staff.id),
      StaffService.getLeaveBalances(tenantId, staff.id),
      StaffService.getEmploymentHistory(tenantId, staff.id)
    ])
      .then(([assignData, qualData, certData, docData, balData, histData]) => {
        setAssignments(assignData);
        setQualifications(qualData);
        setCertifications(certData);
        setDocuments(docData);
        setLeaveBalances(balData);
        setHistory(histData);
      })
      .catch((err) => {
        console.error('Failed to load profile details:', err);
      })
      .finally(() => setLoading(false));
  }, [staff, tenantId]);

  if (!staff) return null;

  const handleStatusUpdate = async () => {
    if (!statusReason.trim()) {
      notify('warning', 'Reason Required', 'Please provide an administrative reason for this status change.');
      return;
    }

    try {
      await StaffService.updateStaffStatus(
        tenantId,
        staff.id,
        newStatus,
        statusReason.trim(),
        currentUser
      );
      notify('success', 'Status Updated', `Staff status changed to ${newStatus}.`);
      setShowStatusChange(false);
      setStatusReason('');
      await refreshAll();
      onClose();
    } catch (err: any) {
      notify('error', 'Update Failed', err.message || 'Could not update staff status.');
    }
  };

  const getStatusBadge = (status: StaffStatus) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'ON_LEAVE':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'SUSPENDED':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'TERMINATED':
      case 'RESIGNED':
      case 'RETIRED':
        return 'bg-slate-200 text-slate-700 border-slate-300';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-150 my-6">
        {/* Profile Header Banner */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-t-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-blue-500/20 border-2 border-white/20 flex items-center justify-center text-white font-bold text-xl">
              {staff.fullName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-bold">{staff.fullName}</h3>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadge(staff.status)}`}>
                  {staff.status}
                </span>
              </div>
              <p className="text-slate-300 text-xs mt-0.5">
                {staff.designation} • {staff.department} • <span className="font-mono">{staff.employeeNumber}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowStatusChange(!showStatusChange)}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer"
            >
              Change Status
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Status Transition Panel */}
        {showStatusChange && (
          <div className="bg-amber-50 p-4 border-b border-amber-200 space-y-3">
            <div className="flex items-center gap-2 text-amber-800 text-xs font-bold uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4" />
              Administrative Lifecycle Transition
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-amber-900 mb-1">New Lifecycle Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as StaffStatus)}
                  className="w-full px-2.5 py-1.5 border border-amber-300 rounded-md text-xs bg-white text-slate-800"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="ON_LEAVE">ON_LEAVE</option>
                  <option value="PROBATION">PROBATION</option>
                  <option value="SUSPENDED">SUSPENDED</option>
                  <option value="NOTICE_PERIOD">NOTICE_PERIOD</option>
                  <option value="RESIGNED">RESIGNED</option>
                  <option value="RETIRED">RETIRED</option>
                  <option value="TERMINATED">TERMINATED</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-amber-900 mb-1">Reason / Board Authorization</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Approved sabbatical / Annual contract renewal"
                    value={statusReason}
                    onChange={(e) => setStatusReason(e.target.value)}
                    className="flex-1 px-2.5 py-1.5 border border-amber-300 rounded-md text-xs bg-white"
                  />
                  <button
                    onClick={handleStatusUpdate}
                    className="px-3 py-1.5 bg-amber-700 hover:bg-amber-800 text-white font-medium text-xs rounded-md cursor-pointer"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 px-6 bg-slate-50 gap-2 overflow-x-auto">
          {[
            { id: 'overview', label: 'Demographics & Placement', icon: User },
            { id: 'assignments', label: `Duties (${assignments.length})`, icon: Briefcase },
            { id: 'qualifications', label: `Credentials (${qualifications.length + certifications.length})`, icon: Award },
            { id: 'documents', label: `Documents (${documents.length})`, icon: FileText },
            { id: 'leave', label: 'Leave Quota', icon: Calendar },
            { id: 'history', label: 'Audit Trail', icon: History }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`py-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'border-blue-600 text-blue-600 bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Modal Body Container */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Overview Tab */}
          {activeSubTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact & Demographics */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-600" />
                    Personal & Contact Details
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">Legal Name:</span>
                      <span className="font-semibold text-slate-800">{staff.fullName}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">Email:</span>
                      <span className="font-semibold text-slate-800">{staff.email}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">Phone:</span>
                      <span className="font-semibold text-slate-800">{staff.phone || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">Gender:</span>
                      <span className="font-semibold text-slate-800">{staff.gender}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Emergency Contact:</span>
                      <span className="font-semibold text-slate-800">
                        {staff.emergencyContact
                          ? `${staff.emergencyContact.name} (${staff.emergencyContact.phone})`
                          : 'Not Provided'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Placement & Contract */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <Building className="w-4 h-4 text-blue-600" />
                    Employment & Placement
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">Department:</span>
                      <span className="font-semibold text-slate-800">{staff.department}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">Designation:</span>
                      <span className="font-semibold text-slate-800">{staff.designation}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">Contract Type:</span>
                      <span className="font-semibold text-slate-800">{staff.employmentType}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">Category:</span>
                      <span className="font-semibold text-slate-800">{staff.employmentCategory}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Joining Date:</span>
                      <span className="font-semibold text-slate-800">{staff.joiningDate}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Assignments Tab */}
          {activeSubTab === 'assignments' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-800">Assigned Courses, Classes & Duties</h4>
              </div>
              {assignments.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs border border-dashed rounded-lg">
                  No active academic or administrative assignments found.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {assignments.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between"
                    >
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">
                          {item.assignmentType}: {item.subjectName || item.dutyName || 'Institutional Role'}
                        </span>
                        <span className="text-xs text-slate-500">
                          {item.className ? `Class: ${item.className} • ` : ''}
                          {item.periodsPerWeek ? `${item.periodsPerWeek} periods/wk • ` : ''}
                          Status: {item.status}
                        </span>
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-1 bg-white border border-slate-200 rounded-md text-slate-700">
                        {item.role}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Qualifications Tab */}
          {activeSubTab === 'qualifications' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-bold text-slate-800 mb-3">Academic Degrees & Qualifications</h4>
                <div className="space-y-2">
                  {qualifications.map((q) => (
                    <div key={q.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">{q.degreeTitle} ({q.qualificationLevel})</span>
                        <span className="text-xs text-slate-500">{q.institution} • Graduated {q.graduationYear}</span>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${q.verified ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                        {q.verified ? 'Verified' : 'Pending Verification'}
                      </span>
                    </div>
                  ))}
                  {qualifications.length === 0 && <p className="text-xs text-slate-400 italic">No degrees logged.</p>}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-800 mb-3">Certifications & Licenses</h4>
                <div className="space-y-2">
                  {certifications.map((c) => (
                    <div key={c.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">{c.certificateName}</span>
                        <span className="text-xs text-slate-500">{c.issuingAuthority} • Issued {c.issueDate}</span>
                      </div>
                      <span className="text-xs font-mono text-slate-600">{c.credentialNumber || 'No ID'}</span>
                    </div>
                  ))}
                  {certifications.length === 0 && <p className="text-xs text-slate-400 italic">No certifications logged.</p>}
                </div>
              </div>
            </div>
          )}

          {/* Documents Tab */}
          {activeSubTab === 'documents' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-800">HR Records & Official Credentials</h4>
              <div className="space-y-2">
                {documents.map((doc) => (
                  <div key={doc.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">{doc.documentTitle}</span>
                        <span className="text-xs text-slate-500">{doc.category} • Uploaded {doc.createdAt.split('T')[0]}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${doc.verificationStatus === 'VERIFIED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                        {doc.verificationStatus}
                      </span>
                    </div>
                  </div>
                ))}
                {documents.length === 0 && <p className="text-xs text-slate-400 italic">No uploaded documents.</p>}
              </div>
            </div>
          )}

          {/* Leave Quota Tab */}
          {activeSubTab === 'leave' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-800">Annual Leave Entitlements & Balances</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {leaveBalances.map((bal) => (
                  <div key={bal.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
                    <span className="text-xs font-bold text-slate-700 block uppercase">{bal.leaveTypeCode}</span>
                    <span className="text-2xl font-black text-slate-900 my-1 block">{bal.remainingDays}</span>
                    <span className="text-xs text-slate-500">
                      {bal.usedDays} used / {bal.allocatedDays + bal.carryForwardDays} total
                    </span>
                  </div>
                ))}
                {leaveBalances.length === 0 && (
                  <div className="col-span-3 text-center py-6 text-slate-400 text-xs">
                    No leave balances allocated for the current academic year.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeSubTab === 'history' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-800">Employment Lifecycle Audit Log</h4>
              <div className="space-y-3">
                {history.map((h) => (
                  <div key={h.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs flex items-start gap-3">
                    <Clock className="w-4 h-4 text-slate-500 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{h.changeType}</span>
                        <span className="text-slate-400">{h.effectiveDate}</span>
                      </div>
                      <p className="text-slate-600 mt-0.5">{h.reason}</p>
                      <span className="text-slate-400 text-xs block mt-1">Authorized by: {h.authorizedByName}</span>
                    </div>
                  </div>
                ))}
                {history.length === 0 && <p className="text-xs text-slate-400 italic">No recorded transitions.</p>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
