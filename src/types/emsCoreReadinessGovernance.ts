export type ReadinessSeverity = 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
export type ReadinessClassification = 'CORE_READY' | 'READY_WITH_WARNINGS' | 'REMEDIATION_REQUIRED' | 'NOT_READY';

export interface CoreModuleDependency {
  moduleId: string;
  requiredVersion?: string;
  optional?: boolean;
}

export interface CorePlatformManifest {
  version: string;
  buildTimestamp: string;
  totalRegisteredModules: number;
  environment: string;
  tenantIsolationEnforced: boolean;
  fourEyesSoDEnforced: boolean;
}

export interface CoreIntegrationHealth {
  sourceModuleId: string;
  targetModuleId: string;
  status: 'HEALTHY' | 'DEGRADED' | 'DISCONNECTED';
  latencyMs: number;
  lastChecked: string;
}

export interface CoreReadinessFinding {
  id: string;
  category: 'ARCHITECTURE' | 'MODULE_CONTRACT' | 'NAVIGATION' | 'CROSS_MODULE' | 'SECURITY' | 'FIRESTORE' | 'AUDIT' | 'BUILD';
  severity: ReadinessSeverity;
  title: string;
  description: string;
  remediation?: string;
  isBlocking: boolean;
}

export interface CoreReadinessAssessment {
  assessmentId: string;
  tenantId: string;
  campusId: string;
  assessedAt: string;
  score: number;
  classification: ReadinessClassification;
  findings: CoreReadinessFinding[];
  isCertified: boolean;
}

export interface CoreCertification {
  certificationId: string;
  tenantId: string;
  issuedAt: string;
  status: 'CORE_PLATFORM_COMPLETE' | 'REMEDIATION_PENDING';
  verdict: 'FUNCTIONAL_MODULE_DEVELOPMENT_AUTHORIZED' | 'HALTED';
  readinessScore: number;
  signedByUserIdRef: string;
  immutableHash: string;
}

export interface CoreAuditEvent {
  id: string;
  tenantId: string;
  campusId: string;
  actorUserIdRef: string;
  action: string;
  entityType: string;
  entityId: string;
  timestamp: string;
  previousHash: string;
  currentHash: string;
  metadata: any;
}
