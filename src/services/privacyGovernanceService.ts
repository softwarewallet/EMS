import { 
  FirebaseService, 
  OperationType, 
  handleFirestoreError 
} from './firebaseService';
import { 
  ProcessingPurpose,
  ConsentRecord,
  PrivacySubjectRequest,
  PrivacyImpactAssessment,
  PrivacyIncident,
  InformationSecurityControl,
  ProcessingPurposeStatus,
  ConsentStatus,
  SubjectRequestStatus,
  PIAStatus,
  IncidentStatus
} from '../types/privacyGovernance';
import { AuditService } from './auditService';
import { User } from '../types/index';
import { db } from '../config/firebase';
import { 
  runTransaction, 
  doc, 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  limit 
} from 'firebase/firestore';

const PURPOSES_COL = 'privacy_processing_purposes';
const CONSENTS_COL = 'privacy_consents';
const REQUESTS_COL = 'privacy_subject_requests';
const PIA_COL = 'privacy_pia';
const INCIDENTS_COL = 'privacy_incidents';
const CONTROLS_COL = 'privacy_security_controls';
const EXCEPTIONS_COL = 'privacy_security_exceptions';

export class PrivacyGovernanceService {
  // =========================================================================
  // 1. PROCESSING PURPOSES
  // =========================================================================

  static async createPurpose(
    tenantId: string,
    params: Omit<ProcessingPurpose, 'id' | 'tenantId' | 'status' | 'version' | 'createdAt' | 'updatedAt' | 'createdBy'>,
    actor: User
  ): Promise<ProcessingPurpose> {
    const id = FirebaseService.generateId('purp');
    const now = new Date().toISOString();
    
    const purpose: ProcessingPurpose = {
      ...params,
      id,
      tenantId,
      status: 'DRAFT',
      version: 1,
      createdAt: now,
      updatedAt: now,
      createdBy: actor.id
    };

    await FirebaseService.setDocument(PURPOSES_COL, id, purpose);
    
    await AuditService.log({
      tenantId,
      userId: actor.id,
      userEmail: actor.email,
      userDisplayName: actor.displayName,
      action: 'PRIVACY_PURPOSE_CREATED',
      resource: 'privacy_purpose',
      resourceId: id,
      resourceName: purpose.name,
      result: 'SUCCESS',
      newValue: purpose
    });

    return purpose;
  }

  static async approvePurpose(
    tenantId: string,
    purposeId: string,
    actor: User
  ): Promise<ProcessingPurpose> {
    const purpose = await FirebaseService.getDocument<ProcessingPurpose>(PURPOSES_COL, purposeId);
    if (!purpose || purpose.tenantId !== tenantId) throw new Error('Purpose not found');
    
    // Separation of duties
    if (purpose.createdBy === actor.id) {
      throw new Error('Separation of Duties Violation: Creator cannot approve their own processing purpose');
    }

    const now = new Date().toISOString();
    purpose.status = 'APPROVED';
    purpose.approvedBy = actor.id;
    purpose.approvedAt = now;
    purpose.updatedAt = now;

    await FirebaseService.setDocument(PURPOSES_COL, purposeId, purpose);
    
    await AuditService.log({
      tenantId,
      userId: actor.id,
      userEmail: actor.email,
      userDisplayName: actor.displayName,
      action: 'PRIVACY_PURPOSE_APPROVED',
      resource: 'privacy_purpose',
      resourceId: purposeId,
      resourceName: purpose.name,
      result: 'SUCCESS'
    });

    return purpose;
  }

  // =========================================================================
  // 2. CONSENT GOVERNANCE
  // =========================================================================

  static async recordConsent(
    tenantId: string,
    params: Omit<ConsentRecord, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>,
    actor: User
  ): Promise<ConsentRecord> {
    const id = FirebaseService.generateId('cons');
    const now = new Date().toISOString();
    
    const consent: ConsentRecord = {
      ...params,
      id,
      tenantId,
      createdAt: now,
      updatedAt: now
    };

    // Use transaction to ensure immutable history if needed or atomic updates
    await FirebaseService.setDocument(CONSENTS_COL, id, consent);
    
    await AuditService.log({
      tenantId,
      userId: actor.id,
      userEmail: actor.email,
      userDisplayName: actor.displayName,
      action: 'PRIVACY_CONSENT_GRANTED',
      resource: 'privacy_consent',
      resourceId: id,
      resourceName: `Consent for ${params.subjectId}`,
      result: 'SUCCESS',
      newValue: consent
    });

    return consent;
  }

