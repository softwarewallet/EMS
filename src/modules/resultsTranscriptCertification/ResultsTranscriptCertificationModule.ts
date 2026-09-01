import { UniversalModuleContract } from '../../core/contracts/ModuleContract';

export const ResultsTranscriptCertificationModule: UniversalModuleContract = {
  moduleId: 'mod_results_transcript_certification',
  name: 'Institutional Results, Transcript & Certification',
  displayName: 'Results & Certification',
  description: 'Authoritative operational module for finalized academic results, transcripts, and credentials.',
  category: 'Core',
  status: 'REGISTERED',
  provider: 'CORE',
  version: '10.7.0',
  dependencies: [], 
  configurationSchema: [],
  navigationItems: [
    {
      id: 'nav_results_transcript_certification',
      moduleId: 'mod_results_transcript_certification',
      label: 'Results & Certification',
      icon: 'Award',
      route: 'results_transcript_certification',
      sortOrder: 7,
      status: 'active',
      requiredPermission: 'academic.result.view',
      allowedRoles: ['super_admin', 'platform_admin', 'institution_admin', 'registrar'],
      targetContext: 'tenant'
    }
  ],
  permissions: [
    {
      code: 'academic.result.view',
      name: 'View Academic Results',
      description: 'Access academic results, transcripts, and credentials'
    },
    {
      code: 'academic.record.manage',
      name: 'Manage Academic Records',
      description: 'Consolidate results, issue transcripts, and manage credentials'
    },
    {
      code: 'academic.record.correction.approve',
      name: 'Approve Record Corrections',
      description: 'Four-Eyes SoD approval authority for post-publication record corrections'
    }
  ]
};
