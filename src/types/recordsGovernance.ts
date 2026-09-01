export enum RecordLifecycle {
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
  DISPOSITION_PENDING = 'DISPOSITION_PENDING',
  DISPOSED = 'DISPOSED',
  LEGAL_HOLD = 'LEGAL_HOLD'
}

export enum Classification {
  PUBLIC = 'PUBLIC',
  INTERNAL = 'INTERNAL',
  CONFIDENTIAL = 'CONFIDENTIAL',
  RESTRICTED = 'RESTRICTED',
  HIGHLY_RESTRICTED = 'HIGHLY_RESTRICTED'
}

export enum RetentionTriggerType {
  CREATED = 'CREATED',
  UPDATED = 'UPDATED',
  CLOSED = 'CLOSED',
  FISCAL_YEAR_END = 'FISCAL_YEAR_END'
}

export interface GovernanceRecordRetentionPolicy {
  id: string;
  tenantId: string;
  name: string;
  retentionPeriodYears: number;
  triggerType: RetentionTriggerType;
  description: string;
}

export interface GovernanceInstitutionalRecord {
  id: string;
  tenantId: string;
  campusId: string;
  title: string;
  recordType: string;
  authoritativeSourceModule: string;
  authoritativeResourceId: string;
  classification: Classification;
  lifecycle: RecordLifecycle;
  retentionPolicyId: string;
  createdAt: string;
  updatedAt: string;
  legalHoldIds: string[];
}

export interface GovernanceLegalHold {
  id: string;
  tenantId: string;
  holdIdentifier: string;
  status: 'ACTIVE' | 'RELEASED';
  description: string;
  createdAt: string;
  createdBy: string;
}
