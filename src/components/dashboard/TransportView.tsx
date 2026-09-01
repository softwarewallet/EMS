import React, { useState } from 'react';
import { Bus, MapPin, Phone, User, Users, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export const TransportView: React.FC = () => {
  const routes = [
    { id: 'BUS-01', routeName: 'Route 1 - Vasant Kunj, Munirka & R.K. Puram', driver: 'Satpal Singh', phone: '+91 98101 44521', vehicleNo: 'DL 01 SCH 2041', capacity: '42 / 45', status: 'on_route', speed: '38 km/h', nextStop: 'Munirka DDA Flats (07:45 AM)' },
    { id: 'BUS-02', routeName: 'Route 2 - Connaught Place, ITO & Pragati Maidan', driver: 'Ramesh Kumar', phone: '+91 98202 88410', vehicleNo: 'DL 01 SCH 1082', capacity: '38 / 40', status: 'on_route', speed: '32 km/h', nextStop: 'Mandi House Circle (07:50 AM)' },
    { id: 'BUS-03', routeName: 'Route 3 - Hauz Khas, Saket & Malviya Nagar', driver: 'Mohammad Aslam', phone: '+91 98110 99230', vehicleNo: 'DL 01 SCH 3055', capacity: '40 / 45', status: 'arrived', speed: '0 km/h', nextStop: 'School Main Gate No. 2' },
    { id: 'BUS-04', routeName: 'Route 4 - Greater Kailash, Nehru Place & Kalkaji', driver: 'Devendra Patil', phone: '+91 98711 33190', vehicleNo: 'DL 01 SCH 4120', capacity: '35 / 40', status: 'on_route', speed: '40 km/h', nextStop: 'GK-1 M Block Market (07:55 AM)' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">School Bus Fleet & GPS Transport</h2>
          <p className="text-xs text-slate-500 mt-1">Live Delhi NCR tracking, CNG fitness certifications, and driver duty rosters</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> 4 Fleet Buses on Route
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {routes.map((bus) => (
          <div key={bus.id} className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4 hover:border-blue-300 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0052FF] flex items-center justify-center font-bold">
                  <Bus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">{bus.routeName}</h3>
                  <p className="text-2xs font-mono text-slate-400">{bus.vehicleNo} • Bus ID: {bus.id}</p>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-2xs font-bold uppercase ${
                bus.status === 'on_route' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {bus.status?.replace('_', ' ') || 'Unknown'}
              </span>
            </div>

            <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-lg border border-slate-100">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <User className="w-3.5 h-3.5" /> Staff Driver
                </span>
                <span className="font-semibold text-slate-800">{bus.driver}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <Phone className="w-3.5 h-3.5" /> Emergency Mobile
                </span>
                <span className="font-mono text-slate-700">{bus.phone}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <MapPin className="w-3.5 h-3.5" /> Next Designated Stop
                </span>
                <span className="font-medium text-slate-800">{bus.nextStop}</span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-2xs">
                <span className="text-slate-400">GPS Speed: <strong className="text-slate-700">{bus.speed}</strong></span>
                <span className="text-slate-400">Capacity: <strong className="text-slate-700">{bus.capacity} seats</strong></span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
