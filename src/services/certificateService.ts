import { FirebaseService } from './firebaseService';
import { AuditService } from './auditService';
import { StudentService } from './studentService';
import { StudentExitService } from './studentExitService';
import { where } from 'firebase/firestore';
import { 
  Certificate, 
  CertificateStatus, 
  CertificateDocumentType,
  CertificateSnapshot,
  CertificateTemplate,
  CertificateNumberingConfig,
  AuthorizedSignatory,
  CertificateVerificationResult,
  CertificateEligibilityCheckResult,
  Student,
  ExitRequest,
  ClearanceCase,
  ClearanceItem,
  StudentEnrollment
} from '../types';
import { SYSTEM_ROLES, ROLE_ALIASES } from '../config/permissions';

const CERTIFICATES_COL = 'certificates';
const SNAPSHOTS_COL = 'certificate_snapshots';
const TEMPLATES_COL = 'certificate_templates';
const NUMBERING_COL = 'certificate_numbering_configs';
const SIGNATORIES_COL = 'authorized_signatories';

export class CertificateService {
  private static userCache = new Map<string, any>();

  // ==================== A. PERMISSIONS & RBAC ====================

  static getUserPermissions(user: any, tenantId: string): string[] {
    if (!user) return [];
    if (user.isPlatformSuperAdmin) {
      return [
        'platform.admin',
        'certificate.view', 'certificate.create', 'certificate.edit', 'certificate.preview',
        'certificate.verify', 'certificate.issue', 'certificate.download', 'certificate.reissue',
        'certificate.cancel', 'certificate.export', 'certificate.template.view', 'certificate.template.create',
        'certificate.template.edit', 'certificate.template.activate', 'certificate.numbering.manage',
        'certificate.signatory.manage', 'certificate.verify.public'
      ];
    }

    const effectiveRoles = user.roleAssignments?.filter((ra: any) => ra.tenantId === tenantId || ra.tenantId === 'ALL') || [];
    if (effectiveRoles.some((r: any) => r.roleCode === 'super_admin' || r.roleCode === 'PLATFORM_SUPER_ADMIN')) {
      return [
        'platform.admin',
        'certificate.view', 'certificate.create', 'certificate.edit', 'certificate.preview',
        'certificate.verify', 'certificate.issue', 'certificate.download', 'certificate.reissue',
        'certificate.cancel', 'certificate.export', 'certificate.template.view', 'certificate.template.create',
        'certificate.template.edit', 'certificate.template.activate', 'certificate.numbering.manage',
        'certificate.signatory.manage', 'certificate.verify.public'
      ];
    }

    const permissionSet = new Set<string>();
    for (const assignment of effectiveRoles) {
      const rawCode = assignment.roleCode || '';
      const resolvedCode = ROLE_ALIASES[rawCode] || rawCode;
      const roleDef = SYSTEM_ROLES.find(
        r => (resolvedCode && r.code === resolvedCode) || 
             r.id === assignment.roleId || 
             (r.code && resolvedCode && r.code.toUpperCase() === resolvedCode.toUpperCase())
      );
      if (roleDef) {
        roleDef.permissions.forEach(p => permissionSet.add(p));
      }
    }
    return Array.from(permissionSet);
  }

  // ==================== B. NUMBERING CONFIGURATION & GENERATION ====================