  static async withdrawConsent(
    tenantId: string,
    consentId: string,
    actor: User
  ): Promise<void> {
    const consent = await FirebaseService.getDocument<ConsentRecord>(CONSENTS_COL, consentId);
    if (!consent || consent.tenantId !== tenantId) throw new Error('Consent record not found');

    const now = new Date().toISOString();
    consent.status = 'WITHDRAWN';
    consent.withdrawnAt = now;
    consent.updatedAt = now;

    await FirebaseService.setDocument(CONSENTS_COL, consentId, consent);
    
    await AuditService.log({
      tenantId,
      userId: actor.id,
      userEmail: actor.email,
      userDisplayName: actor.displayName,
      action: 'PRIVACY_CONSENT_WITHDRAWN',
      resource: 'privacy_consent',
      resourceId: consentId,
      result: 'SUCCESS'
    });
  }

  // =========================================================================
  // 3. SUBJECT REQUESTS
  // =========================================================================

  static async submitSubjectRequest(
    tenantId: string,
    params: Omit<PrivacySubjectRequest, 'id' | 'tenantId' | 'status' | 'identityVerified' | 'createdAt' | 'updatedAt' | 'createdBy'>,
    actor: User
  ): Promise<PrivacySubjectRequest> {
    const id = FirebaseService.generateId('preq');
    const now = new Date().toISOString();
    
    const request: PrivacySubjectRequest = {
      ...params,
      id,
      tenantId,
      status: 'SUBMITTED',
      identityVerified: false,
      createdAt: now,
      updatedAt: now,
      createdBy: actor.id
    };

    await FirebaseService.setDocument(REQUESTS_COL, id, request);
    
    await AuditService.log({
      tenantId,
      userId: actor.id,
      userEmail: actor.email,
      userDisplayName: actor.displayName,
      action: 'PRIVACY_REQUEST_CREATED',
      resource: 'privacy_request',
      resourceId: id,
      result: 'SUCCESS',
      newValue: request
    });

    return request;
  }

  static async verifySubjectIdentity(
    tenantId: string,
    requestId: string,
    method: string,
    actor: User
  ): Promise<void> {
    const request = await FirebaseService.getDocument<PrivacySubjectRequest>(REQUESTS_COL, requestId);
    if (!request || request.tenantId !== tenantId) throw new Error('Request not found');

    const now = new Date().toISOString();
    await FirebaseService.updateDocument(REQUESTS_COL, requestId, {
      identityVerified: true,
      verifiedAt: now,
      verifiedBy: actor.id,
      verificationMethod: method,
      status: 'VERIFIED',
      updatedAt: now
    });
  }

  // =========================================================================
  // 4. INCIDENT MANAGEMENT
  // =========================================================================

  static async reportIncident(
    tenantId: string,
    params: Omit<PrivacyIncident, 'id' | 'tenantId' | 'incidentNumber' | 'status' | 'createdAt' | 'updatedAt'>,
    actor: User
  ): Promise<PrivacyIncident> {
    const id = FirebaseService.generateId('pinc');
    const now = new Date().toISOString();
    const incidentNumber = `INC-${now.substring(0, 4)}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    const incident: PrivacyIncident = {
      ...params,
      id,
      tenantId,
      incidentNumber,
      status: 'REPORTED',
      createdAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(INCIDENTS_COL, id, incident);
    
    await AuditService.log({
      tenantId,
      userId: actor.id,
      userEmail: actor.email,
      userDisplayName: actor.displayName,
      action: 'PRIVACY_INCIDENT_CREATED',
      resource: 'privacy_incident',
      resourceId: id,
      resourceName: incidentNumber,
      result: 'SUCCESS',
      newValue: incident
    });

    return incident;
  }

  // =========================================================================
  // DATA LISTING & UTILS
  // =========================================================================

  static async listPurposes(tenantId: string): Promise<ProcessingPurpose[]> {
    return FirebaseService.getTenantCollection<ProcessingPurpose>(PURPOSES_COL, tenantId);
  }

  static async listIncidents(tenantId: string): Promise<PrivacyIncident[]> {
    return FirebaseService.getTenantCollection<PrivacyIncident>(INCIDENTS_COL, tenantId);
  }

  static async listRequests(tenantId: string): Promise<PrivacySubjectRequest[]> {
    return FirebaseService.getTenantCollection<PrivacySubjectRequest>(REQUESTS_COL, tenantId);
  }
}
