/**
 * EMS PHASE 11.12: Institutional Security, Access Control, Safety, Incident & Business Continuity Operations Types
 * Authoritative type model for security zones, checkpoints, access policies, credentials, visitor management,
 * contractor safety authorizations, physical access events, security patrols, guard assignments, security & safety incidents,
 * emergency response activations, investigations, threat/risk assessments, evacuation planning & accountability,
 * business continuity plans, continuity incidents & recovery actions, emergency drills, Four-Eyes SoD,
 * diagnostics, what-if simulations, and SHA-256 tamper-evident audit chaining.
 */

// ============================================================
// 1. CORE DOMAIN ENUMS & CLASSIFICATIONS
// ============================================================

export type SecurityZoneType =
  | 'PERIMETER'
  | 'PUBLIC'
  | 'GENERAL_ACADEMIC'
  | 'RESIDENTIAL_HOSTEL'
  | 'ADMINISTRATIVE'
  | 'RESEARCH_LABORATORY'
  | 'CRITICAL_INFRASTRUCTURE'
  | 'DATA_CENTER'
  | 'HAZARDOUS_MATERIALS'
  | 'EXECUTIVE_SUITE'
  | 'RESTRICTED_VAULT'
  | 'EMERGENCY_OPERATIONS_CENTER';

export type SecurityClearanceLevel =
  | 'LEVEL_1_PUBLIC'
  | 'LEVEL_2_CAMPUS_COMMUNITY'
  | 'LEVEL_3_FACULTY_STAFF'
  | 'LEVEL_4_RESTRICTED_DEPARTMENTAL'
  | 'LEVEL_5_CONFIDENTIAL_LAB_DATA'
  | 'LEVEL_6_HIGH_SECURITY_CRITICAL';

export type AccessCredentialType =
  | 'SMART_CARD'
  | 'RFID_BADGE'
  | 'BIOMETRIC_FACIAL'
  | 'BIOMETRIC_FINGERPRINT'
  | 'MOBILE_NFC'
  | 'DIGITAL_QR_PASS'
  | 'PHYSICAL_KEYCARD'
  | 'TEMPORARY_VISITOR_BADGE'
  | 'CONTRACTOR_PASS'
  | 'EMERGENCY_MASTER_OVERRIDE';

export type AccessCredentialStatus =
  | 'REQUESTED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'ISSUED'
  | 'ACTIVE'
  | 'SUSPENDED'
  | 'REVOKED'
  | 'EXPIRED';

export type AccessDecision =
  | 'GRANTED'
  | 'DENIED_INVALID_CREDENTIAL'
  | 'DENIED_EXPIRED'
  | 'DENIED_SUSPENDED'
  | 'DENIED_REVOKED'
  | 'DENIED_UNAUTHORIZED_ZONE'
  | 'DENIED_OUTSIDE_ALLOWED_HOURS'
  | 'DENIED_CROSS_CAMPUS_RESTRICTION'
  | 'DENIED_ANTIPASSBACK_VIOLATION'
  | 'DENIED_LOCKDOWN_ENFORCED'
  | 'GRANTED_EMERGENCY_OVERRIDE';

export type VisitorStatus =
  | 'REQUESTED'
  | 'APPROVED'
  | 'CHECKED_IN'
  | 'ESCORTED'
  | 'CHECKED_OUT'
  | 'EXPIRED'
  | 'CANCELLED';

export type ContractorAccessStatus =
  | 'SUBMITTED'
  | 'SAFETY_INDUCTION_COMPLETED'
  | 'APPROVED'
  | 'ACTIVE_ON_SITE'
  | 'WORK_COMPLETED'
  | 'REVOKED'
  | 'EXPIRED';

export type PatrolStatus =
  | 'SCHEDULED'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'COMPLETED_FULL'
  | 'COMPLETED_WITH_EXCEPTIONS'
  | 'MISSED'
  | 'ABORTED_EMERGENCY';

export type SecurityOfficerShift =
  | 'DAY_SHIFT'
  | 'EVENING_SHIFT'
  | 'NIGHT_SHIFT'
  | 'WEEKEND_DAY'
  | 'WEEKEND_NIGHT'
  | 'EMERGENCY_SURGE_SHIFT';

export type IncidentClassification =
  | 'PHYSICAL_INTRUSION'
  | 'UNAUTHORIZED_ACCESS_ATTEMPT'
  | 'THEFT_PROPERTY_LOSS'
  | 'VANDALISM_PROPERTY_DAMAGE'
  | 'ASSAULT_DISPUTE'
  | 'SAFETY_HAZARD'
  | 'FIRE_SMOKE_ALARM'
  | 'MEDICAL_EMERGENCY_REF'
  | 'HAZMAT_CHEMICAL_SPILL'
  | 'SUSPICIOUS_PACKAGE_PERSON'
  | 'INFRASTRUCTURE_FAILURE'
  | 'CAMPUS_PROTEST_DISTURBANCE'
  | 'CYBER_PHYSICAL_BREACH'
  | 'LOST_FOUND_ITEM';

export type IncidentSeverity =
  | 'LOW'
  | 'MEDIUM'
  | 'HIGH'
  | 'CRITICAL';

export type IncidentStatus =
  | 'REPORTED'
  | 'TRIAGED'
  | 'ASSIGNED'
  | 'INVESTIGATING'
  | 'CONTAINED'
  | 'RESOLVED'
  | 'CLOSED';

export type InvestigationStatus =
  | 'OPEN'
  | 'EVIDENCE_COLLECTION'
  | 'WITNESS_INTERVIEWS'
  | 'ANALYSIS'
  | 'CLOSURE_RECOMMENDED'
  | 'CLOSED'
  | 'REFERRED_TO_LAW_ENFORCEMENT';

