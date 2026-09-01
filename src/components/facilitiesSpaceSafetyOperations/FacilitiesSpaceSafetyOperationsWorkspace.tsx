import React, { useState, useEffect } from 'react';
import {
  Building2,
  GitMerge,
  Sliders,
  CalendarDays,
  Gauge,
  ShieldAlert,
  Flame,
  Activity,
  UserCheck,
  Zap,
  Leaf,
  Plus,
  Play,
  RotateCcw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileCheck
} from 'lucide-react';
import { facilitiesSpaceSafetyOperationsService } from '../../services/facilitiesSpaceSafetyOperationsService';
import {
  InstitutionalSpace,
  SpaceReservation,
  UtilityMeter,
  UtilityReading,
  SafetyFinding,
  SafetyIncident,
  FacilitiesAuditEvent,
  FacilitiesSimulationScenario
} from '../../types/facilitiesSpaceSafetyOperations';
import { BookLoader } from '../common/BookLoader';

export const FacilitiesSpaceSafetyOperationsWorkspace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'spaces'
    | 'hierarchy'
    | 'reservations'
    | 'utilities'
    | 'safety'
    | 'sandbox'
    | 'audit'
  >('overview');

  const tenantId = 'TENANT_INDIA_DEFAULT';
  const campusId = 'CAMPUS_DELHI';

  // State caches
  const [spaces, setSpaces] = useState<InstitutionalSpace[]>([]);
  const [reservations, setReservations] = useState<SpaceReservation[]>([]);
  const [meters, setMeters] = useState<UtilityMeter[]>([]);
  const [readings, setReadings] = useState<UtilityReading[]>([]);
  const [findings, setFindings] = useState<SafetyFinding[]>([]);
  const [incidents, setIncidents] = useState<SafetyIncident[]>([]);
  const [auditEvents, setAuditEvents] = useState<FacilitiesAuditEvent[]>([]);
  const [diagnostics, setDiagnostics] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Message notifications
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form states
  const [newSpaceCode, setNewSpaceCode] = useState('');
  const [newSpaceName, setNewSpaceName] = useState('');
  const [newSpaceType, setNewSpaceType] = useState<'CLASSROOM' | 'LABORATORY' | 'OFFICE' | 'AUDITORIUM'>('CLASSROOM');
  const [newSpaceParentId, setNewSpaceParentId] = useState('');

  const [resSpaceId, setResSpaceId] = useState('');
  const [resPurpose, setResPurpose] = useState('');
  const [resCapacity, setResCapacity] = useState(15);

  const [meterIdRef, setMeterIdRef] = useState('');
  const [readingVal, setReadingVal] = useState(0);
  const [prevReadingVal, setPrevReadingVal] = useState(0);
  const [consumptionVal, setConsumptionVal] = useState(0);

  const [incidentTitle, setIncidentTitle] = useState('');
  const [incidentSeverity, setIncidentSeverity] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('LOW');

  // Sandbox simulation results
  const [simResult, setSimResult] = useState<FacilitiesSimulationScenario | null>(null);

  useEffect(() => {
    loadWorkspaceData();
  }, []);

  const loadWorkspaceData = () => {
    setLoading(true);
    try {
      setSpaces(facilitiesSpaceSafetyOperationsService.getSpaces(tenantId));
      setReservations(facilitiesSpaceSafetyOperationsService.getReservations(tenantId));
      setMeters(facilitiesSpaceSafetyOperationsService.getMeters(tenantId));
      setReadings(facilitiesSpaceSafetyOperationsService.getReadings(tenantId));
      setFindings(facilitiesSpaceSafetyOperationsService.getFindings(tenantId));
      setIncidents(facilitiesSpaceSafetyOperationsService.getIncidents(tenantId));
      setAuditEvents(facilitiesSpaceSafetyOperationsService.getAuditTrail(tenantId));
      setDiagnostics(facilitiesSpaceSafetyOperationsService.runDiagnostics(tenantId));
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSpace = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      facilitiesSpaceSafetyOperationsService.createSpace(
        {
          spaceCode: newSpaceCode,
          name: newSpaceName,
          tenantId,
          campusIdRef: campusId,
          spaceType: newSpaceType,
          hierarchyLevel: 'ROOM',
          nominalCapacity: 40,
          safeCapacity: 35,
          accessibilityCapacity: 4,
          isSafetyBlocked: false,
          isActive: true,
          parentSpaceIdRef: newSpaceParentId || undefined,
        },
        `SPC_KEY_${Date.now()}`
      );

      setNewSpaceCode('');
      setNewSpaceName('');
      setNewSpaceParentId('');
      setSuccessMsg(`Space ${newSpaceCode} successfully registered under hierarchical constraints.`);
      loadWorkspaceData();
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const handleMakeReservation = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);

    const targetSpaceId = resSpaceId || (spaces.length > 0 ? spaces[0].spaceId : '');
    if (!targetSpaceId) {
      setErrorMsg('No target space available for scheduling');
      return;
    }

    try {
      facilitiesSpaceSafetyOperationsService.createReservation({
        reservationId: `RES-${Date.now()}`,
        tenantId,
        spaceIdRef: targetSpaceId,
        userIdRef: 'USER_MGR_01',
        purpose: resPurpose || 'Academic Lecture',
        startDate: '2026-09-01T10:00:00.000Z',
        endDate: '2026-09-01T12:00:00.000Z',
        status: 'APPROVED',
        requestedCapacity: resCapacity,
        idempotencyKey: `RES_KEY_${Date.now()}`,
      });

      setResPurpose('');
      setSuccessMsg('Space reservation approved and scheduled with zero overlapping conflicts.');
      loadWorkspaceData();
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const handleRecordReading = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);

    const targetMeterId = meterIdRef || (meters.length > 0 ? meters[0].meterId : '');
    if (!targetMeterId) {
      setErrorMsg('No active telemetry meters found.');
      return;
    }

    try {
      facilitiesSpaceSafetyOperationsService.recordReading({
        tenantId,
        meterIdRef: targetMeterId,
        readingValue: readingVal,
        previousReadingValue: prevReadingVal || undefined,
        consumption: consumptionVal,
        recordedByUserIdRef: 'USER_TECH_01',
        recordedAt: new Date().toISOString(),
        isAnomaly: consumptionVal > 5000,
        idempotencyKey: `RDG_KEY_${Date.now()}`,
      });

      setReadingVal(0);
      setPrevReadingVal(0);
      setConsumptionVal(0);
      setSuccessMsg('Meter telemetry reading recorded and evaluated.');
      loadWorkspaceData();
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const handleReportIncident = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      facilitiesSpaceSafetyOperationsService.reportIncident({
        tenantId,
        campusIdRef: campusId,
        title: incidentTitle,
        description: 'Emergent safety action item',
        severity: incidentSeverity,
        status: 'REPORTED',
        reporterUserIdRef: 'USER_TECH_01',
        idempotencyKey: `INC_KEY_${Date.now()}`,
      });

      setIncidentTitle('');
      setSuccessMsg('Critical safety incident successfully registered into lifecycle queue.');
      loadWorkspaceData();
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const handleCloseIncident = (incidentId: string, sameUser: boolean) => {
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const closer = 'USER_CLOSE_1';
      const approver = sameUser ? 'USER_CLOSE_1' : 'USER_APP_2';

      facilitiesSpaceSafetyOperationsService.closeIncident(incidentId, tenantId, closer, approver);
      setSuccessMsg('Incident resolved and closed via strict Four-Eyes approval checks.');
      loadWorkspaceData();
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const handleRunSimulation = (scenarioId: string) => {
    setSuccessMsg(null);
    setErrorMsg(null);
    try {
      const res = facilitiesSpaceSafetyOperationsService.runSimulation(scenarioId);
      setSimResult(res);
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  if (loading) {
    return <BookLoader size="large" text="Loading Space, Utilities & Safety Workspace..." />;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Dynamic Header Block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-6 rounded-2xl text-white shadow-xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-600/20">
            <Building2 className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              Facilities, Space, Utilities & Safety
            </h1>
            <p className="text-sm text-slate-400 mt-1 font-medium">
              Authoritative Space Planning, Occupancy Limits, Meter Telemetry, and Four-Eyes Fire & Life Safety Guardrails
            </p>
          </div>
        </div>
        <div>
          <span className="px-3.5 py-1.5 bg-indigo-950 text-indigo-400 border border-indigo-800/60 rounded-full text-xs font-bold tracking-wider uppercase">
            EMS Phase 11.5 Operational
          </span>
        </div>
      </div>

      {/* Notifications banner */}
      {successMsg && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-800 text-emerald-300 rounded-xl flex items-center gap-3 text-sm font-medium">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-rose-950/40 border border-rose-800 text-rose-300 rounded-xl flex items-center gap-3 text-sm font-medium">
          <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* High density navigation tabs */}
      <div className="flex overflow-x-auto gap-2 border-b border-slate-800 pb-2 scrollbar-thin">
        {[
          { id: 'overview', label: 'Command Center', icon: Activity },
          { id: 'spaces', label: 'Spaces & Allocations', icon: Building2 },
          { id: 'hierarchy', label: 'Hierarchy Traversal', icon: GitMerge },
          { id: 'reservations', label: 'Reservations', icon: CalendarDays },
          { id: 'utilities', label: 'Utility Meters', icon: Gauge },
          { id: 'safety', label: 'Emergency & Incidents', icon: Flame },
          { id: 'sandbox', label: 'What-If Sandbox', icon: Sliders },
          { id: 'audit', label: 'Provenance Trail', icon: FileCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setSuccessMsg(null);
                setErrorMsg(null);
              }}
              className={`flex items-center gap-2 px-4.5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                  : 'bg-slate-800/40 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Total Rooms</span>
                <Building2 className="w-5 h-5 text-indigo-400" />
              </div>
              <p className="text-3xl font-black text-white">{spaces.length}</p>
              <p className="text-xs text-indigo-400 mt-2">Active Hierarchical Spaces</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Meters Online</span>
                <Gauge className="w-5 h-5 text-sky-400" />
              </div>
              <p className="text-3xl font-black text-white">{meters.length}</p>
              <p className="text-xs text-sky-400 mt-2">Telemetry Streams Active</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Active Hazards</span>
                <ShieldAlert className="w-5 h-5 text-rose-400 animate-pulse" />
              </div>
              <p className="text-3xl font-black text-rose-400">{findings.length + incidents.length}</p>
              <p className="text-xs text-rose-500 mt-2">Requires Mitigation Actions</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">SoD Validation</span>
                <UserCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <p className="text-3xl font-black text-emerald-400">HARDENED</p>
              <p className="text-xs text-slate-400 mt-2">Self-Approvals Rejected</p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
            <h3 className="text-md font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-indigo-400" /> Continuous Operational Diagnostics Engine
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {diagnostics.map((diag, idx) => (
                <div key={idx} className="p-3 bg-slate-800/40 border border-slate-700/60 rounded-xl flex items-center gap-3 text-xs text-slate-300">
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>{diag}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Spaces */}
      {activeTab === 'spaces' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <h3 className="text-md font-bold text-white mb-4">Register New Architectural Room</h3>
            <form onSubmit={handleCreateSpace} className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="Room Code (e.g., ROOM-203)"
                value={newSpaceCode}
                onChange={(e) => setNewSpaceCode(e.target.value)}
                required
                className="bg-slate-850 border border-slate-750 text-white rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none"
              />
              <input
                type="text"
                placeholder="Room Name"
                value={newSpaceName}
                onChange={(e) => setNewSpaceName(e.target.value)}
                required
                className="bg-slate-850 border border-slate-750 text-white rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none"
              />
              <select
                value={newSpaceParentId}
                onChange={(e) => setNewSpaceParentId(e.target.value)}
                className="bg-slate-850 border border-slate-750 text-white rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none"
              >
                <option value="">No Parent Building (Root Node)</option>
                {spaces.map(s => (
                  <option key={s.spaceId} value={s.spaceId}>{s.name} ({s.spaceCode})</option>
                ))}
              </select>
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider py-2.5 rounded-xl transition-all"
              >
                Add Room Layout
              </button>
            </form>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-800">
              <h3 className="text-md font-bold text-white">Authoritative Space Layout Directory</h3>
            </div>
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/40 text-slate-400 uppercase font-bold tracking-wider">
                <tr>
                  <th className="p-4">Room Code</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Capacity Limits (Safe / Max)</th>
                  <th className="p-4">Operational Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {spaces.map(s => (
                  <tr key={s.spaceId} className="hover:bg-slate-800/20">
                    <td className="p-4 font-mono font-bold text-indigo-400">{s.spaceCode}</td>
                    <td className="p-4 text-white font-semibold">{s.name}</td>
                    <td className="p-4 font-bold">{s.spaceType}</td>
                    <td className="p-4 font-mono">{s.safeCapacity} / {s.nominalCapacity} Students</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full font-bold ${
                        s.isSafetyBlocked ? 'bg-rose-950 text-rose-400 border border-rose-800' : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      }`}>
                        {s.isSafetyBlocked ? 'SAFETY BLOCKED' : 'ACTIVE'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Hierarchy */}
      {activeTab === 'hierarchy' && (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6">
          <div>
            <h3 className="text-md font-bold text-white">Institutional Tree Hierarchical Traversal</h3>
            <p className="text-xs text-slate-400 mt-1">
              Traverse parent-ancestor boundaries to ensure zero circular dependencies or orphaned node leaves.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {spaces.map(s => {
              const ancestors = facilitiesSpaceSafetyOperationsService.getAncestors(s.spaceId, tenantId);
              const children = facilitiesSpaceSafetyOperationsService.getChildren(s.spaceId, tenantId);
              return (
                <div key={s.spaceId} className="bg-slate-850 p-4 rounded-xl border border-slate-750/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-indigo-400">{s.spaceCode}</span>
                    <span className="px-2 py-0.5 bg-slate-800 rounded text-[10px] font-mono text-slate-400">
                      Depth: {facilitiesSpaceSafetyOperationsService.calculateHierarchyDepth(s.spaceId, tenantId)}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-white">{s.name}</p>

                  <div className="space-y-1 text-xs">
                    <div className="text-slate-400">
                      <span className="font-semibold text-slate-300">Ancestors:</span>{' '}
                      {ancestors.length > 0 ? ancestors.map(a => a.name).join(' → ') : 'None (Root Node)'}
                    </div>
                    <div className="text-slate-400">
                      <span className="font-semibold text-slate-300">Children:</span>{' '}
                      {children.length > 0 ? children.map(c => c.name).join(', ') : 'None (Leaf Node)'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab: Reservations */}
      {activeTab === 'reservations' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
              <h3 className="text-md font-bold text-white">Create Space Reservation</h3>
              <form onSubmit={handleMakeReservation} className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Target Space</label>
                  <select
                    value={resSpaceId}
                    onChange={(e) => setResSpaceId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none"
                  >
                    {spaces.map(s => (
                      <option key={s.spaceId} value={s.spaceId}>{s.name} ({s.spaceCode})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Purpose Description</label>
                  <input
                    type="text"
                    placeholder="e.g. Optics Midterm Lab Assessment"
                    value={resPurpose}
                    onChange={(e) => setResPurpose(e.target.value)}
                    required
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Requested Seat Count</label>
                  <input
                    type="number"
                    value={resCapacity}
                    onChange={(e) => setResCapacity(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider py-2.5 rounded-xl transition-all"
                >
                  Schedule Booking
                </button>
              </form>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-slate-800">
                <h3 className="text-md font-bold text-white">Approved Scheduling Log</h3>
              </div>
              <div className="divide-y divide-slate-800 max-h-[350px] overflow-y-auto">
                {reservations.map(r => {
                  const spaceObj = spaces.find(s => s.spaceId === r.spaceIdRef);
                  return (
                    <div key={r.reservationId} className="p-4 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{r.purpose}</span>
                        <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded text-[10px] font-bold">
                          {r.status}
                        </span>
                      </div>
                      <div className="text-slate-400 flex justify-between font-mono text-[10px]">
                        <span>Space: {spaceObj?.name || r.spaceIdRef}</span>
                        <span>Seats: {r.requestedCapacity}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Utilities */}
      {activeTab === 'utilities' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
              <h3 className="text-md font-bold text-white">Record Meter Reading</h3>
              <form onSubmit={handleRecordReading} className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Select Sub-Meter Node</label>
                  <select
                    value={meterIdRef}
                    onChange={(e) => setMeterIdRef(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none"
                  >
                    {meters.map(m => (
                      <option key={m.meterId} value={m.meterId}>{m.meterCode} ({m.meterType})</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Previous Value</label>
                    <input
                      type="number"
                      value={prevReadingVal}
                      onChange={(e) => setPrevReadingVal(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">New Value</label>
                    <input
                      type="number"
                      value={readingVal}
                      onChange={(e) => setReadingVal(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Computed Consumption</label>
                  <input
                    type="number"
                    value={consumptionVal}
                    onChange={(e) => setConsumptionVal(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider py-2.5 rounded-xl transition-all"
                >
                  Submit Reading
                </button>
              </form>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-slate-800">
                <h3 className="text-md font-bold text-white">Recorded Readings</h3>
              </div>
              <div className="divide-y divide-slate-800 max-h-[350px] overflow-y-auto">
                {readings.map(r => (
                  <div key={r.readingId} className="p-4 text-xs space-y-1">
                    <div className="flex justify-between items-center text-white font-semibold">
                      <span>Meter reading: {r.readingValue}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        r.isAnomaly ? 'bg-rose-950 text-rose-400 border border-rose-850' : 'bg-emerald-950 text-emerald-400'
                      }`}>
                        {r.isAnomaly ? 'ANOMALOUS SPIKE' : 'VALID'}
                      </span>
                    </div>
                    <p className="text-slate-400">Consumption recorded: {r.consumption} units</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Safety */}
      {activeTab === 'safety' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
              <h3 className="text-md font-bold text-white">Report Safety Incident</h3>
              <form onSubmit={handleReportIncident} className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Incident Headline</label>
                  <input
                    type="text"
                    placeholder="e.g., Water spill on nuclear physics lab floor"
                    value={incidentTitle}
                    onChange={(e) => setIncidentTitle(e.target.value)}
                    required
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Severity Tier</label>
                  <select
                    value={incidentSeverity}
                    onChange={(e) => setIncidentSeverity(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical (Triggers Four-Eyes SoD Validation)</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider py-2.5 rounded-xl transition-all"
                >
                  Log Incident
                </button>
              </form>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-slate-800">
                <h3 className="text-md font-bold text-white">Safety Incidents Log</h3>
              </div>
              <div className="divide-y divide-slate-800 max-h-[350px] overflow-y-auto">
                {incidents.map(i => (
                  <div key={i.incidentId} className="p-4 text-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{i.title}</span>
                      <span className={`px-2.5 py-1 rounded text-[10px] font-black ${
                        i.severity === 'CRITICAL' ? 'bg-rose-950 text-rose-400 border border-rose-800' : 'bg-slate-850 text-slate-400'
                      }`}>
                        {i.severity} Severity
                      </span>
                    </div>
                    {i.status !== 'CLOSED' ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleCloseIncident(i.incidentId, false)}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold rounded-lg transition-all"
                        >
                          Resolve &amp; Close (Pass SoD)
                        </button>
                        {i.severity === 'CRITICAL' && (
                          <button
                            onClick={() => handleCloseIncident(i.incidentId, true)}
                            className="px-3 py-1 bg-rose-900/50 hover:bg-rose-900 border border-rose-700 text-rose-200 text-[10px] font-bold rounded-lg transition-all"
                          >
                            Self-Approve (Fail SoD)
                          </button>
                        )}
                      </div>
                    ) : (
                      <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> Incident Closed &amp; Verified
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Sandbox */}
      {activeTab === 'sandbox' && (
        <div className="space-y-6">
          <div className="bg-indigo-950/30 border border-indigo-800/80 p-4 rounded-xl text-indigo-300 font-bold text-center tracking-wide text-xs">
            SIMULATION ONLY • SANDBOX MODE ACTIVE • ZERO PRODUCTION MUTATION
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { id: 'CAMPUS_OCCUPANCY_SURGE', label: 'Simulate Bulk Occupancy Surge' },
              { id: 'ROOM_CAPACITY_EXHAUSTION', label: 'Simulate Safe Capacity Bounds Exhaustion' },
              { id: 'DOUBLE_BOOKING_CONFLICT', label: 'Simulate Space Double Booking Conflicts' },
              { id: 'BUILDING_CLOSURE', label: 'Simulate Urgent Block Lockdown' },
              { id: 'UTILITY_CONSUMPTION_SPIKE', label: 'Simulate Water Line Rupture Consumption Spike' },
            ].map(scenario => (
              <button
                key={scenario.id}
                onClick={() => handleRunSimulation(scenario.id)}
                className="bg-slate-900 border border-slate-800 hover:border-indigo-500 p-4 rounded-xl text-left text-white font-bold text-xs flex items-center justify-between transition-all"
              >
                <span>{scenario.label}</span>
                <Play className="w-4 h-4 text-indigo-400" />
              </button>
            ))}
          </div>

          {simResult && (
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-slate-200 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Sandbox Run Summary: {simResult.name}</h4>
              <p className="text-sm text-emerald-400 font-semibold">{simResult.result}</p>
              <div className="grid grid-cols-3 gap-4 text-[10px] bg-slate-850 p-4 rounded-xl font-mono">
                <div>Processed Spaces: {simResult.metrics?.processed}</div>
                <div>Live Production Mutations: {simResult.metrics?.mutations}</div>
                <div>Sim Run-Time: {simResult.metrics?.executionTimeMs}ms</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab: Audit */}
      {activeTab === 'audit' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-800">
            <h3 className="text-md font-bold text-white">Append-Only Cryptographic Ledger Traceability</h3>
          </div>
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/40 text-slate-400 uppercase font-bold tracking-wider">
              <tr>
                <th className="p-4">Event ID</th>
                <th className="p-4">Action Route</th>
                <th className="p-4">Entity Point</th>
                <th className="p-4">SHA-256 Signature</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono text-[10px]">
              {auditEvents.map(evt => (
                <tr key={evt.eventId} className="hover:bg-slate-800/20">
                  <td className="p-4 text-indigo-400 font-bold">{evt.eventId}</td>
                  <td className="p-4 text-white font-sans font-semibold">{evt.action}</td>
                  <td className="p-4">{evt.entityType}:{evt.entityId}</td>
                  <td className="p-4 text-slate-400 max-w-xs truncate">{evt.currentHash}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
