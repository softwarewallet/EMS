export enum FrameworkStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  RETIRED = 'RETIRED'
}

export enum ObligationStatus {
  IDENTIFIED = 'IDENTIFIED',
  MAPPED = 'MAPPED',
  ACTIVE = 'ACTIVE',
  AT_RISK = 'AT_RISK',
  BREACHED = 'BREACHED',
  FULFILLED = 'FULFILLED',
  RETIRED = 'RETIRED'
}

export enum ControlLifecycle {
  DRAFT = 'DRAFT',
  DESIGNED = 'DESIGNED',
  IMPLEMENTED = 'IMPLEMENTED',
  UNDER_VERIFICATION = 'UNDER_VERIFICATION',
  VERIFIED = 'VERIFIED',
  FAILED = 'FAILED',
  SUSPENDED = 'SUSPENDED',
  RETIRED = 'RETIRED'
}

export enum GovernanceControlEffectiveness {
  NOT_ASSESSED = 'NOT_ASSESSED',
  INEFFECTIVE = 'INEFFECTIVE',
  PARTIALLY_EFFECTIVE = 'PARTIALLY_EFFECTIVE',
  EFFECTIVE = 'EFFECTIVE',
  EFFECTIVE_WITH_EXCEPTION = 'EFFECTIVE_WITH_EXCEPTION'
}

export enum GovernanceFindingSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum FindingStatus {
  OPEN = 'OPEN',
  IN_REMEDIATION = 'IN_REMEDIATION',
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
  VERIFIED = 'VERIFIED',
  ACCEPTED = 'ACCEPTED',
  CLOSED = 'CLOSED'
}

export interface InstitutionalGovernanceFramework {
  id: string;
  tenantId: string;
  campusId: string;
  name: string;
  description: string;
  status: FrameworkStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface GovernanceObligation {
  id: string;
  tenantId: string;
  frameworkId: string;
  code: string;
  title: string;
  description: string;
  status: ObligationStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface GovernanceControl {
  id: string;
  tenantId: string;
  obligationId: string;
  code: string;
  title: string;
  description: string;
  lifecycle: ControlLifecycle;
  effectiveness: GovernanceControlEffectiveness;
  ownerId: string;
  verifierId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
