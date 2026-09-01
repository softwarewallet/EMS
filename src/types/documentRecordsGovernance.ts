export type EnterpriseDocumentStatus = 
  | 'REGISTERED'
  | 'DRAFT'
  | 'REVIEW'
  | 'APPROVAL_PENDING'
  | 'APPROVED'
  | 'PUBLISHED'
  | 'SUPERSEDED'
  | 'RETIRED'
  | 'ARCHIVED';

export type EnterpriseDocumentClassification = 
  | 'PUBLIC'
  | 'INTERNAL'
  | 'CONFIDENTIAL'
  | 'RESTRICTED'
  | 'HIGHLY_RESTRICTED';

export type EnterpriseRecordStatus = 
  | 'IDENTIFIED'
  | 'CLASSIFIED'
  | 'ACTIVE'
  | 'HOLD'
  | 'RETENTION_COMPLETE'
  | 'DISPOSITION_REVIEW'
  | 'DISPOSITION_APPROVED'
  | 'DISPOSED'
  | 'ARCHIVED';

export type EnterpriseCorrespondenceType = 
  | 'INCOMING'
  | 'OUTGOING'
  | 'INTERNAL'
  | 'EXTERNAL'
  | 'OFFICIAL_NOTICE'
  | 'EXECUTIVE'
  | 'REGULATORY'
  | 'STAKEHOLDER';

export type EnterpriseCorrespondenceStatus = 
  | 'RECEIVED'
  | 'SENT'
  | 'UNDER_REVIEW'
  | 'RESPONSE_PENDING'
  | 'RESPONDED'
  | 'CLOSED';

export type EnterpriseApprovalPackageStatus = 
  | 'DRAFT'
  | 'ASSEMBLED'
  | 'REVIEW'
  | 'APPROVAL_PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'REWORK'
  | 'CLOSED';

export type EnterpriseApprovalLevel = 
  | 'LEVEL_1' // OPERATIONAL
  | 'LEVEL_2' // MANAGEMENT
  | 'LEVEL_3' // EXECUTIVE
  | 'LEVEL_4' // CRITICAL / GOVERNANCE
  | 'LEVEL_5'; // BOARD / AUTHORIZED AUTHORITY

export type EnterpriseApprovalDecisionStatus = 
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'CONDITIONAL_APPROVAL'
  | 'WITHDRAWN';

export type EnterpriseReviewStatus = 
  | 'NOT_STARTED'
  | 'IN_REVIEW'
  | 'COMMENTS_REQUIRED'
  | 'REVIEW_COMPLETE'
  | 'REJECTED'
  | 'APPROVED';

export type EnterpriseIssueStatus = 
  | 'OPEN'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'RESOLVED'
  | 'VERIFIED'
  | 'CLOSED';

export type EnterpriseRetentionStatus = 
  | 'ACTIVE'
  | 'HOLD'
  | 'PENDING_REVIEW'
  | 'DISPOSITION_APPROVED'
  | 'DISPOSED';

export type EnterpriseHoldStatus = 
  | 'ACTIVE'
  | 'UNDER_REVIEW'
  | 'RELEASED'
  | 'EXPIRED';

export type EnterpriseEvidenceVerificationStatus = 
  | 'VERIFIED'
  | 'UNVERIFIED'
  | 'INSUFFICIENT_DATA';

// 1. Enterprise Document
export interface EnterpriseDocumentGovDoc {
  id: string;
  tenantId: string;
  campusId?: string;
  documentNumber: string;
  title: string;
  description: string;
  documentType: string;
  status: EnterpriseDocumentStatus;
  classification: EnterpriseDocumentClassification;
  businessCriticality: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  
  // Reference-only identifiers
  sourceModuleIdRef: string;
  sourceRecordIdRef: string;
  caseIdRef?: string;
  taskIdRef?: string;
  workflowInstanceIdRef?: string;
  approvalPackageIdRef?: string;
  contractIdRef?: string;
  riskIdRef?: string;
  complianceRecordIdRef?: string;
  incidentIdRef?: string;
  projectIdRef?: string;
  departmentIdRef?: string;

  ownerUserIdRef: string;
  stewardUserIdRef: string;

  activeVersionNumber: number;
  retentionCategoryRef?: string;
  legalHoldActive: boolean;

  createdAt: string;
  updatedAt: string;
}