export type EmergencyType =
  | 'FIRE'
  | 'MEDICAL_EMERGENCY_REF'
  | 'ACTIVE_SECURITY_THREAT'
  | 'NATURAL_DISASTER_WEATHER'
  | 'HAZARDOUS_MATERIAL_SPILL'
  | 'STRUCTURAL_INFRASTRUCTURE_FAILURE'
  | 'MASS_EVACUATION'
  | 'CAMPUS_LOCKDOWN'
  | 'SEVERE_POWER_OUTAGE';

export type EmergencyActivationStatus =
  | 'DECLARED'
  | 'RESPONSE_ACTIVE'
  | 'ESCALATED'
  | 'CONTAINED'
  | 'STAND_DOWN_PENDING_REVIEW'
  | 'ALL_CLEAR'
  | 'CLOSED';

export type EvacuationStatus =
  | 'STANDBY'
  | 'ORDERED'
  | 'IN_PROGRESS'
  | 'ACCOUNTABILITY_UNDERWAY'
  | 'ALL_CLEAR_GATHERED'
  | 'RE_ENTRY_AUTHORIZED'
  | 'TERMINATED';

export type ContinuityStatus =
  | 'NORMAL_OPERATIONS'
  | 'MONITORING'
  | 'DISRUPTION_IDENTIFIED'
  | 'CONTINUITY_PLAN_ACTIVATED'
  | 'RECOVERY_IN_PROGRESS'
  | 'OPERATIONS_RESTORED'
  | 'POST_INCIDENT_REVIEW'
  | 'CLOSED';

export type ContinuityIncidentLifecycle =
  | 'IDENTIFIED'
  | 'ASSESSED'
  | 'ACTIVATED'
  | 'RESPONSE'
  | 'RECOVERY'
  | 'RESTORED'
  | 'CLOSED';

export type DrillStatus =
  | 'PLANNED'
  | 'APPROVED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'EVALUATED'
  | 'CANCELLED';

// ============================================================
// 2. SECURITY INFRASTRUCTURE & ZONING
// ============================================================

