import { UniversalModuleContract } from '../../core/contracts/ModuleContract';

export const CertificateModule: UniversalModuleContract = {
  moduleId: 'mod_certificate',
  name: 'Certificate & Document Engine',
  displayName: 'Certificate Generation & Issuance',
  description: 'Manage institutional transfer certificates, school leaving certificates, board-aligned templates, sequential numbering, and cryptographic QR verification.',
  version: '1.0.0',
  status: 'AVAILABLE',
  category: 'Student Lifecycle',
  provider: 'EduTech Core Team',
  
  dependencies: [
    { moduleId: 'mod_core' },
    { moduleId: 'mod_student' },
    { moduleId: 'mod_student_exit' }
  ],
  
  configurationSchema: [
    {
      key: 'principal_signature_required',
      label: 'Require Principal Signature for Issuance',
      type: 'boolean',
      defaultValue: true,
      description: 'Enforce that Principal authorization is mandatory before issuing official certificates.'
    },
    {
      key: 'enable_public_qr_verification',
      label: 'Enable Public QR Verification',
      type: 'boolean',
      defaultValue: true,
      description: 'Allow third-party educational institutions and authorities to verify certificate validity via public token scan.'
    }
  ],
  
  permissions: [
    { code: 'certificate.view', name: 'View Certificates', description: 'Can view generated certificates and registry records.' },
    { code: 'certificate.create', name: 'Create Certificate Draft', description: 'Can generate draft certificates from approved exit requests.' },
    { code: 'certificate.edit', name: 'Edit Certificate Draft', description: 'Can modify certificate draft metadata and fields.' },
    { code: 'certificate.preview', name: 'Preview Certificate', description: 'Can preview official certificates.' },
    { code: 'certificate.verify', name: 'Verify Certificate Data', description: 'Can check and verify student record accuracy.' },
    { code: 'certificate.issue', name: 'Issue Official Certificate', description: 'Can issue and freeze official certificates with sequential numbers.' },
    { code: 'certificate.download', name: 'Download / Print Certificate', description: 'Can print and download official certificates.' },
    { code: 'certificate.reissue', name: 'Reissue Certificate', description: 'Can supersede and reissue certificates with new versions.' },
    { code: 'certificate.cancel', name: 'Cancel Certificate', description: 'Can revoke or cancel certificates.' },
    { code: 'certificate.export', name: 'Export Certificate Register', description: 'Can export certificate registers.' },
    { code: 'certificate.template.view', name: 'View Templates', description: 'Can view board-specific certificate templates.' },
    { code: 'certificate.template.create', name: 'Create Template', description: 'Can design and add new certificate templates.' },
    { code: 'certificate.template.edit', name: 'Edit Template', description: 'Can modify layout and fields for templates.' },
    { code: 'certificate.template.activate', name: 'Activate Template', description: 'Can activate default templates.' },
    { code: 'certificate.numbering.manage', name: 'Manage Numbering Policy', description: 'Can configure prefix, format pattern, and padding.' },
    { code: 'certificate.signatory.manage', name: 'Manage Signatories', description: 'Can configure authorized institutional signatories.' },
    { code: 'certificate.verify.public', name: 'Public Verification', description: 'Can verify certificate tokens publicly.' }
  ],
  
  navigationItems: [
    {
      id: 'nav_certificates_parent',
      moduleId: 'mod_certificate',
      label: 'Certificates & TC',
      icon: 'Award',
      sortOrder: 46,
      status: 'active',
      requiredPermission: 'certificate.view',
      allowedRoles: ['super_admin', 'platform_admin', 'institution_manager', 'tenant_admin', 'principal', 'vice_principal', 'registrar_officer', 'academic_coordinator', 'admission_officer'],
      targetContext: 'tenant'
    },
    {
      id: 'nav_certificate_registry',
      moduleId: 'mod_certificate',
      parentId: 'nav_certificates_parent',
      label: 'Certificate Registry',
      icon: 'FileText',
      route: 'certificates',
      sortOrder: 1,
      status: 'active',
      requiredPermission: 'certificate.view',
      allowedRoles: ['super_admin', 'platform_admin', 'institution_manager', 'tenant_admin', 'principal', 'vice_principal', 'registrar_officer', 'academic_coordinator', 'admission_officer'],
      targetContext: 'tenant'
    },
    {
      id: 'nav_certificate_verification',
      moduleId: 'mod_certificate',
      parentId: 'nav_certificates_parent',
      label: 'Public Verification',
      icon: 'ShieldCheck',
      route: 'certificate_verification',
      sortOrder: 2,
      status: 'active',
      requiredPermission: 'certificate.verify.public',
      allowedRoles: ['super_admin', 'platform_admin', 'institution_manager', 'tenant_admin', 'principal', 'vice_principal', 'registrar_officer', 'academic_coordinator', 'admission_officer', 'student', 'parent'],
      targetContext: 'tenant'
    }
  ],
  
  eventsEmitted: [
    { eventName: 'CERTIFICATE_DRAFT_CREATED', description: 'A certificate draft was prepared for an eligible student.' },
    { eventName: 'CERTIFICATE_ISSUED', description: 'An official certificate was sealed and issued with a permanent number.' },
    { eventName: 'CERTIFICATE_REISSUED', description: 'A previously issued certificate was superseded by a reissued document.' },
    { eventName: 'CERTIFICATE_CANCELLED', description: 'A certificate was revoked and its number was permanently reserved.' }
  ]
};
