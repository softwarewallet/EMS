import { UniversalModuleContract } from '../../core/contracts/ModuleContract';

export const InstitutionalCommunicationModule: UniversalModuleContract = {
  moduleId: 'mod_institutional_communication',
  name: 'Institutional Communication & Stakeholder Relations',
  displayName: 'Institutional Communication & Stakeholder Relations',
  description: 'Governed institutional communication, multi-channel circulars, approval workflows, dynamic audience targeting, stakeholder inquiries, and delivery assurance.',
  version: '1.0.0',
  status: 'INSTALLED',
  category: 'Communication',
  provider: 'EMS Core',
  dependencies: [],
  configurationSchema: [],
  navigationItems: [],
  permissions: [
    {
      code: 'communication.view',
      name: 'View Institutional Communications',
      description: 'Allows viewing of institutional notices, circulars, and stakeholder threads.'
    },
    {
      code: 'communication.create',
      name: 'Draft Circulars & Notices',
      description: 'Allows drafting new circulars, institutional notices, and campaigns.'
    },
    {
      code: 'communication.manage',
      name: 'Manage Communications',
      description: 'Allows creating, modifying, and scheduling institutional communications.'
    },
    {
      code: 'communication.review',
      name: 'Review Communications',
      description: 'Allows administrative review and editorial changes to submitted notices.'
    },
    {
      code: 'communication.approve',
      name: 'Approve & Publish Communications',
      description: 'Allows authoritative executive approval and multi-channel publication of circulars.'
    },
    {
      code: 'communication.emergency',
      name: 'Emergency Broadcast Override',
      description: 'Allows triggering instantaneous priority emergency broadcasts across all channels.'
    },
    {
      code: 'communication.stakeholder',
      name: 'Manage Stakeholder Inquiries',
      description: 'Allows managing parent, student, staff, and alumni engagement/grievance threads.'
    },
    {
      code: 'communication.acknowledge',
      name: 'Manage Acknowledgements & Waivers',
      description: 'Allows tracking digital sign-offs and authorizing compliance waivers.'
    },
    {
      code: 'communication.analytics',
      name: 'View Delivery & SLA Analytics',
      description: 'Allows viewing multi-channel delivery rates, latency, and SLA compliance metrics.'
    }
  ]
};
