import React, { useState, useEffect } from 'react';
import { 
  Building, 
  DoorOpen, 
  Users, 
  Bed, 
  CheckCircle2, 
  Plus,
  ShieldAlert,
  Utensils,
  Wrench,
  Sparkles,
  ClipboardList,
  AlertTriangle,
  BarChart3,
  Clock,
  UserCheck,
  FileText
} from 'lucide-react';
import { 
  HostelProfile, 
  HostelRoom, 
  HostelAllocation,
  MessProfile,
  MealPlan,
  ResidentMealAssignment,
  MealSession,
  MealConsumptionEvent,
  ResidenceServiceRequest,
  ResidenceHousekeepingTask,
  ResidenceInspection,
  ResidenceComplaint,
  ResidenceIncident,
  HostelOperationsAnalyticsCache
} from '../../types/hostel';
import { HostelService } from '../../services/hostelService';
import { BookLoader } from '../common/BookLoader';

interface Props {
  tenantId: string;
  user: { id: string; email: string; displayName?: string; role?: string };
}

export const HostelWorkspace: React.FC<Props> = ({ tenantId, user }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'profiles' | 'rooms' | 'allocations' | 'operations' | 'mess' | 'dining' | 'service' | 'housekeeping' | 'incidents' | 'analytics'>('dashboard');
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Data States
  const [profiles, setProfiles] = useState<HostelProfile[]>([]);
  const [rooms, setRooms] = useState<HostelRoom[]>([]);
  const [allocations, setAllocations] = useState<HostelAllocation[]>([]);
  
  // Phase 7.12C States
  const [messProfiles, setMessProfiles] = useState<MessProfile[]>([]);
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [mealAssignments, setMealAssignments] = useState<ResidentMealAssignment[]>([]);
  const [mealSessions, setMealSessions] = useState<MealSession[]>([]);
  const [mealConsumptions, setMealConsumptions] = useState<MealConsumptionEvent[]>([]);
  const [serviceRequests, setServiceRequests] = useState<ResidenceServiceRequest[]>([]);
  const [housekeepingTasks, setHousekeepingTasks] = useState<ResidenceHousekeepingTask[]>([]);
  const [inspections, setInspections] = useState<ResidenceInspection[]>([]);
  const [complaints, setComplaints] = useState<ResidenceComplaint[]>([]);
  const [incidents, setIncidents] = useState<ResidenceIncident[]>([]);
  const [analytics, setAnalytics] = useState<HostelOperationsAnalyticsCache | null>(null);

  // Form States
  const [showMessModal, setShowMessModal] = useState(false);
  const [newMessName, setNewMessName] = useState('');
  const [newMessCapacity, setNewMessCapacity] = useState(200);

  const [showPlanModal, setShowPlanModal] = useState(false);
  const [newPlanName, setNewPlanName] = useState('');
  const [selectedMessId, setSelectedMessId] = useState('');

  const [showServiceModal, setShowServiceModal] = useState(false);
  const [serviceStudentId, setServiceStudentId] = useState('');
  const [serviceTitle, setServiceTitle] = useState('');
  const [serviceCategory, setServiceCategory] = useState<any>('MAINTENANCE');
  const [servicePriority, setServicePriority] = useState<any>('NORMAL');
  const [serviceDescription, setServiceDescription] = useState('');

  const [showSessionModal, setShowSessionModal] = useState(false);
  const [sessionMealType, setSessionMealType] = useState<any>('LUNCH');
  const [sessionDate, setSessionDate] = useState(new Date().toISOString().split('T')[0]);

  const [scanStudentId, setScanStudentId] = useState('');
  const [selectedSessionId, setSelectedSessionId] = useState('');

  useEffect(() => {
    loadData();
  }, [tenantId]);

  const loadData = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const [profs, rms, allocs, mProfs, mPlans, mAssigns, mSess, sReqs, hTasks, insps, cmps, incs, cache] = await Promise.all([
        HostelService.getProfiles(tenantId),
        HostelService.getRooms(tenantId),
        HostelService.getAllocations(tenantId),
        HostelService.getMessProfiles(tenantId),
        HostelService.getMealPlans(tenantId),
        HostelService.getResidentMealAssignments(tenantId),
        HostelService.getMealSessions(tenantId),
        HostelService.getServiceRequests(tenantId),
        HostelService.getHousekeepingTasks(tenantId),
        HostelService.getInspections(tenantId),
        HostelService.getComplaints(tenantId),
        HostelService.getIncidents(tenantId),
        HostelService.rebuildAnalyticsCache(tenantId)
      ]);
      setProfiles(profs);
      setRooms(rms);
      setAllocations(allocs);
      setMessProfiles(mProfs);
      setMealPlans(mPlans);
      setMealAssignments(mAssigns);
      setMealSessions(mSess);
      setServiceRequests(sReqs);
      setHousekeepingTasks(hTasks);
      setInspections(insps);
      setComplaints(cmps);
      setIncidents(incs);
      setAnalytics(cache);
      if (mSess.length > 0) setSelectedSessionId(mSess[0].mealSessionId);
    } catch (error: any) {
      console.error('Error loading hostel operational data:', error);
      setErrorMessage(error.message || 'Failed to load operational data.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profiles.length) {
      setErrorMessage('A Hostel Profile is required to establish a Mess Facility.');
      return;
    }
    try {
      await HostelService.saveMessProfile({
        tenantId,
        hostelProfileId: (profiles[0]?.hostelProfileId || ""),
        name: newMessName,
        capacity: newMessCapacity
      }, user);
      setSuccessMessage(`Mess Facility "${newMessName}" created successfully.`);
      setShowMessModal(false);
      setNewMessName('');
      loadData();
    } catch (err: any) {
      setErrorMessage(err.message);
    }
  };

  const handleCreateMealPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messProfiles.length) {
      setErrorMessage('A Mess Facility is required before creating a Meal Plan.');
      return;
    }
    try {
      const targetMess = messProfiles.find(m => m.messProfileId === selectedMessId) || messProfiles[0];
      await HostelService.saveMealPlan({
        tenantId,
        hostelProfileId: targetMess.hostelProfileId,
        messProfileId: targetMess.messProfileId,
        name: newPlanName,
        includedMeals: ['BREAKFAST', 'LUNCH', 'DINNER']
      }, user);
      setSuccessMessage(`Meal Plan "${newPlanName}" created and activated.`);
      setShowPlanModal(false);
      setNewPlanName('');
      loadData();
    } catch (err: any) {
      setErrorMessage(err.message);
    }
  };

  const handleCreateServiceRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await HostelService.createServiceRequest({
        tenantId,
        studentId: serviceStudentId,
        title: serviceTitle,
        category: serviceCategory,
        priority: servicePriority,
        description: serviceDescription
      }, user);
      setSuccessMessage(`Service Request "${serviceTitle}" created with SLA due date calculated.`);
      setShowServiceModal(false);
      setServiceTitle('');
      setServiceStudentId('');
      setServiceDescription('');
      loadData();
    } catch (err: any) {
      setErrorMessage(err.message);
    }
  };

  const handleCreateMealSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messProfiles.length) {
      setErrorMessage('Mess Facility required to open a Meal Session.');
      return;
    }
    try {
      const targetMess = messProfiles[0];
      await HostelService.createMealSession({
        tenantId,
        hostelProfileId: targetMess.hostelProfileId,
        messProfileId: targetMess.messProfileId,
        mealType: sessionMealType,
        serviceDate: sessionDate,
        startTime: '12:00',
        endTime: '14:30',
        capacity: targetMess.capacity,
        status: 'OPEN',
        createdBy: user.id
      }, user);
      setSuccessMessage(`Meal Session opened for ${sessionMealType} on ${sessionDate}.`);
      setShowSessionModal(false);
      loadData();
    } catch (err: any) {
      setErrorMessage(err.message);
    }
  };

  const handleRecordConsumption = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSessionId) {
      setErrorMessage('Please select or open an active Meal Session first.');
      return;
    }
    try {
      const sess = mealSessions.find(s => s.mealSessionId === selectedSessionId);
      if (!sess) throw new Error('Meal session not found');

      await HostelService.recordMealConsumption({
        tenantId,
        mealSessionId: selectedSessionId,
        studentId: scanStudentId,
        enrollmentId: 'ENR-AUTO',
        allocationId: 'ALLOC-AUTO',
        mealPlanId: 'MP-AUTO',
        mealType: sess.mealType,
        serviceDate: sess.serviceDate,
        source: 'QR',
        recordedBy: user.id,
        status: 'CONSUMED'
      }, user);
      setSuccessMessage(`Meal consumption recorded for Student ${scanStudentId}. Duplicate checks passed.`);
      setScanStudentId('');
      loadData();
    } catch (err: any) {
      setErrorMessage(err.message);
    }
  };

  const activeAllocations = allocations.filter(a => a.status === 'ACTIVE' || a.status === 'APPROVED');
  const totalCapacity = profiles.reduce((acc, p) => acc + p.capacity, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 tracking-tight">Hostel, Residence & Operations</h2>
          <p className="text-sm text-slate-500">Phase 7.12C Comprehensive Residence Services, Mess & Maintenance Engine.</p>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage('')} className="text-xs text-emerald-700 underline font-medium">Dismiss</button>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage('')} className="text-xs text-rose-700 underline font-medium">Dismiss</button>
        </div>
      )}

      {/* Main Tab Bar */}
      <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl w-full overflow-x-auto text-xs font-medium border border-slate-200/60">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${activeTab === 'dashboard' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Command Center
        </button>
        <button
          onClick={() => setActiveTab('profiles')}
          className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap ${activeTab === 'profiles' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Hostels ({profiles.length})
        </button>
        <button
          onClick={() => setActiveTab('rooms')}
          className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap ${activeTab === 'rooms' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Rooms ({rooms.length})
        </button>
        <button
          onClick={() => setActiveTab('allocations')}
          className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap ${activeTab === 'allocations' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Allocations ({allocations.length})
        </button>
        <button
          onClick={() => setActiveTab('mess')}
          className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${activeTab === 'mess' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
        >
          <Utensils className="w-3.5 h-3.5 text-indigo-600" />
          Mess & Plans ({messProfiles.length})
        </button>
        <button
          onClick={() => setActiveTab('dining')}
          className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${activeTab === 'dining' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
        >
          <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
          Meal Verification ({mealSessions.length})
        </button>
        <button
          onClick={() => setActiveTab('service')}
          className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${activeTab === 'service' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
        >
          <Wrench className="w-3.5 h-3.5 text-amber-600" />
          Service & SLA ({serviceRequests.length})
        </button>
        <button
          onClick={() => setActiveTab('housekeeping')}
          className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${activeTab === 'housekeeping' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
        >
          <Sparkles className="w-3.5 h-3.5 text-sky-600" />
          Housekeeping ({housekeepingTasks.length})
        </button>
        <button
          onClick={() => setActiveTab('incidents')}
          className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${activeTab === 'incidents' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
          Incidents ({incidents.length})
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${activeTab === 'analytics' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
        >
          <BarChart3 className="w-3.5 h-3.5 text-violet-600" />
          Ops Analytics
        </button>
      </div>

      {loading ? (
        <BookLoader size="small" text="Loading" />
      ) : (
        <>
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-slate-600">Active Hostels</h3>
                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
                      <Building className="w-5 h-5 text-indigo-600" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-slate-900">{profiles.length}</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-slate-600">Total Capacity</h3>
                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                      <DoorOpen className="w-5 h-5 text-emerald-600" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-slate-900">{totalCapacity}</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-slate-600">Students Housed</h3>
                    <div className="w-10 h-10 rounded-full bg-sky-50 flex items-center justify-center">
                      <Users className="w-5 h-5 text-sky-600" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-slate-900">{activeAllocations.length}</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-slate-600">Mess Facilities</h3>
                    <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                      <Utensils className="w-5 h-5 text-amber-600" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-slate-900">{messProfiles.length}</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-center text-slate-500">
                <ShieldAlert className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-slate-900 mb-1">Hostel & Mess Operations Command Center</h3>
                <p className="text-sm max-w-xl mx-auto text-slate-600">
                  Full multi-tenant, server-side enforced accommodation, lifecycle, mess, maintenance SLA, and operations analytics.
                </p>
              </div>
            </div>
          )}

          {/* Profiles Tab */}
          {activeTab === 'profiles' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-slate-50">
                <h3 className="text-sm font-semibold text-slate-900">Hostel Profiles</h3>
              </div>
              <div className="divide-y divide-slate-100">
                {profiles.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-sm">No hostels defined.</div>
                ) : (
                  profiles.map(p => (
                    <div key={p.hostelProfileId} className="p-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-900">{p.name} ({p.code})</p>
                        <p className="text-xs text-slate-500">Type: {p.hostelType} | Capacity: {p.capacity}</p>
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-100 text-indigo-800 rounded-lg">
                        {p.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Rooms Tab */}
          {activeTab === 'rooms' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-slate-50">
                <h3 className="text-sm font-semibold text-slate-900">Rooms Register</h3>
              </div>
              <div className="divide-y divide-slate-100">
                {rooms.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-sm">No rooms defined.</div>
                ) : (
                  rooms.map(r => (
                    <div key={r.roomId} className="p-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-900">Room {r.roomNumber}</p>
                        <p className="text-xs text-slate-500">Type: {r.roomType} | Capacity: {r.capacity}</p>
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg">
                        {r.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Allocations Tab */}
          {activeTab === 'allocations' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-slate-50">
                <h3 className="text-sm font-semibold text-slate-900">Student Allocations</h3>
              </div>
              <div className="divide-y divide-slate-100">
                {allocations.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-sm">No allocations found.</div>
                ) : (
                  allocations.map(a => (
                    <div key={a.allocationId} className="p-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-900">Student: {a.studentId}</p>
                        <p className="text-xs text-slate-500">Room: {a.roomId} | Bed: {a.bedId}</p>
                      </div>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
                        a.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'
                      }`}>
                        {a.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Mess & Plans Tab */}
          {activeTab === 'mess' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-slate-900">Mess Profiles & Meal Plans</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowMessModal(true)}
                    className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 hover:bg-indigo-700 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    New Mess Facility
                  </button>
                  <button
                    onClick={() => setShowPlanModal(true)}
                    className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 hover:bg-emerald-700 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    New Meal Plan
                  </button>
                </div>
              </div>

              {/* Mess Facilities List */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50">
                  <h4 className="text-sm font-semibold text-slate-900">Mess Facilities ({messProfiles.length})</h4>
                </div>
                <div className="divide-y divide-slate-100">
                  {messProfiles.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 text-sm">No mess facilities configured yet. Click "New Mess Facility" to create one.</div>
                  ) : (
                    messProfiles.map(m => (
                      <div key={m.messProfileId} className="p-4 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-900">{m.name} ({m.code})</p>
                          <p className="text-xs text-slate-500">Service Mode: {m.serviceMode} | Dining Capacity: {m.capacity}</p>
                        </div>
                        <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-100 text-indigo-800 rounded-lg">
                          {m.status}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Meal Plans List */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50">
                  <h4 className="text-sm font-semibold text-slate-900">Meal Plans ({mealPlans.length})</h4>
                </div>
                <div className="divide-y divide-slate-100">
                  {mealPlans.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 text-sm">No meal plans configured yet. Click "New Meal Plan" to define rules.</div>
                  ) : (
                    mealPlans.map(p => (
                      <div key={p.mealPlanId} className="p-4 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-900">{p.name} ({p.code})</p>
                          <p className="text-xs text-slate-500">Meals: {p.includedMeals.join(', ')} | Rules: {p.eligibilityRules}</p>
                        </div>
                        <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg">
                          {p.status} (v{p.version})
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Dining & Verification Tab */}
          {activeTab === 'dining' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-slate-900">Daily Meal Sessions & Instant QR Verification</h3>
                <button
                  onClick={() => setShowSessionModal(true)}
                  className="px-3.5 py-2 bg-indigo-600 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 hover:bg-indigo-700 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Open Meal Session
                </button>
              </div>

              {/* Meal Verification Form */}
              <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800">
                <div className="flex items-center gap-2 mb-4">
                  <UserCheck className="w-5 h-5 text-emerald-400" />
                  <h4 className="text-sm font-semibold">Resident Meal Access Scanner (Duplicate Protection Enforced)</h4>
                </div>
                <form onSubmit={handleRecordConsumption} className="flex flex-col sm:flex-row gap-3">
                  <select
                    value={selectedSessionId}
                    onChange={(e) => setSelectedSessionId(e.target.value)}
                    className="bg-slate-800 border border-slate-700 text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="">Select Meal Session...</option>
                    {mealSessions.map(s => (
                      <option key={s.mealSessionId} value={s.mealSessionId}>
                        {s.mealType} - {s.serviceDate} ({s.status}) - Served: {s.servedCount}
                      </option>
                    ))}
                  </select>

                  <input
                    type="text"
                    placeholder="Enter or scan Student ID (e.g. STU-1001)"
                    value={scanStudentId}
                    onChange={(e) => setScanStudentId(e.target.value)}
                    required
                    className="flex-1 bg-slate-800 border border-slate-700 text-white text-xs rounded-xl px-3.5 py-2.5 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                  />

                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 font-semibold text-xs text-white rounded-xl transition-colors whitespace-nowrap"
                  >
                    Verify & Record
                  </button>
                </form>
              </div>

              {/* Meal Sessions List */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50">
                  <h4 className="text-sm font-semibold text-slate-900">Active & Scheduled Meal Sessions ({mealSessions.length})</h4>
                </div>
                <div className="divide-y divide-slate-100">
                  {mealSessions.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 text-sm">No active meal sessions. Open a session to start serving.</div>
                  ) : (
                    mealSessions.map(s => (
                      <div key={s.mealSessionId} className="p-4 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-900">{s.mealType} Session ({s.serviceDate})</p>
                          <p className="text-xs text-slate-500">Service Hours: {s.startTime} - {s.endTime} | Headcount Served: <span className="font-semibold text-indigo-600">{s.servedCount}</span> / {s.capacity}</p>
                        </div>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
                          s.status === 'OPEN' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'
                        }`}>
                          {s.status}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Maintenance & SLA Tab */}
          {activeTab === 'service' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-slate-900">Maintenance & Service Requests (SLA Tracked)</h3>
                <button
                  onClick={() => setShowServiceModal(true)}
                  className="px-3.5 py-2 bg-indigo-600 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 hover:bg-indigo-700 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  New Service Request
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50">
                  <h4 className="text-sm font-semibold text-slate-900">Service Requests Log ({serviceRequests.length})</h4>
                </div>
                <div className="divide-y divide-slate-100">
                  {serviceRequests.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 text-sm">No service requests logged. Click "New Service Request" to report an issue.</div>
                  ) : (
                    serviceRequests.map(r => (
                      <div key={r.requestId} className="p-4 flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-slate-900">{r.title}</p>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                              r.priority === 'EMERGENCY' ? 'bg-rose-100 text-rose-800' :
                              r.priority === 'URGENT' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                            }`}>
                              {r.priority}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Category: {r.category} | Student: {r.studentId} | Due SLA: {new Date(r.dueAt || '').toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {r.breachedAt && (
                            <span className="text-[10px] font-bold px-2 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-md">
                              SLA BREACHED
                            </span>
                          )}
                          <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-100 text-indigo-800 rounded-lg">
                            {r.status}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Housekeeping Tab */}
          {activeTab === 'housekeeping' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-slate-900">Housekeeping & Room Inspections</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-4 border-b border-slate-100 bg-slate-50">
                    <h4 className="text-sm font-semibold text-slate-900">Housekeeping Tasks ({housekeepingTasks.length})</h4>
                  </div>
                  <div className="divide-y divide-slate-100 p-4">
                    {housekeepingTasks.length === 0 ? (
                      <p className="text-xs text-slate-500 text-center py-4">No pending housekeeping tasks.</p>
                    ) : (
                      housekeepingTasks.map(t => (
                        <div key={t.taskId} className="py-2 flex justify-between text-xs">
                          <span>{t.taskType} - Room {t.roomId}</span>
                          <span className="font-semibold text-indigo-600">{t.status}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-4 border-b border-slate-100 bg-slate-50">
                    <h4 className="text-sm font-semibold text-slate-900">Room Condition Inspections ({inspections.length})</h4>
                  </div>
                  <div className="divide-y divide-slate-100 p-4">
                    {inspections.length === 0 ? (
                      <p className="text-xs text-slate-500 text-center py-4">No inspections recorded.</p>
                    ) : (
                      inspections.map(i => (
                        <div key={i.inspectionId} className="py-2 flex justify-between text-xs">
                          <span>{i.inspectionType} - Room {i.roomId}</span>
                          <span className="font-semibold text-emerald-600">{i.condition}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Incidents & Complaints Tab */}
          {activeTab === 'incidents' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-slate-900">Residence Complaints & Safety Incidents</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-4 border-b border-slate-100 bg-slate-50">
                    <h4 className="text-sm font-semibold text-slate-900">Complaints Register ({complaints.length})</h4>
                  </div>
                  <div className="divide-y divide-slate-100 p-4">
                    {complaints.length === 0 ? (
                      <p className="text-xs text-slate-500 text-center py-4">No complaints reported.</p>
                    ) : (
                      complaints.map(c => (
                        <div key={c.complaintId} className="py-2 flex justify-between text-xs">
                          <span>{c.description}</span>
                          <span className="font-semibold text-amber-600">{c.status}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-4 border-b border-slate-100 bg-slate-50">
                    <h4 className="text-sm font-semibold text-slate-900">Safety & Incident Register ({incidents.length})</h4>
                  </div>
                  <div className="divide-y divide-slate-100 p-4">
                    {incidents.length === 0 ? (
                      <p className="text-xs text-slate-500 text-center py-4">No critical incidents logged.</p>
                    ) : (
                      incidents.map(inc => (
                        <div key={inc.incidentId} className="py-2 flex justify-between text-xs">
                          <span>{inc.incidentType}: {inc.description}</span>
                          <span className="font-bold text-rose-600">{inc.severity}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Operations Analytics Tab */}
          {activeTab === 'analytics' && analytics && (
            <div className="space-y-6">
              <h3 className="text-base font-semibold text-slate-900">Operations Read Model & Analytics</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Meal Utilization</h4>
                  <p className="text-3xl font-bold text-slate-900">{analytics.mealUtilization.consumptionPercentage}%</p>
                  <p className="text-xs text-slate-500 mt-1">Consumed: {analytics.mealUtilization.totalConsumed} / {analytics.mealUtilization.totalEligible}</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Open Service Requests</h4>
                  <p className="text-3xl font-bold text-slate-900">{analytics.serviceRequests.totalOpen}</p>
                  <p className="text-xs text-rose-600 mt-1 font-semibold">SLA Breached: {analytics.serviceRequests.slaBreachedCount}</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Critical Incidents</h4>
                  <p className="text-3xl font-bold text-slate-900">{analytics.complaintsAndIncidents.criticalIncidents}</p>
                  <p className="text-xs text-slate-500 mt-1">Open Complaints: {analytics.complaintsAndIncidents.openComplaints}</p>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modals */}
      {showMessModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border border-slate-100">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Create Mess Facility</h3>
            <form onSubmit={handleCreateMess} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Mess Facility Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Central Dining Hall"
                  value={newMessName}
                  onChange={(e) => setNewMessName(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Dining Capacity</label>
                <input
                  type="number"
                  required
                  value={newMessCapacity}
                  onChange={(e) => setNewMessCapacity(parseInt(e.target.value) || 100)}
                  className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowMessModal(false)}
                  className="px-4 py-2 border border-slate-200 text-xs font-medium rounded-xl hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white text-xs font-medium rounded-xl hover:bg-indigo-700"
                >
                  Save Mess Facility
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showPlanModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border border-slate-100">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Create Meal Plan</h3>
            <form onSubmit={handleCreateMealPlan} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Select Mess Facility</label>
                <select
                  value={selectedMessId}
                  onChange={(e) => setSelectedMessId(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500"
                >
                  {messProfiles.map(m => (
                    <option key={m.messProfileId} value={m.messProfileId}>{m.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Meal Plan Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Standard Full Board Dining Plan"
                  value={newPlanName}
                  onChange={(e) => setNewPlanName(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPlanModal(false)}
                  className="px-4 py-2 border border-slate-200 text-xs font-medium rounded-xl hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white text-xs font-medium rounded-xl hover:bg-emerald-700"
                >
                  Create Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showServiceModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border border-slate-100">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">New Service Request</h3>
            <form onSubmit={handleCreateServiceRequest} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Student ID</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. STU-1001"
                  value={serviceStudentId}
                  onChange={(e) => setServiceStudentId(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Request Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Electrical Fault in Desk Socket"
                  value={serviceTitle}
                  onChange={(e) => setServiceTitle(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Category</label>
                  <select
                    value={serviceCategory}
                    onChange={(e) => setServiceCategory(e.target.value as any)}
                    className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="MAINTENANCE">MAINTENANCE</option>
                    <option value="ELECTRICAL">ELECTRICAL</option>
                    <option value="PLUMBING">PLUMBING</option>
                    <option value="CLEANING">CLEANING</option>
                    <option value="INTERNET">INTERNET</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Priority</label>
                  <select
                    value={servicePriority}
                    onChange={(e) => setServicePriority(e.target.value as any)}
                    className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="LOW">LOW (72h)</option>
                    <option value="NORMAL">NORMAL (48h)</option>
                    <option value="HIGH">HIGH (12h)</option>
                    <option value="URGENT">URGENT (4h)</option>
                    <option value="EMERGENCY">EMERGENCY (2h)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={serviceDescription}
                  onChange={(e) => setServiceDescription(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowServiceModal(false)}
                  className="px-4 py-2 border border-slate-200 text-xs font-medium rounded-xl hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 text-white text-xs font-medium rounded-xl hover:bg-amber-700"
                >
                  Create Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showSessionModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border border-slate-100">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Open Meal Session</h3>
            <form onSubmit={handleCreateMealSession} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Meal Type</label>
                <select
                  value={sessionMealType}
                  onChange={(e) => setSessionMealType(e.target.value as any)}
                  className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500"
                >
                  <option value="BREAKFAST">BREAKFAST</option>
                  <option value="MORNING_SNACK">MORNING_SNACK</option>
                  <option value="LUNCH">LUNCH</option>
                  <option value="EVENING_SNACK">EVENING_SNACK</option>
                  <option value="DINNER">DINNER</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Service Date</label>
                <input
                  type="date"
                  required
                  value={sessionDate}
                  onChange={(e) => setSessionDate(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSessionModal(false)}
                  className="px-4 py-2 border border-slate-200 text-xs font-medium rounded-xl hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white text-xs font-medium rounded-xl hover:bg-indigo-700"
                >
                  Open Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

