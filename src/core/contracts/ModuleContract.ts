import React from "react";
import { NavigationItemDefinition } from '../../types';

export type ModuleStatus = 'REGISTERED' | 'AVAILABLE' | 'INSTALLED' | 'ENABLED' | 'DISABLED' | 'DEPRECATED' | 'RETIRED';

export interface ModuleDependency {
  moduleId: string;
  minVersion?: string;
  optional?: boolean;
}

export interface ModulePermission {
  code: string;
  name: string;
  description: string;
}

export interface ModuleConfigField {
  key: string;
  label: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'enum' | 'json';
  options?: { label: string; value: string }[];
  defaultValue?: any;
  required?: boolean;
  description?: string;
}

export interface ModuleEventDefinition {
  eventName: string;
  description: string;
}

export interface ModuleWidget {
  id: string;
  title: string;
  component: React.ComponentType<any>;
  defaultLayout?: { w: number; h: number };
}

export interface ModuleReport {
  id: string;
  title: string;
  description: string;
  route: string;
  requiredPermission?: string;
}

export interface UniversalModuleContract {
  // Metadata
  moduleId: string;
  name: string;
  displayName: string;
  description: string;
  version: string;
  status: ModuleStatus;
  category: 'Core' | 'Student Lifecycle' | 'Academics' | 'Operations' | 'Finance' | 'Communication' | 'HR' | 'Infrastructure' | 'Future';
  provider: string;

  // Dependencies
  dependencies: ModuleDependency[];
  minimumPlatformVersion?: string;

  // Configuration
  configurationSchema: ModuleConfigField[];

  // Permissions & Access
  permissions: ModulePermission[];

  // User Interface Integration
  navigationItems: NavigationItemDefinition[];
  dashboardWidgets?: ModuleWidget[];
  reports?: ModuleReport[];

  // Event Driven Architecture
  eventsEmitted?: ModuleEventDefinition[];
  eventsConsumed?: string[];

  // Lifecycle Hooks
  onInstall?: (tenantId: string) => Promise<void>;
  onEnable?: (tenantId: string) => Promise<void>;
  onDisable?: (tenantId: string) => Promise<void>;
  onUninstall?: (tenantId: string) => Promise<void>;
}
