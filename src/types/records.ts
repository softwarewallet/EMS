import { UserActor } from './index';

export type RecordClassification = 'UNCLASSIFIED' | 'INTERNAL' | 'CONFIDENTIAL' | 'HIGHLY_CONFIDENTIAL' | 'RESTRICTED';

export type RecordStatus = 
  | 'ACTIVE' 
  | 'ARCHIVED' 
  | 'PENDING_DISPOSITION' 
  | 'DISPOSED' 
  | 'LEGAL_HOLD'
  | 'PERMANENT';

export type RetentionTrigger = 
  | 'CREATION_DATE' 
  | 'LAST_MODIFIED' 
  | 'EVENT_BASED' 
  | 'STAFF_EXIT' 
  | 'STUDENT_GRADUATION' 
  | 'CONTRACT_EXPIRY';

export type DispositionAction = 
  | 'DESTRUCTION' 
  | 'SECURE_DESTRUCTION' 
  | 'TRANSFER_TO_ARCHIVES' 
  | 'PERMANENT_RETENTION' 
  | 'REVIEW';

export interface RetentionSchedule {
  id: string;
  tenantId: string;
  campusId?: string;
  categoryName: string;
  recordSeriesCode: string;
  retentionPeriodYears: number;
  trigger: RetentionTrigger;
  dispositionAction: DispositionAction;
  legalAuthorityReference?: string;
  isStandard?: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InstitutionalRecord {
  id: string;
  tenantId: string;
  campusId?: string;
  title: string;
  recordNumber: string;
  category: string;
  classification: RecordClassification;
  status: RecordStatus;
  
  // Reference to existing Document Registry artifact
  documentRegistryId: string;
  
  // Governance metadata
  retentionScheduleId: string;
  creationDate: string;
  triggerDate?: string; // e.g. graduation date if trigger is STUDENT_GRADUATION
  dispositionDueDate: string;
  
  ownerId: string;
  ownerName: string;
  departmentId?: string;
  
  metadata: Record<string, any>;
  tags: string[];
  
  lastReviewedAt?: string;
  lastReviewedBy?: string;
  
  isVitalRecord: boolean;
  legalHoldIds: string[];
  
  createdAt: string;
  updatedAt: string;
}

export interface LegalHold {
  id: string;
  tenantId: string;
  campusId?: string;
  title: string;
  reason: string;
  matterReference: string;
  institutedBy: string;
  institutedByName: string;
  institutedAt: string;
  status: 'ACTIVE' | 'RELEASED';
  releasedAt?: string;
  releasedBy?: string;
  notes?: string;
  affectedRecordIds: string[];
}

export interface EvidencePackage {
  id: string;
  tenantId: string;
  campusId?: string;
  title: string;
  description: string;
  purpose: 'ACCREDITATION' | 'AUDIT' | 'LEGAL' | 'COMPLIANCE' | 'GOVERNANCE';
  
  // Ordered sequence of record references
  items: {
    recordId: string;
    sequence: number;
    contextNotes?: string;
  }[];
  
  isLocked: boolean;
  lockedAt?: string;
  lockedBy?: string;
  
  integrityHash?: string; // Snapshot verification
  
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  createdByName: string;
}

export interface DispositionBatch {
  id: string;
  tenantId: string;
  campusId?: string;
  batchNumber: string;
  recordIds: string[];
  status: 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'COMPLETED' | 'CANCELLED';
  
  action: DispositionAction;
  proposedBy: string;
  proposedByName: string;
  proposedAt: string;
  
  approvedBy?: string;
  approvedByName?: string;
  approvedAt?: string;
  
  executionNotes?: string;
  certificateOfDestructionId?: string; // Reference to a record or document
  
  completedAt?: string;
}

export interface RecordAuditLog {
  id: string;
  tenantId: string;
  recordId: string;
  actorId: string;
  actorName: string;
  action: 'CREATE' | 'VIEW' | 'DOWNLOAD' | 'CLASSIFICATION_CHANGE' | 'STATUS_CHANGE' | 'RETENTION_UPDATE' | 'LEGAL_HOLD_APPLIED' | 'LEGAL_HOLD_RELEASED' | 'DISPOSITION_EXECUTED';
  previousValue?: any;
  newValue?: any;
  timestamp: string;
  ipAddress?: string;
}