// 2. Document Version
export interface EnterpriseDocumentVersion {
  id: string;
  tenantId: string;
  documentIdRef: string;
  versionNumber: number;
  sourceReferenceUrl?: string;
  contentHash?: string;
  changeSummary: string;
  createdByUserIdRef: string;
  isApprovedVersion: boolean;
  approvalPackageIdRef?: string;
  verificationStatus: EnterpriseEvidenceVerificationStatus;
  createdAt: string;
}

// 3. Enterprise Record
export interface EnterpriseRecordGovRecord {
  id: string;
  tenantId: string;
  campusId?: string;
  recordNumber: string;
  title: string;
  recordCategory: string;
  status: EnterpriseRecordStatus;
  
  sourceSystem: string;
  sourceRecordIdRef: string;

  ownerUserIdRef: string;
  stewardUserIdRef: string;

  retentionCategory: string;
  retentionStartDate: string;
  disposalEligibilityDate: string;
  legalHoldActive: boolean;
  preservationStatus: 'NORMAL' | 'PRESERVED' | 'LITIGATION_FREEZE';

  createdAt: string;
  updatedAt: string;
}

// 4. Correspondence Record
export interface EnterpriseCorrespondenceGovRecord {
  id: string;
  tenantId: string;
  campusId?: string;
  correspondenceNumber: string;
  type: EnterpriseCorrespondenceType;
  status: EnterpriseCorrespondenceStatus;
  
  subject: string;
  classification: EnterpriseDocumentClassification;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

  senderReference: string;
  recipientReference: string;
  organizationReference?: string;

  caseIdRef?: string;
  workflowInstanceIdRef?: string;
  contractIdRef?: string;
  incidentIdRef?: string;

  responseRequired: boolean;
  responseDueDate?: string;
  slaPolicyIdRef?: string;

  createdAt: string;
  updatedAt: string;
}

// 5. Approval Package
export interface EnterpriseApprovalPackageGovPkg {
  id: string;
  tenantId: string;
  campusId?: string;
  packageNumber: string;
  title: string;
  purpose: string;
  classification: EnterpriseDocumentClassification;
  status: EnterpriseApprovalPackageStatus;

  ownerUserIdRef: string;
  requesterUserIdRef: string;

  targetApprovalLevel: EnterpriseApprovalLevel;
  requiredApprovalCount: number;

  referencedDocumentIds: string[];
  referencedCaseIdRef?: string;
  referencedTaskIdRef?: string;

  decisionDeadline?: string;
  finalDecision?: EnterpriseApprovalDecisionStatus;
  decisionRationale?: string;
  auditHash: string;

  createdAt: string;
  updatedAt: string;
}

// 6. Approval Decision
export interface EnterpriseApprovalDecisionGovDec {
  id: string;
  tenantId: string;
  packageIdRef: string;
  approverUserIdRef: string;
  approverRoleRef: string;
  approvalLevel: EnterpriseApprovalLevel;
  decision: EnterpriseApprovalDecisionStatus;
  rationale: string;
  idempotencyKey: string;
  auditHash: string;
  decidedAt: string;
}

// 7. Document Review
export interface EnterpriseDocumentReviewGovRev {
  id: string;
  tenantId: string;
  documentIdRef: string;
  versionNumber: number;
  reviewerUserIdRef: string;
  reviewerRole: string;
  status: EnterpriseReviewStatus;
  findings: string;
  comments: string;
  requiredChanges?: string;
  completedAt?: string;
  createdAt: string;
}

// 8. Document Issue
export interface EnterpriseDocumentIssueGovIssue {
  id: string;
  tenantId: string;
  documentIdRef: string;
  issueNumber: string;
  issueType: 'COMPLIANCE' | 'LEGAL' | 'SECURITY' | 'PRIVACY' | 'QUALITY' | 'MISSING_EVIDENCE';
  status: EnterpriseIssueStatus;
  title: string;
  description: string;
  reportedByUserIdRef: string;
  assignedUserIdRef?: string;
  actionIdRef?: string;
  resolvedAt?: string;
  createdAt: string;
}

// 9. Retention Policy Reference
export interface EnterpriseRetentionPolicyReference {
  id: string;
  tenantId: string;
  policyName: string;
  retentionPeriodYears: number;
  triggerEvent: 'CREATION_DATE' | 'CLOSURE_DATE' | 'SUPERSEDED_DATE' | 'FISCAL_YEAR_END';
  dispositionAction: 'REVIEW_DISPOSAL' | 'AUTOMATIC_ARCHIVE' | 'PERMANENT_PRESERVATION';
}

