import { UserActor } from './index';

export type DataClassification = 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'RESTRICTED' | 'HIGHLY_CONFIDENTIAL';

export type ProcessingPurposeStatus = 'DRAFT' | 'UNDER_REVIEW' | 'APPROVED' | 'ACTIVE' | 'SUSPENDED' | 'RETIRED';

export type ConsentStatus = 'REQUESTED' | 'GRANTED' | 'PARTIALLY_GRANTED' | 'WITHDRAWN' | 'EXPIRED' | 'REVOKED';

export type SubjectRequestType = 'ACCESS' | 'RECTIFICATION' | 'EXPORT' | 'RESTRICTION' | 'OBJECTION' | 'DELETION' | 'ANONYMIZATION';

export type SubjectRequestStatus = 
  | 'SUBMITTED' 
  | 'IDENTITY_VERIFICATION_REQUIRED' 
  | 'VERIFIED' 
  | 'UNDER_REVIEW' 
  | 'APPROVED' 
  | 'REJECTED' 
  | 'IN_PROGRESS' 
  | 'FULFILLED' 
  | 'CLOSED';

export type IncidentSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type IncidentStatus = 
  | 'REPORTED' 
  | 'TRIAGED' 
  | 'UNDER_INVESTIGATION' 
  | 'CONTAINED' 
  | 'REMEDIATION' 
  | 'REVIEW' 
  | 'CLOSED';

export type PIAStatus = 'DRAFT' | 'UNDER_REVIEW' | 'HIGH_RISK' | 'APPROVED' | 'REJECTED' | 'ACTIVE' | 'RETIRED';

export interface ProcessingPurpose {
  id: string;
  tenantId: string;
  campusId?: string;
  name: string;
  description: string;
  dataCategories: string[];
  subjectCategories: string[];
  sourceModules: string[];
  processingBasis: string;
  legalReference?: string;
  status: ProcessingPurposeStatus;
  version: number;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface ConsentRecord {
  id: string;
  tenantId: string;
  campusId?: string;
  subjectId: string; // References Student, Staff, or User
  subjectType: 'STUDENT' | 'STAFF' | 'GUARDIAN' | 'USER';
  purposeId: string;
  status: ConsentStatus;
  grantedAt?: string;
  withdrawnAt?: string;
  effectiveFrom?: string;
  effectiveUntil?: string;
  source: 'WEB_PORTAL' | 'PAPER_FORM' | 'MOBILE_APP' | 'SYSTEM_ADMIN';
  evidenceDocumentId?: string; // Reference to Document Registry
  policyVersion: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PrivacySubjectRequest {
  id: string;
  tenantId: string;
  campusId?: string;
  subjectId: string;
  subjectType: string;
  requestType: SubjectRequestType;
  status: SubjectRequestStatus;
  description: string;
  identityVerified: boolean;
  verifiedAt?: string;
  verifiedBy?: string;
  verificationMethod?: string;
  fulfillmentNotes?: string;
  targetRecordId?: string; // Reference to the record in the authoritative module
  targetModule?: string;
  approvedBy?: string;
  approvedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface PrivacyImpactAssessment {
  id: string;
  tenantId: string;
  campusId?: string;
  title: string;
  projectReference: string;
  description: string;
  dataCategories: string[];
  affectedSubjects: string[];
  riskAssessment: {
    likelihood: number;
    impact: number;
    score: number;
  };
  mitigations: {
    description: string;
    status: 'PLANNED' | 'IMPLEMENTED';
  }[];
  residualRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: PIAStatus;
  version: number;
  reviewerId?: string;
  approvalId?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface PrivacyIncident {
  id: string;
  tenantId: string;
  campusId?: string;
  incidentNumber: string;
  title: string;
  type: 'PRIVACY_BREACH' | 'SECURITY_INCIDENT' | 'DATA_LEAKAGE' | 'UNAUTHORIZED_ACCESS' | 'POLICY_VIOLATION';
  severity: IncidentSeverity;
  status: IncidentStatus;
  description: string;
  discoveryDate: string;
  incidentDate: string;
  detectedBy: string;
  affectedRecordCount: number;
  affectedSubjectCount: number;
  containmentStatus: string;
  remediationPlan?: string;
  isRegulatoryReportable: boolean;
  regulatoryNotificationStatus?: 'NOT_REQUIRED' | 'PENDING' | 'COMPLETED';
  closedAt?: string;
  closedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InformationSecurityControl {
  id: string;
  tenantId: string;
  campusId?: string;
  controlCode: string;
  framework: 'ISO27001' | 'ISO27701' | 'NIST' | 'INTERNAL_POLICY';
  category: string;
  description: string;
  ownerId: string;
  status: 'IMPLEMENTED' | 'PARTIALLY_IMPLEMENTED' | 'NOT_IMPLEMENTED' | 'EXEMPT';
  lastReviewDate?: string;
  nextReviewDate?: string;
  effectiveness: 'EFFECTIVE' | 'INEFFECTIVE' | 'NOT_TESTED';
  evidenceDocumentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PrivacyAnalyticsCache {
  id: string;
  tenantId: string;
  campusId?: string;
  activePurposes: number;
  totalConsents: number;
  withdrawnConsents: number;
  pendingRequests: number;
  openIncidents: number;
  criticalIncidents: number;
  highRiskPIAs: number;
  complianceScore: number;
  lastUpdated: string;
}
