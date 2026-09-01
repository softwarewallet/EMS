import React, { useState, useEffect } from 'react';
import {
  Bus,
  User,
  GitFork,
  Gauge,
  Wrench,
  Fuel,
  ShieldAlert,
  Calendar,
  History,
  Play,
  RotateCcw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Plus,
  Send,
  Building,
  ShieldCheck,
  Activity,
  UserCheck,
  PlusCircle,
  Clock,
  ArrowRight,
  Sparkles,
  ClipboardList
} from 'lucide-react';
import { transportFleetMobilityService } from '../../services/transportFleetMobilityService';
import {
  Vehicle,
  DriverQualification,
  TransportRoute,
  Trip,
  MaintenanceWorkOrder,
  FuelRecord,
  OdometerRecord,
  TransportIncident,
  TransportException,
  TransportAuditEvent,
  SimulationScenario,
  VehicleLifecycleState,
  TripLifecycleState,
  MaintenanceLifecycleState,
  IncidentLifecycleState
} from '../../types/transportFleetMobility';

export const TransportFleetMobilityWorkspace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'vehicles'
    | 'drivers'
    | 'routes'
    | 'trips'
    | 'dispatch'
    | 'passengers'
    | 'maintenance'
    | 'telemetry'
    | 'safety'
    | 'compliance'
    | 'diagnostics'
    | 'audit'
    | 'sandbox'
  >('overview');

  const tenantId = 'TENANT_INDIA_DEFAULT';
  const campusId = 'CAMPUS_DELHI';

  // --- CORE STATE CACHES ---
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<DriverQualification[]>([]);
  const [routes, setRoutes] = useState<TransportRoute[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [workOrders, setWorkOrders] = useState<MaintenanceWorkOrder[]>([]);
  const [odometers, setOdometers] = useState<OdometerRecord[]>([]);
  const [incidents, setIncidents] = useState<TransportIncident[]>([]);
  const [exceptions, setExceptions] = useState<TransportException[]>([]);
  const [auditEvents, setAuditEvents] = useState<TransportAuditEvent[]>([]);
  const [diagnostics, setDiagnostics] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Notifications
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // --- FORM STATES ---
  // Vehicle Create
  const [vehId, setVehId] = useState('');
  const [vehReg, setVehReg] = useState('');
  const [vehVin, setVehVin] = useState('');
  const [vehClass, setVehClass] = useState('VC-BUS');
  const [vehMake, setVehMake] = useState('');
  const [vehModel, setVehModel] = useState('');
  const [vehCapacity, setVehCapacity] = useState(40);
  const [vehInsExp, setVehInsExp] = useState('2028-12-31T00:00:00.000Z');
  const [vehPermitExp, setVehPermitExp] = useState('2028-12-31T00:00:00.000Z');
  const [vehInspExp, setVehInspExp] = useState('2028-12-31T00:00:00.000Z');

  // Driver Qual Create
  const [drQualId, setDrQualId] = useState('');
  const [drEmpId, setDrEmpId] = useState('');
  const [drLicNum, setDrLicNum] = useState('');
  const [drLicClass, setDrLicClass] = useState('BUS');
  const [drValidUntil, setDrValidUntil] = useState('2030-12-31T00:00:00.000Z');

  // Route Create
  const [rtId, setRtId] = useState('');
  const [rtCode, setRtCode] = useState('');
  const [rtName, setRtName] = useState('');
  const [rtOrigin, setRtOrigin] = useState('');
  const [rtDest, setRtDest] = useState('');
  const [rtDist, setRtDist] = useState(15);
  const [rtDuration, setRtDuration] = useState(40);

  // Trip Create
  const [tripId, setTripId] = useState('');
  const [tripCode, setTripCode] = useState('');
  const [tripRouteId, setTripRouteId] = useState('');
  const [tripDeparture, setTripDeparture] = useState('');
  const [tripPassCount, setTripPassCount] = useState(10);

  // Dispatch Action
  const [dispTripId, setDispTripId] = useState('');
  const [dispVehId, setDispVehId] = useState('');
  const [dispDriverId, setDispDriverId] = useState('');
  const [dispIdempotency, setDispIdempotency] = useState('');
  const [dispOverrideRequester, setDispOverrideRequester] = useState('');

  // Maintenance WO Create
  const [woId, setWoId] = useState('');
  const [woNum, setWoNum] = useState('');
  const [woVehId, setWoVehId] = useState('');
  const [woType, setWoType] = useState<'PREVENTIVE' | 'CORRECTIVE'>('PREVENTIVE');
  const [woDesc, setWoDesc] = useState('');
  const [woIsSafety, setWoIsSafety] = useState(false);

  // Telemetry Recording
  const [telVehId, setTelVehId] = useState('');
  const [telOdoVal, setTelOdoVal] = useState(55000);
  const [telPrevOdoVal, setTelPrevOdoVal] = useState(54200);
  const [telFuelLiters, setTelFuelLiters] = useState(45);
  const [telFuelCost, setTelFuelCost] = useState(4100);

  // Safety Incident Report
  const [incId, setIncId] = useState('');
  const [incTitle, setIncTitle] = useState('');
  const [incDesc, setIncDesc] = useState('');
  const [incSeverity, setIncSeverity] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('LOW');
  const [incVehId, setIncVehId] = useState('');
  const [incEmpId, setIncEmpId] = useState('');

  // Exception Submit
  const [excId, setExcId] = useState('');
  const [excType, setExcType] = useState<'CAPACITY_OVERRIDE' | 'EXPIRED_QUALIFICATION_DISPATCH' | 'SAFETY_BLOCKED_DISPATCH' | 'CROSS_CAMPUS_ROUTE'>('CAPACITY_OVERRIDE');
  const [excReason, setExcReason] = useState('');

  // Simulation Running
  const [selectedScenario, setSelectedScenario] = useState('FLEET_SURGE');
  const [simResult, setSimResult] = useState<SimulationScenario | null>(null);

  // --- REFRESH DATA HANDLER ---
  const loadData = () => {
    setLoading(true);
    try {
      setVehicles(transportFleetMobilityService.getVehicles(tenantId));
      setDrivers(transportFleetMobilityService.getDriverQualifications(tenantId));
      setRoutes(transportFleetMobilityService.getRoutes(tenantId));
      setTrips(transportFleetMobilityService.getTrips(tenantId));
      setWorkOrders(transportFleetMobilityService.getMaintenanceWorkOrders(tenantId));
      setOdometers(transportFleetMobilityService.getOdometerRecords(tenantId));
      setIncidents(transportFleetMobilityService.getIncidents(tenantId));
      setAuditEvents(transportFleetMobilityService.getAuditTrail(tenantId));
      setDiagnostics(transportFleetMobilityService.runDiagnostics(tenantId));
    } catch (e: any) {
      setErrorMsg(e.message || 'Error pulling operations lists.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const triggerSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setErrorMsg(null);
    loadData();
    setTimeout(() => setSuccessMsg(null), 5000);
  };

  const triggerError = (msg: string) => {
    setErrorMsg(msg);
    setSuccessMsg(null);
    setTimeout(() => setErrorMsg(null), 7000);
  };

  // --- ACTIONS ---
  const handleCreateVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      transportFleetMobilityService.createVehicle({
        vehicleId: vehId || `VH-${Date.now().toString().slice(-4)}`,
        registrationNumber: vehReg,
        vin: vehVin,
        vehicleClassIdRef: vehClass,
        tenantId,
        campusIdRef: campusId,
        make: vehMake,
        model: vehModel,
        year: 2024,
        capacity: Number(vehCapacity),
        status: 'ACTIVE',
        insuranceExpiry: vehInsExp,
        permitExpiry: vehPermitExp,
        inspectionExpiry: vehInspExp,
        isActive: true,
        isSafetyBlocked: false,
      }, 'COORDINATOR_A');
      triggerSuccess(`Vehicle ${vehReg} created successfully.`);
      setVehId(''); setVehReg(''); setVehVin(''); setVehMake(''); setVehModel('');
    } catch (err: any) {
      triggerError(err.message || 'Failed to create vehicle.');
    }
  };

  const handleUpdateVehicleStatus = (vehicleId: string, status: VehicleLifecycleState) => {
    try {
      transportFleetMobilityService.updateVehicleStatus(vehicleId, tenantId, status, 'COORDINATOR_A');
      triggerSuccess(`Vehicle status updated to ${status}.`);
    } catch (err: any) {
      triggerError(err.message || 'Failed to update vehicle status.');
    }
  };

  const handleCreateDriverQual = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      transportFleetMobilityService.createDriverQualification({
        qualificationId: drQualId || `DQ-${Date.now().toString().slice(-4)}`,
        tenantId,
        employeeIdRef: drEmpId,
        licenseNumber: drLicNum,
        licenseClass: drLicClass,
        validUntil: drValidUntil,
        isSuspended: false,
        authorizedStatus: 'AUTHORIZED',
      }, 'COORDINATOR_A');
      triggerSuccess(`Driver Qualification for employee ${drEmpId} saved.`);
      setDrQualId(''); setDrEmpId(''); setDrLicNum('');
    } catch (err: any) {
      triggerError(err.message || 'Failed to register driver.');
    }
  };

  const handleToggleDriverSuspension = (qualId: string, currentSuspended: boolean) => {
    try {
      transportFleetMobilityService.updateDriverSuspension(qualId, tenantId, !currentSuspended, 'COORDINATOR_A');
      triggerSuccess(`Driver suspension toggled to ${!currentSuspended}`);
    } catch (err: any) {
      triggerError(err.message || 'Failed to toggle suspension.');
    }
  };

  const handleCreateRoute = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      transportFleetMobilityService.createRoute({
        routeId: rtId || `RT-${Date.now().toString().slice(-4)}`,
        routeCode: rtCode,
        routeName: rtName,
        tenantId,
        campusIdRef: campusId,
        originName: rtOrigin,
        destinationName: rtDest,
        stopPoints: ['Intermediary Point A', 'Intermediary Point B'],
        estimatedDistanceKm: Number(rtDist),
        estimatedDurationMin: Number(rtDuration),
        isActive: true,
      }, 'COORDINATOR_A');
      triggerSuccess(`Route ${rtName} defined successfully.`);
      setRtId(''); setRtCode(''); setRtName(''); setRtOrigin(''); setRtDest('');
    } catch (err: any) {
      triggerError(err.message || 'Failed to create route.');
    }
  };

  const handleCreateTrip = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      transportFleetMobilityService.createTrip({
        tripId: tripId || `TR-${Date.now().toString().slice(-4)}`,
        tripCode,
        tenantId,
        campusIdRef: campusId,
        routeIdRef: tripRouteId,
        status: 'PLANNED',
        plannedDeparture: tripDeparture || new Date(Date.now() + 1800000).toISOString(),
        passengerCount: Number(tripPassCount),
      }, 'COORDINATOR_A');
      triggerSuccess(`Shuttle Trip ${tripCode} scheduled.`);
      setTripId(''); setTripCode(''); setTripRouteId('');
    } catch (err: any) {
      triggerError(err.message || 'Failed to plan trip.');
    }
  };

  const handleDispatchTripSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      transportFleetMobilityService.dispatchTrip(
        dispTripId,
        tenantId,
        dispVehId,
        dispDriverId,
        'COORDINATOR_A',
        dispIdempotency || `IDEM-${Date.now()}`,
        dispOverrideRequester || undefined
      );
      triggerSuccess('Trip successfully Dispatched. Vehicle is active.');
      setDispTripId(''); setDispVehId(''); setDispDriverId(''); setDispIdempotency(''); setDispOverrideRequester('');
    } catch (err: any) {
      triggerError(err.message || 'Dispatch rejected due to compliance checks.');
    }
  };

  const handleTripStatusUpdate = (tripId: string, status: TripLifecycleState) => {
    try {
      transportFleetMobilityService.updateTripStatus(tripId, tenantId, status, 'COORDINATOR_A');
      triggerSuccess(`Trip state transitioned to ${status}.`);
    } catch (err: any) {
      triggerError(err.message || 'State transition rejected.');
    }
  };

  const handleCreateWorkOrder = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      transportFleetMobilityService.createMaintenanceWorkOrder({
        workOrderId: woId || `WO-${Date.now().toString().slice(-4)}`,
        workOrderNumber: woNum,
        tenantId,
        vehicleIdRef: woVehId,
        maintenanceType: woType,
        issueDescription: woDesc,
        requestedByUserIdRef: 'USER_MGR',
        isSafetyBlocking: woIsSafety,
      }, 'USER_MGR');
      triggerSuccess(`Work order ${woNum} requested successfully.`);
      setWoId(''); setWoNum(''); setWoVehId(''); setWoDesc(''); setWoIsSafety(false);
    } catch (err: any) {
      triggerError(err.message || 'Failed to submit maintenance request.');
    }
  };

  const handleApproveWorkOrder = (woId: string, requesterId: string) => {
    try {
      // Four-eyes checklist logic requires different approver
      const currentApprover = 'USER_TEST_SAME'; // Simulation actor
      transportFleetMobilityService.approveMaintenance(woId, tenantId, currentApprover);
      triggerSuccess('Maintenance work order approved and scheduled.');
    } catch (err: any) {
      triggerError(err.message || 'Approval rejected.');
    }
  };

  const handleCompleteWorkOrder = (woId: string) => {
    try {
      transportFleetMobilityService.completeMaintenance(woId, tenantId, 'MECHANIC_A', 'Completed comprehensive engine calibration & safety checks.');
      triggerSuccess('Maintenance completed. Pending verification sign-off.');
    } catch (err: any) {
      triggerError(err.message || 'Failed.');
    }
  };

  const handleVerifyWorkOrder = (woId: string) => {
    try {
      transportFleetMobilityService.verifyAndCloseMaintenance(woId, tenantId, 'AUDITOR_SAFETY_A');
      triggerSuccess('Work order verified and closed. Vehicle returned to Active.');
    } catch (err: any) {
      triggerError(err.message || 'Verification rejected.');
    }
  };

  const handleRecordTelemetry = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!telVehId) throw new Error('Must specify vehicle');

      // 1. Log Odometer
      transportFleetMobilityService.recordOdometer({
        odometerRecordId: `ODM-${Date.now()}`,
        tenantId,
        vehicleIdRef: telVehId,
        readingValue: Number(telOdoVal),
        previousReadingValue: Number(telPrevOdoVal),
        recordedByUserIdRef: 'USER_TECH_01',
        recordedAt: new Date().toISOString(),
        isAnomaly: false,
      }, 'USER_TECH_01');

      // 2. Log Fuel
      transportFleetMobilityService.recordFuel({
        fuelRecordId: `FL-${Date.now()}`,
        tenantId,
        vehicleIdRef: telVehId,
        recordedByUserIdRef: 'USER_TECH_01',
        refueledAt: new Date().toISOString(),
        fuelQuantityLiters: Number(telFuelLiters),
        cost: Number(telFuelCost),
        odometerReading: Number(telOdoVal),
      }, 'USER_TECH_01');

      triggerSuccess('Telemetry & Fuel data registered successfully.');
      setTelVehId('');
    } catch (err: any) {
      triggerError(err.message || 'Telemetry logs rejected.');
    }
  };

  const handleReportIncident = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      transportFleetMobilityService.reportIncident({
        incidentId: incId || `INC-${Date.now().toString().slice(-4)}`,
        tenantId,
        campusIdRef: campusId,
        vehicleIdRef: incVehId || undefined,
        employeeIdRef: incEmpId || undefined,
        title: incTitle,
        description: incDesc,
        severity: incSeverity,
        status: 'REPORTED',
        reportedByUserIdRef: 'USER_REPORTER_A',
        isSafetyBlocking: incSeverity === 'CRITICAL',
      }, 'USER_REPORTER_A');
      triggerSuccess('Incident reported. Fleet and safety alerts generated.');
      setIncId(''); setIncTitle(''); setIncDesc(''); setIncVehId(''); setIncEmpId('');
    } catch (err: any) {
      triggerError(err.message || 'Failed to report incident.');
    }
  };

  const handleTriageIncident = (incidentId: string, status: IncidentLifecycleState) => {
    try {
      transportFleetMobilityService.triageIncident(incidentId, tenantId, status, 'SAFETY_OFFICER_A');
      triggerSuccess(`Incident status updated to ${status}.`);
    } catch (err: any) {
      triggerError(err.message || 'Triage rejected.');
    }
  };

  const handleCloseIncident = (incidentId: string) => {
    try {
      // Four-Eyes SoD closedBy !== requester
      transportFleetMobilityService.closeIncident(incidentId, tenantId, 'SAFETY_AUDITOR_B', 'USER_REPORTER_A');
      triggerSuccess('Critical incident verified and closed under Four-Eyes approval.');
    } catch (err: any) {
      triggerError(err.message || 'Close approval rejected.');
    }
  };

  const handleSubmitException = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      transportFleetMobilityService.submitException({
        exceptionId: excId || `EXC-${Date.now().toString().slice(-4)}`,
        tenantId,
        requestedByUserIdRef: 'COORDINATOR_A',
        exceptionType: excType,
        reason: excReason,
        isApproved: false,
      }, 'COORDINATOR_A');
      triggerSuccess('Operational exception submitted to registry for audit.');
      setExcId(''); setExcReason('');
    } catch (err: any) {
      triggerError(err.message || 'Failed.');
    }
  };

  const handleRunSimulation = () => {
    try {
      const res = transportFleetMobilityService.runSimulation(selectedScenario);
      setSimResult(res);
    } catch (err: any) {
      triggerError(err.message || 'Simulation runtime error.');
    }
  };

  // --- RENDERING TABS ---
  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 bg-neutral-50 min-h-screen text-neutral-800" id="transport-workspace">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-neutral-200 pb-5 mb-6">
        <div>
          <span className="text-xs font-semibold text-neutral-500 tracking-wider uppercase">EMS Phase 11.6 Operations</span>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 mt-1 flex items-center gap-3">
            <Bus className="h-8 w-8 text-indigo-600" />
            Institutional Transport, Fleet &amp; Mobility
          </h1>
          <p className="text-neutral-500 text-sm mt-1 max-w-2xl">
            Authoritative full-stack module for vehicle registers, compliance audits, driver qualifications, real-time dispatches, and diagnostics.
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <button
            onClick={() => loadData()}
            className="px-3 py-2 bg-white border border-neutral-200 rounded-md text-sm font-medium hover:bg-neutral-50 flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Refresh Core
          </button>
        </div>
      </div>

      {/* ALERT BOXES */}
      {successMsg && (
        <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg flex items-center gap-3 text-sm animate-fade-in">
          <CheckCircle className="h-5 w-5 text-emerald-600" />
          <span className="font-semibold">{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="mb-4 p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg flex items-center gap-3 text-sm">
          <XCircle className="h-5 w-5 text-rose-600" />
          <span className="font-semibold">{errorMsg}</span>
        </div>
      )}

      {/* WORKSPACE NAVIGATION TABS */}
      <div className="flex flex-wrap gap-1 border-b border-neutral-200 pb-px mb-6 overflow-x-auto scrollbar-none">
        {[
          { id: 'overview', label: 'Command Center', icon: Activity },
          { id: 'vehicles', label: 'Fleet & Vehicles', icon: Bus },
          { id: 'drivers', label: 'Drivers', icon: User },
          { id: 'routes', label: 'Routes & Areas', icon: GitFork },
          { id: 'trips', label: 'Requests & Trips', icon: Calendar },
          { id: 'dispatch', label: 'Dispatch Control', icon: Send },
          { id: 'maintenance', label: 'Maintenance', icon: Wrench },
          { id: 'telemetry', label: 'Fuel & Telemetry', icon: Fuel },
          { id: 'safety', label: 'Safety & Incidents', icon: ShieldAlert },
          { id: 'compliance', label: 'Compliance & Exceptions', icon: ShieldCheck },
          { id: 'diagnostics', label: 'Diagnostics Engine', icon: ClipboardList },
          { id: 'audit', label: 'Audit trail', icon: History },
          { id: 'sandbox', label: 'What-If Sandbox', icon: Sparkles },
        ].map(tab => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                active
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-900 hover:border-neutral-300'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* --- TAB CONTENT LAYOUTS --- */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* STATS STRIP */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 border border-neutral-200 rounded-xl shadow-sm">
              <span className="text-neutral-500 text-xs uppercase font-semibold">Active Fleet size</span>
              <p className="text-3xl font-extrabold text-neutral-900 mt-2">{vehicles.length}</p>
              <p className="text-xs text-neutral-500 mt-1">Units logged in primary register</p>
            </div>
            <div className="bg-white p-5 border border-neutral-200 rounded-xl shadow-sm">
              <span className="text-neutral-500 text-xs uppercase font-semibold">Authorized Drivers</span>
              <p className="text-3xl font-extrabold text-neutral-900 mt-2">
                {drivers.filter(d => d.authorizedStatus === 'AUTHORIZED').length}
              </p>
              <p className="text-xs text-neutral-500 mt-1">Credentials verified &amp; active</p>
            </div>
            <div className="bg-white p-5 border border-neutral-200 rounded-xl shadow-sm">
              <span className="text-neutral-500 text-xs uppercase font-semibold">Active Trips</span>
              <p className="text-3xl font-extrabold text-neutral-900 mt-2">
                {trips.filter(t => t.status === 'DISPATCHED' || t.status === 'IN_PROGRESS').length}
              </p>
              <p className="text-xs text-neutral-500 mt-1">Shuttles currently in-transit</p>
            </div>
            <div className="bg-white p-5 border border-neutral-200 rounded-xl shadow-sm">
              <span className="text-neutral-500 text-xs uppercase font-semibold">Open Safety Incidents</span>
              <p className="text-3xl font-extrabold text-neutral-900 mt-2">
                {incidents.filter(i => i.status !== 'CLOSED').length}
              </p>
              <p className="text-xs text-rose-600 font-semibold mt-1 flex items-center gap-1">
                <AlertTriangle className="h-3.5 w-3.5" /> Urgent reviews needed
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Core Diagnostics Panel */}
            <div className="lg:col-span-2 bg-white p-6 border border-neutral-200 rounded-xl shadow-sm">
              <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2 mb-4">
                <Activity className="h-5 w-5 text-indigo-600" />
                Live Fleet Diagnostics Scan
              </h2>
              <div className="space-y-3">
                {diagnostics.map((diag, index) => {
                  const isSuccess = diag.includes('clear');
                  return (
                    <div
                      key={index}
                      className={`p-3.5 rounded-lg border text-sm flex items-start gap-3 ${
                        isSuccess
                          ? 'bg-emerald-50/50 border-emerald-100 text-emerald-800'
                          : 'bg-amber-50/60 border-amber-100 text-amber-900'
                      }`}
                    >
                      {isSuccess ? (
                        <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <span className="font-semibold block">{isSuccess ? 'Clear' : 'Warning'}</span>
                        <p className="text-xs text-neutral-600 mt-0.5">{diag}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions / Info */}
            <div className="bg-white p-6 border border-neutral-200 rounded-xl shadow-sm space-y-6">
              <div>
                <h3 className="text-base font-bold text-neutral-900 mb-2">Campus Boundaries</h3>
                <p className="text-xs text-neutral-500">
                  Fleet operations strictly governed by tenant isolated routers. Cross-tenant routes are locked unless a compliance exception is verified.
                </p>
                <div className="mt-3 p-3 bg-neutral-50 rounded-lg border border-neutral-150 text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Default Tenant:</span>
                    <span className="font-semibold text-neutral-800">{tenantId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Target Campus:</span>
                    <span className="font-semibold text-neutral-800">{campusId}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-neutral-900 mb-2">Four-Eyes SoD Guidelines</h3>
                <p className="text-xs text-neutral-500">
                  Critical approvals (maintenance scheduling, safety blocks, vehicle dispatch bypass, incident resolution) enforce isolation: requester cannot approve or sign-off themselves.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'vehicles' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 border border-neutral-200 rounded-xl shadow-sm">
              <h2 className="text-lg font-bold text-neutral-900 mb-4">Vehicle Registry</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-100 bg-neutral-50/50">
                      <th className="p-3 text-neutral-500 font-semibold text-xs uppercase">Vehicle Code</th>
                      <th className="p-3 text-neutral-500 font-semibold text-xs uppercase">Registration</th>
                      <th className="p-3 text-neutral-500 font-semibold text-xs uppercase">Make/Model</th>
                      <th className="p-3 text-neutral-500 font-semibold text-xs uppercase">Capacity</th>
                      <th className="p-3 text-neutral-500 font-semibold text-xs uppercase">Status</th>
                      <th className="p-3 text-neutral-500 font-semibold text-xs uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehicles.map(v => (
                      <tr key={v.vehicleId} className="border-b border-neutral-100 hover:bg-neutral-50/50">
                        <td className="p-3 font-semibold text-indigo-700">{v.vehicleId}</td>
                        <td className="p-3 font-mono text-xs">{v.registrationNumber}</td>
                        <td className="p-3 text-xs">{v.make} {v.model}</td>
                        <td className="p-3 text-xs">{v.capacity} seats</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                            v.status === 'ACTIVE'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                              : v.status === 'MAINTENANCE'
                              ? 'bg-amber-50 text-amber-700 border border-amber-100'
                              : 'bg-neutral-100 text-neutral-700'
                          }`}>
                            {v.status}
                          </span>
                        </td>
                        <td className="p-3 flex gap-1">
                          {v.status === 'ACTIVE' && (
                            <button
                              onClick={() => handleUpdateVehicleStatus(v.vehicleId, 'MAINTENANCE')}
                              className="px-2 py-1 text-xs bg-amber-50 border border-amber-200 text-amber-700 rounded hover:bg-amber-100"
                            >
                              Under Maintenance
                            </button>
                          )}
                          {v.status === 'MAINTENANCE' && (
                            <button
                              onClick={() => handleUpdateVehicleStatus(v.vehicleId, 'ACTIVE')}
                              className="px-2 py-1 text-xs bg-emerald-50 border border-emerald-200 text-emerald-700 rounded hover:bg-emerald-100"
                            >
                              Make Active
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 border border-neutral-200 rounded-xl shadow-sm">
            <h3 className="text-base font-bold text-neutral-900 mb-4">Register New Vehicle</h3>
            <form onSubmit={handleCreateVehicle} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Vehicle Code</label>
                <input
                  type="text"
                  placeholder="e.g. VH-104"
                  value={vehId}
                  onChange={e => setVehId(e.target.value)}
                  className="w-full text-sm p-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-600"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Registration Number</label>
                <input
                  type="text"
                  placeholder="e.g. DL-01-A-0000"
                  value={vehReg}
                  onChange={e => setVehReg(e.target.value)}
                  className="w-full text-sm p-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-600"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Make</label>
                  <input
                    type="text"
                    placeholder="e.g. Tata"
                    value={vehMake}
                    onChange={e => setVehMake(e.target.value)}
                    className="w-full text-sm p-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Model</label>
                  <input
                    type="text"
                    placeholder="e.g. Bus 40"
                    value={vehModel}
                    onChange={e => setVehModel(e.target.value)}
                    className="w-full text-sm p-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-600"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Vehicle Capacity</label>
                <input
                  type="number"
                  value={vehCapacity}
                  onChange={e => setVehCapacity(Number(e.target.value))}
                  className="w-full text-sm p-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-600"
                  min="2"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <PlusCircle className="h-4 w-4" />
                Add to Fleet
              </button>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'drivers' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 border border-neutral-200 rounded-xl shadow-sm">
              <h2 className="text-lg font-bold text-neutral-900 mb-4">Driver Qualifications &amp; License Log</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-100 bg-neutral-50/50">
                      <th className="p-3 text-neutral-500 font-semibold text-xs uppercase">Driver ID (Employee)</th>
                      <th className="p-3 text-neutral-500 font-semibold text-xs uppercase">License Class</th>
                      <th className="p-3 text-neutral-500 font-semibold text-xs uppercase">License Num</th>
                      <th className="p-3 text-neutral-500 font-semibold text-xs uppercase">Valid Until</th>
                      <th className="p-3 text-neutral-500 font-semibold text-xs uppercase">Status</th>
                      <th className="p-3 text-neutral-500 font-semibold text-xs uppercase">Suspended</th>
                    </tr>
                  </thead>
                  <tbody>
                    {drivers.map(d => (
                      <tr key={d.qualificationId} className="border-b border-neutral-100 hover:bg-neutral-50/50">
                        <td className="p-3 font-semibold text-neutral-900">{d.employeeIdRef}</td>
                        <td className="p-3"><span className="px-1.5 py-0.5 bg-neutral-100 text-xs font-semibold rounded">{d.licenseClass}</span></td>
                        <td className="p-3 font-mono text-xs">{d.licenseNumber}</td>
                        <td className="p-3 text-xs">{new Date(d.validUntil).toLocaleDateString()}</td>
                        <td className="p-3 text-xs">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                            d.authorizedStatus === 'AUTHORIZED'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                              : 'bg-rose-50 text-rose-700 border border-rose-100'
                          }`}>
                            {d.authorizedStatus}
                          </span>
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => handleToggleDriverSuspension(d.qualificationId, d.isSuspended)}
                            className={`px-2 py-1 text-xs rounded border transition-all ${
                              d.isSuspended
                                ? 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'
                                : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                            }`}
                          >
                            {d.isSuspended ? 'Suspended (click to free)' : 'Active (click to block)'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 border border-neutral-200 rounded-xl shadow-sm">
            <h3 className="text-base font-bold text-neutral-900 mb-4">Register New Driver Qualification</h3>
            <form onSubmit={handleCreateDriverQual} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Driver Qualification ID</label>
                <input
                  type="text"
                  placeholder="e.g. DQ-004"
                  value={drQualId}
                  onChange={e => setDrQualId(e.target.value)}
                  className="w-full text-sm p-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-600"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Employee ID Reference</label>
                <input
                  type="text"
                  placeholder="e.g. EMP-001"
                  value={drEmpId}
                  onChange={e => setDrEmpId(e.target.value)}
                  className="w-full text-sm p-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-600"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">License Number</label>
                <input
                  type="text"
                  placeholder="e.g. DL-12345"
                  value={drLicNum}
                  onChange={e => setDrLicNum(e.target.value)}
                  className="w-full text-sm p-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-600"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">License Class Authorization</label>
                <select
                  value={drLicClass}
                  onChange={e => setDrLicClass(e.target.value)}
                  className="w-full text-sm p-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-600"
                >
                  <option value="BUS">High Capacity BUS</option>
                  <option value="SUV">SUV / CAR</option>
                  <option value="ELECTRIC_VAN">ELECTRIC VAN</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Valid Until</label>
                <input
                  type="date"
                  value={drValidUntil.split('T')[0]}
                  onChange={e => setDrValidUntil(new Date(e.target.value).toISOString())}
                  className="w-full text-sm p-2 border border-neutral-200 rounded-lg focus:outline-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <UserCheck className="h-4 w-4" />
                Register Driver
              </button>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'routes' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 border border-neutral-200 rounded-xl shadow-sm">
              <h2 className="text-lg font-bold text-neutral-900 mb-4">Master Routes Registry</h2>
              <div className="space-y-4">
                {routes.map(r => (
                  <div key={r.routeId} className="p-4 border border-neutral-150 rounded-xl hover:border-neutral-200 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-xs font-bold font-mono rounded">
                          {r.routeCode}
                        </span>
                        <h3 className="text-base font-bold text-neutral-900 mt-1">{r.routeName}</h3>
                      </div>
                      <div className="text-right text-xs text-neutral-500">
                        <span className="font-semibold block text-neutral-800">{r.estimatedDistanceKm} KM</span>
                        <span>{r.estimatedDurationMin} mins estimate</span>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-neutral-700 bg-neutral-50 p-2.5 rounded-lg border border-neutral-100">
                      <span className="text-neutral-500">Origin:</span>
                      <span className="text-indigo-600">{r.originName}</span>
                      <ArrowRight className="h-3 w-3 text-neutral-400" />
                      <span className="text-neutral-500">Destination:</span>
                      <span className="text-indigo-600">{r.destinationName}</span>
                    </div>
                    <div className="mt-2 text-[11px] text-neutral-500">
                      <strong>Via:</strong> {r.stopPoints.join(' → ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 border border-neutral-200 rounded-xl shadow-sm">
            <h3 className="text-base font-bold text-neutral-900 mb-4">Establish New Transport Route</h3>
            <form onSubmit={handleCreateRoute} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Route ID Code</label>
                <input
                  type="text"
                  placeholder="e.g. RT-103"
                  value={rtId}
                  onChange={e => setRtId(e.target.value)}
                  className="w-full text-sm p-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-600"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Route Designation Code</label>
                <input
                  type="text"
                  placeholder="e.g. RT-DEL-03"
                  value={rtCode}
                  onChange={e => setRtCode(e.target.value)}
                  className="w-full text-sm p-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-600"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Route Display Name</label>
                <input
                  type="text"
                  placeholder="e.g. Sector 50 Express"
                  value={rtName}
                  onChange={e => setRtName(e.target.value)}
                  className="w-full text-sm p-2 border border-neutral-200 rounded-lg focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Origin Station Name</label>
                <input
                  type="text"
                  placeholder="Main Gate"
                  value={rtOrigin}
                  onChange={e => setRtOrigin(e.target.value)}
                  className="w-full text-sm p-2 border border-neutral-200 rounded-lg focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Destination Station Name</label>
                <input
                  type="text"
                  placeholder="Metro Terminal"
                  value={rtDest}
                  onChange={e => setRtDest(e.target.value)}
                  className="w-full text-sm p-2 border border-neutral-200 rounded-lg focus:outline-none"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Distance (KM)</label>
                  <input
                    type="number"
                    value={rtDist}
                    onChange={e => setRtDist(Number(e.target.value))}
                    className="w-full text-sm p-2 border border-neutral-200 rounded-lg focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Minutes Est.</label>
                  <input
                    type="number"
                    value={rtDuration}
                    onChange={e => setRtDuration(Number(e.target.value))}
                    className="w-full text-sm p-2 border border-neutral-200 rounded-lg focus:outline-none"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <PlusCircle className="h-4 w-4" />
                Save Route Path
              </button>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'trips' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 border border-neutral-200 rounded-xl shadow-sm">
              <h2 className="text-lg font-bold text-neutral-900 mb-4">Shuttle Trips Schedule</h2>
              <div className="space-y-4">
                {trips.map(t => (
                  <div key={t.tripId} className="p-4 border border-neutral-150 rounded-xl bg-white flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-indigo-700 font-mono">{t.tripCode}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          t.status === 'PLANNED'
                            ? 'bg-neutral-100 text-neutral-700'
                            : t.status === 'DISPATCHED'
                            ? 'bg-blue-50 text-blue-700 border border-blue-100'
                            : t.status === 'IN_PROGRESS'
                            ? 'bg-amber-50 text-amber-700 border border-amber-100'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        }`}>
                          {t.status}
                        </span>
                      </div>
                      <div className="mt-2 text-xs text-neutral-500 space-y-1">
                        <p><strong>Route CodeRef:</strong> {t.routeIdRef || 'Direct Transfer'}</p>
                        <p><strong>Planned Departure:</strong> {new Date(t.plannedDeparture).toLocaleString()}</p>
                        <p><strong>Passenger capacity reserved:</strong> {t.passengerCount} passengers</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {t.status === 'DISPATCHED' && (
                        <button
                          onClick={() => handleTripStatusUpdate(t.tripId, 'IN_PROGRESS')}
                          className="px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg text-xs font-semibold hover:bg-amber-100"
                        >
                          Start Journey
                        </button>
                      )}
                      {t.status === 'IN_PROGRESS' && (
                        <button
                          onClick={() => handleTripStatusUpdate(t.tripId, 'COMPLETED')}
                          className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-xs font-semibold hover:bg-emerald-100"
                        >
                          Mark Completed
                        </button>
                      )}
                      {t.status === 'COMPLETED' && (
                        <button
                          onClick={() => handleTripStatusUpdate(t.tripId, 'CLOSED')}
                          className="px-3 py-1.5 bg-neutral-100 border border-neutral-200 text-neutral-700 rounded-lg text-xs font-semibold hover:bg-neutral-200"
                        >
                          Archive/Close
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 border border-neutral-200 rounded-xl shadow-sm">
            <h3 className="text-base font-bold text-neutral-900 mb-4">Plan Scheduled Trip</h3>
            <form onSubmit={handleCreateTrip} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Trip ID</label>
                <input
                  type="text"
                  placeholder="e.g. TR-102"
                  value={tripId}
                  onChange={e => setTripId(e.target.value)}
                  className="w-full text-sm p-2 border border-neutral-200 rounded-lg focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Trip Display Code</label>
                <input
                  type="text"
                  placeholder="e.g. TRIP-DEL-002"
                  value={tripCode}
                  onChange={e => setTripCode(e.target.value)}
                  className="w-full text-sm p-2 border border-neutral-200 rounded-lg focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Select Route</label>
                <select
                  value={tripRouteId}
                  onChange={e => setTripRouteId(e.target.value)}
                  className="w-full text-sm p-2 border border-neutral-200 rounded-lg"
                  required
                >
                  <option value="">-- Choose Route --</option>
                  {routes.map(r => (
                    <option key={r.routeId} value={r.routeId}>
                      {r.routeName} ({r.routeCode})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Passenger Size</label>
                <input
                  type="number"
                  value={tripPassCount}
                  onChange={e => setTripPassCount(Number(e.target.value))}
                  className="w-full text-sm p-2 border border-neutral-200 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Scheduled Departure Time</label>
                <input
                  type="datetime-local"
                  onChange={e => setTripDeparture(new Date(e.target.value).toISOString())}
                  className="w-full text-sm p-2 border border-neutral-200 rounded-lg"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <PlusCircle className="h-4 w-4" />
                Schedule Shuttle Trip
              </button>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'dispatch' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 border border-neutral-200 rounded-xl shadow-sm">
              <h2 className="text-lg font-bold text-neutral-900 mb-4">Dispatcher Command Dashboard</h2>
              <p className="text-xs text-neutral-500 mb-4">
                Launches real-time dispatches with full safety-locking audits and driver validation scans.
              </p>
              <div className="p-4 bg-yellow-50/50 border border-yellow-100 rounded-xl text-xs text-yellow-900 mb-6 space-y-1">
                <strong>Safety checks enforced:</strong>
                <p>• Reject expired, unauthorized or suspended driver credentials.</p>
                <p>• Prevent double-booking conflicts on vehicles or drivers already in-transit.</p>
                <p>• Block dispatch of vehicles in maintenance state unless overridden by different Four-Eyes approver.</p>
              </div>

              {/* ACTIVE DISPATCHES LIST */}
              <h3 className="text-sm font-bold text-neutral-900 mb-3 uppercase tracking-wider">Active Dispatched Fleets</h3>
              <div className="space-y-3">
                {trips.filter(t => t.status === 'DISPATCHED' || t.status === 'IN_PROGRESS').map(t => (
                  <div key={t.tripId} className="p-3 border border-neutral-150 rounded-lg text-xs flex justify-between items-center">
                    <div>
                      <span className="font-bold text-indigo-700 block">{t.tripCode}</span>
                      <p className="text-neutral-500 mt-1">Vehicle Ref: <strong>{t.vehicleIdRef}</strong> | Driver Ref: <strong>{t.employeeIdRef}</strong></p>
                    </div>
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded font-semibold text-[10px]">
                      {t.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 border border-neutral-200 rounded-xl shadow-sm">
            <h3 className="text-base font-bold text-neutral-900 mb-4">Initiate Real-time Dispatch</h3>
            <form onSubmit={handleDispatchTripSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Select Planned Trip</label>
                <select
                  value={dispTripId}
                  onChange={e => setDispTripId(e.target.value)}
                  className="w-full text-sm p-2 border border-neutral-200 rounded-lg"
                  required
                >
                  <option value="">-- Choose Shuttle Trip --</option>
                  {trips.filter(t => t.status === 'PLANNED').map(t => (
                    <option key={t.tripId} value={t.tripId}>
                      {t.tripCode} ({t.passengerCount} pass)
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Select Vehicle</label>
                <select
                  value={dispVehId}
                  onChange={e => setDispVehId(e.target.value)}
                  className="w-full text-sm p-2 border border-neutral-200 rounded-lg"
                  required
                >
                  <option value="">-- Choose Vehicle --</option>
                  {vehicles.map(v => (
                    <option key={v.vehicleId} value={v.vehicleId}>
                      {v.vehicleId} - {v.make} {v.model} ({v.capacity} cap) {v.status === 'MAINTENANCE' ? '[MAINTENANCE]' : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Assign Driver (Employee)</label>
                <select
                  value={dispDriverId}
                  onChange={e => setDispDriverId(e.target.value)}
                  className="w-full text-sm p-2 border border-neutral-200 rounded-lg"
                  required
                >
                  <option value="">-- Select Driver --</option>
                  {drivers.map(d => (
                    <option key={d.qualificationId} value={d.employeeIdRef}>
                      {d.employeeIdRef} ({d.licenseClass}) {d.isSuspended ? '[SUSPENDED]' : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div className="border-t border-neutral-100 pt-3">
                <span className="text-xs font-bold text-neutral-800 block mb-2">Four-Eyes Override (Optional)</span>
                <p className="text-[10px] text-neutral-500 mb-2">Required only to override safety-blocked / maintenance vehicles.</p>
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Approving Manager ID</label>
                  <input
                    type="text"
                    placeholder="e.g. USER_MGR"
                    value={dispOverrideRequester}
                    onChange={e => setDispOverrideRequester(e.target.value)}
                    className="w-full text-sm p-2 border border-neutral-200 rounded-lg focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Idempotency Key</label>
                <input
                  type="text"
                  placeholder="IDEM-991"
                  value={dispIdempotency}
                  onChange={e => setDispIdempotency(e.target.value)}
                  className="w-full text-sm p-2 border border-neutral-200 rounded-lg focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Send className="h-4 w-4" />
                Launch Dispatch Log
              </button>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'maintenance' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 border border-neutral-200 rounded-xl shadow-sm">
              <h2 className="text-lg font-bold text-neutral-900 mb-4">Preventative &amp; Corrective Maintenance Workorders</h2>
              <div className="space-y-4">
                {workOrders.map(wo => (
                  <div key={wo.workOrderId} className="p-4 border border-neutral-150 rounded-xl bg-white flex flex-col justify-between gap-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs font-bold text-neutral-500 font-mono">WO-NUM: {wo.workOrderNumber}</span>
                        <h3 className="text-base font-bold text-neutral-900 mt-1">{wo.issueDescription}</h3>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        wo.status === 'REQUESTED'
                          ? 'bg-neutral-100 text-neutral-700'
                          : wo.status === 'APPROVED'
                          ? 'bg-blue-50 text-blue-700 border border-blue-100'
                          : wo.status === 'COMPLETED'
                          ? 'bg-amber-50 text-amber-700 border border-amber-100'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                      }`}>
                        {wo.status}
                      </span>
                    </div>
                    <div className="text-xs text-neutral-500 space-y-1">
                      <p><strong>Vehicle Ref:</strong> {wo.vehicleIdRef} | <strong>Type:</strong> {wo.maintenanceType}</p>
                      <p><strong>Safety Blocking Check:</strong> {wo.isSafetyBlocking ? 'YES (Binds Vehicle state)' : 'NO'}</p>
                      {wo.actionTaken && <p><strong>Action Taken:</strong> {wo.actionTaken}</p>}
                    </div>
                    <div className="flex gap-2 mt-2 pt-3 border-t border-neutral-100">
                      {wo.status === 'REQUESTED' && (
                        <button
                          onClick={() => handleApproveWorkOrder(wo.workOrderId, wo.requestedByUserIdRef)}
                          className="px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-xs font-semibold hover:bg-blue-100"
                        >
                          Approve (Four-Eyes Check)
                        </button>
                      )}
                      {wo.status === 'APPROVED' && (
                        <button
                          onClick={() => handleCompleteWorkOrder(wo.workOrderId)}
                          className="px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg text-xs font-semibold hover:bg-amber-100"
                        >
                          Record Mechanic Completion
                        </button>
                      )}
                      {wo.status === 'COMPLETED' && (
                        <button
                          onClick={() => handleVerifyWorkOrder(wo.workOrderId)}
                          className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-xs font-semibold hover:bg-emerald-100"
                        >
                          Verify Audit Sign-off
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 border border-neutral-200 rounded-xl shadow-sm">
            <h3 className="text-base font-bold text-neutral-900 mb-4">Request Vehicle Maintenance</h3>
            <form onSubmit={handleCreateWorkOrder} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Workorder ID</label>
                <input
                  type="text"
                  placeholder="e.g. WO-102"
                  value={woId}
                  onChange={e => setWoId(e.target.value)}
                  className="w-full text-sm p-2 border border-neutral-200 rounded-lg focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Document Number</label>
                <input
                  type="text"
                  placeholder="e.g. WO-REG-9912"
                  value={woNum}
                  onChange={e => setWoNum(e.target.value)}
                  className="w-full text-sm p-2 border border-neutral-200 rounded-lg focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Select Target Vehicle</label>
                <select
                  value={woVehId}
                  onChange={e => setWoVehId(e.target.value)}
                  className="w-full text-sm p-2 border border-neutral-200 rounded-lg"
                  required
                >
                  <option value="">-- Choose Vehicle --</option>
                  {vehicles.map(v => (
                    <option key={v.vehicleId} value={v.vehicleId}>
                      {v.vehicleId} ({v.registrationNumber})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Repair Category</label>
                <select
                  value={woType}
                  onChange={e => setWoType(e.target.value as any)}
                  className="w-full text-sm p-2 border border-neutral-200 rounded-lg"
                >
                  <option value="PREVENTIVE">PREVENTIVE SERVICE</option>
                  <option value="CORRECTIVE">CORRECTIVE REPAIR</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Diagnostic Issue Details</label>
                <textarea
                  placeholder="Describe electrical leakage, brake issues or physical anomalies..."
                  value={woDesc}
                  onChange={e => setWoDesc(e.target.value)}
                  className="w-full text-sm p-2 border border-neutral-200 rounded-lg focus:outline-none h-20"
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="safetyBlock"
                  checked={woIsSafety}
                  onChange={e => setWoIsSafety(e.target.checked)}
                  className="h-4 w-4"
                />
                <label htmlFor="safetyBlock" className="text-xs font-semibold text-neutral-700">
                  Enforce immediate safety block on vehicle status?
                </label>
              </div>
              <button
                type="submit"
                className="w-full p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <PlusCircle className="h-4 w-4" />
                Submit WO Request
              </button>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'telemetry' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 border border-neutral-200 rounded-xl shadow-sm">
              <h2 className="text-lg font-bold text-neutral-900 mb-4">Odometer Progression Ledger</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-100 bg-neutral-50/50">
                      <th className="p-3 text-neutral-500 font-semibold text-xs uppercase">Vehicle</th>
                      <th className="p-3 text-neutral-500 font-semibold text-xs uppercase">Prev KM</th>
                      <th className="p-3 text-neutral-500 font-semibold text-xs uppercase">Current KM</th>
                      <th className="p-3 text-neutral-500 font-semibold text-xs uppercase">Progress</th>
                      <th className="p-3 text-neutral-500 font-semibold text-xs uppercase">Anomalous</th>
                    </tr>
                  </thead>
                  <tbody>
                    {odometers.map(o => (
                      <tr key={o.odometerRecordId} className="border-b border-neutral-100 hover:bg-neutral-50/50">
                        <td className="p-3 font-semibold text-indigo-700">{o.vehicleIdRef}</td>
                        <td className="p-3 text-xs">{o.previousReadingValue}</td>
                        <td className="p-3 text-xs font-bold text-neutral-900">{o.readingValue}</td>
                        <td className="p-3 text-xs text-emerald-600">+{o.readingValue - o.previousReadingValue} KM</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${o.isAnomaly ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'}`}>
                            {o.isAnomaly ? 'ALERT' : 'NORMAL'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* VEHICLE UTILIZATION CALCULATOR */}
            <div className="bg-white p-6 border border-neutral-200 rounded-xl shadow-sm">
              <h3 className="text-base font-bold text-neutral-900 mb-3">Vehicle Utilization Analytics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {vehicles.map(v => {
                  const rate = transportFleetMobilityService.getUtilizationRate(v.vehicleId, tenantId);
                  return (
                    <div key={v.vehicleId} className="p-3 border border-neutral-150 rounded-lg text-xs space-y-1">
                      <strong className="text-neutral-800 font-bold block">{v.vehicleId} ({v.registrationNumber})</strong>
                      <span className="text-neutral-500 block">Status: {v.status}</span>
                      <span className="text-indigo-600 font-semibold block mt-1">{rate}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 border border-neutral-200 rounded-xl shadow-sm">
            <h3 className="text-base font-bold text-neutral-900 mb-4">Record Mileage &amp; Fueling</h3>
            <form onSubmit={handleRecordTelemetry} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Select Vehicle</label>
                <select
                  value={telVehId}
                  onChange={e => setTelVehId(e.target.value)}
                  className="w-full text-sm p-2 border border-neutral-200 rounded-lg"
                  required
                >
                  <option value="">-- Choose Vehicle --</option>
                  {vehicles.map(v => (
                    <option key={v.vehicleId} value={v.vehicleId}>
                      {v.vehicleId} ({v.registrationNumber})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Previous Odometer Value (KM)</label>
                <input
                  type="number"
                  value={telPrevOdoVal}
                  onChange={e => setTelPrevOdoVal(Number(e.target.value))}
                  className="w-full text-sm p-2 border border-neutral-200 rounded-lg focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Current Odometer Value (KM)</label>
                <input
                  type="number"
                  value={telOdoVal}
                  onChange={e => setTelOdoVal(Number(e.target.value))}
                  className="w-full text-sm p-2 border border-neutral-200 rounded-lg focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Refueled Liters</label>
                <input
                  type="number"
                  value={telFuelLiters}
                  onChange={e => setTelFuelLiters(Number(e.target.value))}
                  className="w-full text-sm p-2 border border-neutral-200 rounded-lg focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Fueling Transaction Cost (INR)</label>
                <input
                  type="number"
                  value={telFuelCost}
                  onChange={e => setTelFuelCost(Number(e.target.value))}
                  className="w-full text-sm p-2 border border-neutral-200 rounded-lg focus:outline-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Gauge className="h-4 w-4" />
                Submit Telemetry Log
              </button>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'safety' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 border border-neutral-200 rounded-xl shadow-sm">
              <h2 className="text-lg font-bold text-neutral-900 mb-4">Accident &amp; Transport Safety Incidents Log</h2>
              <div className="space-y-4">
                {incidents.map(inc => (
                  <div key={inc.incidentId} className="p-4 border border-neutral-150 rounded-xl bg-white flex flex-col justify-between gap-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs font-mono text-neutral-500 uppercase tracking-wider">{inc.incidentCode}</span>
                        <h3 className="text-base font-bold text-neutral-900 mt-1">{inc.title}</h3>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        inc.severity === 'CRITICAL'
                          ? 'bg-rose-50 text-rose-700 border border-rose-100'
                          : 'bg-amber-50 text-amber-700 border border-amber-100'
                      }`}>
                        {inc.severity} SEVERITY
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600">{inc.description}</p>
                    <div className="text-xs text-neutral-500 space-y-1">
                      <p><strong>Vehicle Ref:</strong> {inc.vehicleIdRef || 'None'} | <strong>Status:</strong> {inc.status}</p>
                      <p><strong>Immediate safety-blocking enforced:</strong> {inc.isSafetyBlocking ? 'YES' : 'NO'}</p>
                    </div>
                    <div className="flex gap-2 mt-2 pt-3 border-t border-neutral-100">
                      {inc.status === 'REPORTED' && (
                        <button
                          onClick={() => handleTriageIncident(inc.incidentId, 'TRIAGED')}
                          className="px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-xs font-semibold hover:bg-blue-100"
                        >
                          Triage &amp; Investigate
                        </button>
                      )}
                      {inc.status === 'TRIAGED' && (
                        <button
                          onClick={() => handleTriageIncident(inc.incidentId, 'RESOLVED')}
                          className="px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg text-xs font-semibold hover:bg-amber-100"
                        >
                          Mark Resolved
                        </button>
                      )}
                      {inc.status === 'RESOLVED' && (
                        <button
                          onClick={() => handleCloseIncident(inc.incidentId)}
                          className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-xs font-semibold hover:bg-emerald-100"
                        >
                          Four-Eyes Auditor Close
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 border border-neutral-200 rounded-xl shadow-sm">
            <h3 className="text-base font-bold text-neutral-900 mb-4">Report Active Route Incident</h3>
            <form onSubmit={handleReportIncident} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Incident ID</label>
                <input
                  type="text"
                  placeholder="e.g. INC-TR-1"
                  value={incId}
                  onChange={e => setIncId(e.target.value)}
                  className="w-full text-sm p-2 border border-neutral-200 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Incident Headline Title</label>
                <input
                  type="text"
                  placeholder="e.g. Minor Collision near Block A"
                  value={incTitle}
                  onChange={e => setIncTitle(e.target.value)}
                  className="w-full text-sm p-2 border border-neutral-200 rounded-lg focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Detailed Investigation Description</label>
                <textarea
                  placeholder="Provide brief outline of spillage, collision severity or delay parameters..."
                  value={incDesc}
                  onChange={e => setIncDesc(e.target.value)}
                  className="w-full text-sm p-2 border border-neutral-200 rounded-lg focus:outline-none h-20"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Select Vehicle</label>
                  <select
                    value={incVehId}
                    onChange={e => setIncVehId(e.target.value)}
                    className="w-full text-sm p-2 border border-neutral-200 rounded-lg"
                  >
                    <option value="">-- Optional --</option>
                    {vehicles.map(v => (
                      <option key={v.vehicleId} value={v.vehicleId}>
                        {v.vehicleId}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Severity Tier</label>
                  <select
                    value={incSeverity}
                    onChange={e => setIncSeverity(e.target.value as any)}
                    className="w-full text-sm p-2 border border-neutral-200 rounded-lg"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="CRITICAL">CRITICAL</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="w-full p-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <ShieldAlert className="h-4 w-4" />
                Report Accident &amp; Block Vehicle
              </button>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'compliance' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 border border-neutral-200 rounded-xl shadow-sm">
              <h2 className="text-lg font-bold text-neutral-900 mb-4">Statutory Expiries Audit Checklist</h2>
              <div className="space-y-4">
                {vehicles.map(v => {
                  const insExpDate = new Date(v.insuranceExpiry);
                  const permExpDate = new Date(v.permitExpiry);
                  const now = new Date();
                  const insExpired = insExpDate < now;
                  const permExpired = permExpDate < now;

                  return (
                    <div key={v.vehicleId} className="p-4 border border-neutral-150 rounded-lg text-xs space-y-2">
                      <div className="flex justify-between font-bold">
                        <span>{v.vehicleId} ({v.registrationNumber})</span>
                        <span className="text-neutral-500">Owner branch: Delhi</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className={`p-2 rounded border ${insExpired ? 'bg-rose-50 border-rose-100 text-rose-800' : 'bg-emerald-50 border-emerald-100 text-emerald-800'}`}>
                          <strong>Insurance expiry:</strong> {insExpDate.toLocaleDateString()}
                          {insExpired && <span className="block font-bold mt-0.5">EXPIRED - ACTION REQ</span>}
                        </div>
                        <div className={`p-2 rounded border ${permExpired ? 'bg-rose-50 border-rose-100 text-rose-800' : 'bg-emerald-50 border-emerald-100 text-emerald-800'}`}>
                          <strong>Permit validity:</strong> {permExpDate.toLocaleDateString()}
                          {permExpired && <span className="block font-bold mt-0.5">EXPIRED - ACTION REQ</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 border border-neutral-200 rounded-xl shadow-sm">
            <h3 className="text-base font-bold text-neutral-900 mb-4">Submit Dispatch Exception Log</h3>
            <p className="text-xs text-neutral-500 mb-4">
              Authorized capacity overrides or driver qualification lapses must be recorded directly into the compliance exception register.
            </p>
            <form onSubmit={handleSubmitException} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Exception Record ID</label>
                <input
                  type="text"
                  placeholder="e.g. EXC-1"
                  value={excId}
                  onChange={e => setExcId(e.target.value)}
                  className="w-full text-sm p-2 border border-neutral-200 rounded-lg focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Exception Category</label>
                <select
                  value={excType}
                  onChange={e => setExcType(e.target.value as any)}
                  className="w-full text-sm p-2 border border-neutral-200 rounded-lg"
                >
                  <option value="CAPACITY_OVERRIDE">CAPACITY LIMIT OVERRIDE</option>
                  <option value="EXPIRED_QUALIFICATION_DISPATCH">EXPIRED QUALIFICATION BYPASS</option>
                  <option value="SAFETY_BLOCKED_DISPATCH">SAFETY BLOCKED OVERRIDE</option>
                  <option value="CROSS_CAMPUS_ROUTE">CROSS CAMPUS BOUNDARY TRANSIT</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Explanatory Justification Reason</label>
                <textarea
                  placeholder="Detail the urgent administrative necessity or secondary driver standby..."
                  value={excReason}
                  onChange={e => setExcReason(e.target.value)}
                  className="w-full text-sm p-2 border border-neutral-200 rounded-lg focus:outline-none h-24"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <ShieldCheck className="h-4 w-4" />
                Commit Exception Record
              </button>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'diagnostics' && (
        <div className="bg-white p-6 border border-neutral-200 rounded-xl shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-indigo-600" />
              Automated Integrity Diagnostics Engine
            </h2>
          </div>
          <p className="text-xs text-neutral-500">
            Scanning in-memory variables to inspect for duplicate vehicles, credentials expiry, double-booked resources, odometer rollback telemetry, and Four-Eyes overrides conflicts.
          </p>

          <div className="space-y-4">
            {diagnostics.map((d, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-neutral-150 bg-neutral-50/50 flex items-start gap-3">
                {d.includes('clear') ? (
                  <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                )}
                <div>
                  <span className="text-xs font-bold text-neutral-700 uppercase block">Diagnostics Output {idx + 1}</span>
                  <p className="text-xs text-neutral-600 mt-1">{d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'audit' && (
        <div className="bg-white p-6 border border-neutral-200 rounded-xl shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
            <History className="h-5 w-5 text-indigo-600" />
            Append-only Cryptographic Audit Ledger
          </h2>
          <p className="text-xs text-neutral-500">
            All state mutations on Phase 11.6 entities bind to a secure, append-only, reproducible SHA-256 hash provenance chain. No deletions or rollbacks.
          </p>
          <div className="space-y-4 mt-4">
            {auditEvents.map(evt => (
              <div key={evt.eventId} className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/60 font-mono text-[10px] space-y-2">
                <div className="flex flex-col md:flex-row md:justify-between font-bold text-indigo-700 text-xs gap-1">
                  <span>ID: {evt.eventId}</span>
                  <span>{new Date(evt.timestamp).toLocaleString()}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-neutral-600">
                  <p><strong>Actor:</strong> {evt.actor}</p>
                  <p><strong>Action:</strong> {evt.action}</p>
                  <p><strong>Target Entity:</strong> {evt.entity}</p>
                  <p className="break-all"><strong>Prev Hash:</strong> {evt.previousHash}</p>
                </div>
                <div className="p-2.5 bg-neutral-100 rounded border border-neutral-200 text-[10px] break-all text-neutral-700">
                  <strong>Payload:</strong> {evt.payload}
                </div>
                <div className="text-xs text-emerald-600 font-semibold break-all">
                  SHA-256: {evt.hash}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'sandbox' && (
        <div className="bg-white p-6 border border-neutral-200 rounded-xl shadow-sm space-y-6">
          <div className="border-b border-neutral-200 pb-4">
            <span className="text-xs font-bold text-amber-600 tracking-widest uppercase block mb-1">⚠️ Restricted Planning Area</span>
            <h2 className="text-xl font-black text-neutral-900 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-600" />
              What-If Isolated Forecasting Sandbox
            </h2>
          </div>

          <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs font-bold space-y-2">
            <p>SIMULATION ONLY</p>
            <p>SANDBOX MODE ACTIVE</p>
            <p>ZERO PRODUCTION MUTATION</p>
            <p className="font-normal text-neutral-600 mt-1">
              Select any of the 15 pre-configured capacity and disruption forecasting models. The system will execute them entirely in-memory on deep clones, leaving active database states untouched.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3">
            <div className="md:col-span-1 space-y-4">
              <label className="block text-xs font-semibold text-neutral-500 uppercase">Select Disruption Scenario</label>
              <select
                value={selectedScenario}
                onChange={e => setSelectedScenario(e.target.value)}
                className="w-full text-sm p-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-600 bg-white"
              >
                <option value="FLEET_SURGE">Fleet Surge</option>
                <option value="VEHICLE_SHORTAGE">Vehicle Shortage</option>
                <option value="DRIVER_SHORTAGE">Driver Shortage</option>
                <option value="ROUTE_OVERLOAD">Route Overload</option>
                <option value="CAPACITY_EXHAUSTION">Capacity Exhaustion</option>
                <option value="VEHICLE_MAINTENANCE_CASCADE">Vehicle Maintenance Cascade</option>
                <option value="COMPLIANCE_EXPIRY">Compliance Expiry</option>
                <option value="DRIVER_QUALIFICATION_EXPIRY">Driver Qual Expiry</option>
                <option value="DISPATCH_CONFLICT">Dispatch Conflict</option>
                <option value="CROSS_CAMPUS_REQUEST">Cross Campus Request</option>
                <option value="INCIDENT_CASCADE">Incident Cascade</option>
                <option value="FUEL_ANOMALY">Fuel Anomaly</option>
                <option value="MAINTENANCE_BACKLOG">Maintenance Backlog</option>
                <option value="DEMAND_SPIKE">Demand Spike</option>
                <option value="SERVICE_DISRUPTION">Service Disruption</option>
              </select>

              <button
                onClick={handleRunSimulation}
                className="w-full p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow"
              >
                <Play className="h-4 w-4" />
                Launch Simulation Run
              </button>
            </div>

            <div className="md:col-span-2 p-5 bg-neutral-900 text-neutral-100 rounded-xl font-mono text-xs space-y-3 shadow-inner">
              <div className="flex justify-between border-b border-neutral-800 pb-2">
                <span className="text-neutral-500 font-bold">TERMINAL RUNTIME LOGS</span>
                <span className="text-indigo-400">STATUS: {simResult ? simResult.status : 'WAITING'}</span>
              </div>
              {simResult ? (
                <div className="space-y-3">
                  <p className="text-yellow-400 whitespace-pre-wrap">{simResult.result}</p>
                  <div className="border-t border-neutral-800 pt-3 space-y-1 text-neutral-400 text-[10px]">
                    <p><strong>Processed records length:</strong> {simResult.metrics?.processed}</p>
                    <p><strong>Live database mutations:</strong> {simResult.metrics?.mutations}</p>
                    <p><strong>Runtime duration:</strong> {simResult.metrics?.executionTimeMs} ms</p>
                  </div>
                </div>
              ) : (
                <p className="text-neutral-500">Waiting for user to trigger isolated simulation scenarios...</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