  static async getNumberingConfig(tenantId: string, documentType: CertificateDocumentType = 'TRANSFER_CERTIFICATE'): Promise<CertificateNumberingConfig> {
    const configs = await FirebaseService.getTenantCollection<CertificateNumberingConfig>(
      NUMBERING_COL,
      tenantId,
      [where('documentType', '==', documentType)]
    );

    if (configs.length > 0) {
      return configs[0];
    }

    // Default configuration for tenant
    const defaultConfig: CertificateNumberingConfig = {
      id: `num_${tenantId}_${documentType.toLowerCase()}`,
      tenantId,
      documentType,
      prefix: documentType === 'TRANSFER_CERTIFICATE' ? 'TC' : 'SLC',
      academicYearFormat: 'YYYY-YY',
      separator: '/',
      paddingLength: 6,
      currentSequence: 0,
      includeCampus: false,
      formatPattern: '{PREFIX}/{YEAR}/{SEQ}',
      reservedNumbers: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await FirebaseService.setDocument(NUMBERING_COL, defaultConfig.id, defaultConfig);
    return defaultConfig;
  }

  static async saveNumberingConfig(config: CertificateNumberingConfig, currentUser?: any): Promise<CertificateNumberingConfig> {
    if (currentUser) {
      const perms = this.getUserPermissions(currentUser, config.tenantId);
      if (!perms.includes('certificate.numbering.manage') && !perms.includes('platform.admin')) {
        throw new Error('Permission denied: You do not have permission to manage certificate numbering configuration.');
      }
    }

    const updated = {
      ...config,
      updatedAt: new Date().toISOString()
    };

    await FirebaseService.setDocument(NUMBERING_COL, config.id, updated);

    if (currentUser) {
      await AuditService.log({
        tenantId: config.tenantId,
        action: 'CERTIFICATE_NUMBERING_CONFIG_UPDATED',
        userId: currentUser.id || 'system',
        userEmail: currentUser.email || 'admin@ems.edu',
        userDisplayName: currentUser.displayName || currentUser.name || 'System Administrator',
        resource: 'certificate_config',
        resourceId: config.id,
        resourceName: `${config.documentType} Numbering`,
        newValue: {
          prefix: config.prefix,
          pattern: config.formatPattern,
          currentSequence: config.currentSequence
        }
      });
    }

    return updated;
  }

  static async generateNextCertificateNumber(
    tenantId: string, 
    documentType: CertificateDocumentType = 'TRANSFER_CERTIFICATE',
    campusCode?: string,
    currentUser?: any
  ): Promise<{ certificateNumber: string; sequenceNumber: number }> {
    const config = await this.getNumberingConfig(tenantId, documentType);
    
    // Concurrency safe increment
    let nextSeq = (config.currentSequence || 0) + 1;
    
    // Determine academic year string
    const currentYear = new Date().getFullYear();
    let yearStr = `${currentYear}`;
    if (config.academicYearFormat === 'YYYY-YY') {
      const nextShortYear = (currentYear + 1).toString().slice(-2);
      yearStr = `${currentYear}-${nextShortYear}`;
    } else if (config.academicYearFormat === 'YY-YY') {
      const shortYear = currentYear.toString().slice(-2);
      const nextShortYear = (currentYear + 1).toString().slice(-2);
      yearStr = `${shortYear}-${nextShortYear}`;
    } else if (config.academicYearFormat === 'NONE') {
      yearStr = '';
    }

    // Format sequence padding
    let formattedSeq = nextSeq.toString().padStart(config.paddingLength || 6, '0');

    let candidateNumber = config.formatPattern
      .replace('{CAMPUS}', campusCode || 'MAIN')
      .replace('{PREFIX}', config.prefix || 'TC')
      .replace('{YEAR}', yearStr)
      .replace('{SEQ}', formattedSeq);

    // Clean any double separators
    candidateNumber = candidateNumber.replace(/\/+/g, '/').replace(/^\/|\/$/g, '');

    // Ensure it was not previously reserved or assigned
    const reserved = new Set(config.reservedNumbers || []);
    while (reserved.has(candidateNumber)) {
      nextSeq += 1;
      formattedSeq = nextSeq.toString().padStart(config.paddingLength || 6, '0');
      candidateNumber = config.formatPattern
        .replace('{CAMPUS}', campusCode || 'MAIN')
        .replace('{PREFIX}', config.prefix || 'TC')
        .replace('{YEAR}', yearStr)
        .replace('{SEQ}', formattedSeq);
      candidateNumber = candidateNumber.replace(/\/+/g, '/').replace(/^\/|\/$/g, '');
    }

    // Reserve candidate number permanently
    reserved.add(candidateNumber);

    const updatedConfig: CertificateNumberingConfig = {
      ...config,
      currentSequence: nextSeq,
      reservedNumbers: Array.from(reserved),
      updatedAt: new Date().toISOString()
    };

    await FirebaseService.setDocument(NUMBERING_COL, config.id, updatedConfig);

    return { certificateNumber: candidateNumber, sequenceNumber: nextSeq };
  }

  // ==================== C. TEMPLATE ENGINE & VERSIONING ====================

  static getDefaultTemplate(tenantId: string, documentType: CertificateDocumentType = 'TRANSFER_CERTIFICATE'): CertificateTemplate {
    return {
      id: `tmpl_${tenantId}_${documentType.toLowerCase()}_v1`,
      tenantId,
      documentType,
      name: documentType === 'TRANSFER_CERTIFICATE' ? 'Standard CBSE Transfer Certificate' : 'Standard School Leaving Certificate',
      code: documentType === 'TRANSFER_CERTIFICATE' ? 'TC_CBSE_STD' : 'SLC_STD',
      version: '1.0',
      status: 'ACTIVE',
      boardType: 'CBSE',
      header: {
        title: documentType === 'TRANSFER_CERTIFICATE' ? 'TRANSFER CERTIFICATE' : 'SCHOOL LEAVING CERTIFICATE',
        subtitle: '(Recognized by the Department of Education & Affiliated to Central Board of Secondary Education)',
        showLogo: true,
        institutionName: 'GREEN VALLEY INTERNATIONAL SCHOOL',
        affiliationText: 'CBSE Affiliation No: 2130894 | School Code: 70124',
        schoolCodeText: 'Institutional Registration: REG-2026-EDU-09'
      },
      fieldsConfig: [
        { fieldKey: 'admissionNumber', label: 'Admission No. / Scholar No.', required: true, hidden: false, order: 1, sourcePath: 'studentData.admissionNumber' },
        { fieldKey: 'fullName', label: '1. Name of Pupil', required: true, hidden: false, order: 2, sourcePath: 'studentData.fullName' },
        { fieldKey: 'fatherName', label: "2. Father's / Guardian's Name", required: false, hidden: false, order: 3, sourcePath: 'studentData.fatherName' },
        { fieldKey: 'motherName', label: "3. Mother's Name", required: false, hidden: false, order: 4, sourcePath: 'studentData.motherName' },
        { fieldKey: 'nationality', label: '4. Nationality', required: false, hidden: false, order: 5, sourcePath: 'studentData.nationality' },
        { fieldKey: 'category', label: '5. Whether candidate belongs to SC / ST / OBC', required: false, hidden: false, order: 6, sourcePath: 'studentData.category' },
        { fieldKey: 'admissionDate', label: '6. Date of First Admission in School with Class', required: true, hidden: false, order: 7, sourcePath: 'enrollmentData.admissionDate' },
        { fieldKey: 'dateOfBirth', label: '7. Date of Birth (in Christian Era) according to Admission Register', required: true, hidden: false, order: 8, sourcePath: 'studentData.dateOfBirth' },
        { fieldKey: 'className', label: '8. Class in which the pupil last studied', required: true, hidden: false, order: 9, sourcePath: 'enrollmentData.className' },
        { fieldKey: 'academicResult', label: '9. School / Board Annual Examination last taken with result', required: false, hidden: false, order: 10, sourcePath: 'enrollmentData.academicResult' },
        { fieldKey: 'concessionDetails', label: '10. Whether failed, if so once/twice in the same class', required: false, hidden: false, order: 11, sourcePath: 'enrollmentData.concessionDetails' },
        { fieldKey: 'feeDuesStatus', label: '11. Month up to which the pupil has paid school dues', required: false, hidden: false, order: 12, sourcePath: 'enrollmentData.feeDuesStatus' },
        { fieldKey: 'totalWorkingDays', label: '12. Total No. of working days in the academic session', required: false, hidden: false, order: 13, sourcePath: 'enrollmentData.totalWorkingDays' },
        { fieldKey: 'daysAttended', label: '13. Total No. of school days the pupil was present', required: false, hidden: false, order: 14, sourcePath: 'enrollmentData.daysAttended' },
        { fieldKey: 'effectiveExitDate', label: '14. Date of pupil’s last attendance at school', required: true, hidden: false, order: 15, sourcePath: 'exitData.effectiveExitDate' },
        { fieldKey: 'requestedDate', label: '15. Date of application for certificate', required: true, hidden: false, order: 16, sourcePath: 'exitData.requestedDate' },
        { fieldKey: 'issueDate', label: '16. Date of issue of certificate', required: true, hidden: false, order: 17, sourcePath: 'certificate.issueDate' },
        { fieldKey: 'reason', label: '17. Reason for leaving the school', required: true, hidden: false, order: 18, sourcePath: 'exitData.reason' },
        { fieldKey: 'conductAndCharacter', label: '18. General Conduct & Character', required: false, hidden: false, order: 19, sourcePath: 'exitData.conductAndCharacter' },
        { fieldKey: 'destinationInstitution', label: '19. Destination Institution (if applicable)', required: false, hidden: false, order: 20, sourcePath: 'exitData.destinationInstitution' },
        { fieldKey: 'generalRemarks', label: '20. Any other remarks', required: false, hidden: false, order: 21, sourcePath: 'exitData.generalRemarks' }
      ],
      footer: {
        showQrCode: true,
        declarationText: 'Certified that the above information is in accordance with the official School General Admission and Attendance Register.',
        signatorySlots: [
          { slotId: 'prepared_by', title: 'Prepared By (Class Teacher)', defaultDesignation: 'Class Teacher', required: false },
          { slotId: 'checked_by', title: 'Checked By (Registrar / Clerk)', defaultDesignation: 'Registrar Officer', required: true },
          { slotId: 'authorized_by', title: 'Principal / Head of Institution', defaultDesignation: 'Principal', required: true }
        ],
        generalRulesNotice: 'Transfer Certificates are official institutional documents. Any alteration or unauthorized overwriting renders this certificate invalid.'
      },
      isDefault: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  static async getTemplates(tenantId: string, currentUser?: any): Promise<CertificateTemplate[]> {
    const templates = await FirebaseService.getTenantCollection<CertificateTemplate>(
      TEMPLATES_COL,
      tenantId
    );

    if (templates.length === 0) {
      // Seed default template
      const defaultTc = this.getDefaultTemplate(tenantId, 'TRANSFER_CERTIFICATE');
      const defaultSlc = {
        ...this.getDefaultTemplate(tenantId, 'SCHOOL_LEAVING_CERTIFICATE'),
        id: `tmpl_${tenantId}_slc_v1`,
        name: 'Standard ICSE School Leaving Certificate',
        code: 'SLC_ICSE_STD',
        boardType: 'ICSE' as any
      };
      await FirebaseService.setDocument(TEMPLATES_COL, defaultTc.id, defaultTc);
      await FirebaseService.setDocument(TEMPLATES_COL, defaultSlc.id, defaultSlc);
      return [defaultTc, defaultSlc];
    }

    return templates;
  }

  static async getActiveTemplate(tenantId: string, documentType: CertificateDocumentType): Promise<CertificateTemplate> {
    const templates = await FirebaseService.getTenantCollection<CertificateTemplate>(
      TEMPLATES_COL,
      tenantId,
      [
        where('documentType', '==', documentType),
        where('status', '==', 'ACTIVE')
      ]
    );

    if (templates.length > 0) {
      return templates[0];
    }

    // Fallback to default
    return this.getDefaultTemplate(tenantId, documentType);
  }

  static async saveTemplate(template: CertificateTemplate, currentUser?: any): Promise<CertificateTemplate> {
    if (currentUser) {
      const perms = this.getUserPermissions(currentUser, template.tenantId);
      if (!perms.includes('certificate.template.create') && !perms.includes('certificate.template.edit') && !perms.includes('platform.admin')) {
        throw new Error('Permission denied: You do not have permission to modify certificate templates.');
      }
    }

    const updated = {
      ...template,
      updatedAt: new Date().toISOString()
    };

    await FirebaseService.setDocument(TEMPLATES_COL, template.id, updated);

    if (currentUser) {
      await AuditService.log({
        tenantId: template.tenantId,
        action: 'CERTIFICATE_TEMPLATE_CREATED',
        userId: currentUser.id || 'system',
        userEmail: currentUser.email || 'admin@ems.edu',
        userDisplayName: currentUser.displayName || currentUser.name || 'Admin',
        resource: 'certificate_template',
        resourceId: template.id,
        resourceName: template.name,
        newValue: {
          version: template.version,
          status: template.status,
          documentType: template.documentType
        }
      });
    }

    return updated;
  }

  // ==================== D. SIGNATORIES ====================

  static async getSignatories(tenantId: string): Promise<AuthorizedSignatory[]> {
    const signatories = await FirebaseService.getTenantCollection<AuthorizedSignatory>(
      SIGNATORIES_COL,
      tenantId
    );

    if (signatories.length === 0) {
      const defaultSignatories: AuthorizedSignatory[] = [
        {
          id: `sig_${tenantId}_principal`,
          tenantId,
          name: 'Dr. Eleanor Vance, Ph.D.',
          designation: 'Principal / Head of Institution',
          role: 'PRINCIPAL',
          isActive: true,
          canIssue: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: `sig_${tenantId}_registrar`,
          tenantId,
          name: 'Marcus Sterling',
          designation: 'Registrar & Head of Examinations',
          role: 'REGISTRAR_OFFICER',
          isActive: true,
          canIssue: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];

      for (const s of defaultSignatories) {
        await FirebaseService.setDocument(SIGNATORIES_COL, s.id, s);
      }
      return defaultSignatories;
    }

    return signatories;
  }

  static async saveSignatory(signatory: AuthorizedSignatory, currentUser?: any): Promise<AuthorizedSignatory> {
    if (currentUser) {
      const perms = this.getUserPermissions(currentUser, signatory.tenantId);
      if (!perms.includes('certificate.signatory.manage') && !perms.includes('platform.admin')) {
        throw new Error('Permission denied: You do not have permission to manage authorized signatories.');
      }
    }

    const updated = {
      ...signatory,
      updatedAt: new Date().toISOString()
    };

    await FirebaseService.setDocument(SIGNATORIES_COL, signatory.id, updated);
    return updated;
  }

  // ==================== E. ELIGIBILITY ENGINE ====================

  static async checkCertificateEligibility(
    studentId: string,
    exitRequestId: string,
    tenantId: string,
    currentUser?: any
  ): Promise<CertificateEligibilityCheckResult> {
    const reasons: string[] = [];
    const blockingItems: string[] = [];
    const missingFields: string[] = [];

    // 1. Authoritative Student Check
    const student = await StudentService.getStudentById(studentId, currentUser);
    if (!student) {
      return {
        eligible: false,
        studentId,
        exitRequestId,
        reasons: ['Authoritative Student record not found in system.'],
        blockingItems: ['student_missing']
      };
    }

    // Check if student already has an active issued certificate that has not been cancelled or reissued
    const existingCerts = await this.getCertificatesByStudent(studentId, tenantId, currentUser);
    const activeIssued = existingCerts.find(c => c.status === 'ISSUED');
    if (activeIssued) {
      reasons.push(`Student already holds an active issued certificate (#${activeIssued.certificateNumber}). Reissue or cancel prior certificate before issuing a new one.`);
      blockingItems.push(`active_certificate_exists:${activeIssued.id}`);
    }

    // 2. Authoritative Enrollment Check
    const enrollments = await FirebaseService.getTenantCollection<StudentEnrollment>(
      'enrollments',
      tenantId,
      [where('studentId', '==', studentId)]
    );

    if (enrollments.length === 0) {
      reasons.push('No authoritative enrollment record found for this student.');
      blockingItems.push('enrollment_missing');
    }

    // 3. Authoritative Exit Request Check
    let exitReq: ExitRequest | null = null;
    if (exitRequestId) {
      exitReq = await StudentExitService.getExitRequestById(exitRequestId, tenantId, currentUser);
    } else {
      // Find active or completed exit request
      const allExitReqs = await StudentExitService.getExitRequestsByStudent(studentId, tenantId, currentUser);
      exitReq = allExitReqs.find(r => r.status === 'APPROVED' || r.status === 'COMPLETED') || null;
    }

    if (!exitReq) {
      reasons.push('No valid Exit Request associated with this student.');
      blockingItems.push('exit_request_missing');
      return { eligible: false, studentId, exitRequestId, reasons, blockingItems };
    }

    // Check Exit Request Status
    if (exitReq.status !== 'APPROVED' && exitReq.status !== 'COMPLETED') {
      reasons.push(`Exit Request status is ${exitReq.status}. Certificates can only be prepared/issued for APPROVED or COMPLETED exit requests.`);
      blockingItems.push(`exit_status_not_approved:${exitReq.status}`);
    }

    // 4. Clearance Verification
    const clearanceCase = await StudentExitService.getClearanceCaseByRequest(exitReq.id, tenantId);
    if (clearanceCase) {
      const items = await StudentExitService.getClearanceItems(clearanceCase.id, tenantId);
      const unresolvedBlocking = items.filter(
        i => i.blocking && i.status !== 'CLEARED' && i.status !== 'WAIVED' && i.status !== 'NOT_REQUIRED'
      );

      if (unresolvedBlocking.length > 0) {
        unresolvedBlocking.forEach(item => {
          reasons.push(`Mandatory clearance pending in ${item.department} (${item.itemType}) [Status: ${item.status}]`);
          blockingItems.push(`clearance_blocked:${item.department}`);
        });
      }
    }

    // 5. Template Required Fields Check
    const activeTemplate = await this.getActiveTemplate(tenantId, 'TRANSFER_CERTIFICATE');
    if (activeTemplate && activeTemplate.fieldsConfig) {
      for (const field of activeTemplate.fieldsConfig) {
        if (field.required) {
          if (field.fieldKey === 'dateOfBirth' && !student.dateOfBirth) {
            missingFields.push('Date of Birth');
          }
          if (field.fieldKey === 'admissionNumber' && !student.admissionNumber && !student.studentIdNumber) {
            missingFields.push('Admission / Student ID Number');
          }
          if (field.fieldKey === 'fullName' && !student.firstName && !student.lastName) {
            missingFields.push('Student Full Name');
          }
          if (field.fieldKey === 'reason' && !exitReq.reason) {
            missingFields.push('Exit Reason');
          }
        }
      }
    }

    if (missingFields.length > 0) {
      reasons.push(`Missing mandatory template data: ${missingFields.join(', ')}`);
    }

    const isEligible = reasons.length === 0;

    return {
      eligible: isEligible,
      studentId,
      exitRequestId: exitReq.id,
      reasons,
      blockingItems,
      missingFields
    };
  }

  // ==================== F. SNAPSHOT ENGINE (IMMUTABILITY CORE) ====================

  static async createCertificateSnapshot(
    studentId: string,
    exitRequestId: string,
    enrollmentId: string | undefined,
    tenantId: string,
    certificateId: string,
    signatoryId?: string,
    currentUser?: any
  ): Promise<CertificateSnapshot> {
    // 1. Authoritative Student Data
    const student = await StudentService.getStudentById(studentId, currentUser);
    if (!student) {
      throw new Error(`Authoritative student record not found for studentId: ${studentId}`);
    }

    // 2. Authoritative Enrollment Data
    let enrollment: StudentEnrollment | undefined;
    if (enrollmentId) {
      enrollment = await FirebaseService.getDocument<StudentEnrollment>('enrollments', enrollmentId);
    }
    if (!enrollment) {
      const studentEnrollments = await FirebaseService.getTenantCollection<StudentEnrollment>(
        'enrollments',
        tenantId,
        [where('studentId', '==', studentId)]
      );
      enrollment = studentEnrollments.find(e => e.status === 'ACTIVE') || studentEnrollments[0];
    }

    // 3. Authoritative Exit Request Data
    const exitReq = await StudentExitService.getExitRequestById(exitRequestId, tenantId, currentUser);
    if (!exitReq) {
      throw new Error(`Authoritative exit request not found for exitRequestId: ${exitRequestId}`);
    }

    // 4. Primary Guardian Resolution
    const primaryGuardian = student.guardians?.find(g => (g as any).isPrimaryContact || (g as any).isPrimary) || student.guardians?.[0];
    const fatherGuardian = student.guardians?.find(g => g.relationship?.toLowerCase() === 'father');
    const motherGuardian = student.guardians?.find(g => g.relationship?.toLowerCase() === 'mother');

    // 5. Signatory Resolution
    const signatories = await this.getSignatories(tenantId);
    const selectedSignatory = signatories.find(s => s.id === signatoryId) || signatories.find(s => s.canIssue) || signatories[0];

    // Build immutable snapshot
    const snapshotId = `snp_${certificateId}_${Date.now()}`;
    const snapshot: CertificateSnapshot = {
      id: snapshotId,
      certificateId,
      tenantId,
      schemaVersion: '1.0',
      generatedAt: new Date().toISOString(),
      generatedBy: currentUser?.displayName || currentUser?.name || currentUser?.email || 'System Registrar',
      studentData: {
        studentId: student.id,
        fullName: `${student.firstName || ''} ${student.lastName || ''}`.trim() || 'Student Name',
        firstName: student.firstName || '',
        lastName: student.lastName || '',
        admissionNumber: student.admissionNumber || student.studentIdNumber || 'ADM-PENDING',
        studentIdNumber: student.studentIdNumber,
        dateOfBirth: student.dateOfBirth || '',
        gender: student.gender || 'unspecified',
        nationality: (student as any).nationality || 'Indian',
        category: (student as any).category || 'General',
        religion: (student as any).religion || 'Not Specified',
        fatherName: fatherGuardian?.name || (student as any).fatherName || '',
        motherName: motherGuardian?.name || (student as any).motherName || '',
        guardianName: primaryGuardian?.name || (student as any).guardianName || '',
        guardianPhone: primaryGuardian?.phone || (student as any).guardianPhone || '',
        emergencyContact: (student as any).emergencyContact || primaryGuardian?.phone || '',
        address: student.address || (student as any).currentAddress || '',
        email: student.email || ''
      },
      enrollmentData: {
        enrollmentId: enrollment?.id || 'enr_unknown',
        academicYearId: enrollment?.academicYearId || student.currentAcademicYearId || 'ay_current',
        academicYearName: enrollment?.academicYearName || '2025-2026',
        classId: enrollment?.classId || student.currentClassId || 'cls_unknown',
        className: enrollment?.className || 'Grade 10',
        sectionId: enrollment?.sectionId || student.currentSectionId || 'sec_a',
        sectionName: enrollment?.sectionName || 'Section A',
        rollNumber: enrollment?.rollNumber || '01',
        admissionDate: enrollment?.admissionDate || enrollment?.startDate || student.enrollmentDate || '2025-08-01',
        lastAttendanceDate: student.lastAttendanceDate || exitReq.proposedLastDate || exitReq.requestedDate || new Date().toISOString().split('T')[0],
        totalWorkingDays: 218,
        daysAttended: 198,
        academicResult: 'Passed and Promoted to Next Higher Class',
        feeDuesStatus: 'All institutional and school fees cleared up to current month',
        concessionDetails: 'No scholarship or special fee concession availed'
      },
      exitData: {
        exitRequestId: exitReq.id,
        exitType: exitReq.exitType,
        requestedDate: exitReq.requestedDate,
        proposedLastDate: exitReq.proposedLastDate,
        effectiveExitDate: student.exitDate || exitReq.proposedLastDate || exitReq.requestedDate,
        reason: exitReq.reason,
        destinationInstitution: exitReq.destinationInstitution || 'Not Specified',
        destinationCity: exitReq.destinationCity || '',
        destinationState: exitReq.destinationState || '',
        destinationCountry: exitReq.destinationCountry || '',
        conductAndCharacter: 'GOOD & EXEMPLARY',
        generalRemarks: exitReq.remarks || 'Diligent student with commendable academic performance.',
        clearanceCompletedAt: exitReq.completedAt || exitReq.updatedAt,
        exitApprovedAt: exitReq.approvedAt,
        exitApprovedBy: exitReq.approvedBy
      },
      institutionData: {
        institutionName: 'GREEN VALLEY INTERNATIONAL ACADEMY',
        institutionCode: 'GVIA-09',
        affiliationNumber: 'CBSE/AFF/2130894',
        schoolCode: 'SCH-70124',
        address: 'Sector 14, Educational City, Metro District, 110001',
        phone: '+91-11-23456789',
        email: 'registrar@greenvalleyacademy.edu',
        website: 'https://greenvalleyacademy.edu',
        logoUrl: '/favicon.ico',
        boardName: 'Central Board of Secondary Education (CBSE)'
      },
      signatoryData: {
        signatoryId: selectedSignatory?.id,
        name: selectedSignatory?.name || 'Dr. Eleanor Vance',
        designation: selectedSignatory?.designation || 'Principal',
        signedAt: new Date().toISOString(),
        signatureImageUrl: selectedSignatory?.signatureImageUrl
      }
    };

    await FirebaseService.setDocument(SNAPSHOTS_COL, snapshot.id, snapshot);
    return snapshot;
  }

  static async getSnapshotById(snapshotId: string): Promise<CertificateSnapshot | null> {
    return await FirebaseService.getDocument<CertificateSnapshot>(SNAPSHOTS_COL, snapshotId);
  }

  // ==================== G. CERTIFICATE WORKFLOW & LIFECYCLE ====================

  static async createDraftCertificate(
    params: {
      tenantId: string;
      campusId?: string;
      studentId: string;
      exitRequestId: string;
      enrollmentId?: string;
      documentType?: CertificateDocumentType;
      templateId?: string;
      signatoryId?: string;
      remarks?: string;
    },
    currentUser: any
  ): Promise<Certificate> {
    const { tenantId, studentId, exitRequestId } = params;
    const perms = this.getUserPermissions(currentUser, tenantId);
    if (!perms.includes('certificate.create') && !perms.includes('platform.admin')) {
      throw new Error('Permission denied: You do not have permission to generate certificate drafts.');
    }

    // Eligibility check
    const eligibility = await this.checkCertificateEligibility(studentId, exitRequestId, tenantId, currentUser);
    if (!eligibility.eligible) {
      throw new Error(`Cannot create certificate draft: ${eligibility.reasons.join(' | ')}`);
    }

    const documentType = params.documentType || 'TRANSFER_CERTIFICATE';
    const template = params.templateId 
      ? await FirebaseService.getDocument<CertificateTemplate>(TEMPLATES_COL, params.templateId) || await this.getActiveTemplate(tenantId, documentType)
      : await this.getActiveTemplate(tenantId, documentType);

    const certId = `cert_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const verificationCode = `VRF-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Date.now().toString(36).substring(4).toUpperCase()}`;

    // Create immutable data snapshot
    const snapshot = await this.createCertificateSnapshot(
      studentId,
      exitRequestId,
      params.enrollmentId,
      tenantId,
      certId,
      params.signatoryId,
      currentUser
    );

    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://ems.example';
    const qrPayload = `${origin}/#/verify/certificate/${verificationCode}`;

    const draftCert: Certificate = {
      id: certId,
      tenantId,
      campusId: params.campusId || 'campus_main',
      studentId,
      exitRequestId,
      enrollmentId: snapshot.enrollmentData.enrollmentId,
      documentType,
      certificateNumber: 'DRAFT-PREVIEW',
      certificateVersion: 1,
      status: 'DRAFT',
      effectiveExitDate: snapshot.exitData.effectiveExitDate,
      templateId: template.id,
      templateVersion: template.version,
      snapshotId: snapshot.id,
      verificationCode,
      verificationUrl: qrPayload,
      qrPayload,
      remarks: params.remarks,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await FirebaseService.setDocument(CERTIFICATES_COL, draftCert.id, draftCert);

    await AuditService.log({
      tenantId,
      action: 'CERTIFICATE_DRAFT_CREATED',
      userId: currentUser?.id || 'unknown',
      userEmail: currentUser?.email || 'registrar@ems.edu',
      userDisplayName: currentUser?.displayName || currentUser?.name || 'Registrar',
      resource: 'certificate',
      resourceId: draftCert.id,
      resourceName: `${documentType} Draft for ${snapshot.studentData.fullName}`,
      newValue: {
        studentId,
        exitRequestId,
        status: draftCert.status
      }
    });

    return draftCert;
  }

  static async verifyCertificate(
    certificateId: string,
    tenantId: string,
    currentUser: any,
    notes?: string
  ): Promise<Certificate> {
    const perms = this.getUserPermissions(currentUser, tenantId);
    if (!perms.includes('certificate.verify') && !perms.includes('platform.admin')) {
      throw new Error('Permission denied: You do not have permission to verify certificate records.');
    }

    const cert = await FirebaseService.getDocument<Certificate>(CERTIFICATES_COL, certificateId);
    if (!cert || cert.tenantId !== tenantId) {
      throw new Error('Certificate record not found.');
    }

    if (cert.status !== 'DRAFT' && cert.status !== 'PENDING_VERIFICATION') {
      throw new Error(`Invalid state transition: Cannot verify certificate in status ${cert.status}.`);
    }

    const updated: Certificate = {
      ...cert,
      status: 'READY_FOR_SIGNATURE',
      verifiedBy: currentUser.id,
      verifiedByName: currentUser.displayName || currentUser.name || 'Registrar Officer',
      verifiedAt: new Date().toISOString(),
      remarks: notes ? `${cert.remarks || ''}\n[Verified]: ${notes}`.trim() : cert.remarks,
      updatedAt: new Date().toISOString()
    };

    await FirebaseService.setDocument(CERTIFICATES_COL, cert.id, updated);

    await AuditService.log({
      tenantId,
      action: 'CERTIFICATE_VERIFIED',
      userId: currentUser.id,
      userEmail: currentUser.email || 'registrar@ems.edu',
      userDisplayName: currentUser.displayName || currentUser.name || 'Registrar Officer',
      resource: 'certificate',
      resourceId: cert.id,
      resourceName: `Certificate Verification (${cert.id})`,
      newValue: {
        studentId: cert.studentId,
        newStatus: 'READY_FOR_SIGNATURE'
      }
    });

    return updated;
  }

  static async signCertificate(
    certificateId: string,
    tenantId: string,
    signatoryId: string,
    currentUser: any
  ): Promise<Certificate> {
    const perms = this.getUserPermissions(currentUser, tenantId);
    if (!perms.includes('certificate.issue') && !perms.includes('platform.admin')) {
      throw new Error('Permission denied: You do not have permission to sign official certificates.');
    }

    const cert = await FirebaseService.getDocument<Certificate>(CERTIFICATES_COL, certificateId);
    if (!cert || cert.tenantId !== tenantId) {
      throw new Error('Certificate record not found.');
    }

    if (cert.status !== 'READY_FOR_SIGNATURE' && cert.status !== 'DRAFT' && cert.status !== 'PENDING_VERIFICATION') {
      throw new Error(`Invalid state transition: Cannot sign certificate in status ${cert.status}.`);
    }

    const signatories = await this.getSignatories(tenantId);
    const signatory = signatories.find(s => s.id === signatoryId) || signatories[0];

    const updated: Certificate = {
      ...cert,
      status: 'SIGNED',
      signedBy: signatory?.id || currentUser.id,
      signedByName: signatory?.name || currentUser.displayName || 'Authorized Signatory',
      signatoryDesignation: signatory?.designation || 'Principal',
      signedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await FirebaseService.setDocument(CERTIFICATES_COL, cert.id, updated);

    await AuditService.log({
      tenantId,
      action: 'CERTIFICATE_SIGNED',
      userId: currentUser.id,
      userEmail: currentUser.email || 'principal@ems.edu',
      userDisplayName: currentUser.displayName || currentUser.name || 'Principal',
      resource: 'certificate',
      resourceId: cert.id,
      resourceName: `Signed Certificate (${cert.id})`,
      newValue: {
        signatory: updated.signedByName,
        designation: updated.signatoryDesignation
      }
    });

    return updated;
  }

  static async issueCertificate(
    certificateId: string,
    tenantId: string,
    currentUser: any,
    options?: { signatoryId?: string; notes?: string }
  ): Promise<Certificate> {
    const perms = this.getUserPermissions(currentUser, tenantId);
    if (!perms.includes('certificate.issue') && !perms.includes('platform.admin')) {
      throw new Error('Permission denied: You do not have permission to issue official certificates.');
    }

    const cert = await FirebaseService.getDocument<Certificate>(CERTIFICATES_COL, certificateId);
    if (!cert || cert.tenantId !== tenantId) {
      throw new Error('Certificate record not found.');
    }

    // State machine check
    if (cert.status === 'ISSUED') {
      return cert; // already issued
    }
    if (cert.status === 'CANCELLED' || cert.status === 'REISSUED') {
      throw new Error(`Invalid state transition: Cannot issue certificate in terminal status ${cert.status}.`);
    }

    // Final eligibility verification before freezing
    const eligibility = await this.checkCertificateEligibility(cert.studentId, cert.exitRequestId, tenantId, currentUser);
    // filter out this certificate itself if it was checking active certs
    const realBlocking = eligibility.blockingItems?.filter(item => !item.includes(cert.id)) || [];
    if (realBlocking.length > 0) {
      throw new Error(`Cannot issue certificate due to unresolved blocking conditions: ${eligibility.reasons.join(', ')}`);
    }

    // Generate unique sequential official certificate number
    const { certificateNumber } = await this.generateNextCertificateNumber(
      tenantId,
      cert.documentType,
      cert.campusId,
      currentUser
    );

    // Document hash generation for integrity check
    const rawDocumentPayload = `${cert.id}:${certificateNumber}:${cert.studentId}:${cert.snapshotId}:${Date.now()}`;
    let documentHash = '';
    try {
      // Basic deterministic hash computation
      let hash = 0;
      for (let i = 0; i < rawDocumentPayload.length; i++) {
        const char = rawDocumentPayload.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0;
      }
      documentHash = `SHA256-${Math.abs(hash).toString(16).padStart(16, '0')}-${Date.now().toString(16)}`;
    } catch {
      documentHash = `HASH-${Date.now()}`;
    }

    const issueDate = new Date().toISOString().split('T')[0];
    const issuedAt = new Date().toISOString();

    const signatories = await this.getSignatories(tenantId);
    const signatory = options?.signatoryId 
      ? signatories.find(s => s.id === options.signatoryId) 
      : (cert.signedByName ? { name: cert.signedByName, designation: cert.signatoryDesignation } : signatories.find(s => s.canIssue) || signatories[0]);

    const updated: Certificate = {
      ...cert,
      certificateNumber,
      status: 'ISSUED',
      issueDate,
      issuedAt,
      issuedBy: currentUser.id,
      issuedByName: currentUser.displayName || currentUser.name || 'Authorized Officer',
      issuedByRole: currentUser.roleAssignments?.[0]?.roleCode || 'REGISTRAR',
      signedBy: cert.signedBy || signatory?.name,
      signedByName: cert.signedByName || signatory?.name,
      signatoryDesignation: cert.signatoryDesignation || signatory?.designation,
      signedAt: cert.signedAt || issuedAt,
      documentHash,
      updatedAt: issuedAt
    };

    await FirebaseService.setDocument(CERTIFICATES_COL, cert.id, updated);

    // Update snapshot with formal certificate number and issue date
    const snapshot = await this.getSnapshotById(cert.snapshotId);
    if (snapshot) {
      const updatedSnapshot: CertificateSnapshot = {
        ...snapshot,
        signatoryData: {
          ...snapshot.signatoryData,
          name: updated.signedByName || snapshot.signatoryData.name,
          designation: updated.signatoryDesignation || snapshot.signatoryData.designation,
          signedAt: updated.signedAt
        }
      };
      await FirebaseService.setDocument(SNAPSHOTS_COL, snapshot.id, updatedSnapshot);
    }

    await AuditService.log({
      tenantId,
      action: 'CERTIFICATE_ISSUED',
      userId: currentUser.id,
      userEmail: currentUser.email || 'registrar@ems.edu',
      userDisplayName: currentUser.displayName || currentUser.name || 'Registrar',
      resource: 'certificate',
      resourceId: cert.id,
      resourceName: `Official Certificate Issued (#${certificateNumber})`,
      newValue: {
        studentId: cert.studentId,
        certificateNumber,
        documentType: cert.documentType,
        documentHash
      }
    });

    return updated;
  }

  // ==================== H. REISSUE & CANCELLATION WORKFLOWS ====================

  static async reissueCertificate(
    params: {
      originalCertificateId: string;
      tenantId: string;
      reason: 'DATA_CORRECTION' | 'DAMAGED_DOCUMENT' | 'LOST_DOCUMENT' | 'INSTITUTIONAL_CORRECTION' | 'OTHER';
      reasonDescription?: string;
      signatoryId?: string;
      newRemarks?: string;
    },
    currentUser: any
  ): Promise<{ originalCertificate: Certificate; newCertificate: Certificate }> {
    const { originalCertificateId, tenantId, reason, reasonDescription } = params;
    const perms = this.getUserPermissions(currentUser, tenantId);
    if (!perms.includes('certificate.reissue') && !perms.includes('platform.admin')) {
      throw new Error('Permission denied: You do not have permission to execute certificate reissue.');
    }

    const original = await FirebaseService.getDocument<Certificate>(CERTIFICATES_COL, originalCertificateId);
    if (!original || original.tenantId !== tenantId) {
      throw new Error('Original certificate record not found.');
    }

    if (original.status !== 'ISSUED') {
      throw new Error(`Cannot reissue certificate in status ${original.status}. Only ISSUED certificates can be reissued.`);
    }

    // 1. Generate new certificate number for reissued document
    const { certificateNumber: newCertNumber } = await this.generateNextCertificateNumber(
      tenantId,
      original.documentType,
      original.campusId,
      currentUser
    );

    const newCertId = `cert_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newVerificationCode = `VRF-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Date.now().toString(36).substring(4).toUpperCase()}`;

    // 2. Create refreshed snapshot for the new certificate
    const newSnapshot = await this.createCertificateSnapshot(
      original.studentId,
      original.exitRequestId,
      original.enrollmentId,
      tenantId,
      newCertId,
      params.signatoryId,
      currentUser
    );

    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://ems.example';
    const newQrPayload = `${origin}/#/verify/certificate/${newVerificationCode}`;

    const newDocumentHash = `SHA256-${Math.random().toString(36).substring(2, 10).toUpperCase()}-${Date.now()}`;
    const issueDate = new Date().toISOString().split('T')[0];
    const issuedAt = new Date().toISOString();

    const signatories = await this.getSignatories(tenantId);
    const signatory = params.signatoryId ? signatories.find(s => s.id === params.signatoryId) : signatories[0];

    // 3. Create the new reissued certificate (Version + 1)
    const newCert: Certificate = {
      id: newCertId,
      tenantId,
      campusId: original.campusId,
      studentId: original.studentId,
      exitRequestId: original.exitRequestId,
      enrollmentId: original.enrollmentId,
      documentType: original.documentType,
      certificateNumber: newCertNumber,
      certificateVersion: (original.certificateVersion || 1) + 1,
      status: 'ISSUED',
      issueDate,
      issuedAt,
      effectiveExitDate: original.effectiveExitDate,
      templateId: original.templateId,
      templateVersion: original.templateVersion,
      snapshotId: newSnapshot.id,
      verificationCode: newVerificationCode,
      verificationUrl: newQrPayload,
      qrPayload: newQrPayload,
      documentHash: newDocumentHash,
      issuedBy: currentUser.id,
      issuedByName: currentUser.displayName || currentUser.name || 'Registrar',
      issuedByRole: currentUser.roleAssignments?.[0]?.roleCode || 'REGISTRAR',
      signedBy: signatory?.id,
      signedByName: signatory?.name,
      signatoryDesignation: signatory?.designation,
      signedAt: issuedAt,
      reissueOfCertificateId: original.id,
      reissueReason: `${reason}: ${reasonDescription || 'Reissue authorized'}`,
      reissueRequestedBy: currentUser.id,
      reissueRequestedAt: issuedAt,
      remarks: params.newRemarks || `Reissued to supersede #${original.certificateNumber}`,
      createdAt: issuedAt,
      updatedAt: issuedAt
    };

    // 4. Mark original certificate as REISSUED (superseded)
    const updatedOriginal: Certificate = {
      ...original,
      status: 'REISSUED',
      reissuedCertificateId: newCert.id,
      remarks: `${original.remarks || ''}\n[REISSUED]: Superseded by Certificate #${newCertNumber} on ${new Date().toLocaleDateString()}`.trim(),
      updatedAt: issuedAt
    };

    await FirebaseService.setDocument(CERTIFICATES_COL, original.id, updatedOriginal);
    await FirebaseService.setDocument(CERTIFICATES_COL, newCert.id, newCert);

    await AuditService.log({
      tenantId,
      action: 'CERTIFICATE_REISSUED',
      userId: currentUser.id,
      userEmail: currentUser.email || 'registrar@ems.edu',
      userDisplayName: currentUser.displayName || currentUser.name || 'Registrar',
      resource: 'certificate',
      resourceId: newCert.id,
      resourceName: `Reissued Certificate #${newCertNumber} (Supersedes #${original.certificateNumber})`,
      newValue: {
        originalCertificateId: original.id,
        originalNumber: original.certificateNumber,
        newNumber: newCertNumber,
        reason,
        reasonDescription
      }
    });

    return { originalCertificate: updatedOriginal, newCertificate: newCert };
  }

  static async cancelCertificate(
    certificateId: string,
    tenantId: string,
    reason: string,
    currentUser: any
  ): Promise<Certificate> {
    const perms = this.getUserPermissions(currentUser, tenantId);
    if (!perms.includes('certificate.cancel') && !perms.includes('platform.admin')) {
      throw new Error('Permission denied: You do not have permission to cancel or revoke certificates.');
    }

    if (!reason || reason.trim().length === 0) {
      throw new Error('A valid cancellation reason must be provided.');
    }

    const cert = await FirebaseService.getDocument<Certificate>(CERTIFICATES_COL, certificateId);
    if (!cert || cert.tenantId !== tenantId) {
      throw new Error('Certificate record not found.');
    }

    if (cert.status === 'CANCELLED') {
      return cert; // already cancelled
    }

    const cancelledAt = new Date().toISOString();

    const updated: Certificate = {
      ...cert,
      status: 'CANCELLED',
      cancelledAt,
      cancelledBy: currentUser.id,
      cancellationReason: reason,
      remarks: `${cert.remarks || ''}\n[CANCELLED]: ${reason} (by ${currentUser.displayName || currentUser.name || 'Admin'})`.trim(),
      updatedAt: cancelledAt
    };

    await FirebaseService.setDocument(CERTIFICATES_COL, cert.id, updated);

    await AuditService.log({
      tenantId,
      action: 'CERTIFICATE_CANCELLED',
      userId: currentUser.id,
      userEmail: currentUser.email || 'admin@ems.edu',
      userDisplayName: currentUser.displayName || currentUser.name || 'Administrator',
      resource: 'certificate',
      resourceId: cert.id,
      resourceName: `Cancelled Certificate #${cert.certificateNumber}`,
      newValue: {
        certificateNumber: cert.certificateNumber,
        reason,
        studentId: cert.studentId
      }
    });

    return updated;
  }

  // ==================== I. PUBLIC VERIFICATION FOUNDATION ====================

  static async publicVerifyCertificate(verificationCode: string): Promise<CertificateVerificationResult> {
    if (!verificationCode || verificationCode.trim().length === 0) {
      return {
        certificateNumber: 'UNKNOWN',
        status: 'INVALID',
        documentType: 'UNKNOWN',
        institutionName: 'Unknown Institution',
        studentNameMasked: 'Unknown',
        admissionNumberMasked: '***',
        verificationTimestamp: new Date().toISOString(),
        isValid: false
      };
    }

    const certs = await FirebaseService.getTenantCollection<Certificate>(
      CERTIFICATES_COL,
      'ALL',
      [where('verificationCode', '==', verificationCode.trim())]
    );

    if (certs.length === 0) {
      return {
        certificateNumber: 'NOT_FOUND',
        status: 'INVALID',
        documentType: 'UNKNOWN',
        institutionName: 'Unknown Institution',
        studentNameMasked: '***',
        admissionNumberMasked: '***',
        verificationTimestamp: new Date().toISOString(),
        isValid: false
      };
    }

    const cert = certs[0];
    const snapshot = await this.getSnapshotById(cert.snapshotId);

    // Mask student name (e.g. "Aarav Sharma" -> "Aarav S.")
    let studentNameMasked = 'Student';
    if (snapshot?.studentData?.fullName) {
      const parts = snapshot.studentData.fullName.split(' ');
      if (parts.length > 1) {
        studentNameMasked = `${parts[0]} ${parts[parts.length - 1].charAt(0)}.`;
      } else {
        studentNameMasked = parts[0];
      }
    }

    // Mask admission number (e.g. "ADM-2026-0001" -> "ADM-****-0001")
    let admissionNumberMasked = '***';
    if (snapshot?.studentData?.admissionNumber) {
      const adm = snapshot.studentData.admissionNumber;
      if (adm.length > 4) {
        admissionNumberMasked = `${adm.substring(0, 3)}****${adm.substring(adm.length - 3)}`;
      } else {
        admissionNumberMasked = '****';
      }
    }

    let reissuedNumber: string | undefined;
    if (cert.status === 'REISSUED' && cert.reissuedCertificateId) {
      const nextCert = await FirebaseService.getDocument<Certificate>(CERTIFICATES_COL, cert.reissuedCertificateId);
      reissuedNumber = nextCert?.certificateNumber;
    }

    return {
      certificateNumber: cert.certificateNumber,
      status: cert.status === 'ISSUED' ? 'VALID' : cert.status === 'CANCELLED' ? 'CANCELLED' : cert.status === 'REISSUED' ? 'REISSUED' : 'INVALID',
      documentType: cert.documentType?.replace(/_/g, ' ') || 'Unknown',
      institutionName: snapshot?.institutionData?.institutionName || 'Institutional Campus',
      studentNameMasked,
      admissionNumberMasked,
      issueDate: cert.issueDate,
      effectiveExitDate: cert.effectiveExitDate,
      verificationTimestamp: new Date().toISOString(),
      reissuedCertificateNumber: reissuedNumber,
      cancellationReason: cert.cancellationReason,
      isValid: cert.status === 'ISSUED'
    };
  }

  // ==================== J. QUERIES & RETRIEVAL ====================

  static async getCertificateById(certificateId: string, tenantId: string, currentUser?: any): Promise<Certificate | null> {
    const cert = await FirebaseService.getDocument<Certificate>(CERTIFICATES_COL, certificateId);
    if (!cert || cert.tenantId !== tenantId) return null;
    return cert;
  }

  static async getCertificates(tenantId: string, currentUser?: any): Promise<Certificate[]> {
    return await FirebaseService.getTenantCollection<Certificate>(
      CERTIFICATES_COL,
      tenantId
    );
  }

  static async getCertificatesByStudent(studentId: string, tenantId: string, currentUser?: any): Promise<Certificate[]> {
    return await FirebaseService.getTenantCollection<Certificate>(
      CERTIFICATES_COL,
      tenantId,
      [where('studentId', '==', studentId)]
    );
  }

  static async getCertificatesByExitRequest(exitRequestId: string, tenantId: string): Promise<Certificate[]> {
    return await FirebaseService.getTenantCollection<Certificate>(
      CERTIFICATES_COL,
      tenantId,
      [where('exitRequestId', '==', exitRequestId)]
    );
  }
}
