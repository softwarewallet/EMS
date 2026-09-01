import React, { useState } from 'react';
import { useStaffContext } from './StaffContext';
import { StaffService } from '../../services/staffService';
import { useNotification } from '../../context/NotificationContext';
import {
  EmploymentType,
  EmploymentCategory,
  StaffStatus,
  Gender
} from '../../types';
import { X, UserPlus, Save, AlertCircle } from 'lucide-react';

interface OnboardStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardStaffModal: React.FC<OnboardStaffModalProps> = ({ isOpen, onClose }) => {
  const { tenantId, selectedCampusId, campuses, currentUser, departments, designations, refreshAll } = useStaffContext();
  const { notify } = useNotification();

  const [campusId, setCampusId] = useState<string>(selectedCampusId || (campuses[0]?.id || ''));
  const [fullName, setFullName] = useState<string>('');
  const [preferredName, setPreferredName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [gender, setGender] = useState<Gender>('PREFER_NOT_TO_SAY');
  const [dateOfBirth, setDateOfBirth] = useState<string>('');
  const [department, setDepartment] = useState<string>(departments[0]?.name || 'General Administration');
  const [designation, setDesignation] = useState<string>('Faculty Member');
  const [employmentType, setEmploymentType] = useState<EmploymentType>('PERMANENT');
  const [employmentCategory, setEmploymentCategory] = useState<EmploymentCategory>('TEACHING');
  const [joiningDate, setJoiningDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [employeeCode, setEmployeeCode] = useState<string>('');
  const [customEmployeeNumber, setCustomEmployeeNumber] = useState<string>('');
  const [emergencyName, setEmergencyName] = useState<string>('');
  const [emergencyPhone, setEmergencyPhone] = useState<string>('');
  const [emergencyRelation, setEmergencyRelation] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !joiningDate) {
      setErrorMsg('Please fill in all mandatory fields (Name, Email, Joining Date).');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const created = await StaffService.createStaff(
        tenantId,
        {
          tenantId,
          campusId: campusId || selectedCampusId || (campuses[0]?.id || ''),
          fullName: fullName.trim(),
          preferredName: preferredName.trim() || undefined,
          email: email.trim(),
          phone: phone.trim(),
          gender,
          dateOfBirth: dateOfBirth || undefined,
          department,
          designation,
          employmentType,
          employmentCategory,
          status: 'ACTIVE',
          joiningDate,
          employeeCode: employeeCode.trim() || `EMP-${Date.now().toString().slice(-4)}`,
          customEmployeeNumber: customEmployeeNumber.trim() || undefined,
          emergencyContact: emergencyName
            ? {
                name: emergencyName.trim(),
                relationship: emergencyRelation.trim() || 'Next of Kin',
                phone: emergencyPhone.trim()
              }
            : undefined
        },
        currentUser
      );

      // Initialize leave quotas
      await StaffService.initializeLeaveBalances(
        tenantId,
        created.id,
        'ay_2026_27',
        created.employmentCategory,
        currentUser
      );

      notify('success', 'Employee Onboarded', `${created.fullName} (${created.employeeNumber}) onboarded successfully.`);

      await refreshAll();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to onboard staff record.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-150 my-8">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Onboard New Employee</h3>
              <p className="text-xs text-slate-500">Register employee master profile, department & credentials</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-sm flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-500 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Basic Identification */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Personal Information</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Full Legal Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Arthur Pendelton"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Preferred / Display Name</label>
                <input
                  type="text"
                  placeholder="e.g. Arthur"
                  value={preferredName}
                  onChange={(e) => setPreferredName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Institutional Email <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. arthur.p@edutech.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Contact Phone</label>
                <input
                  type="tel"
                  placeholder="e.g. +1 (555) 019-2831"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as Gender)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden bg-white"
                >
                  <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
                  <option value="FEMALE">Female</option>
                  <option value="MALE">Male</option>
                  <option value="NON_BINARY">Non-Binary</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Employment & Placement */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Employment & Department</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Campus Branch</label>
                <select
                  value={campusId}
                  onChange={(e) => setCampusId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden bg-white"
                >
                  {campuses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.isMainCampus ? '(Main)' : ''}
                    </option>
                  ))}
                  {campuses.length === 0 && <option value="main_campus">Main Campus</option>}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Department</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden bg-white"
                >
                  {departments.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                  {departments.length === 0 && (
                    <>
                      <option value="Sciences & Mathematics">Sciences & Mathematics</option>
                      <option value="Humanities & Languages">Humanities & Languages</option>
                      <option value="General Administration">General Administration</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Designation / Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Faculty / Lecturer"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Employment Category</label>
                <select
                  value={employmentCategory}
                  onChange={(e) => setEmploymentCategory(e.target.value as EmploymentCategory)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden bg-white"
                >
                  <option value="TEACHING">Teaching / Faculty</option>
                  <option value="NON_TEACHING">Non-Teaching</option>
                  <option value="ADMINISTRATIVE">Administrative</option>
                  <option value="MANAGEMENT">Management</option>
                  <option value="SUPPORT_STAFF">Support Staff</option>
                  <option value="TECHNICAL">Technical / IT</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Employment Contract Type</label>
                <select
                  value={employmentType}
                  onChange={(e) => setEmploymentType(e.target.value as EmploymentType)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden bg-white"
                >
                  <option value="PERMANENT">Permanent / Regular</option>
                  <option value="PROBATION">Probation</option>
                  <option value="CONTRACT">Contractual</option>
                  <option value="PART_TIME">Part-Time</option>
                  <option value="VISITING">Visiting Faculty</option>
                  <option value="CONSULTANT">Consultant</option>
                  <option value="INTERN">Intern</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Joining Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={joiningDate}
                  onChange={(e) => setJoiningDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Custom Employee Number (Optional)</label>
                <input
                  type="text"
                  placeholder="Auto-generated if blank (e.g. EMP-2026-0005)"
                  value={customEmployeeNumber}
                  onChange={(e) => setCustomEmployeeNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Internal Short / Biometric Code</label>
                <input
                  type="text"
                  placeholder="e.g. BIO-501"
                  value={employeeCode}
                  onChange={(e) => setEmployeeCode(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Emergency Contact (Optional)</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Contact Name</label>
                <input
                  type="text"
                  placeholder="e.g. Jane Doe"
                  value={emergencyName}
                  onChange={(e) => setEmergencyName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Relationship</label>
                <input
                  type="text"
                  placeholder="e.g. Spouse / Parent"
                  value={emergencyRelation}
                  onChange={(e) => setEmergencyRelation(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Phone</label>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden"
                />
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50 rounded-b-xl">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-slate-700 hover:bg-slate-200 rounded-lg text-sm font-medium transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-xs transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Onboarding...</span>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Complete Onboarding</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
