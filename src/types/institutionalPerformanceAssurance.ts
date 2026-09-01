export enum PerformanceFrameworkStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  RETIRED = 'RETIRED'
}

export enum PerformanceIndicatorDirection {
  HIGHER_IS_BETTER = 'HIGHER_IS_BETTER',
  LOWER_IS_BETTER = 'LOWER_IS_BETTER',
  TARGET_VALUE = 'TARGET_VALUE'
}

export enum PerformanceStatus {
  EXCEEDING = 'EXCEEDING',
  ON_TRACK = 'ON_TRACK',
  WATCH = 'WATCH',
  AT_RISK = 'AT_RISK',
  CRITICAL = 'CRITICAL',
  INSUFFICIENT_DATA = 'INSUFFICIENT_DATA'
}

export interface InstitutionalPerformanceFramework {
  id: string;
  tenantId: string;
  campusId: string;
  name: string;
  description: string;
  status: PerformanceFrameworkStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface PerformanceIndicator {
  id: string;
  tenantId: string;
  frameworkId: string;
  code: string;
  name: string;
  description: string;
  direction: PerformanceIndicatorDirection;
  target: number;
  unit: string;
  ownerId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface PerformanceMeasurement {
  id: string;
  tenantId: string;
  indicatorId: string;
  value: number;
  period: string;
  recordedAt: string;
  recordedBy: string;
}
