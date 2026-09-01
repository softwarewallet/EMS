export type CheckpointState = 
  | 'ADMISSION_ACCEPTED'
  | 'STUDENT_CREATED'
  | 'PROGRAM_ENROLLMENT_ACTIVE'
  | 'REGISTRATION_CONFIRMED'
  | 'ACADEMIC_ACTIVITY_RECORDED'
  | 'ASSESSMENT_COMPLETED'
  | 'RESULT_FINALIZED'
  | 'ACADEMIC_RECORD_FINALIZED'
  | 'TRANSCRIPT_READY'
  | 'GRADUATION_ELIGIBILITY_CONFIRMED'
  | 'CLEARANCE_COMPLETED'
  | 'GRADUATION_APPROVED'
  | 'DEGREE_AWARDED'
  | 'CREDENTIAL_ISSUED'
  | 'ALUMNI_ACTIVATED';

export type TransactionStatus =
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'FAILED'
  | 'PARTIALLY_COMPLETED'
  | 'ROLLED_BACK'
  | 'RECOVERY_REQUIRED';

export type IncidentSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface LifecycleIntegrationCheckpoint {
  checkpointId: string;
  tenantId: string;
  campusIdRef: string;
  studentIdRef: string;
  state: CheckpointState;
  sourceEntityIdRef: string;
  sourceModuleRef: string;
  recordedAt: string;
}

export interface LifecycleIntegrationTransaction {
  transactionId: string;
  tenantId: string;
  campusIdRef: string;
  initiatingActorUserIdRef: string;
  operation: string;
  currentStep: string;
  completedSteps: string[];
  failedSteps: string[];
  status: TransactionStatus;
  startedAt: string;
  completedAt?: string;
  failureReason?: string;
  correlationId: string;
}

export interface LifecycleReconciliationFinding {
  findingId: string;
  tenantId: string;
  runIdRef: string;
  studentIdRef: string;
  discrepancyType: string;
  description: string;
  severity: IncidentSeverity;
  sourceEntities: Record<string, string>;
  status: 'OPEN' | 'RESOLVED' | 'IGNORED';
  detectedAt: string;
}

export interface LifecycleIntegrationIncident {
  incidentId: string;
  tenantId: string;
  severity: IncidentSeverity;
  findingIdRef?: string;
  transactionIdRef?: string;
  description: string;
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'CLOSED';
  createdAt: string;
  updatedAt: string;
}

export interface LifecycleRecoveryAction {
  actionId: string;
  tenantId: string;
  incidentIdRef: string;
  actionType: 'RETRY_EVENT' | 'REPROCESS_CHECKPOINT' | 'REBUILD_REFERENCE' | 'RECONCILE_STATE' | 'MARK_RECOVERY_REQUIRED' | 'ESCALATE';
  targetEntityIdRef: string;
  requesterUserIdRef: string;
  approverUserIdRef?: string;
  status: 'REQUESTED' | 'APPROVED' | 'EXECUTED' | 'FAILED';
  createdAt: string;
  updatedAt: string;
}

export interface LifecycleIntegrationAuditEvent {
  eventId: string;
  tenantId: string;
  campusIdRef: string;
  actorUserIdRef: string;
  action: string;
  entityType: string;
  entityId: string;
  timestamp: string;
  previousHash: string;
  currentHash: string;
}

export interface LifecycleSimulationScenario {
  id: string;
  name: string;
  description: string;
  status: 'IDLE' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  result?: string;
  metrics?: any;
}
