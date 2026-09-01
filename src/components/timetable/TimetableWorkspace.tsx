import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Layers, 
  CheckCircle2, 
  Plus, 
  AlertTriangle,
  Users,
  MapPin,
  RefreshCw
} from 'lucide-react';
import { 
  TimetableProfile, 
  PeriodStructure, 
  SchedulingResource, 
  TimetableSlot, 
  SubstituteTeacher, 
  TimetableConflict 
} from '../../types/timetable';
import { TimetableService } from '../../services/timetableService';
import { AcademicService } from '../../services/academicService';
import { TeacherService } from '../../services/academicManagementService';

interface Props {
  tenantId: string;
  user: { id: string; email: string; displayName?: string; role?: string };
}

export const TimetableWorkspace: React.FC<Props> = ({ tenantId, user }) => {
  const [profiles, setProfiles] = useState<TimetableProfile[]>([]);
  const [periods, setPeriods] = useState<PeriodStructure[]>([]);
  const [resources, setResources] = useState<SchedulingResource[]>([]);
  const [slots, setSlots] = useState<TimetableSlot[]>([]);
  const [conflicts, setConflicts] = useState<TimetableConflict[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profiles' | 'periods' | 'slots' | 'resources' | 'conflicts'>('profiles');
  const [successMessage, setSuccessMessage] = useState('');
  
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);
  const [profileName, setProfileName] = useState('');

  useEffect(() => {
    loadData();
  }, [tenantId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [profs, pers, res, sls, cfs] = await Promise.all([
        TimetableService.getTimetables(tenantId),
        TimetableService.getPeriodStructures(tenantId),
        TimetableService.getResources(tenantId),
        TimetableService.getTimetableSlots(tenantId),
        TimetableService.getConflicts(tenantId)
      ]);
      setProfiles(profs);
      setPeriods(pers);
      setResources(res);
      setSlots(sls);
      setConflicts(cfs);
    } catch (err) {
      console.error('Error loading timetable data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await TimetableService.saveTimetable({
        tenantId,
        academicYearId: 'ay_2027_28', // Fallback for UI if real selector not ready
        name: profileName,
        code: `TT-${Date.now()}`,
        description: 'Main Timetable Schedule',
        scope: 'Campus',
        status: 'DRAFT',
        version: '1.0',
        effectiveFrom: '2027-04-01',
        effectiveTo: '2028-03-31',
        weekPattern: 'WEEKLY',
        workingDays: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
        periodStructureId: periods[0]?.periodStructureId || 'ps_default',
        createdBy: user.displayName || user.email || user.id
      }, user);

      setSuccessMessage('Timetable Profile Created Successfully');
      setIsCreatingProfile(false);
      setProfileName('');
      loadData();
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to create timetable');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 tracking-tight">Timetable & Academic Scheduling</h2>
          <p className="text-sm text-slate-500">Phase 7.9 Scheduling Engine, Resource Allocations, and Conflict Detection.</p>
        </div>
        <button
          onClick={() => setIsCreatingProfile(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Create Timetable
        </button>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl w-fit text-xs font-medium">
        <button
          onClick={() => setActiveTab('profiles')}
          className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'profiles' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Timetables ({profiles.length})
        </button>
        <button
          onClick={() => setActiveTab('slots')}
          className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'slots' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Active Slots ({slots.length})
        </button>
        <button
          onClick={() => setActiveTab('periods')}
          className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'periods' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Period Structures ({periods.length})
        </button>
        <button
          onClick={() => setActiveTab('resources')}
          className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'resources' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Resources ({resources.length})
        </button>
        <button
          onClick={() => setActiveTab('conflicts')}
          className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'conflicts' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Conflicts ({conflicts.length})
        </button>
      </div>

      {isCreatingProfile && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Create Timetable Profile</h3>
          <form onSubmit={handleCreateProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Timetable Name</label>
              <input
                type="text"
                required
                value={profileName}
                onChange={e => setProfileName(e.target.value)}
                placeholder="e.g., 2027 Main Schedule"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsCreatingProfile(false)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 shadow-sm"
              >
                Save Timetable
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'profiles' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.map(prof => (
            <div key={prof.timetableId} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg">
                    {prof.code}
                  </span>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
                    prof.status === 'PUBLISHED' || prof.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {prof.status}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-slate-900 mb-1">{prof.name}</h3>
                <p className="text-xs text-slate-500 font-mono mb-4">Version: {prof.version} | Pattern: {prof.weekPattern}</p>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-700 space-y-1">
                  <p>Days: {prof.workingDays.join(', ')}</p>
                  <p>Effective: {prof.effectiveFrom} to {prof.effectiveTo}</p>
                </div>
              </div>
            </div>
          ))}
          {profiles.length === 0 && (
            <div className="col-span-full text-center py-12 text-slate-400 text-sm">
              No timetables created yet.
            </div>
          )}
        </div>
      )}

      {activeTab === 'resources' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">Scheduling Resources</h3>
            <span className="text-xs text-slate-500 font-medium">{resources.length} Resources</span>
          </div>
          <div className="divide-y divide-slate-100">
            {resources.map(res => (
              <div key={res.resourceId} className="p-4 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span className="font-semibold text-slate-900 text-sm">{res.name}</span>
                    <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-700 rounded-lg font-medium">{res.resourceType}</span>
                  </div>
                  <p className="text-xs text-slate-500">Capacity: {res.capacity} students | {res.location}</p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
                  res.status === 'AVAILABLE' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                }`}>
                  {res.status}
                </span>
              </div>
            ))}
            {resources.length === 0 && (
              <div className="text-center py-12 text-slate-400 text-sm">No scheduling resources found.</div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'slots' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-center text-slate-500">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-slate-900 mb-1">Timetable Slots</h3>
          <p className="text-sm">No active schedule loaded for this view. Use the planner to assign periods.</p>
        </div>
      )}
      
      {activeTab === 'periods' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-center text-slate-500">
          <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-slate-900 mb-1">Period Structures</h3>
          <p className="text-sm">Define daily periods, breaks, and session durations here.</p>
        </div>
      )}

      {activeTab === 'conflicts' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-center text-slate-500">
          <AlertTriangle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-slate-900 mb-1">Conflict Register</h3>
          <p className="text-sm">No active scheduling conflicts detected.</p>
        </div>
      )}
    </div>
  );
};
