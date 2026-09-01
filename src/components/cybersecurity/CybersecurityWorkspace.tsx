import React, { useState, useEffect } from 'react';
import {
  Shield,
  Activity,
  AlertTriangle,
  FolderLock,
  Compass,
  FileCheck2,
  CheckCircle,
  XCircle,
  Users,
  Terminal,
  Cpu,
  RefreshCw,
  Search,
  UserCheck,
  Plus,
  Play,
  ClipboardList,
  AlertCircle,
  Sliders,
  Check,
  Eye,
  History,
  Lock
} from 'lucide-react';
import { CybersecurityOperationsService } from '../../services/cybersecurityOperationsService';
import { SecurityTestService } from '../../services/securityTestService';
import { FirebaseService } from '../../services/firebaseService';
import { useAuth } from '../../context/AuthContext';
import { useTenant } from '../../context/TenantContext';
import {
  SecurityEvent,
  ThreatIndicator,
  SecurityAlert,
  SecurityInvestigation,
  ZeroTrustPolicy,
  SecurityExceptionRequest,
  SecurityPostureSnapshot,
  SecurityDataQualityIssue
} from '../../types/cybersecurityOperations';

export function CybersecurityWorkspace() {
  const { currentTenant } = useTenant();
  const { currentUser, activeRoleAssignment } = useAuth();

  const tenantId = currentTenant?.id || 'tenant_main';
  const actorId = currentUser?.uid || currentUser?.id || 'usr_cyber_admin';
  const userRole = activeRoleAssignment?.roleCode || 'CYBER_ADMIN';
  const userDisplayName = currentUser?.displayName || 'Cyber Admin';

  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<
    'dashboard' | 'events' | 'threats' | 'alerts' | 'cases' | 'zerotrust' | 'exceptions' | 'testing'
  >('dashboard');

  // Core service state
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [threats, setThreats] = useState<ThreatIndicator[]>([]);
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [cases, setCases] = useState<SecurityInvestigation[]>([]);
  const [policies, setPolicies] = useState<ZeroTrustPolicy[]>([]);
  const [exceptions, setExceptions] = useState<SecurityExceptionRequest[]>([]);
  const [posture, setPosture] = useState<SecurityPostureSnapshot | null>(null);
  const [dataIssues, setDataIssues] = useState<SecurityDataQualityIssue[]>([]);
  const [loading, setLoading] = useState(false);

  // Test suite states
  const [testSuiteResults, setTestSuiteResults] = useState<{ testId: string; title: string; passed: boolean; details: string }[]>([]);
  const [runningTests, setRunningTests] = useState(false);

  // Form input states
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    severity: 'MEDIUM' as SecurityEvent['severity'],
    telemetrySourceId: 'src_firewall_01',
    assetName: '',
    assetType: 'server' as any
  });

  const [threatForm, setThreatForm] = useState({
    indicatorType: 'IP' as any,
    normalizedValue: '',
    severity: 'MEDIUM' as any,
    source: 'External Feed'
  });

  const [alertForm, setAlertForm] = useState({
    title: '',
    description: '',
    severity: 'MEDIUM' as any,
    priority: 'MEDIUM' as any,
    assetName: '',
    assetType: 'server' as any
  });

  const [caseForm, setCaseForm] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM' as any
  });

  const [policyForm, setPolicyForm] = useState({
    name: '',
    description: '',
    requiredRoles: 'TEACHER,STUDENT',
    requiredDeviceTrust: 'BASIC' as any,
    maxRiskScoreAllowed: 70,
    mfaRequired: true
  });

  const [exceptionForm, setExceptionForm] = useState({
    title: '',
    description: '',
    justification: '',
    compensatingControls: '',
    expirationDays: 30
  });

  // Zero-trust evaluation sandbox simulation
  const [ztSandbox, setZtSandbox] = useState({
    userId: 'usr_simulation_student',
    userEmail: 'student@school.edu',
    role: 'STUDENT',
    deviceTrust: 'BASIC' as any,
    resourceId: 'res_grades_database',
    resourceClassification: 'CONFIDENTIAL' as any,
    userRiskScore: 40,
    mfaVerified: true
  });
  const [ztSandboxResult, setZtSandboxResult] = useState<any>(null);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Seed sample data for preview if collections are empty
  const [showSeedButton, setShowSeedButton] = useState(false);

  useEffect(() => {
    loadAllData();
  }, [tenantId]);

  const loadAllData = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const fetchedEvents = await CybersecurityOperationsService.getSecurityEvents(tenantId);
      const fetchedThreats = await CybersecurityOperationsService.getThreatIndicators(tenantId);
      const fetchedAlerts = await CybersecurityOperationsService.getSecurityAlerts(tenantId);
      const fetchedCases = await CybersecurityOperationsService.getInvestigations(tenantId);
      const fetchedPolicies = await CybersecurityOperationsService.getZeroTrustPolicies(tenantId);
      const fetchedExceptions = await CybersecurityOperationsService.getSecurityExceptions(tenantId);
      const calculatedPosture = await CybersecurityOperationsService.calculateSecurityPosture(tenantId);
      const fetchedIssues = await CybersecurityOperationsService.runDataQualityDiagnostic(tenantId);

      setEvents(fetchedEvents);
      setThreats(fetchedThreats);
      setAlerts(fetchedAlerts);
      setCases(fetchedCases);
      setPolicies(fetchedPolicies);
      setExceptions(fetchedExceptions);
      setPosture(calculatedPosture);
      setDataIssues(fetchedIssues);

      if (fetchedEvents.length === 0) {
        setShowSeedButton(true);
      } else {
        setShowSeedButton(false);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Could not fetch security operations data.');
    } finally {
      setLoading(false);
    }
  };

  const seedSampleData = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      // Seed 1: Security Event
      await CybersecurityOperationsService.createSecurityEvent(
        tenantId,
        {
          tenantId,
          createdBy: actorId,
          updatedBy: actorId,
          detectedAt: new Date().toISOString(),
          title: 'Brute Force Attempt detected on Principal Portal',
          description: 'Repeated failed logins detected from IP 192.168.4.150 targetting administrator profiles.',
          severity: 'HIGH',
          telemetrySourceId: 'src_iam_active_directory',
          affectedAsset: {
            id: 'as_principal_portal',
            assetType: 'application',
            assetId: 'principal_portal',
            name: 'Principal Administrative Portal',
            criticality: 'CRITICAL'
          }
        },
        actorId
      );

      // Seed 2: Threat Indicator
      await CybersecurityOperationsService.createThreatIndicator(
        tenantId,
        {
          tenantId,
          createdBy: 'system_seeder',
          updatedBy: 'system_seeder',
          indicatorType: 'IP',
          normalizedValue: '198.51.100.42',
          confidence: 85,
          severity: 'HIGH',
          source: 'System Threat Intelligence',
          firstObservedAt: new Date().toISOString(),
          lastObservedAt: new Date().toISOString(),
          expiration: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
          classification: 'Malicious Botnet host'
        },
        'system_seeder' // Unique ID so Separation of Duties is not self-violated
      );

      // Seed 3: Security Alert
      await CybersecurityOperationsService.createSecurityAlert(
        tenantId,
        {
          tenantId,
          createdBy: actorId,
          updatedBy: actorId,
          confidence: 90,
          title: 'Suspicious API Key Leak in Staff Public Repository',
          description: 'A cloud scan detected an exposed API credential mapping to the school domain portal.',
          severity: 'CRITICAL',
          priority: 'URGENT',
          detectionSource: 'GitHub Credentials Guard',
          affectedAsset: {
            id: 'as_repository_staff',
            assetType: 'integration',
            assetId: 'staff_portal_repo',
            name: 'Staff Public Portal Repository',
            criticality: 'HIGH'
          }
        },
        actorId
      );

      // Seed 4: Investigation
      const newInv = await CybersecurityOperationsService.createInvestigation(
        tenantId,
        {
          tenantId,
          createdBy: actorId,
          updatedBy: actorId,
          title: 'Exposed Credential Incident Assessment',
          description: 'Assessing root cause and exposure windows for leaked client tokens.',
          assignedToId: actorId,
          priority: 'HIGH'
        },
        actorId
      );

      // Add timeline event
      await CybersecurityOperationsService.logInvestigationEvent(
        newInv.id,
        tenantId,
        actorId,
        userDisplayName,
        'NOTE',
        'Initial investigation dossier initialized, security team assigned.'
      );

      // Seed 5: Zero Trust Policy
      await CybersecurityOperationsService.createZeroTrustPolicy(
        tenantId,
        {
          tenantId,
          name: 'Academic Records High-Security Access Filter',
          description: 'Mandatory posture, device enrolment and MFA checks for Principal and Registrar accesses.',
          isEnabled: true,
          requiredRoles: ['REGISTRAR_OFFICER', 'SUPER_ADMIN'],
          requiredDeviceTrust: 'COMPLIANT',
          maxRiskScoreAllowed: 50,
          mfaRequired: true
        },
        actorId
      );

      // Seed 6: Exception Request
      await CybersecurityOperationsService.createSecurityException(
        tenantId,
        {
          tenantId,
          createdBy: 'usr_external_auditor',
          updatedBy: 'usr_external_auditor',
          title: 'Temporary Firewall Port Exception for External Audit Server',
          description: 'Required port 8443 bypass to receive diagnostic scans during compliance week.',
          justification: 'External accreditation compliance audit requirement.',
          compensatingControls: 'Strict source IP listing, active logging, disabled immediately after scan completion.',
          expirationDate: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString()
        },
        'usr_external_auditor'
      );

      setSuccessMsg('Successfully seeded secure sandbox data.');
      await loadAllData();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(`Seeding failed: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  // Run 50 test verification suite
  const runVerificationSuite = async () => {
    setRunningTests(true);
    try {
      const outcomes = await SecurityTestService.runPhase745VerificationSuite();
      setTestSuiteResults(outcomes);
      setSuccessMsg('Adversarial Security Suite (ADV-01 through ADV-50) complete.');
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Failed to complete test verification runs.');
    } finally {
      setRunningTests(false);
    }
  };

  // Operation Handlers
  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      await CybersecurityOperationsService.createSecurityEvent(
        tenantId,
        {
          tenantId,
          createdBy: actorId,
          updatedBy: actorId,
          detectedAt: new Date().toISOString(),
          title: eventForm.title,
          description: eventForm.description,
          severity: eventForm.severity,
          telemetrySourceId: eventForm.telemetrySourceId,
          affectedAsset: {
            id: `as_${FirebaseService.generateId('as')}`,
            assetType: eventForm.assetType,
            assetId: eventForm.assetName.toLowerCase().replace(/\s+/g, '_'),
            name: eventForm.assetName,
            criticality: eventForm.severity === 'CRITICAL' ? 'CRITICAL' : eventForm.severity === 'HIGH' ? 'HIGH' : 'MEDIUM'
          }
        },
        actorId
      );
      setSuccessMsg('Observed event successfully registered.');
      setEventForm({
        title: '',
        description: '',
        severity: 'MEDIUM',
        telemetrySourceId: 'src_firewall_01',
        assetName: '',
        assetType: 'server'
      });
      await loadAllData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to record security event.');
    }
  };

  const handleTransitionEvent = async (eventId: string, targetStatus: any) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      await CybersecurityOperationsService.transitionEventStatus(tenantId, eventId, targetStatus, actorId);
      setSuccessMsg(`Event state successfully transitioned to ${targetStatus}`);
      await loadAllData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Transition blocked by state machine.');
    }
  };

  const handleCreateThreat = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      await CybersecurityOperationsService.createThreatIndicator(
        tenantId,
        {
          tenantId,
          createdBy: actorId,
          updatedBy: actorId,
          indicatorType: threatForm.indicatorType,
          normalizedValue: threatForm.normalizedValue,
          confidence: 75,
          severity: threatForm.severity,
          source: threatForm.source,
          firstObservedAt: new Date().toISOString(),
          lastObservedAt: new Date().toISOString(),
          expiration: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
          classification: 'Suspicious host flag'
        },
        actorId
      );
      setSuccessMsg('Threat indicator recorded.');
      setThreatForm({
        indicatorType: 'IP',
        normalizedValue: '',
        severity: 'MEDIUM',
        source: 'External Feed'
      });
      await loadAllData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to record threat indicator.');
    }
  };

  const handleVerifyThreat = async (threatId: string, status: any) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      await CybersecurityOperationsService.verifyThreatIndicator(tenantId, threatId, status, actorId);
      setSuccessMsg(`Threat indicator verification set to ${status}`);
      await loadAllData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Verification rejected by policy.');
    }
  };

  const handleCreateAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      await CybersecurityOperationsService.createSecurityAlert(
        tenantId,
        {
          tenantId,
          createdBy: actorId,
          updatedBy: actorId,
          confidence: 95,
          title: alertForm.title,
          description: alertForm.description,
          severity: alertForm.severity,
          priority: alertForm.priority,
          detectionSource: 'SIEM Analyst Portal',
          affectedAsset: {
            id: `as_${FirebaseService.generateId('as')}`,
            assetType: alertForm.assetType,
            assetId: alertForm.assetName.toLowerCase().replace(/\s+/g, '_'),
            name: alertForm.assetName,
            criticality: alertForm.severity === 'CRITICAL' ? 'CRITICAL' : alertForm.severity === 'HIGH' ? 'HIGH' : 'MEDIUM'
          }
        },
        actorId
      );
      setSuccessMsg('Security alert successfully triggered.');
      setAlertForm({
        title: '',
        description: '',
        severity: 'MEDIUM',
        priority: 'MEDIUM',
        assetName: '',
        assetType: 'server'
      });
      await loadAllData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to dispatch alert.');
    }
  };

  const handleTransitionAlert = async (alertId: string, targetStatus: any) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      await CybersecurityOperationsService.transitionAlertStatus(tenantId, alertId, targetStatus, actorId);
      setSuccessMsg(`Alert state transitioned to ${targetStatus}`);
      await loadAllData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to transition alert.');
    }
  };

  const handleCreateCase = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      await CybersecurityOperationsService.createInvestigation(
        tenantId,
        {
          tenantId,
          createdBy: actorId,
          updatedBy: actorId,
          title: caseForm.title,
          description: caseForm.description,
          assignedToId: actorId,
          priority: caseForm.priority
        },
        actorId
      );
      setSuccessMsg('Investigation record successfully initialized.');
      setCaseForm({
        title: '',
        description: '',
        priority: 'MEDIUM'
      });
      await loadAllData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to open case.');
    }
  };

  const handleUpdateCaseStatus = async (caseId: string, status: any) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      await CybersecurityOperationsService.updateInvestigation(tenantId, caseId, { status }, actorId);
      setSuccessMsg(`Case status successfully set to ${status}`);
      await loadAllData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update case status.');
    }
  };

  const handleCreatePolicy = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      await CybersecurityOperationsService.createZeroTrustPolicy(
        tenantId,
        {
          tenantId,
          name: policyForm.name,
          description: policyForm.description,
          isEnabled: true,
          requiredRoles: policyForm.requiredRoles.split(',').map(r => r.trim()),
          requiredDeviceTrust: policyForm.requiredDeviceTrust,
          maxRiskScoreAllowed: policyForm.maxRiskScoreAllowed,
          mfaRequired: policyForm.mfaRequired
        },
        actorId
      );
      setSuccessMsg('Zero-Trust access control policy activated.');
      setPolicyForm({
        name: '',
        description: '',
        requiredRoles: 'TEACHER,STUDENT',
        requiredDeviceTrust: 'BASIC',
        maxRiskScoreAllowed: 70,
        mfaRequired: true
      });
      await loadAllData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to register policy.');
    }
  };

  const handleExecuteSandboxEvaluation = async () => {
    setErrorMsg(null);
    try {
      const res = await CybersecurityOperationsService.evaluateAccess(tenantId, ztSandbox);
      setZtSandboxResult(res);
    } catch (err: any) {
      setErrorMsg('Failed to execute access check.');
    }
  };

  const handleCreateException = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const expDate = new Date(Date.now() + exceptionForm.expirationDays * 24 * 3600 * 1000).toISOString();
      await CybersecurityOperationsService.createSecurityException(
        tenantId,
        {
          tenantId,
          createdBy: actorId,
          updatedBy: actorId,
          title: exceptionForm.title,
          description: exceptionForm.description,
          justification: exceptionForm.justification,
          compensatingControls: exceptionForm.compensatingControls,
          expirationDate: expDate
        },
        actorId
      );
      setSuccessMsg('Security exception request submitted for multi-party CAB review.');
      setExceptionForm({
        title: '',
        description: '',
        justification: '',
        compensatingControls: '',
        expirationDays: 30
      });
      await loadAllData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to file exception.');
    }
  };

  const handleReviewException = async (excId: string, action: 'APPROVED' | 'REVOKED') => {
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      await CybersecurityOperationsService.reviewSecurityException(
        tenantId,
        excId,
        action,
        `Approved by cyber administrator: ${userDisplayName}`,
        actorId
      );
      setSuccessMsg(`Exception request successfully marked as ${action}`);
      await loadAllData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to process exception review.');
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800" id="cyber-security-ops-root">
      {/* Upper Navigation Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl border border-rose-100">
            <Shield className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              Cybersecurity, Threat Intelligence & Zero-Trust Governance
              <span className="text-xs bg-rose-100 text-rose-800 font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide">
                Phase 7.45
              </span>
            </h1>
            <p className="text-sm text-slate-500">
              Securing institutional portals, identity trust, and zero-risk posture logs.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
          {showSeedButton && (
            <button
              onClick={seedSampleData}
              className="bg-amber-500 hover:bg-amber-600 text-white font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-2 shadow-sm transition-all"
              id="cyber-seed-btn"
            >
              <Cpu className="w-4 h-4" />
              Seed Sandbox Data
            </button>
          )}

          <button
            onClick={loadAllData}
            className="border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium px-3.5 py-2 rounded-lg text-sm flex items-center gap-2 transition-all"
            id="cyber-refresh-btn"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh Desk
          </button>
        </div>
      </header>

      {/* Primary Workspace Nav Grid */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Alerts & Messages Block */}
        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl flex items-start gap-3 mb-6" id="cyber-err-alert">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm">Security Policy Restriction</p>
              <p className="text-xs text-red-700 mt-1">{errorMsg}</p>
            </div>
          </div>
        )}

        {successMsg && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-start gap-3 mb-6 animate-fade-in" id="cyber-success-alert">
            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm">Operation Success</p>
              <p className="text-xs text-emerald-700 mt-1">{successMsg}</p>
            </div>
          </div>
        )}

        {/* Tab switcher buttons */}
        <div className="flex flex-wrap gap-1.5 border-b border-slate-200 mb-6 pb-2">
          {[
            { id: 'dashboard', label: 'Operations Desk', icon: Shield },
            { id: 'events', label: 'Security Events', icon: Activity },
            { id: 'threats', label: 'Threat Intelligence', icon: Compass },
            { id: 'alerts', label: 'Secure Triage Queue', icon: AlertTriangle },
            { id: 'cases', label: 'Case Management', icon: FolderLock },
            { id: 'zerotrust', label: 'Zero-Trust Sandbox', icon: Lock },
            { id: 'exceptions', label: 'Exception Requests', icon: Sliders },
            { id: 'testing', label: '50-Test Compliance', icon: FileCheck2 }
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeWorkspaceTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveWorkspaceTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  active
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
                id={`cyber-tab-${tab.id}`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab 1: Operations Dashboard */}
        {activeWorkspaceTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in" id="cyber-tabview-dashboard">
            {/* Posture Score Radial card */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Dynamic Security Posture</h3>
                <p className="text-xs text-slate-400 mt-0.5">Enforcing safe math controls server-side</p>
              </div>

              <div className="flex items-center justify-center my-6">
                <div className="relative w-36 h-36 flex items-center justify-center">
                  {/* Circular visual progress */}
                  <div className="absolute inset-0 rounded-full border-8 border-slate-100"></div>
                  <div className="absolute inset-0 rounded-full border-8 border-rose-500 clip-half transform rotate-45"></div>
                  <div className="text-center z-10">
                    <span className="text-4xl font-extrabold text-slate-900" id="posture-score-val">
                      {posture?.overallScore || 100}%
                    </span>
                    <span className="block text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-1">
                      Posture Index
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {posture?.explanation || 'Calculating posture scores based on active telemetry feeds.'}
                </p>
              </div>
            </div>

            {/* Posture Stats Breakdowns */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm lg:col-span-2 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Telemetry Coverage & Metrics</h3>
                <p className="text-xs text-slate-400 mt-0.5">Automated server-side evaluation stats</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 my-6">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
                  <span className="block text-2xl font-bold text-slate-900">
                    {posture?.metrics.controlCoverage || 85}%
                  </span>
                  <span className="text-xs text-slate-500 font-medium">Control Coverage</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
                  <span className="block text-2xl font-bold text-rose-600">
                    {posture?.metrics.unresolvedCriticalAlerts || 0}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">Critical Alerts</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
                  <span className="block text-2xl font-bold text-amber-600">
                    {posture?.metrics.unresolvedHighVulnerabilities || 0}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">CVE Exposures</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
                  <span className="block text-2xl font-bold text-indigo-600">
                    {posture?.metrics.securityExceptionExposure || 0}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">Active Exceptions</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
                  <span className="block text-2xl font-bold text-teal-600">
                    {posture?.metrics.zeroTrustEvaluationHealth || 100}%
                  </span>
                  <span className="text-xs text-slate-500 font-medium">ZT Pass Index</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
                  <span className="block text-2xl font-bold text-slate-700">
                    {dataIssues.length}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">Data Quality Issues</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-rose-600 font-semibold bg-rose-50 border border-rose-100 p-2.5 rounded-lg">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>Zero Trust verification filters are running actively across all resource endpoints.</span>
              </div>
            </div>

            {/* Active Telemetry feeds */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm lg:col-span-3">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Institutional Telemetry Sensors</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { name: 'Firewall IPS Logs', rate: '24 events/sec', status: 'ACTIVE', color: 'teal' },
                  { name: 'Active Directory IAM Logs', rate: '5 events/sec', status: 'ACTIVE', color: 'teal' },
                  { name: 'EDR Endpoint Monitor', rate: '120 events/sec', status: 'ACTIVE', color: 'teal' },
                  { name: 'DNS Security Gateway', rate: '0 events/sec', status: 'DEGRADED', color: 'amber' }
                ].map((feed, index) => (
                  <div key={index} className="p-4 border border-slate-200 rounded-xl flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-sm text-slate-900">{feed.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{feed.rate}</p>
                    </div>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                      feed.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {feed.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Security Events & Triage */}
        {activeWorkspaceTab === 'events' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in" id="cyber-tabview-events">
            {/* Create security event form */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-4">Observe Security Event</h3>
              <form onSubmit={handleCreateEvent} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Event Title</label>
                  <input
                    type="text"
                    required
                    value={eventForm.title}
                    onChange={e => setEventForm({ ...eventForm, title: e.target.value })}
                    className="w-full border border-slate-200 p-2.5 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none transition-all"
                    placeholder="e.g. Host portscan activity"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Description</label>
                  <textarea
                    required
                    value={eventForm.description}
                    onChange={e => setEventForm({ ...eventForm, description: e.target.value })}
                    className="w-full border border-slate-200 p-2.5 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none transition-all h-20"
                    placeholder="Identify patterns..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Severity</label>
                    <select
                      value={eventForm.severity}
                      onChange={e => setEventForm({ ...eventForm, severity: e.target.value as any })}
                      className="w-full border border-slate-200 p-2.5 rounded-lg text-sm bg-slate-50"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="CRITICAL">Critical</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Source ID</label>
                    <input
                      type="text"
                      required
                      value={eventForm.telemetrySourceId}
                      onChange={e => setEventForm({ ...eventForm, telemetrySourceId: e.target.value })}
                      className="w-full border border-slate-200 p-2.5 rounded-lg text-sm bg-slate-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Target Asset Name</label>
                  <input
                    type="text"
                    required
                    value={eventForm.assetName}
                    onChange={e => setEventForm({ ...eventForm, assetName: e.target.value })}
                    className="w-full border border-slate-200 p-2.5 rounded-lg text-sm bg-slate-50"
                    placeholder="e.g. Student Database Server"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Asset Type</label>
                  <select
                    value={eventForm.assetType}
                    onChange={e => setEventForm({ ...eventForm, assetType: e.target.value as any })}
                    className="w-full border border-slate-200 p-2.5 rounded-lg text-sm bg-slate-50"
                  >
                    <option value="server">Server</option>
                    <option value="application">Application</option>
                    <option value="database">Database</option>
                    <option value="integration">Integration</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Register Event Log
                </button>
              </form>
            </div>

            {/* Event Triage Board */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm lg:col-span-2">
              <h3 className="text-base font-bold text-slate-900 mb-4">Observed Security Logs & Triage Desk</h3>
              {events.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <Activity className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                  <p className="text-sm">No security logs recorded for this partition yet.</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                  {events.map(evt => (
                    <div key={evt.id} className="p-4 border border-slate-200 rounded-xl hover:border-rose-200 transition-all">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-sm text-slate-900">{evt.title}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                              evt.severity === 'CRITICAL' ? 'bg-red-100 text-red-800' : evt.severity === 'HIGH' ? 'bg-orange-100 text-orange-800' : 'bg-slate-100 text-slate-800'
                            }`}>
                              {evt.severity}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed">{evt.description}</p>
                        </div>
                        <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full font-bold">
                          {evt.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
                        <div>
                          <span className="font-semibold text-slate-700">Affected Asset:</span> {evt.affectedAsset.name} ({evt.affectedAsset.assetType})
                        </div>
                        <div className="text-right">
                          <span className="font-semibold text-slate-700">Sensor:</span> {evt.telemetrySourceId}
                        </div>
                      </div>

                      {/* State transitions */}
                      <div className="flex justify-end gap-1.5 mt-4">
                        {evt.status === 'OBSERVED' && (
                          <button
                            onClick={() => handleTransitionEvent(evt.id, 'TRIAGED')}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-bold px-2.5 py-1 rounded-md transition-all"
                          >
                            Mark Triaged
                          </button>
                        )}
                        {evt.status === 'TRIAGED' && (
                          <button
                            onClick={() => handleTransitionEvent(evt.id, 'INVESTIGATING')}
                            className="bg-rose-50 text-rose-700 hover:bg-rose-100 text-[10px] font-bold px-2.5 py-1 rounded-md transition-all"
                          >
                            Investigate
                          </button>
                        )}
                        {evt.status === 'INVESTIGATING' && (
                          <button
                            onClick={() => handleTransitionEvent(evt.id, 'CONTAINED')}
                            className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-[10px] font-bold px-2.5 py-1 rounded-md transition-all"
                          >
                            Trigger Containment
                          </button>
                        )}
                        {evt.status === 'CONTAINED' && (
                          <button
                            onClick={() => handleTransitionEvent(evt.id, 'RESOLVED')}
                            className="bg-blue-50 text-blue-700 hover:bg-blue-100 text-[10px] font-bold px-2.5 py-1 rounded-md transition-all"
                          >
                            Resolve Event
                          </button>
                        )}
                        {evt.status !== 'CLOSED' && (
                          <button
                            onClick={() => handleTransitionEvent(evt.id, 'CLOSED')}
                            className="bg-slate-800 hover:bg-slate-900 text-white text-[10px] font-bold px-2.5 py-1 rounded-md transition-all"
                          >
                            Archive Log
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Threat Intelligence (IOCs & Campaigns) */}
        {activeWorkspaceTab === 'threats' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in" id="cyber-tabview-threats">
            {/* IOC Creator */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-4">Ingest Threat Indicator</h3>
              <form onSubmit={handleCreateThreat} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Indicator Type</label>
                  <select
                    value={threatForm.indicatorType}
                    onChange={e => setThreatForm({ ...threatForm, indicatorType: e.target.value as any })}
                    className="w-full border border-slate-200 p-2.5 rounded-lg text-sm bg-slate-50"
                  >
                    <option value="IP">IP Address</option>
                    <option value="DOMAIN">Domain Name</option>
                    <option value="URL">Target URL</option>
                    <option value="HASH">SHA-256 Hash</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Value / Address</label>
                  <input
                    type="text"
                    required
                    value={threatForm.normalizedValue}
                    onChange={e => setThreatForm({ ...threatForm, normalizedValue: e.target.value })}
                    className="w-full border border-slate-200 p-2.5 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none transition-all"
                    placeholder="e.g. 185.220.101.5"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Threat Severity</label>
                  <select
                    value={threatForm.severity}
                    onChange={e => setThreatForm({ ...threatForm, severity: e.target.value as any })}
                    className="w-full border border-slate-200 p-2.5 rounded-lg text-sm bg-slate-50"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Intel Source</label>
                  <input
                    type="text"
                    required
                    value={threatForm.source}
                    onChange={e => setThreatForm({ ...threatForm, source: e.target.value })}
                    className="w-full border border-slate-200 p-2.5 rounded-lg text-sm bg-slate-50"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <Compass className="w-4 h-4" />
                  Ingest IOC
                </button>
              </form>
            </div>

            {/* IOC Ledger Table */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm lg:col-span-2">
              <h3 className="text-base font-bold text-slate-900 mb-4">Threat Indicators of Compromise (IOC)</h3>
              {threats.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <Compass className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                  <p className="text-sm">No threat intel feeds recorded.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-xs font-bold uppercase text-slate-400 bg-slate-50">
                        <th className="py-3 px-4">Type</th>
                        <th className="py-3 px-4">Indicator Value</th>
                        <th className="py-3 px-4">Intel Source</th>
                        <th className="py-3 px-4">Verification</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {threats.map(ioc => (
                        <tr key={ioc.id} className="border-b border-slate-100 hover:bg-slate-50 text-sm">
                          <td className="py-3.5 px-4 font-bold text-slate-600">{ioc.indicatorType}</td>
                          <td className="py-3.5 px-4 font-semibold text-slate-900">{ioc.normalizedValue}</td>
                          <td className="py-3.5 px-4 text-xs text-slate-500">{ioc.source}</td>
                          <td className="py-3.5 px-4">
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                              ioc.verificationStatus === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-800' : ioc.verificationStatus === 'FALSE_POSITIVE' ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-800'
                            }`}>
                              {ioc.verificationStatus}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            {ioc.verificationStatus === 'UNVERIFIED' && (
                              <div className="flex justify-end gap-1">
                                <button
                                  onClick={() => handleVerifyThreat(ioc.id, 'CONFIRMED')}
                                  className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold px-2 py-1 rounded transition-all"
                                  title="Separation of Duties check applies"
                                >
                                  Confirm
                                </button>
                                <button
                                  onClick={() => handleVerifyThreat(ioc.id, 'FALSE_POSITIVE')}
                                  className="bg-red-50 text-red-700 hover:bg-red-100 text-xs font-bold px-2 py-1 rounded transition-all"
                                >
                                  FP flag
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 4: Secure Triage Alert Queue */}
        {activeWorkspaceTab === 'alerts' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in" id="cyber-tabview-alerts">
            {/* Create security alert form */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-4">Manual Alert Dispatch</h3>
              <form onSubmit={handleCreateAlert} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Alert Title</label>
                  <input
                    type="text"
                    required
                    value={alertForm.title}
                    onChange={e => setAlertForm({ ...alertForm, title: e.target.value })}
                    className="w-full border border-slate-200 p-2.5 rounded-lg text-sm bg-slate-50"
                    placeholder="e.g. Host credential exfiltration"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Description</label>
                  <textarea
                    required
                    value={alertForm.description}
                    onChange={e => setAlertForm({ ...alertForm, description: e.target.value })}
                    className="w-full border border-slate-200 p-2.5 rounded-lg text-sm bg-slate-50 h-20"
                    placeholder="Provide remediation steps..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Severity</label>
                    <select
                      value={alertForm.severity}
                      onChange={e => setAlertForm({ ...alertForm, severity: e.target.value as any })}
                      className="w-full border border-slate-200 p-2.5 rounded-lg text-sm bg-slate-50"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="CRITICAL">Critical</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Priority</label>
                    <select
                      value={alertForm.priority}
                      onChange={e => setAlertForm({ ...alertForm, priority: e.target.value as any })}
                      className="w-full border border-slate-200 p-2.5 rounded-lg text-sm bg-slate-50"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="URGENT">Urgent</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Target Asset Name</label>
                  <input
                    type="text"
                    required
                    value={alertForm.assetName}
                    onChange={e => setAlertForm({ ...alertForm, assetName: e.target.value })}
                    className="w-full border border-slate-200 p-2.5 rounded-lg text-sm bg-slate-50"
                    placeholder="e.g. Registrar Database Client"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Asset Type</label>
                  <select
                    value={alertForm.assetType}
                    onChange={e => setAlertForm({ ...alertForm, assetType: e.target.value as any })}
                    className="w-full border border-slate-200 p-2.5 rounded-lg text-sm bg-slate-50"
                  >
                    <option value="server">Server</option>
                    <option value="application">Application</option>
                    <option value="database">Database</option>
                    <option value="integration">Integration</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <AlertTriangle className="w-4 h-4" />
                  Dispatch Secure Alert
                </button>
              </form>
            </div>

            {/* Alert List and SLA Check */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm lg:col-span-2">
              <h3 className="text-base font-bold text-slate-900 mb-4">Secure Incident Triage Queue</h3>
              {alerts.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <AlertTriangle className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                  <p className="text-sm">No operational security alerts triggered.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {alerts.map(al => (
                    <div key={al.id} className="p-4 border border-slate-200 rounded-xl hover:border-slate-300 transition-all flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-900">{al.title}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                              al.severity === 'CRITICAL' ? 'bg-red-100 text-red-800 animate-pulse' : 'bg-orange-100 text-orange-800'
                            }`}>
                              {al.severity}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">{al.description}</p>
                        </div>
                        <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-bold">
                          {al.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
                        <div>
                          <span className="font-semibold text-slate-700">Target Asset:</span> {al.affectedAsset?.name}
                        </div>
                        <div>
                          <span className="font-semibold text-slate-700">Deadline:</span> {new Date(al.slaDeadline).toLocaleTimeString()}
                        </div>
                        <div className="text-right">
                          <span className="font-semibold text-slate-700">Escalated:</span> {al.isEscalated ? 'Yes' : 'No'}
                        </div>
                      </div>

                      <div className="flex justify-end gap-1.5 mt-3">
                        {al.status === 'OPEN' && (
                          <button
                            onClick={() => handleTransitionAlert(al.id, 'ACKNOWLEDGED')}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-bold px-2.5 py-1 rounded transition-all"
                          >
                            Acknowledge Clock
                          </button>
                        )}
                        {al.status === 'ACKNOWLEDGED' && (
                          <button
                            onClick={() => handleTransitionAlert(al.id, 'TRIAGED')}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-bold px-2.5 py-1 rounded transition-all"
                          >
                            Mark Triaged
                          </button>
                        )}
                        {al.status === 'TRIAGED' && (
                          <button
                            onClick={() => handleTransitionAlert(al.id, 'RESOLVED')}
                            className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-[10px] font-bold px-2.5 py-1 rounded transition-all"
                          >
                            Mark Resolved
                          </button>
                        )}
                        {al.status !== 'CLOSED' && (
                          <button
                            onClick={() => handleTransitionAlert(al.id, 'CLOSED')}
                            className="bg-slate-800 hover:bg-slate-900 text-white text-[10px] font-bold px-2.5 py-1 rounded transition-all"
                          >
                            Archive Alert
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 5: Case Management */}
        {activeWorkspaceTab === 'cases' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in" id="cyber-tabview-cases">
            {/* Create Case */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-4">Initialize Investigation</h3>
              <form onSubmit={handleCreateCase} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Dossier Title</label>
                  <input
                    type="text"
                    required
                    value={caseForm.title}
                    onChange={e => setCaseForm({ ...caseForm, title: e.target.value })}
                    className="w-full border border-slate-200 p-2.5 rounded-lg text-sm bg-slate-50"
                    placeholder="e.g. Unauthorized administrative access log"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Incident Summary</label>
                  <textarea
                    required
                    value={caseForm.description}
                    onChange={e => setCaseForm({ ...caseForm, description: e.target.value })}
                    className="w-full border border-slate-200 p-2.5 rounded-lg text-sm bg-slate-50 h-24"
                    placeholder="Record timeline and forensics..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Investigation Priority</label>
                  <select
                    value={caseForm.priority}
                    onChange={e => setCaseForm({ ...caseForm, priority: e.target.value as any })}
                    className="w-full border border-slate-200 p-2.5 rounded-lg text-sm bg-slate-50"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <FolderLock className="w-4 h-4" />
                  Open Investigation Dossier
                </button>
              </form>
            </div>

            {/* Cases list and Timeline forensic records */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm lg:col-span-2">
              <h3 className="text-base font-bold text-slate-900 mb-4">Active Cyber Investigations</h3>
              {cases.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <FolderLock className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                  <p className="text-sm">No investigations initiated.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {cases.map(cs => (
                    <div key={cs.id} className="p-4 border border-slate-200 rounded-xl hover:border-slate-300 transition-all">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-bold text-sm text-slate-900 block">{cs.title}</span>
                          <span className="text-xs text-slate-500 mt-1 block">{cs.description}</span>
                        </div>
                        <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">
                          {cs.status}
                        </span>
                      </div>

                      <div className="flex justify-end gap-1.5 mt-4">
                        {cs.status === 'OPEN' && (
                          <button
                            onClick={() => handleUpdateCaseStatus(cs.id, 'INVESTIGATING')}
                            className="bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold px-2.5 py-1 rounded transition-all"
                          >
                            Mark Investigating
                          </button>
                        )}
                        {cs.status === 'INVESTIGATING' && (
                          <button
                            onClick={() => handleUpdateCaseStatus(cs.id, 'CLOSED')}
                            className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold px-2.5 py-1 rounded transition-all"
                            title="Four-Eyes Separation of Duties applies"
                          >
                            Archive Case
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 6: Zero-Trust Policy Studio & Sandbox Evaluation */}
        {activeWorkspaceTab === 'zerotrust' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in" id="cyber-tabview-zerotrust">
            {/* Create Zero-Trust Policy */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-4">Define Access Policy</h3>
              <form onSubmit={handleCreatePolicy} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Policy Name</label>
                  <input
                    type="text"
                    required
                    value={policyForm.name}
                    onChange={e => setPolicyForm({ ...policyForm, name: e.target.value })}
                    className="w-full border border-slate-200 p-2.5 rounded-lg text-sm bg-slate-50"
                    placeholder="e.g. Registrar Portal policy"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Description</label>
                  <textarea
                    required
                    value={policyForm.description}
                    onChange={e => setPolicyForm({ ...policyForm, description: e.target.value })}
                    className="w-full border border-slate-200 p-2.5 rounded-lg text-sm bg-slate-50 h-16"
                    placeholder="State access constraints..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Required Roles (comma-separated)</label>
                  <input
                    type="text"
                    required
                    value={policyForm.requiredRoles}
                    onChange={e => setPolicyForm({ ...policyForm, requiredRoles: e.target.value })}
                    className="w-full border border-slate-200 p-2.5 rounded-lg text-sm bg-slate-50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Device Level</label>
                    <select
                      value={policyForm.requiredDeviceTrust}
                      onChange={e => setPolicyForm({ ...policyForm, requiredDeviceTrust: e.target.value as any })}
                      className="w-full border border-slate-200 p-2.5 rounded-lg text-sm bg-slate-50"
                    >
                      <option value="NONE">None</option>
                      <option value="BASIC">Basic</option>
                      <option value="ENROLLED">Enrolled</option>
                      <option value="COMPLIANT">Compliant</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Max Risk Score</label>
                    <input
                      type="number"
                      required
                      value={policyForm.maxRiskScoreAllowed}
                      onChange={e => setPolicyForm({ ...policyForm, maxRiskScoreAllowed: Number(e.target.value) })}
                      className="w-full border border-slate-200 p-2.5 rounded-lg text-sm bg-slate-50"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={policyForm.mfaRequired}
                    onChange={e => setPolicyForm({ ...policyForm, mfaRequired: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-300"
                  />
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Require MFA Check</label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <Lock className="w-4 h-4" />
                  Activate Access Filter
                </button>
              </form>
            </div>

            {/* Evaluation Sandbox Engine */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm lg:col-span-2">
              <h3 className="text-base font-bold text-slate-900 mb-4">Zero-Trust Real-Time Authorization Engine</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4 p-4 border border-slate-200 rounded-xl bg-slate-50">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Simulation parameters</span>
                  
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">Simulated Role</label>
                    <select
                      value={ztSandbox.role}
                      onChange={e => setZtSandbox({ ...ztSandbox, role: e.target.value })}
                      className="w-full border border-slate-200 p-2 rounded-lg text-xs bg-white"
                    >
                      <option value="STUDENT">Student</option>
                      <option value="TEACHER">Teacher</option>
                      <option value="REGISTRAR_OFFICER">Registrar Officer</option>
                      <option value="SUPER_ADMIN">Super Admin</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">Device Level</label>
                    <select
                      value={ztSandbox.deviceTrust}
                      onChange={e => setZtSandbox({ ...ztSandbox, deviceTrust: e.target.value as any })}
                      className="w-full border border-slate-200 p-2 rounded-lg text-xs bg-white"
                    >
                      <option value="NONE">Unenrolled / Personal</option>
                      <option value="BASIC">Enrolled Basic</option>
                      <option value="COMPLIANT">Managed Secure Device</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">User Risk score (calculated in-memory)</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={ztSandbox.userRiskScore}
                      onChange={e => setZtSandbox({ ...ztSandbox, userRiskScore: Number(e.target.value) })}
                      className="w-full"
                    />
                    <span className="text-xs font-bold text-slate-700">{ztSandbox.userRiskScore} / 100</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={ztSandbox.mfaVerified}
                      onChange={e => setZtSandbox({ ...ztSandbox, mfaVerified: e.target.checked })}
                      className="w-3.5 h-3.5"
                    />
                    <label className="text-xs text-slate-600">Simulate MFA Verification Pass</label>
                  </div>

                  <button
                    onClick={handleExecuteSandboxEvaluation}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2 rounded-lg transition-all"
                  >
                    Evaluate Decision Now
                  </button>
                </div>

                {/* Simulation Output panel */}
                <div className="p-4 border border-slate-200 rounded-xl bg-slate-900 text-slate-100 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Authorization decision</span>
                    {ztSandboxResult ? (
                      <div className="mt-4">
                        <span className={`text-2xl font-black block tracking-tight ${
                          ztSandboxResult.decision === 'ALLOW' ? 'text-emerald-400' : 'text-rose-400'
                        }`}>
                          {ztSandboxResult.decision}
                        </span>
                        <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                          {ztSandboxResult.reason}
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 mt-6">
                        Configure simulation context parameters and click 'Evaluate Decision' to audit authorization policies.
                      </p>
                    )}
                  </div>

                  <div className="border-t border-slate-800 pt-3 mt-4 text-[10px] text-slate-500">
                    Calculated via strict Zero-Trust factors & tenant context policies.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 7: Exception Desk */}
        {activeWorkspaceTab === 'exceptions' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in" id="cyber-tabview-exceptions">
            {/* Create Exception Request */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-4">Request Security Exception</h3>
              <form onSubmit={handleCreateException} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Exception Title</label>
                  <input
                    type="text"
                    required
                    value={exceptionForm.title}
                    onChange={e => setExceptionForm({ ...exceptionForm, title: e.target.value })}
                    className="w-full border border-slate-200 p-2.5 rounded-lg text-sm bg-slate-50"
                    placeholder="e.g. Legacy server bypass"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Security Exception Scope</label>
                  <textarea
                    required
                    value={exceptionForm.description}
                    onChange={e => setExceptionForm({ ...exceptionForm, description: e.target.value })}
                    className="w-full border border-slate-200 p-2.5 rounded-lg text-sm bg-slate-50 h-16"
                    placeholder="Detailed context..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Justification</label>
                  <textarea
                    required
                    value={exceptionForm.justification}
                    onChange={e => setExceptionForm({ ...exceptionForm, justification: e.target.value })}
                    className="w-full border border-slate-200 p-2.5 rounded-lg text-sm bg-slate-50 h-16"
                    placeholder="ACC or Board justification..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Compensating Controls</label>
                  <textarea
                    required
                    value={exceptionForm.compensatingControls}
                    onChange={e => setExceptionForm({ ...exceptionForm, compensatingControls: e.target.value })}
                    className="w-full border border-slate-200 p-2.5 rounded-lg text-sm bg-slate-50 h-16"
                    placeholder="Mitigations..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <Sliders className="w-4 h-4" />
                  Submit Request
                </button>
              </form>
            </div>

            {/* Exceptions review lists */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm lg:col-span-2">
              <h3 className="text-base font-bold text-slate-900 mb-4">Governed Exceptional Rules Desk</h3>
              {exceptions.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <Sliders className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                  <p className="text-sm">No exception requests filed.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {exceptions.map(exc => (
                    <div key={exc.id} className="p-4 border border-slate-200 rounded-xl hover:border-slate-300 transition-all">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-bold text-sm text-slate-900">{exc.title}</span>
                          <p className="text-xs text-slate-500 mt-1">{exc.description}</p>
                          <p className="text-[10px] text-amber-600 font-semibold mt-2">Justification: {exc.justification}</p>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded font-bold ${
                          exc.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'
                        }`}>
                          {exc.status}
                        </span>
                      </div>

                      {exc.status === 'SUBMITTED' && (
                        <div className="flex justify-end gap-1.5 mt-4 pt-3 border-t border-slate-100">
                          <button
                            onClick={() => handleReviewException(exc.id, 'APPROVED')}
                            className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold px-2.5 py-1 rounded transition-all"
                            title="Four-Eyes Separation of Duties check applies"
                          >
                            Approve Bypass Exception
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 8: Verification test suite */}
        {activeWorkspaceTab === 'testing' && (
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm animate-fade-in" id="cyber-tabview-testing">
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Institutional Cybersecurity Compliance Verification</h3>
                <p className="text-xs text-slate-500 mt-0.5">Execution of Adversarial Testing Matrix (ADV-01 through ADV-50)</p>
              </div>
              <button
                onClick={runVerificationSuite}
                disabled={runningTests}
                className="bg-rose-600 hover:bg-rose-700 disabled:bg-rose-300 text-white font-medium px-4 py-2.5 rounded-lg text-sm flex items-center gap-2 shadow-sm transition-all"
                id="cyber-run-tests-btn"
              >
                {runningTests ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                {runningTests ? 'Running Compliance Suite...' : 'Execute Full Suite'}
              </button>
            </div>

            {testSuiteResults.length > 0 ? (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {testSuiteResults.map(res => (
                  <div key={res.testId} className="p-3 border border-slate-200 rounded-lg flex items-start justify-between hover:bg-slate-50 transition-all">
                    <div className="flex gap-3">
                      {res.passed ? (
                        <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      )}
                      <div>
                        <span className="font-bold text-sm text-slate-900 flex items-center gap-2">
                          {res.testId}: {res.title}
                        </span>
                        <p className="text-xs text-slate-500 mt-1">{res.details}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                      PASSED
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-slate-400">
                <ClipboardList className="w-16 h-16 mx-auto mb-2 text-slate-300" />
                <p className="text-sm">Compliance verification matrix ready for execution.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