export interface SecurityZone {
  zoneId: string;
  tenantId: string;
  campusIdRef: string;
  zoneCode: string;
  zoneName: string;
  zoneType: SecurityZoneType;
  clearanceRequired: SecurityClearanceLevel;
  buildingIdRef?: string;
  floorLevel?: string;
  maxOccupancy?: number;
  isActive: boolean;
  requiresEscortForVisitors: boolean;
  biometricRequired: boolean;
  twoFactorRequired: boolean;
  allowedHoursStart?: string; // "08:00"
  allowedHoursEnd?: string;   // "18:00"
  is24x7Accessible: boolean;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface SecurityCheckpoint {
  checkpointId: string;
  tenantId: string;
  campusIdRef: string;
  checkpointCode: string;
  checkpointName: string;
  zoneIdRef: string;
  checkpointType: 'MAIN_GATE' | 'PEDESTRIAN_TURNSTILE' | 'BUILDING_ENTRANCE' | 'LAB_DOOR' | 'VEHICLE_BARRIER' | 'EMERGENCY_EXIT';
  readerHardwareId: string;
  isOnline: boolean;
  supportsBiometrics: boolean;
  supportsMobileNfc: boolean;
  isLockdownCapable: boolean;
  isAntiPassbackEnabled: boolean;
  direction: 'INBOUND' | 'OUTBOUND' | 'BIDIRECTIONAL';
  emergencyOverrideActive: boolean;
  installedLocation: string;
}

export interface SecurityPost {
  postId: string;
  tenantId: string;
  campusIdRef: string;
  postCode: string;
  postName: string;
  locationDescription: string;
  zoneIdRef: string;
  is24x7Manned: boolean;
  requiredGuardCount: number;
  contactExtension: string;
  primaryRadioChannel: string;
}

export interface SecurityCameraReference {
  cameraId: string;
  tenantId: string;
  campusIdRef: string;
  cameraCode: string;
  zoneIdRef: string;
  streamEndpointRef: string; // Reference only, no raw streaming blob stored
  isRecording: boolean;
  retentionDays: number;
  installedPosition: string;
}

export interface SecurityControlPoint {
  controlPointId: string;
  tenantId: string;
  campusIdRef: string;
  name: string;
  zoneIdRef: string;
  controlType: 'ACCESS_BARRIER' | 'INTERCOM' | 'ALARM_PANEL' | 'PANIC_BUTTON' | 'LOCKER_STATION';
  status: 'OPERATIONAL' | 'DEGRADED' | 'FAULT' | 'MAINTENANCE';
}

export interface SecurityPolicy {
  policyId: string;
  tenantId: string;
  campusIdRef: string;
  policyCode: string;
  title: string;
  scope: 'CAMPUS_WIDE' | 'ZONE_SPECIFIC' | 'ROLE_SPECIFIC' | 'CONTRACTOR_ONLY';
  zoneIdRef?: string;
  enforceQuietHours: boolean;
  curfewStartTime?: string; // "22:00"
  curfewEndTime?: string;   // "06:00"
  maxVisitorDurationMinutes: number;
  mandatoryEscortLevel: SecurityClearanceLevel;
  lockdownProceduresSummary: string;
  version: string;
  isActive: boolean;
  effectiveDate: string;
  expiryDate?: string;
  approvedByUserIdRef: string;
  approvedAt: string;
}

export interface SecurityProcedure {
  procedureId: string;
  tenantId: string;
  campusIdRef: string;
  code: string;
  title: string;
  category: 'ROUTINE_ACCESS' | 'VIP_ESCORT' | 'SUSPICIOUS_OBJECT' | 'CONTAINMENT' | 'MEDICAL_FIRST_RESPOND' | 'AFTER_HOURS_LOCKDOWN';
  steps: string[];
  mandatoryRole: string;
  lastReviewedAt: string;
}

// ============================================================
// 3. ACCESS CONTROL & CREDENTIALS
// ============================================================

export interface AccessCredential {
  credentialId: string;
  tenantId: string;
  campusIdRef: string;
  credentialNumber: string;
  credentialType: AccessCredentialType;
  holderType: 'STUDENT' | 'FACULTY' | 'STAFF' | 'VISITOR' | 'CONTRACTOR' | 'SECURITY_OFFICER' | 'EMERGENCY_RESPONDER';
  holderUserIdRef: string;
  holderName: string;
  clearanceLevel: SecurityClearanceLevel;
  status: AccessCredentialStatus;
  issuedAt?: string;
  expiresAt: string;
  suspendedAt?: string;
  suspensionReason?: string;
  revokedAt?: string;
  revocationReason?: string;
  revokedByUserIdRef?: string;
  authorizedZones: string[]; // zoneIdRefs
  isMasterOverride: boolean;
  biometricTemplateHash?: string; // Cryptographic hash reference only
  rfidUid?: string;
  barcodeValue?: string;
  requestedByUserIdRef: string;
  approvedByUserIdRef?: string;
  metadata: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface AccessAuthorization {
  authorizationId: string;
  tenantId: string;
  campusIdRef: string;
  credentialIdRef: string;
  zoneIdRef: string;
  grantedByUserIdRef: string;
  grantedAt: string;
  expiresAt: string;
  isSpecialExemption: boolean;
  exemptionJustification?: string;
  twoFactorEnforced: boolean;
  allowedDaysOfWeek: number[]; // [1,2,3,4,5] = Mon-Fri
  allowedStartTime?: string;
  allowedEndTime?: string;
}

export interface AccessRequest {
  requestId: string;
  tenantId: string;
  campusIdRef: string;
  requesterUserIdRef: string;
  requesterRole: string;
  targetZoneIdRef: string;
  requestedClearance: SecurityClearanceLevel;
  justification: string;
  requestedDurationDays: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED';
  reviewedByUserIdRef?: string;
  reviewedAt?: string;
  reviewRemarks?: string;
  createdAt: string;
}

export interface AccessGrant {
  grantId: string;
  tenantId: string;
  campusIdRef: string;
  requestIdRef: string;
  credentialIdRef: string;
  zoneIdRef: string;
  authorizedByUserIdRef: string;
  validFrom: string;
  validUntil: string;
  sha256Signature: string;
}

export interface AccessRevocation {
  revocationId: string;
  tenantId: string;
  campusIdRef: string;
  credentialIdRef: string;
  revocationReason: string;
  revokedByUserIdRef: string;
  revocationTimestamp: string;
  isOverride: boolean;
  dualAuthorizedByUserIdRef?: string;
  sha256Signature: string;
}

export interface PhysicalAccessEvent {
  eventId: string;
  tenantId: string;
  campusIdRef: string;
  timestamp: string;
  checkpointIdRef: string;
  zoneIdRef: string;
  credentialIdRef?: string;
  holderUserIdRef?: string;
  holderName?: string;
  credentialType?: AccessCredentialType;
  decision: AccessDecision;
  rejectionReason?: string;
  rawCardUid?: string;
  isTailgatingSuspected: boolean;
  operatorNotes?: string;
}

// ============================================================
// 4. VISITOR & CONTRACTOR MANAGEMENT
// ============================================================

export interface VisitorRecord {
  visitorId: string;
  tenantId: string;
  campusIdRef: string;
  fullName: string;
  idDocumentType: 'NATIONAL_ID' | 'PASSPORT' | 'DRIVERS_LICENSE' | 'CORPORATE_ID';
  idDocumentNumberMasked: string;
  organizationOrAffiliation: string;
  contactPhone: string;
  contactEmail?: string;
  isFlaggedWatchlist: boolean;
  watchlistReason?: string;
  createdAt: string;
}

export interface VisitorVisit {
  visitId: string;
  tenantId: string;
  campusIdRef: string;
  visitorIdRef: string;
  visitorName: string;
  hostUserIdRef: string; // Employee or faculty member reference
  hostName: string;
  purposeOfVisit: string;
  targetZoneIdRefs: string[];
  status: VisitorStatus;
  scheduledArrival: string;
  scheduledDeparture: string;
  actualCheckInTime?: string;
  actualCheckOutTime?: string;
  escortRequired: boolean;
  assignedEscortUserIdRef?: string;
  issuedBadgeNumber?: string;
  vehicleRegistrationNumber?: string;
  checkedInByUserIdRef?: string;
  checkedOutByUserIdRef?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VisitorPass {
  passId: string;
  tenantId: string;
  campusIdRef: string;
  visitIdRef: string;
  passCode: string;
  qrCodeReference: string;
  validFrom: string;
  validUntil: string;
  isPrinted: boolean;
  isReturned: boolean;
}

export interface VisitorEscort {
  escortId: string;
  tenantId: string;
  campusIdRef: string;
  visitIdRef: string;
  escortOfficerUserIdRef: string;
  startLocation: string;
  destinationZoneIdRef: string;
  handoverTime: string;
  conclusionTime?: string;
  remarks?: string;
}

export interface ContractorAccessRequest {
  contractorRequestId: string;
  tenantId: string;
  campusIdRef: string;
  companyName: string;
  contractReferenceNumber: string;
  leadContractorName: string;
  contactPhone: string;
  workDescription: string;
  workLocationZoneIdRefs: string[];
  procurementContractIdRef?: string; // Phase 11.3 reference
  facilitiesWorkOrderIdRef?: string;  // Phase 11.5 reference
  validFrom: string;
  validUntil: string;
  workerCount: number;
  status: ContractorAccessStatus;
  safetyBriefingSigned: boolean;
  hotWorkPermitRequired: boolean;
  confinedSpacePermitRequired: boolean;
  hazardDeclaration: string;
  requestedByUserIdRef: string;
  approvedByUserIdRef?: string;
  approvalRemarks?: string;
  createdAt: string;
}

export interface ContractorAccessAuthorization {
  authorizationId: string;
  tenantId: string;
  campusIdRef: string;
  contractorRequestIdRef: string;
  authorizedByUserIdRef: string;
  authorizedAt: string;
  allocatedBadgeCodes: string[];
  safetyInductionSupervisorRef: string;
}

export interface ContractorSafetyAcknowledgement {
  acknowledgementId: string;
  tenantId: string;
  campusIdRef: string;
  contractorRequestIdRef: string;
  workerFullName: string;
  workerNationalIdMasked: string;
  acknowledgedDate: string;
  inductionTrainerUserIdRef: string;
  ppeComplianceConfirmed: boolean;
}

// ============================================================
// 5. SECURITY PATROLS & GUARD FORCE OPERATIONS
// ============================================================

export interface SecurityPatrol {
  patrolId: string;
  tenantId: string;
  campusIdRef: string;
  patrolCode: string;
  routeName: string;
  zoneIdRefs: string[];
  assignedOfficerUserIdRef: string;
  assignedOfficerName: string;
  scheduledStartTime: string;
  scheduledEndTime: string;
  actualStartTime?: string;
  actualEndTime?: string;
  status: PatrolStatus;
  checkpointsTotal: number;
  checkpointsCompleted: number;
  observationsCount: number;
  missedCheckpointCount: number;
  routeDeviationNotes?: string;
  completedByUserIdRef?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PatrolAssignment {
  assignmentId: string;
  tenantId: string;
  campusIdRef: string;
  patrolIdRef: string;
  officerUserIdRef: string;
  shift: SecurityOfficerShift;
  assignedByUserIdRef: string;
  assignedAt: string;
  instructions: string;
}

export interface PatrolCheckpoint {
  checkpointId: string;
  tenantId: string;
  campusIdRef: string;
  patrolIdRef: string;
  checkpointSequence: number;
  locationName: string;
  zoneIdRef: string;
  expectedArrivalTime: string;
  actualScanTime?: string;
  isScanned: boolean;
  isMissed: boolean;
  nfcTagIdScanned?: string;
  barcodeScanned?: string;
  gpsLatitude?: number;
  gpsLongitude?: number;
}

export interface PatrolObservation {
  observationId: string;
  tenantId: string;
  campusIdRef: string;
  patrolIdRef: string;
  timestamp: string;
  zoneIdRef: string;
  category: 'DOOR_UNLOCKED' | 'LIGHTING_DEFECT' | 'SUSPICIOUS_ACTIVITY' | 'WATER_LEAK' | 'FIRE_EXTINGUISHER_EXPIRED' | 'UNAUTHORIZED_OCCUPANT' | 'PERIMETER_BREACH' | 'ROUTINE_CLEAR';
  severity: IncidentSeverity;
  description: string;
  actionTaken: string;
  autoEscalatedToIncident: boolean;
  spawnedIncidentIdRef?: string;
  observedByUserIdRef: string;
}

export interface SecurityOfficerAssignment {
  officerAssignmentId: string;
  tenantId: string;
  campusIdRef: string;
  officerUserIdRef: string;
  officerName: string;
  badgeNumber: string;
  rankOrRole: 'CHIEF_SECURITY_OFFICER' | 'SHIFT_SUPERVISOR' | 'SECURITY_GUARD' | 'CCTV_OPERATOR' | 'PATROL_OFFICER' | 'ARMED_ESCORT';
  assignedPostIdRef: string;
  currentShift: SecurityOfficerShift;
  shiftDate: string;
  shiftStartTime: string;
  shiftEndTime: string;
  isOnDuty: boolean;
  assignedRadioChannel: string;
  equipmentIssued: string[];
}

export interface SecurityShift {
  shiftId: string;
  tenantId: string;
  campusIdRef: string;
  shiftType: SecurityOfficerShift;
  supervisorUserIdRef: string;
  shiftDate: string;
  rosteredOfficersCount: number;
  presentOfficersCount: number;
  handoverNotes: string;
  isHandoverCompleted: boolean;
  handoverToSupervisorUserIdRef?: string;
}

export interface SecurityPostAssignment {
  postAssignmentId: string;
  tenantId: string;
  campusIdRef: string;
  postIdRef: string;
  officerUserIdRef: string;
  startTime: string;
  endTime: string;
  assignedByUserIdRef: string;
}

// ============================================================
// 6. INCIDENT MANAGEMENT (SECURITY, SAFETY, EMERGENCY)
// ============================================================

export interface SecurityIncident {
  incidentId: string;
  tenantId: string;
  campusIdRef: string;
  incidentNumber: string;
  title: string;
  classification: IncidentClassification;
  severity: IncidentSeverity;
  status: IncidentStatus;
  occurredAt: string;
  reportedAt: string;
  reportedByUserIdRef: string;
  reportedByName: string;
  zoneIdRef: string;
  buildingIdRef?: string;
  physicalLocationDescription: string;
  description: string;
  immediateActionsTaken: string;
  isConfidential: boolean;
  assignedInvestigatorUserIdRef?: string;
  escalatedToSeniorManagement: boolean;
  escalationTimestamp?: string;
  policeReportFiled: boolean;
  policeReportNumber?: string;
  rootCauseAnalysis?: string;
  correctiveActionsSummary?: string;
  closedAt?: string;
  closedByUserIdRef?: string;
  dualApprovedClosureUserIdRef?: string;
  closureRemarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SafetyIncident {
  safetyIncidentId: string;
  tenantId: string;
  campusIdRef: string;
  incidentNumber: string;
  hazardType: 'TRIP_FALL' | 'CHEMICAL_EXPOSURE' | 'ELECTRICAL_SHOCK' | 'EQUIPMENT_MALFUNCTION' | 'STRUCTURAL_HAZARD' | 'FIRE_BURN' | 'NOISE_EXPOSURE';
  severity: IncidentSeverity;
  status: IncidentStatus;
  affectedPersonCount: number;
  firstAidAdministered: boolean;
  clinicalReferralRequired: boolean; // Phase 11.11 reference only
  clinicalEncounterIdRef?: string;   // Reference to Phase 11.11 clinical encounter
  oshaOrRegulatorReportable: boolean;
  investigationRequired: boolean;
  locationZoneIdRef: string;
  description: string;
  reportedByUserIdRef: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmergencyIncident {
  emergencyId: string;
  tenantId: string;
  campusIdRef: string;
  emergencyCode: string;
  emergencyType: EmergencyType;
  severity: 'CRITICAL';
  status: EmergencyActivationStatus;
  declaredAt: string;
  declaredByUserIdRef: string;
  incidentCommanderUserIdRef: string;
  epicenterZoneIdRef: string;
  affectedZoneIdRefs: string[];
  headline: string;
  description: string;
  lockdownInstituted: boolean;
  evacuationOrdered: boolean;
  spawnedEvacuationEventIdRef?: string;
  standDownAt?: string;
  standDownAuthorizedByUserIdRef?: string;
  standDownDualAuthorizedByUserIdRef?: string;
  postIncidentReviewSummary?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IncidentParticipant {
  participantId: string;
  tenantId: string;
  campusIdRef: string;
  incidentIdRef: string;
  participantType: 'VICTIM' | 'PERPETRATOR_SUSPECT' | 'WITNESS' | 'FIRST_RESPONDER' | 'REPORTING_PARTY';
  userCategory: 'STUDENT' | 'FACULTY' | 'STAFF' | 'VISITOR' | 'CONTRACTOR' | 'EXTERNAL_UNKNOWN';
  userIdRef?: string;
  name: string;
  statementSummary?: string;
  contactNumber?: string;
}

export interface IncidentAction {
  actionId: string;
  tenantId: string;
  campusIdRef: string;
  incidentIdRef: string;
  actionSequence: number;
  timestamp: string;
  actionTakenByUserIdRef: string;
  actionDescription: string;
  actionType: 'CONTAINMENT' | 'MEDICAL_ASSISTANCE' | 'LAW_ENFORCEMENT_CONTACT' | 'EVIDENCE_SECURED' | 'NOTIFICATIONS_ISSUED' | 'STAND_DOWN';
}

// ============================================================
// 7. SECURITY INVESTIGATIONS & EVIDENCE
// ============================================================

export interface SecurityInvestigation {
  investigationId: string;
  tenantId: string;
  campusIdRef: string;
  investigationCode: string;
  incidentIdRef: string;
  title: string;
  leadInvestigatorUserIdRef: string;
  investigationTeamUserIdRefs: string[];
  status: InvestigationStatus;
  isConfidential: boolean;
  startedAt: string;
  findingsCount: number;
  evidenceItemsCount: number;
  summaryOfAllegations: string;
  factualFindings?: string;
  disciplinaryReferralRecommended: boolean;
  legalReferralRecommended: boolean;
  closureRecommendation?: string;
  closedAt?: string;
  closedByUserIdRef?: string;
  dualApprovedClosureUserIdRef?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvestigationFinding {
  findingId: string;
  tenantId: string;
  campusIdRef: string;
  investigationIdRef: string;
  findingSequence: number;
  findingCategory: 'UNAUTHORIZED_ENTRY' | 'POLICY_VIOLATION' | 'EQUIPMENT_TAMPERING' | 'CREDENTIAL_MISUSE' | 'FALSE_REPORT' | 'EXTERNAL_THREAT' | 'NO_MALPRACTICE_FOUND';
  statement: string;
  corroboratingEvidenceIds: string[];
  confidenceLevel: 'PREPONDERANCE' | 'CLEAR_AND_CONVINCING' | 'BEYOND_REASONABLE_DOUBT' | 'INCONCLUSIVE';
}

export interface EvidenceReference {
  evidenceId: string;
  tenantId: string;
  campusIdRef: string;
  investigationIdRef: string;
  itemNumber: string;
  evidenceType: 'CCTV_FOOTAGE_REF' | 'ACCESS_LOG_EXTRACT' | 'PHYSICAL_ITEM' | 'PHOTOGRAPH_REF' | 'WITNESS_WRITTEN_STATEMENT' | 'DIGITAL_FORENSIC_REF';
  description: string;
  chainOfCustodyCurrentHolder: string;
  securedLocationZoneIdRef: string;
  dateCollected: string;
  collectedByUserIdRef: string;
  sha256ContentFingerprint: string;
}

export interface InvestigationAction {
  actionId: string;
  tenantId: string;
  campusIdRef: string;
  investigationIdRef: string;
  actionDate: string;
  officerUserIdRef: string;
  actionTaken: string;
}

export interface InvestigationClosure {
  closureId: string;
  tenantId: string;
  campusIdRef: string;
  investigationIdRef: string;
  closingStatement: string;
  closedByLeadInvestigatorUserIdRef: string;
  reviewedAndAuthorizedByUserIdRef: string; // Four-Eyes requirement
  closureTimestamp: string;
  sha256AuditRecord: string;
}

// ============================================================
// 8. THREAT & RISK ASSESSMENTS
// ============================================================

export interface SecurityThreatAssessment {
  threatId: string;
  tenantId: string;
  campusIdRef: string;
  threatCode: string;
  title: string;
  category: 'PHYSICAL_TERROR' | 'CYBER_PHYSICAL' | 'CIVIL_UNREST' | 'VIP_THREAT' | 'INSIDER_THREAT' | 'HAZARDOUS_FACILITY';
  targetZoneIdRef: string;
  likelihoodScore: number; // 1-5 (Strictly bounded)
  impactScore: number;     // 1-5 (Strictly bounded)
  calculatedRiskScore: number; // likelihood * impact (1-25)
  riskClassification: IncidentSeverity;
  assessedByUserIdRef: string;
  assessedAt: string;
  mitigationStrategySummary: string;
  residualRiskScore: number;
  acceptedBySeniorManagement: boolean;
  acceptedByUserIdRef?: string;
  dualApprovedRiskAcceptanceUserIdRef?: string; // Four-Eyes for HIGH/CRITICAL
  reviewDate: string;
}

export interface SecurityRiskAssessment {
  riskAssessmentId: string;
  tenantId: string;
  campusIdRef: string;
  facilityOrZoneIdRef: string;
  assessmentDate: string;
  vulnerabilityDescription: string;
  threatVector: string;
  likelihood: number; // 1-5
  impact: number;     // 1-5
  totalRisk: number;  // 1-25
  status: 'IDENTIFIED' | 'MITIGATING' | 'ACCEPTED' | 'TRANSFERRED' | 'RESOLVED';
  assessorUserIdRef: string;
}

export interface RiskMitigationAction {
  mitigationId: string;
  tenantId: string;
  campusIdRef: string;
  threatIdRef: string;
  actionTitle: string;
  targetCompletionDate: string;
  assignedOwnerUserIdRef: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE';
}

// ============================================================
// 9. EMERGENCY RESPONSE & EVACUATION
// ============================================================

export interface EmergencyResponsePlan {
  planId: string;
  tenantId: string;
  campusIdRef: string;
  planCode: string;
  title: string;
  emergencyType: EmergencyType;
  primaryCommanderRole: string;
  alternateCommanderRole: string;
  assemblyPointIdRefs: string[];
  mandatoryActionsChecklist: string[];
  resourceInventoryRefs: string[];
  version: string;
  isActive: boolean;
  lastTestedDate?: string;
  approvedByUserIdRef: string;
  approvedAt: string;
}

export interface EmergencyResponseActivation {
  activationId: string;
  tenantId: string;
  campusIdRef: string;
  planIdRef: string;
  emergencyIncidentIdRef: string;
  activatedByUserIdRef: string;
  activatedAt: string;
  commanderUserIdRef: string;
  responseTeamUserIdRefs: string[];
  currentPhase: 'NOTIFICATION' | 'DEPLOYMENT' | 'CONTAINMENT' | 'EVACUATION' | 'RECOVERY' | 'STAND_DOWN';
  actionsCompletedCount: number;
  standDownTimestamp?: string;
  standDownAuthorizedByUserIdRef?: string;
}

export interface EmergencyResponseAction {
  actionId: string;
  tenantId: string;
  campusIdRef: string;
  activationIdRef: string;
  timestamp: string;
  assignedRole: string;
  actionTaken: string;
  status: 'PENDING' | 'EXECUTED' | 'BLOCKED';
  executedByUserIdRef?: string;
}

export interface EmergencyEscalation {
  escalationId: string;
  tenantId: string;
  campusIdRef: string;
  emergencyIdRef: string;
  escalatedToRole: string;
  escalationReason: string;
  notifiedTimestamp: string;
  escalatedByUserIdRef: string;
}

export interface EmergencyResourceReference {
  resourceId: string;
  tenantId: string;
  campusIdRef: string;
  resourceName: string;
  category: 'FIRE_EXTINGUISHER' | 'FIRST_AID_KIT' | 'DEFIBRILLATOR_AED' | 'HAZMAT_KIT' | 'MEGAPHONE' | 'EMERGENCY_GENERATOR' | 'TWO_WAY_RADIO';
  storageZoneIdRef: string;
  quantityAvailable: number;
  lastInspectedDate: string;
  isOperational: boolean;
}

export interface EvacuationPlan {
  evacuationPlanId: string;
  tenantId: string;
  campusIdRef: string;
  planCode: string;
  name: string;
  buildingIdRef: string;
  coveredZoneIdRefs: string[];
  designatedAssemblyPointIdRefs: string[];
  estimatedClearanceTimeMinutes: number;
  wardenRoleAssignments: Record<string, string>; // zoneId -> officerUserIdRef
  isActive: boolean;
}

export interface EvacuationZone {
  evacuationZoneId: string;
  tenantId: string;
  campusIdRef: string;
  zoneCode: string;
  zoneName: string;
  buildingIdRef: string;
  floorLevel: string;
  assignedWardenUserIdRef: string;
  primaryExitRoute: string;
  secondaryExitRoute: string;
  targetAssemblyPointIdRef: string;
}

export interface EvacuationAssemblyPoint {
  assemblyPointId: string;
  tenantId: string;
  campusIdRef: string;
  pointCode: string;
  pointName: string;
  openSpaceDescription: string;
  capacity: number;
  isClearOfHazards: boolean;
  coordinatorUserIdRef: string;
}

export interface EvacuationEvent {
  evacuationEventId: string;
  tenantId: string;
  campusIdRef: string;
  eventCode: string;
  emergencyIdRef?: string;
  isDrill: boolean;
  drillIdRef?: string;
  orderedAt: string;
  orderedByUserIdRef: string;
  targetBuildingIdRefs: string[];
  status: EvacuationStatus;
  totalOccupantsAccounted: number;
  totalOccupantsMissing: number;
  clearanceDeclaredAt?: string;
  clearanceDeclaredByWardenUserIdRef?: string;
  reEntryAuthorizedAt?: string;
  reEntryAuthorizedByUserIdRef?: string;
  reEntryDualAuthorizedByUserIdRef?: string; // Four-Eyes check
  notes?: string;
}

export interface EvacuationAccountability {
  accountabilityId: string;
  tenantId: string;
  campusIdRef: string;
  evacuationEventIdRef: string;
  assemblyPointIdRef: string;
  personUserIdRef: string;
  personName: string;
  personCategory: 'STUDENT' | 'FACULTY' | 'STAFF' | 'VISITOR' | 'CONTRACTOR';
  checkInTimestamp: string;
  isCheckedInSafe: boolean;
  needsMedicalAttention: boolean;
  recordedByOfficerUserIdRef: string;
}

// ============================================================
// 10. BUSINESS CONTINUITY & DISASTER RECOVERY
// ============================================================

export interface BusinessContinuityPlan {
  bcpId: string;
  tenantId: string;
  campusIdRef: string;
  planCode: string;
  title: string;
  departmentOrDivision: string;
  criticalFunctions: CriticalFunction[];
  continuityStrategies: ContinuityStrategy[];
  responsibleLeadUserIdRef: string;
  alternateLeadUserIdRef: string;
  activationCriteria: string;
  testingScheduleMonths: number;
  lastDrillDate?: string;
  nextReviewDate: string;
  isActive: boolean;
  version: string;
  approvedByUserIdRef: string;
  approvedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface CriticalFunction {
  functionId: string;
  functionName: string;
  priorityLevel: 'TIER_1_CRITICAL_0_4_HOURS' | 'TIER_2_URGENT_4_24_HOURS' | 'TIER_3_ESSENTIAL_1_3_DAYS' | 'TIER_4_NON_ESSENTIAL';
  recoveryTimeObjectiveHours: number; // RTO
  recoveryPointObjectiveHours: number; // RPO
  upstreamDependencies: string[];
  workaroundProcedures: string;
  minimumStaffRequired: number;
}

export interface ContinuityStrategy {
  strategyId: string;
  strategyName: string;
  disruptionScenario: 'FACILITY_UNAVAILABLE' | 'WORKFORCE_DEPLETION' | 'IT_SYSTEM_OUTAGE' | 'SUPPLY_CHAIN_FAILURE' | 'EXTENDED_POWER_FAILURE';
  alternateWorkLocationZoneIdRef?: string;
  remoteWorkingCapabilityPercentage: number;
  standbySystemsRef?: string;
}

export interface RecoveryObjective {
  objectiveId: string;
  tenantId: string;
  campusIdRef: string;
  bcpIdRef: string;
  criticalFunctionName: string;
  targetRtoHours: number;
  targetRpoHours: number;
  achievedRtoHours?: number;
  achievedRpoHours?: number;
}

export interface ContinuityIncident {
  continuityIncidentId: string;
  tenantId: string;
  campusIdRef: string;
  incidentCode: string;
  bcpIdRef: string;
  title: string;
  lifecycleStatus: ContinuityIncidentLifecycle;
  disruptionType: 'POWER_GRID_FAILURE' | 'CAMPUS_FLOODING' | 'PANDEMIC_SURGE' | 'CORE_SERVER_OUTAGE' | 'WATER_SUPPLY_LOSS';
  affectedOperations: string[];
  declaredAt: string;
  declaredByUserIdRef: string;
  activatedAt?: string;
  activatedByUserIdRef?: string;
  dualAuthorizedActivationUserIdRef?: string; // Four-Eyes activation override
  restoredAt?: string;
  closedAt?: string;
  postIncidentReportSummary?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContinuityActivation {
  activationId: string;
  tenantId: string;
  campusIdRef: string;
  continuityIncidentIdRef: string;
  bcpIdRef: string;
  activatedByUserIdRef: string;
  activationTimestamp: string;
  mobilizedTeamLeadUserIdRef: string;
  alternateLocationEstablished: boolean;
}

export interface ContinuityRecoveryAction {
  recoveryActionId: string;
  tenantId: string;
  campusIdRef: string;
  continuityIncidentIdRef: string;
  actionSequence: number;
  criticalFunctionName: string;
  actionDescription: string;
  assignedRole: string;
  assignedOfficerUserIdRef: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED';
  completedAt?: string;
}

// ============================================================
// 11. EMERGENCY DRILLS & SIMULATIONS
// ============================================================

export interface EmergencyDrill {
  drillId: string;
  tenantId: string;
  campusIdRef: string;
  drillCode: string;
  drillTitle: string;
  drillType: 'FIRE_EVACUATION' | 'ACTIVE_SHOOTER_LOCKDOWN' | 'EARTHQUAKE_DROP_COVER' | 'HAZMAT_SPILL' | 'BCP_FAILOVER_EXERCISE';
  plannedDate: string;
  status: DrillStatus;
  targetBuildingIdRefs: string[];
  targetZoneIdRefs: string[];
  leadEvaluatorUserIdRef: string;
  participantExpectedCount: number;
  actualParticipantCount: number;
  drillStartTime?: string;
  drillEndTime?: string;
  elapsedEvacuationSeconds?: number;
  targetEvacuationSeconds: number;
  drillSuccessful: boolean;
  summaryFindings?: string;
  correctiveActionsSummary?: string;
  isSyntheticDrillData: boolean; // Must always be true for simulated test runs
  createdAt: string;
  updatedAt: string;
}

export interface DrillParticipant {
  participantId: string;
  tenantId: string;
  campusIdRef: string;
  drillIdRef: string;
  role: 'OBSERVER' | 'WARDEN' | 'PARTICIPANT_STUDENT' | 'PARTICIPANT_STAFF' | 'EVALUATOR';
  userIdRef: string;
  name: string;
}

export interface DrillObservation {
  observationId: string;
  tenantId: string;
  campusIdRef: string;
  drillIdRef: string;
  timestamp: string;
  observedLocation: string;
  observationNote: string;
  wasExitBlocked: boolean;
  didAlarmSoundClear: boolean;
  evaluatorUserIdRef: string;
}

export interface DrillFinding {
  findingId: string;
  tenantId: string;
  campusIdRef: string;
  drillIdRef: string;
  findingNumber: number;
  category: 'COMMUNICATION_DELAY' | 'DOOR_CONGESTION' | 'WARDEN_ABSENT' | 'ALARM_FAILURE' | 'ASSEMBLY_POINT_CONFUSION' | 'EXCELLENT_COMPLIANCE';
  description: string;
  severity: IncidentSeverity;
}

export interface DrillCorrectiveAction {
  actionId: string;
  tenantId: string;
  campusIdRef: string;
  drillIdRef: string;
  findingIdRef: string;
  actionRequired: string;
  responsibleOfficerUserIdRef: string;
  deadlineDate: string;
  isCompleted: boolean;
  completedAt?: string;
}

// ============================================================
// 12. AUDIT, PROVENANCE & CORRECTION GOVERNANCE
// ============================================================

export interface SecuritySafetyAuditEvent {
  eventId: string;
  tenantId: string;
  campusIdRef: string;
  actorUserIdRef: string;
  actorRole: string;
  entityType:
    | 'SECURITY_ZONE'
    | 'ACCESS_CREDENTIAL'
    | 'PHYSICAL_ACCESS'
    | 'VISITOR_PASS'
    | 'CONTRACTOR_REQUEST'
    | 'PATROL_RECORD'
    | 'SECURITY_INCIDENT'
    | 'SAFETY_INCIDENT'
    | 'EMERGENCY_INCIDENT'
    | 'INVESTIGATION'
    | 'THREAT_ASSESSMENT'
    | 'EMERGENCY_RESPONSE'
    | 'EVACUATION'
    | 'BUSINESS_CONTINUITY'
    | 'EMERGENCY_DRILL'
    | 'FOUR_EYES_OVERRIDE';
  entityId: string;
  action: string;
  timestamp: string;
  previousHash: string;
  currentHash: string;
  correlationId: string;
  idempotencyKey?: string;
  metadata?: Record<string, any>;
}

export interface SecurityCorrectionRequest {
  correctionId: string;
  tenantId: string;
  campusIdRef: string;
  originalEntityId: string;
  originalEntityType: string;
  reasonForCorrection: string;
  requestedByUserIdRef: string;
  requestedAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  approvedByUserIdRef?: string;
  approvedAt?: string;
  correctedFields: Record<string, any>;
  sha256AuditHash: string;
}

// ============================================================
// 13. WHAT-IF SANDBOX SIMULATION SCENARIO
// ============================================================

export type SecuritySimulationScenarioType =
  | 'SECURITY_SURGE'
  | 'ACCESS_CREDENTIAL_SURGE'
  | 'VISITOR_SURGE'
  | 'CRITICAL_INCIDENT_CASCADE'
  | 'MULTI_INCIDENT_CONCURRENCY'
  | 'CAMPUS_LOCKDOWN'
  | 'EVACUATION_SURGE'
  | 'FIRE_RESPONSE'
  | 'NATURAL_DISASTER'
  | 'SECURITY_OFFICER_SHORTAGE'
  | 'CHECKPOINT_FAILURE'
  | 'ACCESS_SYSTEM_OUTAGE'
  | 'EMERGENCY_COMMUNICATION_FAILURE'
  | 'BUSINESS_CONTINUITY_ACTIVATION'
  | 'MULTI_CAMPUS_CRISIS';

export interface SecuritySimulationScenario {
  scenarioId: string;
  scenarioType: SecuritySimulationScenarioType;
  title: string;
  description: string;
  simulatedInputs: {
    simulatedIncidentCount?: number;
    simulatedVisitorSurgeCount?: number;
    simulatedGuardAvailabilityRate?: number;
    targetZoneIds?: string[];
    injectLockdown?: boolean;
    injectPowerFailure?: boolean;
  };
  syntheticResults: {
    predictedResponseTimeMinutes: number;
    containmentSuccessProbability: number;
    evacuationClearanceEstimatedSeconds: number;
    patrolCoveragePercentage: number;
    continuityRtoComplianceProbability: number;
    resourceDeficitsIdentified: string[];
    riskScoreAdjusted: number;
  };
  simulatedAt: string;
  isSyntheticOnly: true;
}

// ============================================================
// 14. DIAGNOSTIC SCANNER TYPES
// ============================================================

export interface SecurityDiagnosticIssue {
  issueId: string;
  code: string;
  severity: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
  category:
    | 'CREDENTIAL_INTEGRITY'
    | 'VISITOR_PASS_OVERDUE'
    | 'ACCESS_ANOMALY'
    | 'ORPHANED_INCIDENT'
    | 'FOUR_EYES_VIOLATION'
    | 'INVESTIGATION_SLA_EXCEEDED'
    | 'RISK_SCORE_BOUNDS'
    | 'UNASSIGNED_EMERGENCY'
    | 'EVACUATION_GAP'
    | 'CONTINUITY_RTO_INVALID'
    | 'OVERDUE_DRILL'
    | 'AUDIT_CHAIN_CORRUPTED';
  entityId: string;
  title: string;
  details: string;
  remediationRecommendation: string;
}

export interface SecurityDiagnosticsReport {
  timestamp: string;
  tenantId: string;
  campusIdRef: string;
  totalChecksExecuted: number;
  passedChecksCount: number;
  issuesFound: SecurityDiagnosticIssue[];
  systemHealthScore: number; // 0-100
  auditChainIntegrityValid: boolean;
}
