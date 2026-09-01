export interface DomainEventPayload {
  [key: string]: any;
}

export interface DomainEvent {
  eventId: string;
  eventType: string; // e.g., 'STUDENT_ADMITTED'
  tenantId: string;
  actorId: string; // User ID who triggered the event
  entityType: string;
  entityId: string;
  timestamp: string;
  payload: DomainEventPayload;
  version: string;
}

export interface AuditEvent {
  tenantId: string;
  userId: string;
  userEmail: string;
  userDisplayName: string;
  action: string;
  resource: string;
  resourceId?: string;
  resourceName?: string;
  previousValue?: any;
  newValue?: any;
  result: 'SUCCESS' | 'FAILURE' | 'PENDING';
  notes?: string;
  timestamp?: string;
  metadata?: any;
}
