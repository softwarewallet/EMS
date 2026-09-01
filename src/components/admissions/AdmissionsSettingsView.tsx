import React, { useState, useEffect } from 'react';
import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';
import { AdmissionsService } from '../../services/admissionsService';
import { AdmissionSession, AdmissionSessionConfig } from '../../types/admissions';
import { Settings, Play, CheckCircle2, Loader2, Plus, Calendar, ShieldCheck, Database } from 'lucide-react';

export const AdmissionsSettingsView: React.FC = () => {
  const { currentTenant } = useTenant();
  const { user } = useAuth();
  const [sessions, setSessions] = useState<AdmissionSession[]>([]);
  const [config, setConfig] = useState<AdmissionSessionConfig>(AdmissionsService.getDefaultConfig());
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [savingConfig, setSavingConfig] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // New session modal
  const [showNewSessionModal, setShowNewSessionModal] = useState(false);
  const [sessionName, setSessionName] = useState('2027-28 Admissions');
  const [startDate, setStartDate] = useState('2027-01-01');
  const [endDate, setEndDate] = useState('2027-06-30');

  const performedBy = {
    userId: user?.uid || 'usr_admin',
    email: user?.email || 'admin@school.edu',
    name: user?.displayName || 'System Admin'
  };

  const loadData = async () => {
    if (!currentTenant) return;
    setLoading(true);
    try {
      const [sessData, cfgData] = await Promise.all([
        AdmissionsService.getSessions(currentTenant.id),
        AdmissionsService.getTenantConfig(currentTenant.id)
      ]);
      setSessions(sessData);
      setConfig(cfgData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentTenant]);

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTenant) return;
    try {
      await AdmissionsService.createSession({
        tenantId: currentTenant.id,
        name: sessionName,
        academicYearId: 'ay_27_28',
        startDate,
        endDate,
        status: 'OPEN',
        availableClassIds: ['cls_viii', 'cls_ix', 'cls_x']
      }, performedBy);
      setShowNewSessionModal(false);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveConfig = async () => {
    if (!currentTenant) return;
    setSavingConfig(true);
    try {
      await AdmissionsService.saveTenantConfig(currentTenant.id, config, performedBy);
      setSuccessMsg('Admissions configuration saved successfully.');
    } catch (err) {
      console.error(err);
    } finally {
      setSavingConfig(false);
    }
  };

  const generateDemoData = async () => {
    if (!currentTenant || !user) return;
    setGenerating(true);
    setSuccessMsg('');
    try {
      const sess = await AdmissionsService.createSession({
        tenantId: currentTenant.id,
        name: '2027-28 Admissions',
        academicYearId: 'ay_27_28',
        startDate: '2027-01-01',
        endDate: '2027-06-30',
        status: 'OPEN',
        availableClassIds: ['cls_viii', 'cls_ix', 'cls_x']
      }, performedBy);

      // Create Enquiries
      await AdmissionsService.createEnquiry({
        tenantId: currentTenant.id,
        sessionId: sess.id,
        enquiryNumber: 'ENQ-2027-001',
        applicantName: 'Aarav Sharma',
        guardianName: 'Rajesh Sharma',
        contactNumber: '+91 9876543210',
        interestedClassId: 'cls_viii',
        source: 'Website',
        remarks: 'Interested in STEM & Cricket program',
        status: 'NEW'
      }, performedBy);

      const enq2 = await AdmissionsService.createEnquiry({
        tenantId: currentTenant.id,
        sessionId: sess.id,
        enquiryNumber: 'ENQ-2027-002',
        applicantName: 'Ananya Verma',
        guardianName: 'Vikram Verma',
        contactNumber: '+91 9876543211',
        interestedClassId: 'cls_ix',
        source: 'Walk-in',
        remarks: 'Requested hostel and transport details',
        status: 'NEW'
      }, performedBy);

      // Convert one to application
      await AdmissionsService.convertEnquiryToApplication(enq2.id, {
        tenantId: currentTenant.id,
        sessionId: sess.id,
        applicationNumber: 'ADM-2027-000001',
        applicant: {
          firstName: 'Ananya',
          lastName: 'Verma',
          dateOfBirth: '2012-05-14',
          gender: 'female',
          address: '45 Green Park, New Delhi',
          previousInstitution: 'St. Teresa High School',
          previousMarksPercentage: 88
        },
        guardians: [{
          name: 'Vikram Verma',
          relationship: 'father',
          contactNumber: '+91 9876543211',
          isPrimaryContact: true
        }],
        appliedClassId: 'cls_ix',
        source: 'Walk-in',
        status: 'SUBMITTED',
        remarks: 'Document inspection pending'
      }, performedBy);

      // Create Direct Selected & Approved Applications
      const appSelected = await AdmissionsService.createApplication({
        tenantId: currentTenant.id,
        sessionId: sess.id,
        applicationNumber: 'ADM-2027-000002',
        applicant: {
          firstName: 'Kabir',
          lastName: 'Mehta',
          dateOfBirth: '2012-08-22',
          gender: 'male',
          address: '12 Cyber City, Gurgaon',
          previousInstitution: 'Modern School Barakhamba',
          previousMarksPercentage: 92
        },
        guardians: [{
          name: 'Sunil Mehta',
          relationship: 'father',
          contactNumber: '+91 9811122334',
          isPrimaryContact: true
        }],
        appliedClassId: 'cls_viii',
        source: 'Referral',
        status: 'SUBMITTED',
        remarks: 'Excellent academic profile'
      }, performedBy);

      // Mark Kabir as SELECTED & APPROVED
      await AdmissionsService.updateApplicationStatus(appSelected.id, currentTenant.id, 'DOCUMENT_VERIFICATION', performedBy);
      await AdmissionsService.updateApplicationStatus(appSelected.id, currentTenant.id, 'READY_FOR_SELECTION', performedBy);
      await AdmissionsService.updateApplicationStatus(appSelected.id, currentTenant.id, 'SELECTED', performedBy, {
        selectionDecision: {
          decision: 'SELECTED',
          date: new Date().toISOString(),
          byId: performedBy.userId,
          byName: performedBy.name,
          remarks: 'Shortlisted based on merit rank #1'
        }
      });
      await AdmissionsService.updateApplicationStatus(appSelected.id, currentTenant.id, 'APPROVED', performedBy, {
        approvalDecision: {
          decision: 'APPROVED',
          date: new Date().toISOString(),
          byId: performedBy.userId,
          byName: performedBy.name,
          remarks: 'Principal approval granted'
        }
      });

      setSuccessMsg('Phase 5 demo data generated successfully! Session, enquiries, applications, and approvals created.');
      loadData();
    } catch (err: any) {
      console.error(err);
      setSuccessMsg(`Error: ${err.message}`);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Admission Settings & Session Governance</h2>
          <p className="text-sm text-slate-500">Configure academic sessions, prefix formatting, required document types, merit weights, and class seat limits.</p>
        </div>

        <button 
          onClick={() => setShowNewSessionModal(true)}
          className="bg-sky-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-sky-700 transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" /> Create Admission Session
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 border border-emerald-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          {successMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sessions Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b pb-3">
            <Calendar className="w-5 h-5 text-sky-600" /> Academic Admission Sessions
          </h3>

          <div className="space-y-3">
            {sessions.map(s => (
              <div key={s.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{s.name}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                      s.status === 'OPEN' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {s.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Duration: {s.startDate} to {s.endDate}</p>
                </div>

                {s.status === 'OPEN' ? (
                  <button 
                    onClick={() => AdmissionsService.updateSessionStatus(s.id, s.tenantId, 'CLOSED', performedBy).then(loadData)}
                    className="text-xs bg-slate-200 hover:bg-slate-300 font-bold px-3 py-1.5 rounded-lg text-slate-700"
                  >
                    Close Session
                  </button>
                ) : (
                  <button 
                    onClick={() => AdmissionsService.updateSessionStatus(s.id, s.tenantId, 'OPEN', performedBy).then(loadData)}
                    className="text-xs bg-sky-600 hover:bg-sky-700 font-bold px-3 py-1.5 rounded-lg text-white"
                  >
                    Open Session
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Demo Data Tool Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b pb-3">
            <Database className="w-5 h-5 text-indigo-600" /> Phase 5 Demo Data Generator
          </h3>
          <p className="text-xs text-slate-600">
            Populate this institution with sample admission sessions, enquiries, document placeholders, test scores, interview panel records, and approved applications to test the full end-to-end workflow.
          </p>
          <button 
            onClick={generateDemoData}
            disabled={generating}
            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50 shadow-sm"
          >
            {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            Generate Sample Admissions Data
          </button>
        </div>
      </div>

      {/* Tenant Admission Configuration Form */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b pb-3">
          <ShieldCheck className="w-5 h-5 text-sky-600" /> Tenant Admission Rules & Seat Limits
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div>
            <label className="font-bold text-slate-700">Application Number Prefix</label>
            <input 
              type="text" 
              value={config.applicationPrefix}
              onChange={(e) => setConfig({ ...config, applicationPrefix: e.target.value })}
              className="w-full border border-slate-300 rounded-lg p-2.5 mt-1 font-bold text-slate-800 focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700">Entrance Test Weight (%)</label>
            <input 
              type="number" 
              value={config.meritWeights.entranceTest}
              onChange={(e) => setConfig({
                ...config,
                meritWeights: { ...config.meritWeights, entranceTest: parseInt(e.target.value) || 0 }
              })}
              className="w-full border border-slate-300 rounded-lg p-2.5 mt-1 font-bold text-slate-800"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700">Interview Weight (%)</label>
            <input 
              type="number" 
              value={config.meritWeights.interview}
              onChange={(e) => setConfig({
                ...config,
                meritWeights: { ...config.meritWeights, interview: parseInt(e.target.value) || 0 }
              })}
              className="w-full border border-slate-300 rounded-lg p-2.5 mt-1 font-bold text-slate-800"
            />
          </div>
        </div>

        <div className="pt-4 border-t flex justify-end">
          <button 
            onClick={handleSaveConfig}
            disabled={savingConfig}
            className="bg-sky-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-sky-700 transition-colors"
          >
            {savingConfig ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
      </div>
    </div>
  );
};
