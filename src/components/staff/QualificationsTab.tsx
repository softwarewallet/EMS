import React, { useState, useEffect } from 'react';
import { useStaffContext } from './StaffContext';
import { StaffService } from '../../services/staffService';
import { useNotification } from '../../context/NotificationContext';
import { StaffQualification, StaffCertification, StaffSkill, QualificationLevel, SkillProficiency } from '../../types';
import {
  Award,
  Plus,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  Calendar,
  Building
} from 'lucide-react';

export const QualificationsTab: React.FC = () => {
  const { tenantId, staffList, currentUser } = useStaffContext();
  const { notify } = useNotification();

  const [selectedStaffId, setSelectedStaffId] = useState<string>(staffList[0]?.id || '');
  const [qualifications, setQualifications] = useState<StaffQualification[]>([]);
  const [certifications, setCertifications] = useState<StaffCertification[]>([]);
  const [skills, setSkills] = useState<StaffSkill[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Add Qualification Modal
  const [showQualModal, setShowQualModal] = useState<boolean>(false);
  const [degreeTitle, setDegreeTitle] = useState<string>('');
  const [level, setLevel] = useState<QualificationLevel>('BACHELORS');
  const [institution, setInstitution] = useState<string>('');
  const [fieldOfStudy, setFieldOfStudy] = useState<string>('');
  const [gradYear, setGradYear] = useState<number>(2020);

  // Add Certification Modal
  const [showCertModal, setShowCertModal] = useState<boolean>(false);
  const [certName, setCertName] = useState<string>('');
  const [issuingAuthority, setIssuingAuthority] = useState<string>('');
  const [issueDate, setIssueDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [expiryDate, setExpiryDate] = useState<string>('');
  const [credNumber, setCredNumber] = useState<string>('');

  // Add Skill Modal
  const [showSkillModal, setShowSkillModal] = useState<boolean>(false);
  const [skillName, setSkillName] = useState<string>('');
  const [skillCategory, setSkillCategory] = useState<string>('Pedagogy');
  const [proficiency, setProficiency] = useState<SkillProficiency>('ADVANCED');

  const loadStaffData = async () => {
    if (!selectedStaffId) return;
    setLoading(true);
    try {
      const [qData, cData, sData] = await Promise.all([
        StaffService.getQualifications(tenantId, selectedStaffId),
        StaffService.getCertifications(tenantId, selectedStaffId),
        StaffService.getSkills(tenantId, selectedStaffId)
      ]);
      setQualifications(qData);
      setCertifications(cData);
      setSkills(sData);
    } catch (err: any) {
      console.error('Failed to load qualifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStaffData();
  }, [tenantId, selectedStaffId]);

  const handleAddQualification = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await StaffService.addQualification(
        tenantId,
        {
          tenantId,
          staffId: selectedStaffId,
          qualificationType: level,
          degreeTitle: degreeTitle.trim(),
          fieldOfStudy: fieldOfStudy.trim(),
          institution: institution.trim(),
          yearOfPassing: Number(gradYear),
          verificationStatus: 'PENDING'
        },
        currentUser
      );
      notify('success', 'Degree Added', 'Academic qualification record logged.');
      setShowQualModal(false);
      setDegreeTitle('');
      setInstitution('');
      setFieldOfStudy('');
      await loadStaffData();
    } catch (err: any) {
      notify('error', 'Save Failed', err.message || 'Could not save degree.');
    }
  };

  const handleAddCertification = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await StaffService.addCertification(
        tenantId,
        {
          tenantId,
          staffId: selectedStaffId,
          title: certName.trim(),
          issuingOrganization: issuingAuthority.trim(),
          issueDate,
          expiryDate: expiryDate || undefined,
          credentialId: credNumber.trim() || undefined,
          verificationStatus: 'PENDING'
        },
        currentUser
      );
      notify('success', 'Certification Added', 'Professional certification recorded.');
      setShowCertModal(false);
      setCertName('');
      setIssuingAuthority('');
      setCredNumber('');
      await loadStaffData();
    } catch (err: any) {
      notify('error', 'Save Failed', err.message || 'Could not save certification.');
    }
  };

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await StaffService.addSkill(
        tenantId,
        {
          tenantId,
          staffId: selectedStaffId,
          skillName: skillName.trim(),
          category: skillCategory.trim(),
          proficiencyLevel: proficiency
        }
      );
      notify('success', 'Competency Logged', 'Skill tag added to faculty profile.');
      setShowSkillModal(false);
      setSkillName('');
      await loadStaffData();
    } catch (err: any) {
      notify('error', 'Save Failed', err.message || 'Could not save skill.');
    }
  };

  const handleVerifyQualification = async (qualId: string) => {
    try {
      await StaffService.verifyQualification(tenantId, qualId, 'VERIFIED', currentUser);
      notify('success', 'Degree Verified', 'Academic qualification marked as verified.');
      await loadStaffData();
    } catch (err: any) {
      notify('error', 'Verification Failed', err.message || 'Could not verify degree.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Selector */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-600" />
            Qualifications, Certifications & Competency Matrix
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit faculty degrees, state teaching licenses, professional certifications, and subject competency tags.
          </p>
        </div>

        <div className="w-full sm:w-72">
          <label className="block text-xs font-semibold text-slate-500 mb-1">Select Employee</label>
          <select
            value={selectedStaffId}
            onChange={(e) => setSelectedStaffId(e.target.value)}
            className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm bg-white"
          >
            {staffList.map((s) => (
              <option key={s.id} value={s.id}>
                {s.fullName} ({s.department})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 3 Main Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Academic Degrees */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-indigo-600" />
              Academic Degrees ({qualifications.length})
            </h4>
            <button
              onClick={() => setShowQualModal(true)}
              className="p-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer"
              title="Add Degree"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {qualifications.map((q) => (
              <div key={q.id} className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-bold text-slate-900 text-xs block">{q.degreeTitle}</span>
                    <span className="text-xs text-slate-500">{q.fieldOfStudy}</span>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-700">
                    {q.qualificationLevel}
                  </span>
                </div>
                <div className="text-xs text-slate-500 flex items-center justify-between pt-1 border-t border-slate-200/60">
                  <span>{q.institution} ({q.graduationYear})</span>
                  {q.verified ? (
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                    </span>
                  ) : (
                    <button
                      onClick={() => handleVerifyQualification(q.id)}
                      className="text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
                    >
                      Verify Now
                    </button>
                  )}
                </div>
              </div>
            ))}
            {qualifications.length === 0 && (
              <p className="text-center py-6 text-slate-400 text-xs italic">No degrees logged for this faculty member.</p>
            )}
          </div>
        </div>

        {/* Certifications */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Licenses & Certs ({certifications.length})
            </h4>
            <button
              onClick={() => setShowCertModal(true)}
              className="p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
              title="Add Certification"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {certifications.map((c) => (
              <div key={c.id} className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-bold text-slate-900 text-xs block">{c.certificateName}</span>
                    <span className="text-xs text-slate-500">{c.issuingAuthority}</span>
                  </div>
                  <span className="text-xs font-mono text-slate-500">{c.credentialNumber || 'ID N/A'}</span>
                </div>
                <div className="text-xs text-slate-500 flex items-center justify-between pt-1 border-t border-slate-200/60">
                  <span>Issued: {c.issueDate}</span>
                  {c.expiryDate && (
                    <span className="text-amber-700 font-medium">Expires: {c.expiryDate}</span>
                  )}
                </div>
              </div>
            ))}
            {certifications.length === 0 && (
              <p className="text-center py-6 text-slate-400 text-xs italic">No professional licenses logged.</p>
            )}
          </div>
        </div>

        {/* Competencies & Skills */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              Skill Tags ({skills.length})
            </h4>
            <button
              onClick={() => setShowSkillModal(true)}
              className="p-1.5 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-lg transition-colors cursor-pointer"
              title="Add Skill"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {skills.map((s) => (
              <span
                key={s.id}
                className="px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 flex items-center gap-2"
              >
                <span>{s.skillName}</span>
                <span className="px-1.5 py-0.5 bg-white rounded text-[10px] font-bold text-blue-600 border border-slate-200">
                  {s.proficiency}
                </span>
              </span>
            ))}
            {skills.length === 0 && (
              <p className="text-center py-6 text-slate-400 text-xs italic w-full">No competency tags registered.</p>
            )}
          </div>
        </div>
      </div>

      {/* Add Qualification Modal */}
      {showQualModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Add Academic Degree</h3>
            <form onSubmit={handleAddQualification} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Degree Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master of Science"
                  value={degreeTitle}
                  onChange={(e) => setDegreeTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Level</label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value as QualificationLevel)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                >
                  <option value="DOCTORATE">Doctorate (Ph.D / Ed.D)</option>
                  <option value="MASTERS">Masters (M.Sc / M.A / M.Ed)</option>
                  <option value="POST_GRADUATE_DIPLOMA">Post-Graduate Diploma</option>
                  <option value="BACHELORS">Bachelors (B.Sc / B.A / B.Ed)</option>
                  <option value="DIPLOMA">Diploma</option>
                  <option value="CERTIFICATE">Certificate</option>
                  <option value="HIGH_SCHOOL">High School</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Field of Study / Major</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Theoretical Physics"
                  value={fieldOfStudy}
                  onChange={(e) => setFieldOfStudy(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">University / College</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. University of Edinburgh"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Graduation Year</label>
                <input
                  type="number"
                  required
                  min={1950}
                  max={2030}
                  value={gradYear}
                  onChange={(e) => setGradYear(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>
              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowQualModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-xs"
                >
                  Save Degree
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Certification Modal */}
      {showCertModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Add Professional Certification</h3>
            <form onSubmit={handleAddCertification} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Certificate / License Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. State Board Teaching License"
                  value={certName}
                  onChange={(e) => setCertName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Issuing Authority</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Department of Public Instruction"
                  value={issuingAuthority}
                  onChange={(e) => setIssuingAuthority(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Issue Date</label>
                  <input
                    type="date"
                    required
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Expiry Date (Optional)</label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Credential ID / Number</label>
                <input
                  type="text"
                  placeholder="e.g. LIC-2024-99182"
                  value={credNumber}
                  onChange={(e) => setCredNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>
              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCertModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium shadow-xs"
                >
                  Save Certificate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Skill Modal */}
      {showSkillModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Add Skill / Competency</h3>
            <form onSubmit={handleAddSkill} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Skill Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Inquiry-Based Learning / Python"
                  value={skillName}
                  onChange={(e) => setSkillName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Category</label>
                <input
                  type="text"
                  placeholder="e.g. Pedagogy / Technology / Leadership"
                  value={skillCategory}
                  onChange={(e) => setSkillCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Proficiency Level</label>
                <select
                  value={proficiency}
                  onChange={(e) => setProficiency(e.target.value as SkillProficiency)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                >
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                  <option value="EXPERT">Expert / Master Practitioner</option>
                </select>
              </div>
              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowSkillModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium shadow-xs"
                >
                  Save Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
