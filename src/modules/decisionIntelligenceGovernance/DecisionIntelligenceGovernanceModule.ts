import { UniversalModuleContract } from '../../core/contracts/ModuleContract';
import { 
  Brain
} from 'lucide-react';

export const DecisionIntelligenceGovernanceModule: UniversalModuleContract = {
  moduleId: 'mod_decision_intelligence_governance',
  name: 'Decision Intelligence & Governance',
  displayName: 'Decision Intelligence & Executive Governance',
  description: 'Institutional Decision Intelligence, Executive Decision Governance, Policy Impact & Strategic Action Assurance Control Plane',
  category: 'Future',
  status: 'REGISTERED',
  provider: 'CORE',
  version: '9.5.0',
  dependencies: [],
  configurationSchema: [],
  navigationItems: [
    {
      id: 'nav_decision_intelligence_governance',
      moduleId: 'mod_decision_intelligence_governance',
      label: 'Decision Intel & Governance',
      icon: 'Brain',
      route: 'decision_intelligence_governance',
      sortOrder: 100,
      status: 'active',
      requiredPermission: 'decision.intelligence.view',
      allowedRoles: ['super_admin', 'platform_admin', 'institution_manager', 'tenant_admin'],
      targetContext: 'tenant'
    }
  ],
  permissions: [
    {
      code: 'decision.intelligence.view',
      name: 'View Decision Intelligence',
      description: 'Allows viewing decision intelligence strategies and requests'
    },
    {
      code: 'decision.request.create',
      name: 'Create Decision Request',
      description: 'Allows creating new institutional decision requests'
    },
    {
      code: 'decision.brief.manage',
      name: 'Manage Decision Briefs',
      description: 'Allows creating and managing decision briefs'
    },
    {
      code: 'decision.executive.authorize',
      name: 'Authorize Executive Decisions',
      description: 'Allows final authorization of executive decisions'
    },
    {
      code: 'decision.dissent.submit',
      name: 'Submit Decision Dissent',
      description: 'Allows submitting formal dissent or challenge to decisions'
    },
    {
      code: 'decision.policy.impact',
      name: 'Manage Policy Impact',
      description: 'Allows managing policy impact assessments'
    },
    {
      code: 'decision.simulation.run',
      name: 'Run Decision Simulations',
      description: 'Allows running what-if decision simulations'
    },
    {
      code: 'decision.audit.view',
      name: 'View Decision Audit',
      description: 'Allows viewing immutable decision audit provenance'
    }
  ]
};