// 10. Legal Hold
export interface EnterpriseLegalHoldGovHold {
  id: string;
  tenantId: string;
  holdNumber: string;
  title: string;
  matterName: string;
  reason: string;
  status: EnterpriseHoldStatus;
  
  authorizedByUserIdRef: string;
  effectiveDate: string;
  releasedDate?: string;

  targetDocumentIdRefs: string[];
  targetRecordIdRefs: string[];

  auditHash: string;
  createdAt: string;
}

// 11. Document Relationship
export interface EnterpriseDocumentRelationship {
  id: string;
  tenantId: string;
  sourceDocumentIdRef: string;
  targetDocumentIdRef: string;
  relationshipType: 'SUPERSEDES' | 'SUPPORTS' | 'REFERENCES' | 'EVIDENCE_FOR' | 'DERIVED_FROM' | 'ATTACHED_TO';
  createdAt: string;
}

// 12. Document Evidence
export interface EnterpriseDocumentEvidenceGovEv {
  id: string;
  tenantId: string;
  documentIdRef: string;
  title: string;
  sourceSystemUrl?: string;
  contentHash?: string;
  verificationStatus: EnterpriseEvidenceVerificationStatus;
  verifiedByUserIdRef?: string;
  verifiedAt?: string;
}

// 13. Document Exception
export interface EnterpriseDocumentExceptionGovExc {
  id: string;
  tenantId: string;
  exceptionNumber: string;
  title: string;
  businessRationale: string;
  compensatingControl: string;
  requesterUserIdRef: string;
  independentApproverUserIdRef?: string;
  effectiveDate: string;
  expiryDate: string;
  status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED';
  createdAt: string;
}

// 14. Document Diagnostic
export interface EnterpriseDocumentDiagnostic {
  id: string;
  issueType: 
    | 'ORPHAN_DOCUMENT'
    | 'BROKEN_REFERENCE'
    | 'INVALID_TRANSITION'
    | 'VERSION_CONFLICT'
    | 'MISSING_APPROVAL'
    | 'MISSING_REVIEWER'
    | 'SOD_VIOLATION'
    | 'EXPIRED_APPROVAL'
    | 'OVERDUE_REVIEW'
    | 'OVERDUE_CORRESPONDENCE'
    | 'SLA_BREACH'
    | 'UNVERIFIED_EVIDENCE'
    | 'EXPIRED_EXCEPTION'
    | 'LEGAL_HOLD_BLOCK'
    | 'CIRCULAR_RELATIONSHIP'
    | 'BROKEN_PROVENANCE';
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  message: string;
  entityIdRef: string;
  detectedAt: string;
}

// 15. Document Simulation
export interface EnterpriseDocumentSimulation {
  scenario: 
    | 'APPROVAL_BACKLOG_SURGE'
    | 'EXECUTIVE_REVIEW_SURGE'
    | 'REGULATORY_DOCUMENT_SURGE'
    | 'CORRESPONDENCE_VOLUME_SURGE'
    | 'CRITICAL_DOCUMENT_LOSS'
    | 'DOCUMENT_VERSION_CONFLICT'
    | 'APPROVER_UNAVAILABILITY'
    | 'LEGAL_HOLD_SURGE'
    | 'RETENTION_REVIEW_BACKLOG'
    | 'CROSS_CAMPUS_DOCUMENT_EVENT'
    | 'CLASSIFICATION_MISCONFIGURATION'
    | 'EVIDENCE_VERIFICATION_FAILURE'
    | 'WORKFLOW_DEPENDENCY_FAILURE'
    | 'CASE_DOCUMENT_CASCADE'
    | 'MASS_APPROVAL_EVENT';
  simulatedPackageCount: number;
  predictedOverdueApprovals: number;
  capacityBottlenecks: string[];
  impactSummary: string[];
  executedAt: string;
}

// 16. Audit Log
export interface EnterpriseDocumentAuditLog {
  id: string;
  tenantId: string;
  campusId?: string;
  actorId: string;
  action: string;
  entityType: string;
  entityId: string;
  sourceReference: string;
  timestamp: string;
  correlationId: string;
  idempotencyKey: string;
  previousStateHash?: string;
  newStateHash?: string;
  auditHash: string;
}
