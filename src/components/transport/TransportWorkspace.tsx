import React, { useState, useEffect } from 'react';
import { 
  Bus, 
  Map, 
  Users, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2,
  Plus
} from 'lucide-react';
import { 
  TransportProfile, 
  TransportRoute, 
  TransportVehicle, 
  TransportAssignment,
  TripInstance,
  TransportIncident
} from '../../types/transport';
import { TransportService } from '../../services/transportService';
import { BookLoader } from '../common/BookLoader';

interface Props {
  tenantId: string;
  user: { id: string; email: string; displayName?: string; role?: string };
}

export const TransportWorkspace: React.FC<Props> = ({ tenantId, user }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'profiles' | 'routes' | 'vehicles' | 'assignments' | 'trips' | 'incidents'>('dashboard');
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');

  const [profiles, setProfiles] = useState<TransportProfile[]>([]);
  const [routes, setRoutes] = useState<TransportRoute[]>([]);
  const [vehicles, setVehicles] = useState<TransportVehicle[]>([]);
  const [assignments, setAssignments] = useState<TransportAssignment[]>([]);
  const [trips, setTrips] = useState<TripInstance[]>([]);
  const [incidents, setIncidents] = useState<TransportIncident[]>([]);

  useEffect(() => {
    loadData();
  }, [tenantId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [profs, rts, vehs, assigns, trps, incs] = await Promise.all([
        TransportService.getTransportProfiles(tenantId),
        TransportService.getRoutes(tenantId),
        TransportService.getVehicles(tenantId),
        TransportService.getAssignments(tenantId),
        TransportService.getTrips(tenantId),
        TransportService.getIncidents(tenantId)
      ]);
      setProfiles(profs);
      setRoutes(rts);
      setVehicles(vehs);
      setAssignments(assigns);
      setTrips(trps);
      setIncidents(incs);
    } catch (error) {
      console.error('Error loading transport data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 tracking-tight">Transport & Fleet Management</h2>
          <p className="text-sm text-slate-500">Phase 7.11 Authoritative Transport Logistics, Routing, and Fleet Compliance.</p>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl w-fit text-xs font-medium overflow-x-auto">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${activeTab === 'dashboard' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Command Center
        </button>
        <button
          onClick={() => setActiveTab('profiles')}
          className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${activeTab === 'profiles' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Profiles ({profiles.length})
        </button>
        <button
          onClick={() => setActiveTab('routes')}
          className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${activeTab === 'routes' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Routes ({routes.length})
        </button>
        <button
          onClick={() => setActiveTab('vehicles')}
          className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${activeTab === 'vehicles' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Fleet ({vehicles.length})
        </button>
        <button
          onClick={() => setActiveTab('assignments')}
          className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${activeTab === 'assignments' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Assignments ({assignments.length})
        </button>
        <button
          onClick={() => setActiveTab('trips')}
          className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${activeTab === 'trips' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Trips ({trips.length})
        </button>
        <button
          onClick={() => setActiveTab('incidents')}
          className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${activeTab === 'incidents' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Incidents ({incidents.length})
        </button>
      </div>

      {loading ? (
        <BookLoader size="small" text="Loading" />
      ) : (
        <>
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-slate-600">Active Routes</h3>
                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
                      <Map className="w-5 h-5 text-indigo-600" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-slate-900">{routes.length}</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-slate-600">Active Fleet</h3>
                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                      <Bus className="w-5 h-5 text-emerald-600" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-slate-900">{vehicles.length}</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-slate-600">Students Assigned</h3>
                    <div className="w-10 h-10 rounded-full bg-sky-50 flex items-center justify-center">
                      <Users className="w-5 h-5 text-sky-600" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-slate-900">{assignments.length}</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-slate-600">Open Incidents</h3>
                    <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-rose-600" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-slate-900">{incidents.length}</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-center text-slate-500">
                <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-slate-900 mb-1">Transport Control Hub</h3>
                <p className="text-sm">Navigate using the tabs above to manage routing, fleet compliance, and student mobility.</p>
              </div>
            </div>
          )}

          {activeTab === 'profiles' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-slate-50">
                <h3 className="text-sm font-semibold text-slate-900">Transport Profiles</h3>
              </div>
              <div className="divide-y divide-slate-100">
                {profiles.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-sm">No transport profiles found.</div>
                ) : (
                  profiles.map(p => (
                    <div key={p.transportProfileId} className="p-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-900">{p.name} ({p.code})</p>
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

          {activeTab === 'routes' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-slate-50">
                <h3 className="text-sm font-semibold text-slate-900">Transport Routes</h3>
              </div>
              <div className="divide-y divide-slate-100">
                {routes.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-sm">No routes defined.</div>
                ) : (
                  routes.map(r => (
                    <div key={r.routeId} className="p-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-900">{r.name} (v{r.version})</p>
                        <p className="text-xs text-slate-500">{r.startPoint} to {r.endPoint}</p>
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

          {activeTab === 'vehicles' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-slate-50">
                <h3 className="text-sm font-semibold text-slate-900">Fleet Register</h3>
              </div>
              <div className="divide-y divide-slate-100">
                {vehicles.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-sm">No vehicles found.</div>
                ) : (
                  vehicles.map(v => (
                    <div key={v.vehicleId} className="p-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-900">{v.registrationNumber}</p>
                        <p className="text-xs text-slate-500">{v.manufacturer} {v.model} | Capacity: {v.seatingCapacity}</p>
                      </div>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
                        v.status === 'ACTIVE' || v.status === 'IN_SERVICE' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {v.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'assignments' && (
             <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-center text-slate-500">
               <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
               <h3 className="text-lg font-medium text-slate-900 mb-1">Student Assignments</h3>
               <p className="text-sm">Manage student transport subscriptions and pickup/drop-off points.</p>
             </div>
          )}

          {activeTab === 'trips' && (
             <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-center text-slate-500">
               <Bus className="w-12 h-12 text-slate-300 mx-auto mb-3" />
               <h3 className="text-lg font-medium text-slate-900 mb-1">Trip Schedule & Operations</h3>
               <p className="text-sm">Monitor live trip status, boarding events, and actual delivery routes.</p>
             </div>
          )}
          
          {activeTab === 'incidents' && (
             <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-slate-50">
                <h3 className="text-sm font-semibold text-slate-900">Transport Incidents</h3>
              </div>
              <div className="divide-y divide-slate-100">
                {incidents.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-sm">No incidents reported.</div>
                ) : (
                  incidents.map(i => (
                    <div key={i.incidentId} className="p-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-rose-700">{i.type}</p>
                        <p className="text-xs text-slate-500">Severity: {i.severity}</p>
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-1 bg-amber-100 text-amber-800 rounded-lg">
                        {i.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
