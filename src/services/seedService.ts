import { FirebaseService } from './firebaseService';
import { SYSTEM_ROLES } from '../config/permissions';
import {
  Tenant,
  Campus,
  User,
  AcademicYear,
  ClassGrade,
  Section,
  Subject,
  Student,
  AuditRecord,
  TeacherProfile,
  TeacherAssignment,
  TimetableEntry,
  LessonPlan,
  Assignment,
  AssignmentSubmission,
  Assessment,
  Examination,
  ExamSchedule,
  MarkEntry,
  GradingScheme,
  ReportCard,
  PromotionBatch,
  PromotionRecord
} from '../types';

export class SeedService {
  static async seedInitialDataIfNeeded(forceReset = false): Promise<boolean> {
    try {
      const existingTenants = await FirebaseService.getTenantCollection<Tenant>('tenants', 'ALL');
      if (existingTenants.length > 0 && !forceReset) {
        // Check if existing data is already Indianised (contains DPS or Delhi)
        const isAlreadyIndian = existingTenants.some(t => t.name.includes('Delhi') || t.address?.country === 'India');
        if (isAlreadyIndian) {
          return false; // Already seeded with Indian data
        }
      }

      console.log('Bootstrapping initial multi-tenant EMS India database...');

      const now = new Date().toISOString();

      // 1. Initial Tenants (Leading Indian Institutions)
      const tenant1: Tenant = {
        id: 'ten_dps_01',
        name: 'Delhi Public School (DPS) R.K. Puram',
        code: 'DPS-RKP',
        type: 'k12_school',
        registrationNumber: 'CBSE-DEL-1972-0042',
        email: 'administration@dpsrkp.edu.in',
        phone: '+91 11 2617 7371',
        website: 'https://dpsrkp.edu.in',
        address: {
          street: 'Sector XII, R.K. Puram',
          city: 'New Delhi',
          state: 'Delhi',
          country: 'India',
          postalCode: '110022'
        },
        branding: {
          primaryColor: '#0c4a6e', // Deep Navy Blue
          accentColor: '#0284c7',  // Sky Cyan
          portalTitle: 'DPS Central Campus Portal',
          institutionMotto: 'Service Before Self',
          themeMode: 'light'
        },
        academicConfig: {
          academicYearStartMonth: 4, // April (Indian Academic Session)
          gradingSystem: 'percentage',
          attendanceType: 'daily_once',
          termsPerYear: 2
        },
        status: 'active',
        enabledModules: ['core', 'student', 'academic', 'attendance', 'fees', 'library', 'transport', 'admissions', 'mod_admissions'],
        totalStudents: 1450,
        totalStaff: 92,
        createdAt: now,
        updatedAt: now
      };

      const tenant2: Tenant = {
        id: 'ten_xavier_02',
        name: "St. Xavier's Senior Secondary School",
        code: 'XAV-MUM',
        type: 'k12_school',
        registrationNumber: 'CISCE-MH-1984-1092',
        email: 'info@stxaviersmumbai.edu.in',
        phone: '+91 22 2262 0661',
        website: 'https://stxaviersmumbai.edu.in',
        address: {
          street: '5 Mahapalika Marg, Dhobi Talao',
          city: 'Mumbai',
          state: 'Maharashtra',
          country: 'India',
          postalCode: '400001'
        },
        branding: {
          primaryColor: '#1e293b', // Slate / Charcoal
          accentColor: '#10b981',  // Emerald Green
          portalTitle: "St. Xavier's EMS Central",
          institutionMotto: 'Provocans Ad Maiora (Challenging to Greater Things)',
          themeMode: 'light'
        },
        academicConfig: {
          academicYearStartMonth: 4,
          gradingSystem: 'percentage',
          attendanceType: 'daily_once',
          termsPerYear: 2
        },
        status: 'active',
        enabledModules: ['core', 'student', 'academic', 'attendance', 'fees'],
        totalStudents: 1200,
        totalStaff: 84,
        createdAt: now,
        updatedAt: now
      };

      const tenant3: Tenant = {
        id: 'ten_iitk_prep_03',
        name: 'National Skills & Polytechnic Academy',
        code: 'NSPA-BLR',
        type: 'vocational',
        registrationNumber: 'AICTE-VOC-2019-KA',
        email: 'admissions@nspa.ac.in',
        phone: '+91 80 2558 4120',
        address: {
          street: '42 Hosur Road, Electronics City',
          city: 'Bengaluru',
          state: 'Karnataka',
          country: 'India',
          postalCode: '560100'
        },
        branding: {
          primaryColor: '#7c2d12', // Warm Terracotta / Rust
          accentColor: '#f59e0b',
          portalTitle: 'NSPA Vocational Portal',
          institutionMotto: 'Skilled India, Empowered Nation',
          themeMode: 'light'
        },
        academicConfig: {
          academicYearStartMonth: 7,
          gradingSystem: 'percentage',
          attendanceType: 'daily_twice',
          termsPerYear: 3
        },
        status: 'active',
        enabledModules: ['core', 'student', 'academic'],
        totalStudents: 480,
        totalStaff: 38,
        createdAt: now,
        updatedAt: now
      };

      await FirebaseService.setDocument('tenants', tenant1.id, tenant1);
      await FirebaseService.setDocument('tenants', tenant2.id, tenant2);
      await FirebaseService.setDocument('tenants', tenant3.id, tenant3);

      // 2. Campuses
      const campus1: Campus = {
        id: 'cmp_dps_rkp_main',
        tenantId: tenant1.id,
        name: 'R.K. Puram Senior Campus (Main)',
        code: 'DPS-RKP-MAIN',
        address: 'Sector XII, R.K. Puram, New Delhi',
        isMainCampus: true,
        contactEmail: 'campus.senior@dpsrkp.edu.in',
        contactPhone: '+91 11 2617 7371',
        createdAt: now
      };
      const campus2: Campus = {
        id: 'cmp_dps_east_prep',
        tenantId: tenant1.id,
        name: 'Vasant Vihar Primary & Prep Campus',
        code: 'DPS-VV-PREP',
        address: 'Pashchimi Marg, Vasant Vihar, New Delhi',
        isMainCampus: false,
        contactEmail: 'campus.prep@dpsrkp.edu.in',
        contactPhone: '+91 11 2614 4578',
        createdAt: now
      };
      await FirebaseService.setDocument('campuses', campus1.id, campus1);
      await FirebaseService.setDocument('campuses', campus2.id, campus2);

      // 3. Academic Year & Classes for DPS (Indian Academic Session: April 2025 - March 2026)
      const ay1: AcademicYear = {
        id: 'ay_2025_2026',
        tenantId: tenant1.id,
        name: 'Academic Session 2025-2026',
        startDate: '2025-04-01',
        endDate: '2026-03-31',
        isCurrent: true,
        terms: [
          { id: 't1', name: 'Term 1 (Mid-Term & Half Yearly)', startDate: '2025-04-01', endDate: '2025-09-30' },
          { id: 't2', name: 'Term 2 (Annual Final Assessment)', startDate: '2025-10-01', endDate: '2026-03-31' }
        ]
      };
      await FirebaseService.setDocument('academic_years', ay1.id, ay1);

      const classG9: ClassGrade = { id: 'cls_g9', tenantId: tenant1.id, name: 'Class 9', code: 'CLS-09', order: 9 };
      const classG10: ClassGrade = { id: 'cls_g10', tenantId: tenant1.id, name: 'Class 10 (CBSE X)', code: 'CLS-10', order: 10 };
      const classG11: ClassGrade = { id: 'cls_g11', tenantId: tenant1.id, name: 'Class 11 (Senior)', code: 'CLS-11', order: 11 };
      const classG12: ClassGrade = { id: 'cls_g12', tenantId: tenant1.id, name: 'Class 12 (CBSE XII)', code: 'CLS-12', order: 12 };

      await FirebaseService.setDocument('classes', classG9.id, classG9);
      await FirebaseService.setDocument('classes', classG10.id, classG10);
      await FirebaseService.setDocument('classes', classG11.id, classG11);
      await FirebaseService.setDocument('classes', classG12.id, classG12);

      const sec10A: Section = {
        id: 'sec_10a',
        tenantId: tenant1.id,
        classId: 'cls_g10',
        campusId: campus1.id,
        name: 'Section A - Science & Maths',
        code: '10-A',
        roomNumber: 'Room 204',
        classTeacherId: 'usr_teacher_sunita',
        classTeacherName: 'Dr. Sunita Deshmukh',
        maxCapacity: 35,
        currentStudentCount: 32
      };
      const sec10B: Section = {
        id: 'sec_10b',
        tenantId: tenant1.id,
        classId: 'cls_g10',
        campusId: campus1.id,
        name: 'Section B - General Studies',
        code: '10-B',
        roomNumber: 'Room 206',
        classTeacherId: 'usr_teacher_rajesh',
        classTeacherName: 'Dr. Rajesh Kulkarni',
        maxCapacity: 35,
        currentStudentCount: 30
      };
      await FirebaseService.setDocument('sections', sec10A.id, sec10A);
      await FirebaseService.setDocument('sections', sec10B.id, sec10B);

      // Subjects (CBSE / Indian Curriculum)
      const subMath: Subject = {
        id: 'sbj_math10',
        tenantId: tenant1.id,
        name: 'Mathematics & Mental Ability (NCERT)',
        code: 'MTH-041',
        type: 'core',
        creditHours: 4,
        applicableClassIds: ['cls_g10', 'cls_g11']
      };
      const subPhysics: Subject = {
        id: 'sbj_phy10',
        tenantId: tenant1.id,
        name: 'Science & Practical Physics Lab',
        code: 'SCI-086',
        type: 'lab',
        creditHours: 4,
        applicableClassIds: ['cls_g10', 'cls_g11', 'cls_g12']
      };
      const subEng: Subject = {
        id: 'sbj_eng10',
        tenantId: tenant1.id,
        name: 'English Language & Literature',
        code: 'ENG-184',
        type: 'core',
        creditHours: 3,
        applicableClassIds: ['cls_g9', 'cls_g10', 'cls_g11', 'cls_g12']
      };
      const subHindi: Subject = {
        id: 'sbj_hin10',
        tenantId: tenant1.id,
        name: 'Hindi Course (Course A)',
        code: 'HIN-002',
        type: 'core',
        creditHours: 3,
        applicableClassIds: ['cls_g9', 'cls_g10']
      };
      const subSocial: Subject = {
        id: 'sbj_soc10',
        tenantId: tenant1.id,
        name: 'Social Science (History, Civics, Geography)',
        code: 'SST-087',
        type: 'core',
        creditHours: 4,
        applicableClassIds: ['cls_g9', 'cls_g10']
      };

      await FirebaseService.setDocument('subjects', subMath.id, subMath);
      await FirebaseService.setDocument('subjects', subPhysics.id, subPhysics);
      await FirebaseService.setDocument('subjects', subEng.id, subEng);
      await FirebaseService.setDocument('subjects', subHindi.id, subHindi);
      await FirebaseService.setDocument('subjects', subSocial.id, subSocial);

      // 4. Initial Users & Role Assignments (Indian Faculty & Administration)
      const users: User[] = [
        {
          id: 'usr_super_admin',
          email: 'superadmin@edutech-sms.internal',
          displayName: 'Vikramaditya Singhania',
          status: 'active',
          isPlatformSuperAdmin: true,
          defaultTenantId: tenant1.id,
          roleAssignments: [
            {
              id: 'ra_sup_01',
              userId: 'usr_super_admin',
              roleId: 'role_super_admin',
              roleCode: 'super_admin',
              roleName: 'Platform Super Administrator',
              tenantId: 'ALL',
              scopes: [{ type: 'platform', value: '*' }],
              assignedAt: now
            }
          ],
          createdAt: now,
          updatedAt: now
        },
        {
          id: 'usr_owner_tandon',
          email: 'chairman@dpsrkp.edu.in',
          displayName: 'Shri R.K. Tandon',
          status: 'active',
          defaultTenantId: tenant1.id,
          metadata: { designation: 'Managing Trustee & Chairman' },
          roleAssignments: [
            {
              id: 'ra_own_01',
              userId: 'usr_owner_tandon',
              roleId: 'role_institution_owner',
              roleCode: 'institution_owner',
              roleName: 'Institution Owner / Chairman',
              tenantId: tenant1.id,
              scopes: [{ type: 'institution', value: tenant1.id }],
              assignedAt: now
            }
          ],
          createdAt: now,
          updatedAt: now
        },
        {
          id: 'usr_principal_dps',
          email: 'principal@dpsrkp.edu.in',
          displayName: 'Dr. Meenakshi Sundaram',
          status: 'active',
          defaultTenantId: tenant1.id,
          metadata: { designation: 'Principal & Director of Academics', employeeId: 'DPS-EMP-001' },
          roleAssignments: [
            {
              id: 'ra_prin_01',
              userId: 'usr_principal_dps',
              roleId: 'role_principal',
              roleCode: 'principal',
              roleName: 'Principal / Director',
              tenantId: tenant1.id,
              scopes: [{ type: 'institution', value: tenant1.id }],
              assignedAt: now
            }
          ],
          createdAt: now,
          updatedAt: now
        },
        {
          id: 'usr_admission_officer_dps',
          email: 'admissions@dpsrkp.edu.in',
          displayName: 'Sanjay Mehra (Admissions)',
          status: 'active',
          defaultTenantId: tenant1.id,
          metadata: { designation: 'Senior Admissions Officer', employeeId: 'DPS-EMP-009' },
          roleAssignments: [
            {
              id: 'ra_adm_off_01',
              userId: 'usr_admission_officer_dps',
              roleId: 'role_ADMISSION_OFFICER',
              roleCode: 'admission_officer',
              roleName: 'Admission Officer',
              tenantId: tenant1.id,
              scopes: [{ type: 'institution', value: tenant1.id }],
              assignedAt: now
            }
          ],
          createdAt: now,
          updatedAt: now
        },
        {
          id: 'usr_teacher_amit',
          email: 'amit.verma@dpsrkp.edu.in',
          displayName: 'Prof. Amit Verma',
          status: 'active',
          defaultTenantId: tenant1.id,
          metadata: { designation: 'PGT Physics • Class 10 Mentor • Exam Superintendent' },
          roleAssignments: [
            {
              id: 'ra_amit_01',
              userId: 'usr_teacher_amit',
              roleId: 'role_teacher',
              roleCode: 'teacher',
              roleName: 'Teacher (Physics)',
              tenantId: tenant1.id,
              scopes: [{ type: 'class', value: 'cls_g10', name: 'Class 10' }],
              assignedAt: now
            },
            {
              id: 'ra_amit_02',
              userId: 'usr_teacher_amit',
              roleId: 'role_class_coordinator',
              roleCode: 'class_coordinator',
              roleName: 'Class Coordinator (10-A)',
              tenantId: tenant1.id,
              scopes: [{ type: 'section', value: 'sec_10a', name: 'Section 10-A' }],
              assignedAt: now
            },
            {
              id: 'ra_amit_03',
              userId: 'usr_teacher_amit',
              roleId: 'role_exam_coordinator',
              roleCode: 'exam_coordinator',
              roleName: 'Examination Coordinator',
              tenantId: tenant1.id,
              scopes: [{ type: 'institution', value: tenant1.id }],
              assignedAt: now
            }
          ],
          createdAt: now,
          updatedAt: now
        },
        {
          id: 'usr_teacher_sunita',
          email: 'sunita.deshmukh@dpsrkp.edu.in',
          displayName: 'Dr. Sunita Deshmukh',
          status: 'active',
          defaultTenantId: tenant1.id,
          metadata: { designation: 'Senior PGT Mathematics & Academic Coordinator' },
          roleAssignments: [
            {
              id: 'ra_tch_01',
              userId: 'usr_teacher_sunita',
              roleId: 'role_teacher',
              roleCode: 'teacher',
              roleName: 'Senior Teacher',
              tenantId: tenant1.id,
              scopes: [
                { type: 'class', value: 'cls_g10', name: 'Class 10' },
                { type: 'section', value: 'sec_10a', name: 'Section 10-A' }
              ],
              assignedAt: now
            },
            {
              id: 'ra_tch_coord_01',
              userId: 'usr_teacher_sunita',
              roleId: 'role_academic_coordinator',
              roleCode: 'academic_coordinator',
              roleName: 'Academic Coordinator',
              tenantId: tenant1.id,
              scopes: [{ type: 'campus', value: campus1.id }],
              assignedAt: now
            }
          ],
          createdAt: now,
          updatedAt: now
        },
        {
          id: 'usr_student_aarav',
          email: 'aarav.sharma@dpsrkp.student.in',
          displayName: 'Aarav Sharma',
          status: 'active',
          defaultTenantId: tenant1.id,
          metadata: { studentId: 'ADM-2025-0042', rollNumber: '10A-01' },
          roleAssignments: [
            {
              id: 'ra_stu_01',
              userId: 'usr_student_aarav',
              roleId: 'role_student',
              roleCode: 'student',
              roleName: 'Student (Class 10-A)',
              tenantId: tenant1.id,
              scopes: [{ type: 'institution', value: tenant1.id }],
              assignedAt: now
            }
          ],
          createdAt: now,
          updatedAt: now
        },
        {
          id: 'usr_parent_rajesh',
          email: 'rajesh.sharma@gmail.com',
          displayName: 'Rajesh Sharma',
          status: 'active',
          defaultTenantId: tenant1.id,
          metadata: { wardName: 'Aarav Sharma', relationship: 'Father' },
          roleAssignments: [
            {
              id: 'ra_par_01',
              userId: 'usr_parent_rajesh',
              roleId: 'role_parent',
              roleCode: 'parent',
              roleName: 'Parent / Guardian',
              tenantId: tenant1.id,
              scopes: [{ type: 'institution', value: tenant1.id }],
              assignedAt: now
            }
          ],
          createdAt: now,
          updatedAt: now
        },
        {
          id: 'usr_accountant_verma',
          email: 'accounts@dpsrkp.edu.in',
          displayName: 'S.K. Verma (Accountant)',
          status: 'active',
          defaultTenantId: tenant1.id,
          metadata: { designation: 'Chief Bursar & Fee Controller' },
          roleAssignments: [
            {
              id: 'ra_acc_01',
              userId: 'usr_accountant_verma',
              roleId: 'role_accountant',
              roleCode: 'accountant',
              roleName: 'Accountant / Bursar',
              tenantId: tenant1.id,
              scopes: [{ type: 'institution', value: tenant1.id }],
              assignedAt: now
            }
          ],
          createdAt: now,
          updatedAt: now
        },
        {
          id: 'usr_govt_admin',
          email: 'inspector@education.gov.in',
          displayName: 'Dr. Alok Nath (MoE Officer)',
          status: 'active',
          defaultTenantId: tenant1.id,
          metadata: { designation: 'Ministry of Education Inspector' },
          roleAssignments: [
            {
              id: 'ra_gov_01',
              userId: 'usr_govt_admin',
              roleId: 'role_govt_admin',
              roleCode: 'govt_admin',
              roleName: 'Education Ministry Officer',
              tenantId: tenant1.id,
              scopes: [{ type: 'platform', value: '*' }],
              assignedAt: now
            }
          ],
          createdAt: now,
          updatedAt: now
        }
      ];

      for (const u of users) {
        await FirebaseService.setDocument('users', u.id, u);
      }

      // 4b. Master Role Catalogue & Demo User Provisioning (72 System Roles + Demo Accounts)
      const demoTenant: Tenant = {
        id: 'DEMO_SCHOOL',
        name: 'EduTech Demo International School',
        code: 'DEMO-SCH',
        type: 'k12_school',
        registrationNumber: 'CBSE-DEMO-2026-0001',
        email: 'admin@demo-school.ems.internal',
        phone: '+1 555-0199',
        website: 'https://demo-school.ems.internal',
        address: {
          street: '100 Learning Boulevard, Main Campus',
          city: 'Metro City',
          state: 'Capital State',
          country: 'India',
          postalCode: '110001'
        },
        branding: {
          primaryColor: '#0284c7',
          accentColor: '#38bdf8',
          portalTitle: 'EduTech Demo International Portal',
          institutionMotto: 'Excellence in Modular Education',
          themeMode: 'light'
        },
        academicConfig: {
          academicYearStartMonth: 4,
          gradingSystem: 'percentage',
          attendanceType: 'daily_once',
          termsPerYear: 2
        },
        status: 'active',
        enabledModules: ['core', 'student', 'academic', 'attendance', 'admissions', 'fees', 'hr', 'library', 'transport', 'hostel', 'it', 'lms', 'government'],
        totalStudents: 1200,
        totalStaff: 85,
        createdAt: now,
        updatedAt: now
      };
      await FirebaseService.setDocument('tenants', demoTenant.id, demoTenant);

      // Seed all 72 system roles in Firestore
      for (const r of SYSTEM_ROLES) {
        await FirebaseService.setDocument('roles', r.id, r);
      }

      // Seed 72 demo users (one per role template)
      const demoUsers: User[] = SYSTEM_ROLES.map(role => {
        const codeSlug = role.code.toLowerCase().replace(/_/g, '.');
        const isPlatformOrGov = role.category === 'PLATFORM' || role.category === 'GOVERNMENT';
        const tenantId = isPlatformOrGov ? 'ALL' : demoTenant.id;

        return {
          id: `usr_demo_${role.code.toLowerCase()}`,
          email: `demo.${codeSlug}@ems.internal`,
          displayName: `Demo ${role.name}`,
          status: 'active',
          defaultTenantId: tenantId === 'ALL' ? tenant1.id : tenantId,
          isPlatformSuperAdmin: role.code === 'PLATFORM_SUPER_ADMIN',
          isDemo: true,
          is_demo: true,
          environment: 'DEVELOPMENT',
          metadata: {
            designation: role.name,
            employeeId: `DEMO-EMP-${role.code}`
          },
          roleAssignments: [
            {
              id: `ra_demo_${role.code.toLowerCase()}`,
              userId: `usr_demo_${role.code.toLowerCase()}`,
              roleId: role.id,
              roleCode: role.code,
              roleName: role.name,
              tenantId: tenantId,
              scopes: [{ type: role.applicableScopes?.[0] || 'institution', value: '*' }],
              assignedAt: now
            }
          ],
          createdAt: now,
          updatedAt: now
        };
      });

      // Composite Multi-Role Test User (Section 41)
      const multiRoleUser: User = {
        id: 'usr_demo_multirole_academic',
        email: 'demo.multirole.academic@ems.internal',
        displayName: 'Demo Multi-Role Academic User',
        status: 'active',
        defaultTenantId: demoTenant.id,
        isDemo: true,
        is_demo: true,
        environment: 'DEVELOPMENT',
        metadata: { designation: 'Senior Faculty • Class Teacher 8-A • Exam Coordinator' },
        roleAssignments: [
          {
            id: 'ra_mr_01',
            userId: 'usr_demo_multirole_academic',
            roleId: 'role_TEACHER',
            roleCode: 'TEACHER',
            roleName: 'Teacher (Mathematics)',
            tenantId: demoTenant.id,
            scopes: [{ type: 'class', value: 'cls_g8', name: 'Class VIII' }],
            assignedAt: now
          },
          {
            id: 'ra_mr_02',
            userId: 'usr_demo_multirole_academic',
            roleId: 'role_CLASS_TEACHER',
            roleCode: 'CLASS_TEACHER',
            roleName: 'Class Teacher (VIII-A)',
            tenantId: demoTenant.id,
            scopes: [
              { type: 'academic_year', value: 'ay_2026_2027', name: '2026-27' },
              { type: 'class', value: 'cls_g8', name: 'Class VIII' },
              { type: 'section', value: 'sec_8a', name: 'Section A' }
            ],
            assignedAt: now
          },
          {
            id: 'ra_mr_03',
            userId: 'usr_demo_multirole_academic',
            roleId: 'role_EXAMINATION_COORDINATOR',
            roleCode: 'EXAMINATION_COORDINATOR',
            roleName: 'Examination Coordinator',
            tenantId: demoTenant.id,
            scopes: [{ type: 'institution', value: demoTenant.id }],
            assignedAt: now
          }
        ],
        createdAt: now,
        updatedAt: now
      };

      // Multi-Child Parent Test User (Section 42)
      const multiChildParent: User = {
        id: 'usr_demo_parent_multichild',
        email: 'demo.parent.multichild@ems.internal',
        displayName: 'Demo Multi-Child Parent',
        status: 'active',
        defaultTenantId: tenant1.id,
        isDemo: true,
        is_demo: true,
        environment: 'DEVELOPMENT',
        metadata: { wardName: 'Aarav Sharma & Ananya Verma', relationship: 'Father / Guardian' },
        roleAssignments: [
          {
            id: 'ra_mc_01',
            userId: 'usr_demo_parent_multichild',
            roleId: 'role_PARENT_GUARDIAN',
            roleCode: 'PARENT_GUARDIAN',
            roleName: 'Parent / Guardian (2 Children)',
            tenantId: tenant1.id,
            scopes: [
              { type: 'child', value: 'stu_001', name: 'Aarav Sharma (Class 10-A)' },
              { type: 'child', value: 'stu_002', name: 'Ananya Verma (Class 10-A)' }
            ],
            assignedAt: now
          }
        ],
        createdAt: now,
        updatedAt: now
      };

      for (const u of [...demoUsers, multiRoleUser, multiChildParent]) {
        await FirebaseService.setDocument('users', u.id, u);
      }

      // 5. Initial Sample Students (Indian Names & Context)
      const sampleStudents: Student[] = [
        {
          id: 'stu_001',
          tenantId: tenant1.id,
          campusId: campus1.id,
          studentIdNumber: 'ADM-2025-0042',
          firstName: 'Aarav',
          lastName: 'Sharma',
          dateOfBirth: '2010-05-14',
          gender: 'male',
          bloodGroup: 'O+',
          email: 'aarav.sharma@dpsrkp.student.in',
          phone: '+91 98101 22410',
          address: 'Flat 402, Shivalik Apartments, Hauz Khas, New Delhi',
          enrollmentDate: '2023-04-01',
          currentAcademicYearId: ay1.id,
          currentClassId: 'cls_g10',
          currentSectionId: 'sec_10a',
          rollNumber: '10A-01',
          status: 'enrolled',
          guardians: [
            {
              id: 'g_01',
              name: 'Rajesh Sharma',
              relationship: 'father',
              email: 'rajesh.sharma@email.in',
              phone: '+91 98101 22411',
              occupation: 'Senior Director, NIC India',
              isPrimaryContact: true
            },
            {
              id: 'g_02',
              name: 'Dr. Suniti Sharma',
              relationship: 'mother',
              email: 'suniti.sharma@aiims.gov.in',
              phone: '+91 98101 22412',
              occupation: 'Cardiologist, AIIMS New Delhi',
              isPrimaryContact: false
            }
          ],
          createdAt: now,
          updatedAt: now
        },
        {
          id: 'stu_002',
          tenantId: tenant1.id,
          campusId: campus1.id,
          studentIdNumber: 'ADM-2025-0043',
          firstName: 'Ananya',
          lastName: 'Verma',
          dateOfBirth: '2010-08-22',
          gender: 'female',
          bloodGroup: 'B+',
          email: 'ananya.verma@dpsrkp.student.in',
          phone: '+91 98202 55901',
          address: 'B-14, Gulmohar Park, New Delhi',
          enrollmentDate: '2023-04-01',
          currentAcademicYearId: ay1.id,
          currentClassId: 'cls_g10',
          currentSectionId: 'sec_10a',
          rollNumber: '10A-02',
          status: 'enrolled',
          guardians: [
            {
              id: 'g_03',
              name: 'Vikram Verma',
              relationship: 'father',
              email: 'vikram.verma@email.in',
              phone: '+91 98202 55900',
              occupation: 'Chartered Accountant',
              isPrimaryContact: true
            }
          ],
          createdAt: now,
          updatedAt: now
        },
        {
          id: 'stu_003',
          tenantId: tenant1.id,
          campusId: campus1.id,
          studentIdNumber: 'ADM-2025-0044',
          firstName: 'Rohan',
          lastName: 'Gupta',
          dateOfBirth: '2010-01-15',
          gender: 'male',
          bloodGroup: 'A+',
          email: 'rohan.gupta@dpsrkp.student.in',
          phone: '+91 98110 33890',
          address: 'C-72, Greater Kailash 1, New Delhi',
          enrollmentDate: '2024-04-01',
          currentAcademicYearId: ay1.id,
          currentClassId: 'cls_g10',
          currentSectionId: 'sec_10a',
          rollNumber: '10A-03',
          status: 'enrolled',
          guardians: [
            {
              id: 'g_04',
              name: 'Pooja Gupta',
              relationship: 'mother',
              email: 'pooja.gupta@email.in',
              phone: '+91 98110 33891',
              occupation: 'Architect',
              isPrimaryContact: true
            }
          ],
          createdAt: now,
          updatedAt: now
        },
        {
          id: 'stu_004',
          tenantId: tenant1.id,
          campusId: campus1.id,
          studentIdNumber: 'ADM-2025-0045',
          firstName: 'Deepa',
          lastName: 'Iyer',
          dateOfBirth: '2010-11-03',
          gender: 'female',
          bloodGroup: 'AB+',
          email: 'deepa.iyer@dpsrkp.student.in',
          phone: '+91 98711 44520',
          address: 'D-4, Safdarjung Enclave, New Delhi',
          enrollmentDate: '2023-04-01',
          currentAcademicYearId: ay1.id,
          currentClassId: 'cls_g10',
          currentSectionId: 'sec_10b',
          rollNumber: '10B-01',
          status: 'enrolled',
          guardians: [
            {
              id: 'g_05',
              name: 'Venkatesh Iyer',
              relationship: 'father',
              email: 'v.iyer@email.in',
              phone: '+91 98711 44521',
              occupation: 'ISRO Research Scientist',
              isPrimaryContact: true
            }
          ],
          createdAt: now,
          updatedAt: now
        },
        {
          id: 'stu_005',
          tenantId: tenant1.id,
          campusId: campus1.id,
          studentIdNumber: 'ADM-2025-0046',
          firstName: 'Savio',
          lastName: "D'Souza",
          dateOfBirth: '2010-03-28',
          gender: 'male',
          bloodGroup: 'O+',
          email: 'savio.dsouza@dpsrkp.student.in',
          phone: '+91 98188 77610',
          address: '18, Golf Links, New Delhi',
          enrollmentDate: '2023-04-01',
          currentAcademicYearId: ay1.id,
          currentClassId: 'cls_g10',
          currentSectionId: 'sec_10a',
          rollNumber: '10A-04',
          status: 'enrolled',
          guardians: [
            {
              id: 'g_06',
              name: 'Francis D\'Souza',
              relationship: 'father',
              email: 'francis.dsouza@email.in',
              phone: '+91 98188 77611',
              occupation: 'Commercial Pilot, Air India',
              isPrimaryContact: true
            }
          ],
          createdAt: now,
          updatedAt: now
        },
        {
          id: 'stu_006',
          tenantId: tenant1.id,
          campusId: campus1.id,
          studentIdNumber: 'ADM-2025-0047',
          firstName: 'Samira',
          lastName: 'Khan',
          dateOfBirth: '2010-09-12',
          gender: 'female',
          bloodGroup: 'A+',
          email: 'samira.khan@dpsrkp.student.in',
          phone: '+91 98102 99014',
          address: 'Plot 102, Jamia Nagar, Okhla, New Delhi',
          enrollmentDate: '2023-04-01',
          currentAcademicYearId: ay1.id,
          currentClassId: 'cls_g10',
          currentSectionId: 'sec_10a',
          rollNumber: '10A-05',
          status: 'enrolled',
          guardians: [
            {
              id: 'g_07',
              name: 'Tariq Khan',
              relationship: 'father',
              email: 'tariq.khan@email.in',
              phone: '+91 98102 99015',
              occupation: 'Civil Advocate, Supreme Court',
              isPrimaryContact: true
            }
          ],
          createdAt: now,
          updatedAt: now
        }
      ];

      for (const st of sampleStudents) {
        await FirebaseService.setDocument('students', st.id, st);

        // Seed current enrollment record
        const currEnrId = `enr_curr_${st.id}`;
        await FirebaseService.setDocument('enrollments', currEnrId, {
          id: currEnrId,
          studentId: st.id,
          tenantId: st.tenantId,
          academicYearId: st.currentAcademicYearId,
          academicYearName: 'Academic Session 2025–2026',
          classId: st.currentClassId,
          className: 'Class 10 (CBSE X)',
          sectionId: st.currentSectionId,
          sectionName: 'Section A - Science & Maths',
          rollNumber: st.rollNumber,
          enrollmentDate: st.enrollmentDate,
          status: 'ACTIVE'
        });

        // Seed historical Grade 9 enrollment record
        const histEnrId = `enr_hist_g9_${st.id}`;
        await FirebaseService.setDocument('enrollments', histEnrId, {
          id: histEnrId,
          studentId: st.id,
          tenantId: st.tenantId,
          academicYearId: 'ay_2024_2025',
          academicYearName: 'Academic Session 2024–2025',
          classId: 'cls_g9',
          className: 'Class 9',
          sectionId: 'sec_09a',
          sectionName: 'Section A',
          rollNumber: st.rollNumber ? st.rollNumber.replace('10A', '09A') : '09A-01',
          enrollmentDate: '2024-04-01',
          status: 'PROMOTED',
          promotedAt: '2025-03-28T16:00:00Z',
          remarks: 'Promoted to Grade 10 CBSE'
        });
      }

      // 6. Initial Attendance Records for today
      const today = new Date().toISOString().split('T')[0];
      const attendanceList = [
        {
          id: `att_${tenant1.id}_${today}_stu_001`,
          tenantId: tenant1.id,
          campusId: campus1.id,
          date: today,
          academicYearId: ay1.id,
          classId: 'cls_g10',
          sectionId: 'sec_10a',
          studentId: 'stu_001',
          studentName: 'Aarav Sharma',
          rollNumber: '10A-01',
          status: 'present' as const,
          recordedBy: 'Dr. Sunita Deshmukh',
          recordedAt: now
        },
        {
          id: `att_${tenant1.id}_${today}_stu_002`,
          tenantId: tenant1.id,
          campusId: campus1.id,
          date: today,
          academicYearId: ay1.id,
          classId: 'cls_g10',
          sectionId: 'sec_10a',
          studentId: 'stu_002',
          studentName: 'Ananya Verma',
          rollNumber: '10A-02',
          status: 'present' as const,
          recordedBy: 'Dr. Sunita Deshmukh',
          recordedAt: now
        },
        {
          id: `att_${tenant1.id}_${today}_stu_003`,
          tenantId: tenant1.id,
          campusId: campus1.id,
          date: today,
          academicYearId: ay1.id,
          classId: 'cls_g10',
          sectionId: 'sec_10a',
          studentId: 'stu_003',
          studentName: 'Rohan Gupta',
          rollNumber: '10A-03',
          status: 'late' as const,
          remarks: 'Delhi Metro Blue Line signal delay (15 min)',
          recordedBy: 'Dr. Sunita Deshmukh',
          recordedAt: now
        },
        {
          id: `att_${tenant1.id}_${today}_stu_004`,
          tenantId: tenant1.id,
          campusId: campus1.id,
          date: today,
          academicYearId: ay1.id,
          classId: 'cls_g10',
          sectionId: 'sec_10b',
          studentId: 'stu_004',
          studentName: 'Deepa Iyer',
          rollNumber: '10B-01',
          status: 'present' as const,
          recordedBy: 'Dr. Rajesh Kulkarni',
          recordedAt: now
        },
        {
          id: `att_${tenant1.id}_${today}_stu_005`,
          tenantId: tenant1.id,
          campusId: campus1.id,
          date: today,
          academicYearId: ay1.id,
          classId: 'cls_g10',
          sectionId: 'sec_10a',
          studentId: 'stu_005',
          studentName: "Savio D'Souza",
          rollNumber: '10A-04',
          status: 'present' as const,
          recordedBy: 'Dr. Sunita Deshmukh',
          recordedAt: now
        },
        {
          id: `att_${tenant1.id}_${today}_stu_006`,
          tenantId: tenant1.id,
          campusId: campus1.id,
          date: today,
          academicYearId: ay1.id,
          classId: 'cls_g10',
          sectionId: 'sec_10a',
          studentId: 'stu_006',
          studentName: 'Samira Khan',
          rollNumber: '10A-05',
          status: 'present' as const,
          recordedBy: 'Dr. Sunita Deshmukh',
          recordedAt: now
        }
      ];

      for (const att of attendanceList) {
        await FirebaseService.setDocument('student_attendance', att.id, att);
      }

      // ======================================================================
      // 7. PHASE 3: ACADEMIC MANAGEMENT SEED DATA
      // ======================================================================

      // A. Teacher Profiles
      const teacherProfiles: TeacherProfile[] = [
        {
          id: 'tch_sunita',
          tenantId: tenant1.id,
          userId: 'usr_teacher_sunita',
          employeeId: 'DPS-FAC-014',
          qualification: 'M.Sc. Mathematics, B.Ed (Delhi University)',
          specialization: 'Calculus, Linear Algebra & Mental Math',
          department: 'Department of Mathematics & Computing',
          joiningDate: '2018-06-15',
          employmentStatus: 'full_time',
          contactNumber: '+91 98110 44219',
          email: 'sunita.deshmukh@dpsrkp.edu.in',
          bio: 'Senior PGT Mathematics with 14+ years of secondary teaching experience. National CBSE Math Olympiad Mentor.',
          createdAt: now,
          updatedAt: now
        },
        {
          id: 'tch_rajesh',
          tenantId: tenant1.id,
          userId: 'usr_teacher_rajesh',
          employeeId: 'DPS-FAC-021',
          qualification: 'Ph.D. Physics (IIT Bombay), B.Sc. Physics (Hons)',
          specialization: 'Quantum Mechanics, Optics & Practical Labs',
          department: 'Department of Physical Sciences',
          joiningDate: '2020-01-10',
          employmentStatus: 'full_time',
          contactNumber: '+91 98230 11984',
          email: 'rajesh.kulkarni@dpsrkp.edu.in',
          bio: 'PGT Physics and Science Lab In-charge. Author of practical high-school physics problem sets.',
          createdAt: now,
          updatedAt: now
        },
        {
          id: 'tch_ananya',
          tenantId: tenant1.id,
          userId: 'usr_teacher_ananya',
          employeeId: 'DPS-FAC-029',
          qualification: 'M.A. English Literature (JNU), B.Ed',
          specialization: 'Modern Prose, Creative Writing & Linguistics',
          department: 'Department of Humanities & Languages',
          joiningDate: '2021-07-01',
          employmentStatus: 'full_time',
          contactNumber: '+91 97115 88320',
          email: 'ananya.sharma@dpsrkp.edu.in',
          bio: 'TGT English and Debate Club Coordinator. Focus on communication pedagogy and analytical literature essays.',
          createdAt: now,
          updatedAt: now
        },
        {
          id: 'tch_amit',
          tenantId: tenant1.id,
          userId: 'usr_teacher_amit',
          employeeId: 'DPS-FAC-035',
          qualification: 'M.A. History, B.Ed (St. Stephen\'s College)',
          specialization: 'Modern Indian History, Civics & Geography',
          department: 'Department of Social Sciences',
          joiningDate: '2019-04-12',
          employmentStatus: 'full_time',
          contactNumber: '+91 99104 22019',
          email: 'amit.verma@dpsrkp.edu.in',
          bio: 'Senior Social Science instructor and Model United Nations (MUN) advisory mentor.',
          createdAt: now,
          updatedAt: now
        }
      ];

      for (const tp of teacherProfiles) {
        await FirebaseService.setDocument('teacher_profiles', tp.id, tp);
      }

      // B. Teacher Assignments
      const teacherAssignments: TeacherAssignment[] = [
        {
          id: 'tass_01',
          tenantId: tenant1.id,
          teacherId: 'tch_sunita',
          teacherName: 'Dr. Sunita Deshmukh',
          academicYearId: ay1.id,
          classId: classG10.id,
          className: 'Class 10 (CBSE X)',
          sectionId: sec10A.id,
          sectionName: 'Section A - Science & Maths',
          subjectId: subMath.id,
          subjectName: 'Mathematics & Mental Ability (NCERT)',
          subjectCode: 'MTH-041',
          role: 'primary',
          status: 'active',
          assignedAt: now
        },
        {
          id: 'tass_02',
          tenantId: tenant1.id,
          teacherId: 'tch_rajesh',
          teacherName: 'Dr. Rajesh Kulkarni',
          academicYearId: ay1.id,
          classId: classG10.id,
          className: 'Class 10 (CBSE X)',
          sectionId: sec10A.id,
          sectionName: 'Section A - Science & Maths',
          subjectId: subPhysics.id,
          subjectName: 'Science & Practical Physics Lab',
          subjectCode: 'SCI-086',
          role: 'primary',
          status: 'active',
          assignedAt: now
        },
        {
          id: 'tass_03',
          tenantId: tenant1.id,
          teacherId: 'tch_ananya',
          teacherName: 'Mrs. Ananya Sharma',
          academicYearId: ay1.id,
          classId: classG10.id,
          className: 'Class 10 (CBSE X)',
          sectionId: sec10A.id,
          sectionName: 'Section A - Science & Maths',
          subjectId: subEng.id,
          subjectName: 'English Language & Literature',
          subjectCode: 'ENG-184',
          role: 'primary',
          status: 'active',
          assignedAt: now
        },
        {
          id: 'tass_04',
          tenantId: tenant1.id,
          teacherId: 'tch_amit',
          teacherName: 'Mr. Amit Verma',
          academicYearId: ay1.id,
          classId: classG10.id,
          className: 'Class 10 (CBSE X)',
          sectionId: sec10A.id,
          sectionName: 'Section A - Science & Maths',
          subjectId: subSocial.id,
          subjectName: 'Social Science (History, Civics, Geography)',
          subjectCode: 'SST-087',
          role: 'primary',
          status: 'active',
          assignedAt: now
        },
        {
          id: 'tass_05',
          tenantId: tenant1.id,
          teacherId: 'tch_sunita',
          teacherName: 'Dr. Sunita Deshmukh',
          academicYearId: ay1.id,
          classId: classG10.id,
          className: 'Class 10 (CBSE X)',
          sectionId: sec10B.id,
          sectionName: 'Section B - General Studies',
          subjectId: subMath.id,
          subjectName: 'Mathematics & Mental Ability (NCERT)',
          subjectCode: 'MTH-041',
          role: 'primary',
          status: 'active',
          assignedAt: now
        }
      ];

      for (const ta of teacherAssignments) {
        await FirebaseService.setDocument('teacher_assignments', ta.id, ta);
      }

      // C. Timetable Entries (Weekly Grid for Class 10-A)
      const timetableSeed: TimetableEntry[] = [
        // Monday
        { id: 'tt_m1', tenantId: tenant1.id, academicYearId: ay1.id, classId: classG10.id, className: 'Class 10 (CBSE X)', sectionId: sec10A.id, sectionName: 'Section A', dayOfWeek: 'Monday', periodNumber: 1, startTime: '08:00', endTime: '08:45', subjectId: subMath.id, subjectName: 'Mathematics', subjectCode: 'MTH-041', teacherId: 'tch_sunita', teacherName: 'Dr. Sunita Deshmukh', roomId: 'rm_204', roomName: 'Room 204 (Math Studio)', type: 'core' },
        { id: 'tt_m2', tenantId: tenant1.id, academicYearId: ay1.id, classId: classG10.id, className: 'Class 10 (CBSE X)', sectionId: sec10A.id, sectionName: 'Section A', dayOfWeek: 'Monday', periodNumber: 2, startTime: '08:45', endTime: '09:30', subjectId: subPhysics.id, subjectName: 'Science & Physics Lab', subjectCode: 'SCI-086', teacherId: 'tch_rajesh', teacherName: 'Dr. Rajesh Kulkarni', roomId: 'rm_sci_lab', roomName: 'Physics Lab 2', type: 'lab' },
        { id: 'tt_m3', tenantId: tenant1.id, academicYearId: ay1.id, classId: classG10.id, className: 'Class 10 (CBSE X)', sectionId: sec10A.id, sectionName: 'Section A', dayOfWeek: 'Monday', periodNumber: 3, startTime: '09:30', endTime: '10:15', subjectId: subEng.id, subjectName: 'English Literature', subjectCode: 'ENG-184', teacherId: 'tch_ananya', teacherName: 'Mrs. Ananya Sharma', roomId: 'rm_204', roomName: 'Room 204', type: 'core' },
        { id: 'tt_m4', tenantId: tenant1.id, academicYearId: ay1.id, classId: classG10.id, className: 'Class 10 (CBSE X)', sectionId: sec10A.id, sectionName: 'Section A', dayOfWeek: 'Monday', periodNumber: 4, startTime: '10:45', endTime: '11:30', subjectId: subSocial.id, subjectName: 'Social Science', subjectCode: 'SST-087', teacherId: 'tch_amit', teacherName: 'Mr. Amit Verma', roomId: 'rm_204', roomName: 'Room 204', type: 'core' },
        { id: 'tt_m5', tenantId: tenant1.id, academicYearId: ay1.id, classId: classG10.id, className: 'Class 10 (CBSE X)', sectionId: sec10A.id, sectionName: 'Section A', dayOfWeek: 'Monday', periodNumber: 5, startTime: '11:30', endTime: '12:15', subjectId: subHindi.id, subjectName: 'Hindi Course A', subjectCode: 'HIN-002', teacherId: 'tch_ananya', teacherName: 'Mrs. Ananya Sharma', roomId: 'rm_204', roomName: 'Room 204', type: 'core' },
        { id: 'tt_m6', tenantId: tenant1.id, academicYearId: ay1.id, classId: classG10.id, className: 'Class 10 (CBSE X)', sectionId: sec10A.id, sectionName: 'Section A', dayOfWeek: 'Monday', periodNumber: 6, startTime: '12:15', endTime: '01:00', subjectId: 'sbj_sports', subjectName: 'Physical Education & Sports', subjectCode: 'PED-048', teacherId: 'tch_amit', teacherName: 'Mr. Amit Verma', roomId: 'rm_ground', roomName: 'Main Sports Complex', type: 'sports' },

        // Tuesday
        { id: 'tt_t1', tenantId: tenant1.id, academicYearId: ay1.id, classId: classG10.id, className: 'Class 10 (CBSE X)', sectionId: sec10A.id, sectionName: 'Section A', dayOfWeek: 'Tuesday', periodNumber: 1, startTime: '08:00', endTime: '08:45', subjectId: subPhysics.id, subjectName: 'Science & Physics Lab', subjectCode: 'SCI-086', teacherId: 'tch_rajesh', teacherName: 'Dr. Rajesh Kulkarni', roomId: 'rm_sci_lab', roomName: 'Physics Lab 2', type: 'lab' },
        { id: 'tt_t2', tenantId: tenant1.id, academicYearId: ay1.id, classId: classG10.id, className: 'Class 10 (CBSE X)', sectionId: sec10A.id, sectionName: 'Section A', dayOfWeek: 'Tuesday', periodNumber: 2, startTime: '08:45', endTime: '09:30', subjectId: subMath.id, subjectName: 'Mathematics', subjectCode: 'MTH-041', teacherId: 'tch_sunita', teacherName: 'Dr. Sunita Deshmukh', roomId: 'rm_204', roomName: 'Room 204', type: 'core' },
        { id: 'tt_t3', tenantId: tenant1.id, academicYearId: ay1.id, classId: classG10.id, className: 'Class 10 (CBSE X)', sectionId: sec10A.id, sectionName: 'Section A', dayOfWeek: 'Tuesday', periodNumber: 3, startTime: '09:30', endTime: '10:15', subjectId: subSocial.id, subjectName: 'Social Science', subjectCode: 'SST-087', teacherId: 'tch_amit', teacherName: 'Mr. Amit Verma', roomId: 'rm_204', roomName: 'Room 204', type: 'core' },
        { id: 'tt_t4', tenantId: tenant1.id, academicYearId: ay1.id, classId: classG10.id, className: 'Class 10 (CBSE X)', sectionId: sec10A.id, sectionName: 'Section A', dayOfWeek: 'Tuesday', periodNumber: 4, startTime: '10:45', endTime: '11:30', subjectId: subEng.id, subjectName: 'English Literature', subjectCode: 'ENG-184', teacherId: 'tch_ananya', teacherName: 'Mrs. Ananya Sharma', roomId: 'rm_204', roomName: 'Room 204', type: 'core' },
        { id: 'tt_t5', tenantId: tenant1.id, academicYearId: ay1.id, classId: classG10.id, className: 'Class 10 (CBSE X)', sectionId: sec10A.id, sectionName: 'Section A', dayOfWeek: 'Tuesday', periodNumber: 5, startTime: '11:30', endTime: '12:15', subjectId: subMath.id, subjectName: 'Mathematics Advanced Problem Solving', subjectCode: 'MTH-041', teacherId: 'tch_sunita', teacherName: 'Dr. Sunita Deshmukh', roomId: 'rm_204', roomName: 'Room 204', type: 'core' },
        { id: 'tt_t6', tenantId: tenant1.id, academicYearId: ay1.id, classId: classG10.id, className: 'Class 10 (CBSE X)', sectionId: sec10A.id, sectionName: 'Section A', dayOfWeek: 'Tuesday', periodNumber: 6, startTime: '12:15', endTime: '01:00', subjectId: 'sbj_cs', subjectName: 'Computer Applications & Coding', subjectCode: 'CA-165', teacherId: 'tch_sunita', teacherName: 'Dr. Sunita Deshmukh', roomId: 'rm_comp_lab', roomName: 'Computer Lab 1', type: 'lab' },

        // Wednesday
        { id: 'tt_w1', tenantId: tenant1.id, academicYearId: ay1.id, classId: classG10.id, className: 'Class 10 (CBSE X)', sectionId: sec10A.id, sectionName: 'Section A', dayOfWeek: 'Wednesday', periodNumber: 1, startTime: '08:00', endTime: '08:45', subjectId: subMath.id, subjectName: 'Mathematics', subjectCode: 'MTH-041', teacherId: 'tch_sunita', teacherName: 'Dr. Sunita Deshmukh', roomId: 'rm_204', roomName: 'Room 204', type: 'core' },
        { id: 'tt_w2', tenantId: tenant1.id, academicYearId: ay1.id, classId: classG10.id, className: 'Class 10 (CBSE X)', sectionId: sec10A.id, sectionName: 'Section A', dayOfWeek: 'Wednesday', periodNumber: 2, startTime: '08:45', endTime: '09:30', subjectId: subPhysics.id, subjectName: 'Science & Physics Lab', subjectCode: 'SCI-086', teacherId: 'tch_rajesh', teacherName: 'Dr. Rajesh Kulkarni', roomId: 'rm_sci_lab', roomName: 'Physics Lab 2', type: 'lab' },
        { id: 'tt_w3', tenantId: tenant1.id, academicYearId: ay1.id, classId: classG10.id, className: 'Class 10 (CBSE X)', sectionId: sec10A.id, sectionName: 'Section A', dayOfWeek: 'Wednesday', periodNumber: 3, startTime: '09:30', endTime: '10:15', subjectId: subEng.id, subjectName: 'English Language', subjectCode: 'ENG-184', teacherId: 'tch_ananya', teacherName: 'Mrs. Ananya Sharma', roomId: 'rm_204', roomName: 'Room 204', type: 'core' },
        { id: 'tt_w4', tenantId: tenant1.id, academicYearId: ay1.id, classId: classG10.id, className: 'Class 10 (CBSE X)', sectionId: sec10A.id, sectionName: 'Section A', dayOfWeek: 'Wednesday', periodNumber: 4, startTime: '10:45', endTime: '11:30', subjectId: subSocial.id, subjectName: 'Social Science', subjectCode: 'SST-087', teacherId: 'tch_amit', teacherName: 'Mr. Amit Verma', roomId: 'rm_204', roomName: 'Room 204', type: 'core' },
        { id: 'tt_w5', tenantId: tenant1.id, academicYearId: ay1.id, classId: classG10.id, className: 'Class 10 (CBSE X)', sectionId: sec10A.id, sectionName: 'Section A', dayOfWeek: 'Wednesday', periodNumber: 5, startTime: '11:30', endTime: '12:15', subjectId: subHindi.id, subjectName: 'Hindi Course A', subjectCode: 'HIN-002', teacherId: 'tch_ananya', teacherName: 'Mrs. Ananya Sharma', roomId: 'rm_204', roomName: 'Room 204', type: 'core' },
        { id: 'tt_w6', tenantId: tenant1.id, academicYearId: ay1.id, classId: classG10.id, className: 'Class 10 (CBSE X)', sectionId: sec10A.id, sectionName: 'Section A', dayOfWeek: 'Wednesday', periodNumber: 6, startTime: '12:15', endTime: '01:00', subjectId: 'sbj_lib', subjectName: 'Library & Reading Hour', subjectCode: 'LIB-001', teacherId: 'tch_ananya', teacherName: 'Mrs. Ananya Sharma', roomId: 'rm_library', roomName: 'Central Library', type: 'activity' }
      ];

      for (const tt of timetableSeed) {
        await FirebaseService.setDocument('timetable_entries', tt.id, tt);
      }

      // D. Lesson Plans
      const lessonPlanSeed: LessonPlan[] = [
        {
          id: 'lp_01',
          tenantId: tenant1.id,
          academicYearId: ay1.id,
          classId: classG10.id,
          className: 'Class 10 (CBSE X)',
          sectionId: sec10A.id,
          sectionName: 'Section A',
          subjectId: subMath.id,
          subjectName: 'Mathematics & Mental Ability',
          teacherId: 'tch_sunita',
          teacherName: 'Dr. Sunita Deshmukh',
          topic: 'Quadratic Equations & Roots by Factorisation',
          title: 'Unit 4: Finding Roots & Discriminant Analysis',
          curriculumUnit: 'Unit 4 - Algebra',
          smartClassroomReady: true,
          learningObjectives: [
            'Understand standard form ax² + bx + c = 0',
            'Derive roots via middle-term splitting and quadratic formula',
            'Determine nature of roots using Discriminant (b² - 4ac)'
          ],
          teachingMethod: 'Interactive GeoGebra simulation followed by peer problem-solving worksheets.',
          requiredMaterials: ['Interactive Smartboard', 'NCERT Exemplar Exercise 4.2', 'Scientific Graph Plotter'],
          estimatedDurationMinutes: 45,
          notes: 'Pay special attention to negative coefficient factoring cases.',
          lessonDate: '2025-09-02',
          status: 'COMPLETED',
          createdAt: now,
          updatedAt: now
        },
        {
          id: 'lp_02',
          tenantId: tenant1.id,
          academicYearId: ay1.id,
          classId: classG10.id,
          className: 'Class 10 (CBSE X)',
          sectionId: sec10A.id,
          sectionName: 'Section A',
          subjectId: subPhysics.id,
          subjectName: 'Science & Practical Physics Lab',
          teacherId: 'tch_rajesh',
          teacherName: 'Dr. Rajesh Kulkarni',
          topic: 'Ray Optics - Spherical Mirrors & Ray Tracing',
          title: 'Unit 10: Image Formation by Concave and Convex Mirrors',
          curriculumUnit: 'Unit 10 - Light: Reflection and Refraction',
          smartClassroomReady: true,
          learningObjectives: [
            'State laws of reflection for spherical mirrors',
            'Construct ray diagrams for 6 positions of object in front of concave mirror',
            'Apply mirror formula 1/f = 1/v + 1/u and Cartesian sign conventions'
          ],
          teachingMethod: 'Optical bench laboratory demonstration followed by ray tracing exercises.',
          requiredMaterials: ['Concave mirror optical bench', 'Light source & candle', 'Ray tracing protractor sheet'],
          estimatedDurationMinutes: 90,
          notes: 'Ensure laboratory safety goggles during candle optical bench demonstrations.',
          lessonDate: '2025-09-04',
          status: 'PLANNED',
          createdAt: now,
          updatedAt: now
        },
        {
          id: 'lp_03',
          tenantId: tenant1.id,
          academicYearId: ay1.id,
          classId: classG10.id,
          className: 'Class 10 (CBSE X)',
          sectionId: sec10A.id,
          sectionName: 'Section A',
          subjectId: subSocial.id,
          subjectName: 'Social Science (History)',
          teacherId: 'tch_amit',
          teacherName: 'Mr. Amit Verma',
          topic: 'Nationalism in India - The Non-Cooperation Movement',
          title: 'Chapter 2: Differing Strands within the Movement (1920–1922)',
          curriculumUnit: 'India and the Contemporary World - II',
          smartClassroomReady: false,
          learningObjectives: [
            'Analyze social groups participating in Non-Cooperation movement',
            'Evaluate the boycott in towns versus peasant movements in Awadh',
            'Trace the Chauri Chaura incident leading to withdrawal'
          ],
          teachingMethod: 'Documentary excerpt screening and historical source-based inquiry discussion.',
          requiredMaterials: ['Primary historical telegram archives', 'Audio-visual projector'],
          estimatedDurationMinutes: 45,
          notes: 'Connect historical themes with modern constitutional civics.',
          lessonDate: '2025-09-05',
          status: 'PLANNED',
          createdAt: now,
          updatedAt: now
        }
      ];

      for (const lp of lessonPlanSeed) {
        await FirebaseService.setDocument('lesson_plans', lp.id, lp);
      }

      // E. Homework & Assignments
      const assignmentSeed: Assignment[] = [
        {
          id: 'asgn_01',
          tenantId: tenant1.id,
          academicYearId: ay1.id,
          classId: classG10.id,
          className: 'Class 10 (CBSE X)',
          sectionId: sec10A.id,
          sectionName: 'Section A',
          subjectId: subMath.id,
          subjectName: 'Mathematics',
          teacherId: 'tch_sunita',
          teacherName: 'Dr. Sunita Deshmukh',
          title: 'Quadratic Equations Practice Set & Word Problems',
          description: 'Solve 10 selected problems from NCERT Exemplar Chapter 4 including speed-distance word problems and discriminant proofs.',
          instructions: 'Show full algebraic steps. Highlight roots clearly with box notation.',
          issueDate: '2025-09-01',
          dueDate: '2025-09-08',
          maximumMarks: 25,
          status: 'OPEN',
          submissionsCount: 28,
          createdAt: now,
          updatedAt: now
        },
        {
          id: 'asgn_02',
          tenantId: tenant1.id,
          academicYearId: ay1.id,
          classId: classG10.id,
          className: 'Class 10 (CBSE X)',
          sectionId: sec10A.id,
          sectionName: 'Section A',
          subjectId: subPhysics.id,
          subjectName: 'Science & Practical Physics',
          teacherId: 'tch_rajesh',
          teacherName: 'Dr. Rajesh Kulkarni',
          title: 'Ray Diagram Portfolio & Sign Convention Calculation',
          description: 'Draw 6 ray diagrams on A4 graph paper showing real vs virtual images and calculate focal lengths for numerical problem sheet #2.',
          instructions: 'Use sharp 2H pencil and precise ruler measurements. Attach scanned PDF or physical lab sheets.',
          issueDate: '2025-09-03',
          dueDate: '2025-09-10',
          maximumMarks: 20,
          status: 'OPEN',
          submissionsCount: 22,
          createdAt: now,
          updatedAt: now
        },
        {
          id: 'asgn_03',
          tenantId: tenant1.id,
          academicYearId: ay1.id,
          classId: classG10.id,
          className: 'Class 10 (CBSE X)',
          sectionId: sec10A.id,
          sectionName: 'Section A',
          subjectId: subEng.id,
          subjectName: 'English Literature',
          teacherId: 'tch_ananya',
          teacherName: 'Mrs. Ananya Sharma',
          title: 'Analytical Paragraph Writing: Character Arc of Lencho',
          description: 'Write a 150-word analytical paragraph exploring the irony in "A Letter to God" by G.L. Fuentes.',
          instructions: 'Adhere to CBSE marking scheme: Content (2), Organization (2), Accuracy (1).',
          issueDate: '2025-08-25',
          dueDate: '2025-08-30',
          maximumMarks: 10,
          status: 'REVIEWED',
          submissionsCount: 32,
          createdAt: now,
          updatedAt: now
        }
      ];

      for (const asgn of assignmentSeed) {
        await FirebaseService.setDocument('assignments', asgn.id, asgn);
      }

      // Sample Assignment Submissions
      const submissionsSeed: AssignmentSubmission[] = [
        {
          id: 'sub_01',
          assignmentId: 'asgn_03',
          tenantId: tenant1.id,
          studentId: 'stu_001',
          studentName: 'Aarav Sharma',
          rollNumber: '10A-01',
          submittedAt: '2025-08-28T14:30:00Z',
          submissionText: 'In "A Letter to God", Lencho portrays unshakable faith in the divine alongside deep human skepticism. The central situational irony occurs when he suspects the benevolent post office employees of stealing 30 pesos...',
          status: 'graded',
          marksObtained: 9.5,
          feedback: 'Outstanding vocabulary and perceptive analysis of situational irony. Well structured.',
          gradedBy: 'Mrs. Ananya Sharma',
          gradedAt: '2025-08-31T10:00:00Z'
        },
        {
          id: 'sub_02',
          assignmentId: 'asgn_03',
          tenantId: tenant1.id,
          studentId: 'stu_002',
          studentName: 'Ananya Verma',
          rollNumber: '10A-02',
          submittedAt: '2025-08-29T16:20:00Z',
          submissionText: 'Lencho is a simple farmer whose blind trust in God contrasts sharply with his lack of trust in human charity. The author highlights the irony when Lencho writes a second letter calling the postmen a "bunch of crooks"...',
          status: 'graded',
          marksObtained: 9.0,
          feedback: 'Very thoughtful paragraph. Minor punctuation correction needed in sentence 3.',
          gradedBy: 'Mrs. Ananya Sharma',
          gradedAt: '2025-08-31T10:15:00Z'
        }
      ];

      for (const sub of submissionsSeed) {
        await FirebaseService.setDocument('assignment_submissions', sub.id, sub);
      }

      // F. Continuous Assessments
      const assessmentSeed: Assessment[] = [
        {
          id: 'assm_01',
          tenantId: tenant1.id,
          academicYearId: ay1.id,
          classId: classG10.id,
          className: 'Class 10 (CBSE X)',
          sectionId: sec10A.id,
          sectionName: 'Section A',
          subjectId: subMath.id,
          subjectName: 'Mathematics',
          teacherId: 'tch_sunita',
          teacherName: 'Dr. Sunita Deshmukh',
          title: 'Class Test 1: Real Numbers & Polynomials',
          assessmentType: 'class_test',
          date: '2025-05-15',
          maximumMarks: 25,
          passingMarks: 9,
          weightagePercentage: 10,
          status: 'completed',
          createdAt: now
        },
        {
          id: 'assm_02',
          tenantId: tenant1.id,
          academicYearId: ay1.id,
          classId: classG10.id,
          className: 'Class 10 (CBSE X)',
          sectionId: sec10A.id,
          sectionName: 'Section A',
          subjectId: subPhysics.id,
          subjectName: 'Science & Physics',
          teacherId: 'tch_rajesh',
          teacherName: 'Dr. Rajesh Kulkarni',
          title: 'Practical Lab Viva: Verification of Ohm\'s Law',
          assessmentType: 'practical',
          date: '2025-06-20',
          maximumMarks: 20,
          passingMarks: 7,
          weightagePercentage: 10,
          status: 'completed',
          createdAt: now
        }
      ];

      for (const assm of assessmentSeed) {
        await FirebaseService.setDocument('assessments', assm.id, assm);
      }

      // G. Examination Management & Schedules
      const examSeed: Examination[] = [
        {
          id: 'exam_term1_2025',
          tenantId: tenant1.id,
          academicYearId: ay1.id,
          name: 'Term 1 Half-Yearly Examination (CBSE Pattern)',
          code: 'EX-2025-T1',
          examType: 'half_yearly',
          startDate: '2025-09-15',
          endDate: '2025-09-26',
          applicableClassIds: [classG9.id, classG10.id, classG11.id, classG12.id],
          status: 'completed',
          description: 'Official CBSE mid-term comprehensive assessment covering 50% NCERT curriculum with standardized question papers.',
          createdAt: now,
          updatedAt: now
        },
        {
          id: 'exam_preboard_2026',
          tenantId: tenant1.id,
          academicYearId: ay1.id,
          name: 'Pre-Board Examination Series 1',
          code: 'EX-2026-PB1',
          examType: 'pre_board',
          startDate: '2026-01-10',
          endDate: '2026-01-22',
          applicableClassIds: [classG10.id, classG12.id],
          status: 'scheduled',
          description: 'Full syllabus preparatory exam simulating All India Secondary School Examination (AISSE).',
          createdAt: now,
          updatedAt: now
        }
      ];

      for (const ex of examSeed) {
        await FirebaseService.setDocument('examinations', ex.id, ex);
      }

      const examSchedulesSeed: ExamSchedule[] = [
        { id: 'esch_01', examinationId: 'exam_term1_2025', tenantId: tenant1.id, classId: classG10.id, className: 'Class 10 (CBSE X)', sectionId: sec10A.id, sectionName: 'Section A', subjectId: subMath.id, subjectName: 'Mathematics (NCERT)', subjectCode: 'MTH-041', date: '2025-09-15', startTime: '09:00 AM', endTime: '12:00 PM', roomNumber: 'Examination Hall A (Auditorium)', maximumMarks: 80, passingMarks: 27, invigilatorTeacherId: 'tch_amit', invigilatorName: 'Mr. Amit Verma' },
        { id: 'esch_02', examinationId: 'exam_term1_2025', tenantId: tenant1.id, classId: classG10.id, className: 'Class 10 (CBSE X)', sectionId: sec10A.id, sectionName: 'Section A', subjectId: subPhysics.id, subjectName: 'Science Theory', subjectCode: 'SCI-086', date: '2025-09-18', startTime: '09:00 AM', endTime: '12:00 PM', roomNumber: 'Examination Hall A', maximumMarks: 80, passingMarks: 27, invigilatorTeacherId: 'tch_sunita', invigilatorName: 'Dr. Sunita Deshmukh' },
        { id: 'esch_03', examinationId: 'exam_term1_2025', tenantId: tenant1.id, classId: classG10.id, className: 'Class 10 (CBSE X)', sectionId: sec10A.id, sectionName: 'Section A', subjectId: subEng.id, subjectName: 'English Language & Literature', subjectCode: 'ENG-184', date: '2025-09-22', startTime: '09:00 AM', endTime: '12:00 PM', roomNumber: 'Examination Hall A', maximumMarks: 80, passingMarks: 27, invigilatorTeacherId: 'tch_rajesh', invigilatorName: 'Dr. Rajesh Kulkarni' },
        { id: 'esch_04', examinationId: 'exam_term1_2025', tenantId: tenant1.id, classId: classG10.id, className: 'Class 10 (CBSE X)', sectionId: sec10A.id, sectionName: 'Section A', subjectId: subSocial.id, subjectName: 'Social Science', subjectCode: 'SST-087', date: '2025-09-24', startTime: '09:00 AM', endTime: '12:00 PM', roomNumber: 'Examination Hall A', maximumMarks: 80, passingMarks: 27, invigilatorTeacherId: 'tch_ananya', invigilatorName: 'Mrs. Ananya Sharma' },
        { id: 'esch_05', examinationId: 'exam_term1_2025', tenantId: tenant1.id, classId: classG10.id, className: 'Class 10 (CBSE X)', sectionId: sec10A.id, sectionName: 'Section A', subjectId: subHindi.id, subjectName: 'Hindi Course A', subjectCode: 'HIN-002', date: '2025-09-26', startTime: '09:00 AM', endTime: '12:00 PM', roomNumber: 'Examination Hall A', maximumMarks: 80, passingMarks: 27, invigilatorTeacherId: 'tch_amit', invigilatorName: 'Mr. Amit Verma' }
      ];

      for (const esch of examSchedulesSeed) {
        await FirebaseService.setDocument('examination_schedules', esch.id, esch);
      }

      // H. Marks Entries with Multi-Stage Workflow
      const marksSeed: MarkEntry[] = [
        // Aarav Sharma (stu_001)
        { id: 'mark_t1_mth_001', tenantId: tenant1.id, academicYearId: ay1.id, examinationId: 'exam_term1_2025', examScheduleId: 'esch_01', classId: classG10.id, className: 'Class 10 (CBSE X)', sectionId: sec10A.id, sectionName: 'Section A', subjectId: subMath.id, subjectName: 'Mathematics', studentId: 'stu_001', studentName: 'Aarav Sharma', rollNumber: '10A-01', marksObtained: 76, maximumMarks: 80, attendanceStatus: 'present', status: 'PUBLISHED', enteredBy: 'Dr. Sunita Deshmukh', enteredAt: '2025-09-28T10:00:00Z', verifiedBy: 'Dr. Meenakshi Sundaram', verifiedAt: '2025-09-29T12:00:00Z', approvedBy: 'Dr. Meenakshi Sundaram', approvedAt: '2025-09-30T10:00:00Z', publishedAt: '2025-10-01T09:00:00Z', remarks: 'Exceptional proofs in geometry and trigonometry.' },
        { id: 'mark_t1_phy_001', tenantId: tenant1.id, academicYearId: ay1.id, examinationId: 'exam_term1_2025', examScheduleId: 'esch_02', classId: classG10.id, className: 'Class 10 (CBSE X)', sectionId: sec10A.id, sectionName: 'Section A', subjectId: subPhysics.id, subjectName: 'Science Theory', studentId: 'stu_001', studentName: 'Aarav Sharma', rollNumber: '10A-01', marksObtained: 74, maximumMarks: 80, attendanceStatus: 'present', status: 'PUBLISHED', enteredBy: 'Dr. Rajesh Kulkarni', enteredAt: '2025-09-28T11:00:00Z', verifiedBy: 'Dr. Meenakshi Sundaram', approvedBy: 'Dr. Meenakshi Sundaram', publishedAt: '2025-10-01T09:00:00Z', remarks: 'Clear ray diagrams and numerical solutions.' },
        { id: 'mark_t1_eng_001', tenantId: tenant1.id, academicYearId: ay1.id, examinationId: 'exam_term1_2025', examScheduleId: 'esch_03', classId: classG10.id, className: 'Class 10 (CBSE X)', sectionId: sec10A.id, sectionName: 'Section A', subjectId: subEng.id, subjectName: 'English Literature', studentId: 'stu_001', studentName: 'Aarav Sharma', rollNumber: '10A-01', marksObtained: 72, maximumMarks: 80, attendanceStatus: 'present', status: 'PUBLISHED', enteredBy: 'Mrs. Ananya Sharma', enteredAt: '2025-09-28T12:00:00Z', verifiedBy: 'Dr. Meenakshi Sundaram', approvedBy: 'Dr. Meenakshi Sundaram', publishedAt: '2025-10-01T09:00:00Z', remarks: 'Articulate writing style.' },
        { id: 'mark_t1_soc_001', tenantId: tenant1.id, academicYearId: ay1.id, examinationId: 'exam_term1_2025', examScheduleId: 'esch_04', classId: classG10.id, className: 'Class 10 (CBSE X)', sectionId: sec10A.id, sectionName: 'Section A', subjectId: subSocial.id, subjectName: 'Social Science', studentId: 'stu_001', studentName: 'Aarav Sharma', rollNumber: '10A-01', marksObtained: 75, maximumMarks: 80, attendanceStatus: 'present', status: 'PUBLISHED', enteredBy: 'Mr. Amit Verma', enteredAt: '2025-09-28T14:00:00Z', verifiedBy: 'Dr. Meenakshi Sundaram', approvedBy: 'Dr. Meenakshi Sundaram', publishedAt: '2025-10-01T09:00:00Z', remarks: 'Accurate map pointing and historical arguments.' },
        { id: 'mark_t1_hin_001', tenantId: tenant1.id, academicYearId: ay1.id, examinationId: 'exam_term1_2025', examScheduleId: 'esch_05', classId: classG10.id, className: 'Class 10 (CBSE X)', sectionId: sec10A.id, sectionName: 'Section A', subjectId: subHindi.id, subjectName: 'Hindi Course A', studentId: 'stu_001', studentName: 'Aarav Sharma', rollNumber: '10A-01', marksObtained: 71, maximumMarks: 80, attendanceStatus: 'present', status: 'PUBLISHED', enteredBy: 'Mrs. Ananya Sharma', enteredAt: '2025-09-28T15:00:00Z', verifiedBy: 'Dr. Meenakshi Sundaram', approvedBy: 'Dr. Meenakshi Sundaram', publishedAt: '2025-10-01T09:00:00Z', remarks: 'Good grasp of grammar.' },

        // Ananya Verma (stu_002)
        { id: 'mark_t1_mth_002', tenantId: tenant1.id, academicYearId: ay1.id, examinationId: 'exam_term1_2025', examScheduleId: 'esch_01', classId: classG10.id, className: 'Class 10 (CBSE X)', sectionId: sec10A.id, sectionName: 'Section A', subjectId: subMath.id, subjectName: 'Mathematics', studentId: 'stu_002', studentName: 'Ananya Verma', rollNumber: '10A-02', marksObtained: 78, maximumMarks: 80, attendanceStatus: 'present', status: 'PUBLISHED', enteredBy: 'Dr. Sunita Deshmukh', enteredAt: '2025-09-28T10:00:00Z', verifiedBy: 'Dr. Meenakshi Sundaram', approvedBy: 'Dr. Meenakshi Sundaram', publishedAt: '2025-10-01T09:00:00Z', remarks: 'Near perfect algebra computation.' },
        { id: 'mark_t1_phy_002', tenantId: tenant1.id, academicYearId: ay1.id, examinationId: 'exam_term1_2025', examScheduleId: 'esch_02', classId: classG10.id, className: 'Class 10 (CBSE X)', sectionId: sec10A.id, sectionName: 'Section A', subjectId: subPhysics.id, subjectName: 'Science Theory', studentId: 'stu_002', studentName: 'Ananya Verma', rollNumber: '10A-02', marksObtained: 77, maximumMarks: 80, attendanceStatus: 'present', status: 'PUBLISHED', enteredBy: 'Dr. Rajesh Kulkarni', enteredAt: '2025-09-28T11:00:00Z', verifiedBy: 'Dr. Meenakshi Sundaram', approvedBy: 'Dr. Meenakshi Sundaram', publishedAt: '2025-10-01T09:00:00Z', remarks: 'Flawless experiment analysis.' },
        { id: 'mark_t1_eng_002', tenantId: tenant1.id, academicYearId: ay1.id, examinationId: 'exam_term1_2025', examScheduleId: 'esch_03', classId: classG10.id, className: 'Class 10 (CBSE X)', sectionId: sec10A.id, sectionName: 'Section A', subjectId: subEng.id, subjectName: 'English Literature', studentId: 'stu_002', studentName: 'Ananya Verma', rollNumber: '10A-02', marksObtained: 76, maximumMarks: 80, attendanceStatus: 'present', status: 'PUBLISHED', enteredBy: 'Mrs. Ananya Sharma', enteredAt: '2025-09-28T12:00:00Z', verifiedBy: 'Dr. Meenakshi Sundaram', approvedBy: 'Dr. Meenakshi Sundaram', publishedAt: '2025-10-01T09:00:00Z', remarks: 'Superb creative composition.' },
        { id: 'mark_t1_soc_002', tenantId: tenant1.id, academicYearId: ay1.id, examinationId: 'exam_term1_2025', examScheduleId: 'esch_04', classId: classG10.id, className: 'Class 10 (CBSE X)', sectionId: sec10A.id, sectionName: 'Section A', subjectId: subSocial.id, subjectName: 'Social Science', studentId: 'stu_002', studentName: 'Ananya Verma', rollNumber: '10A-02', marksObtained: 79, maximumMarks: 80, attendanceStatus: 'present', status: 'PUBLISHED', enteredBy: 'Mr. Amit Verma', enteredAt: '2025-09-28T14:00:00Z', verifiedBy: 'Dr. Meenakshi Sundaram', approvedBy: 'Dr. Meenakshi Sundaram', publishedAt: '2025-10-01T09:00:00Z', remarks: 'Highest score in social sciences.' },
        { id: 'mark_t1_hin_002', tenantId: tenant1.id, academicYearId: ay1.id, examinationId: 'exam_term1_2025', examScheduleId: 'esch_05', classId: classG10.id, className: 'Class 10 (CBSE X)', sectionId: sec10A.id, sectionName: 'Section A', subjectId: subHindi.id, subjectName: 'Hindi Course A', studentId: 'stu_002', studentName: 'Ananya Verma', rollNumber: '10A-02', marksObtained: 75, maximumMarks: 80, attendanceStatus: 'present', status: 'PUBLISHED', enteredBy: 'Mrs. Ananya Sharma', enteredAt: '2025-09-28T15:00:00Z', verifiedBy: 'Dr. Meenakshi Sundaram', approvedBy: 'Dr. Meenakshi Sundaram', publishedAt: '2025-10-01T09:00:00Z', remarks: 'Excellent expression.' },

        // Rohan Gupta (stu_003)
        { id: 'mark_t1_mth_003', tenantId: tenant1.id, academicYearId: ay1.id, examinationId: 'exam_term1_2025', examScheduleId: 'esch_01', classId: classG10.id, className: 'Class 10 (CBSE X)', sectionId: sec10A.id, sectionName: 'Section A', subjectId: subMath.id, subjectName: 'Mathematics', studentId: 'stu_003', studentName: 'Rohan Gupta', rollNumber: '10A-03', marksObtained: 68, maximumMarks: 80, attendanceStatus: 'present', status: 'PUBLISHED', enteredBy: 'Dr. Sunita Deshmukh', enteredAt: '2025-09-28T10:00:00Z', verifiedBy: 'Dr. Meenakshi Sundaram', approvedBy: 'Dr. Meenakshi Sundaram', publishedAt: '2025-10-01T09:00:00Z', remarks: 'Good performance, can improve quadratic equations.' },
        { id: 'mark_t1_phy_003', tenantId: tenant1.id, academicYearId: ay1.id, examinationId: 'exam_term1_2025', examScheduleId: 'esch_02', classId: classG10.id, className: 'Class 10 (CBSE X)', sectionId: sec10A.id, sectionName: 'Section A', subjectId: subPhysics.id, subjectName: 'Science Theory', studentId: 'stu_003', studentName: 'Rohan Gupta', rollNumber: '10A-03', marksObtained: 65, maximumMarks: 80, attendanceStatus: 'present', status: 'PUBLISHED', enteredBy: 'Dr. Rajesh Kulkarni', enteredAt: '2025-09-28T11:00:00Z', verifiedBy: 'Dr. Meenakshi Sundaram', approvedBy: 'Dr. Meenakshi Sundaram', publishedAt: '2025-10-01T09:00:00Z', remarks: 'Solid conceptual understanding.' }
      ];

      for (const m of marksSeed) {
        await FirebaseService.setDocument('mark_entries', m.id, m);
      }

      // I. Grading Schemes (CBSE 9-Point Grading Scheme)
      const gradingSchemeSeed: GradingScheme = {
        id: 'gs_cbse_default',
        tenantId: tenant1.id,
        name: 'CBSE 9-Point National Grading Scale',
        isDefault: true,
        rules: [
          { minPercentage: 91, maxPercentage: 100, grade: 'A1', gradePoint: 10.0, description: 'Top 1/8th of passed candidates (Outstanding)', isPassing: true },
          { minPercentage: 81, maxPercentage: 90, grade: 'A2', gradePoint: 9.0, description: 'Next 1/8th of passed candidates (Excellent)', isPassing: true },
          { minPercentage: 71, maxPercentage: 80, grade: 'B1', gradePoint: 8.0, description: 'Next 1/8th of passed candidates (Very Good)', isPassing: true },
          { minPercentage: 61, maxPercentage: 70, grade: 'B2', gradePoint: 7.0, description: 'Next 1/8th of passed candidates (Good)', isPassing: true },
          { minPercentage: 51, maxPercentage: 60, grade: 'C1', gradePoint: 6.0, description: 'Next 1/8th of passed candidates (Above Average)', isPassing: true },
          { minPercentage: 41, maxPercentage: 50, grade: 'C2', gradePoint: 5.0, description: 'Next 1/8th of passed candidates (Average)', isPassing: true },
          { minPercentage: 33, maxPercentage: 40, grade: 'D', gradePoint: 4.0, description: 'Passing Boundary (Satisfactory)', isPassing: true },
          { minPercentage: 21, maxPercentage: 32, grade: 'E1', gradePoint: 0.0, description: 'Essential Repeat / Remedial Required', isPassing: false },
          { minPercentage: 0, maxPercentage: 20, grade: 'E2', gradePoint: 0.0, description: 'Failed / Comprehensive Re-evaluation', isPassing: false }
        ],
        createdAt: now
      };
      await FirebaseService.setDocument('grading_schemes', gradingSchemeSeed.id, gradingSchemeSeed);

      // J. Report Cards
      const reportCardsSeed: ReportCard[] = [
        {
          id: 'rc_exam_term1_2025_stu_001',
          tenantId: tenant1.id,
          academicYearId: ay1.id,
          academicYearName: 'Academic Session 2025–2026',
          studentId: 'stu_001',
          studentName: 'Aarav Sharma',
          rollNumber: '10A-01',
          classId: classG10.id,
          className: 'Class 10 (CBSE X)',
          sectionId: sec10A.id,
          sectionName: 'Section A - Science & Maths',
          examinationId: 'exam_term1_2025',
          examinationName: 'Term 1 Half-Yearly Examination',
          subjects: [
            { subjectId: subMath.id, subjectName: 'Mathematics', subjectCode: 'MTH-041', maxMarks: 80, marksObtained: 76, grade: 'A1', gradePoint: 10.0, teacherRemarks: 'High aptitude in problem solving' },
            { subjectId: subPhysics.id, subjectName: 'Science Theory & Lab', subjectCode: 'SCI-086', maxMarks: 80, marksObtained: 74, grade: 'A1', gradePoint: 10.0, teacherRemarks: 'Excellent lab skills' },
            { subjectId: subEng.id, subjectName: 'English Literature', subjectCode: 'ENG-184', maxMarks: 80, marksObtained: 72, grade: 'A2', gradePoint: 9.0, teacherRemarks: 'Creative and articulate' },
            { subjectId: subSocial.id, subjectName: 'Social Science', subjectCode: 'SST-087', maxMarks: 80, marksObtained: 75, grade: 'A1', gradePoint: 10.0, teacherRemarks: 'Thorough analytical grasp' },
            { subjectId: subHindi.id, subjectName: 'Hindi Course A', subjectCode: 'HIN-002', maxMarks: 80, marksObtained: 71, grade: 'A2', gradePoint: 9.0, teacherRemarks: 'Good linguistic expression' }
          ],
          totalMaxMarks: 400,
          totalMarksObtained: 368,
          percentage: 92.0,
          overallGrade: 'A1',
          overallGradePoint: 9.6,
          overallResult: 'DISTINCTION',
          attendancePercentage: 96.5,
          workingDays: 115,
          presentDays: 111,
          classTeacherRemarks: 'Aarav has consistently maintained scholastic excellence and actively participates in Math and Science club forums.',
          principalRemarks: 'Promoted with high distinction. Commendable academic discipline.',
          status: 'PUBLISHED',
          generatedAt: '2025-09-30T10:00:00Z',
          verifiedBy: 'Dr. Meenakshi Sundaram',
          approvedBy: 'Dr. Meenakshi Sundaram',
          publishedAt: '2025-10-01T09:00:00Z'
        },
        {
          id: 'rc_exam_term1_2025_stu_002',
          tenantId: tenant1.id,
          academicYearId: ay1.id,
          academicYearName: 'Academic Session 2025–2026',
          studentId: 'stu_002',
          studentName: 'Ananya Verma',
          rollNumber: '10A-02',
          classId: classG10.id,
          className: 'Class 10 (CBSE X)',
          sectionId: sec10A.id,
          sectionName: 'Section A - Science & Maths',
          examinationId: 'exam_term1_2025',
          examinationName: 'Term 1 Half-Yearly Examination',
          subjects: [
            { subjectId: subMath.id, subjectName: 'Mathematics', subjectCode: 'MTH-041', maxMarks: 80, marksObtained: 78, grade: 'A1', gradePoint: 10.0, teacherRemarks: 'Outstanding computational speed' },
            { subjectId: subPhysics.id, subjectName: 'Science Theory & Lab', subjectCode: 'SCI-086', maxMarks: 80, marksObtained: 77, grade: 'A1', gradePoint: 10.0, teacherRemarks: 'Top practical investigator' },
            { subjectId: subEng.id, subjectName: 'English Literature', subjectCode: 'ENG-184', maxMarks: 80, marksObtained: 76, grade: 'A1', gradePoint: 10.0, teacherRemarks: 'Exceptional literary analysis' },
            { subjectId: subSocial.id, subjectName: 'Social Science', subjectCode: 'SST-087', maxMarks: 80, marksObtained: 79, grade: 'A1', gradePoint: 10.0, teacherRemarks: 'Class topper in SST' },
            { subjectId: subHindi.id, subjectName: 'Hindi Course A', subjectCode: 'HIN-002', maxMarks: 80, marksObtained: 75, grade: 'A1', gradePoint: 10.0, teacherRemarks: 'Fluent and precise' }
          ],
          totalMaxMarks: 400,
          totalMarksObtained: 385,
          percentage: 96.25,
          overallGrade: 'A1',
          overallGradePoint: 10.0,
          overallResult: 'DISTINCTION',
          attendancePercentage: 98.2,
          workingDays: 115,
          presentDays: 113,
          classTeacherRemarks: 'Ananya ranks #1 in the cohort with exemplary academic and co-curricular achievements.',
          principalRemarks: 'Highest institutional commendation. Exceptional performance across all CBSE disciplines.',
          status: 'PUBLISHED',
          generatedAt: '2025-09-30T10:00:00Z',
          verifiedBy: 'Dr. Meenakshi Sundaram',
          approvedBy: 'Dr. Meenakshi Sundaram',
          publishedAt: '2025-10-01T09:00:00Z'
        }
      ];

      for (const rc of reportCardsSeed) {
        await FirebaseService.setDocument('report_cards', rc.id, rc);
      }

      // K. Promotion Records & Batch Rollovers
      const promotionBatchSeed: PromotionBatch = {
        id: 'pb_2024_2025_g9_to_g10',
        tenantId: tenant1.id,
        fromAcademicYearId: 'ay_2024_2025',
        fromAcademicYearName: 'Academic Session 2024–2025',
        toAcademicYearId: ay1.id,
        toAcademicYearName: 'Academic Session 2025–2026',
        fromClassId: classG9.id,
        fromClassName: 'Class 9',
        toClassId: classG10.id,
        toClassName: 'Class 10 (CBSE X)',
        promotedBy: 'principal@dpsrkp.edu.in',
        promotedAt: '2025-03-28T16:00:00Z',
        totalStudents: 32,
        promotedCount: 31,
        retainedCount: 0,
        conditionalCount: 1,
        status: 'completed'
      };
      await FirebaseService.setDocument('promotion_batches', promotionBatchSeed.id, promotionBatchSeed);

      const promotionRecordSeed: PromotionRecord = {
        id: 'prec_01',
        batchId: promotionBatchSeed.id,
        studentId: 'stu_001',
        studentName: 'Aarav Sharma',
        rollNumber: '09A-01',
        fromClassId: classG9.id,
        fromClassName: 'Class 9',
        fromSectionId: 'sec_09a',
        fromSectionName: 'Section A',
        toClassId: classG10.id,
        toClassName: 'Class 10 (CBSE X)',
        toSectionId: sec10A.id,
        toSectionName: 'Section A - Science & Maths',
        status: 'PROMOTED',
        percentage: 91.5,
        remarks: 'Promoted to Secondary Board Grade with First Division Distinction',
        promotedAt: '2025-03-28T16:00:00Z'
      };
      await FirebaseService.setDocument('promotion_records', promotionRecordSeed.id, promotionRecordSeed);

      // 7. Initial Immutable Audit Trail
      const auditSeed: AuditRecord[] = [
        {
          id: 'aud_seed_01',
          tenantId: 'ALL',
          tenantName: 'National Platform Central',
          userId: 'usr_super_admin',
          userEmail: 'superadmin@edutech-sms.internal',
          userDisplayName: 'Vikramaditya Singhania',
          action: 'SECURITY_CONFIG_CHANGED',
          resource: 'security',
          resourceId: 'sys_init',
          resourceName: 'EduTech-SMS National Platform Bootstrap',
          timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
          ipAddress: '127.0.0.1',
          userAgent: 'System Genesis Engine India',
          result: 'SUCCESS',
          notes: 'Multi-tenant Indian educational database schemas and CBSE security baseline configured.'
        },
        {
          id: 'aud_seed_02',
          tenantId: tenant1.id,
          tenantName: tenant1.name,
          userId: 'usr_principal_dps',
          userEmail: 'principal@dpsrkp.edu.in',
          userDisplayName: 'Dr. Meenakshi Sundaram',
          action: 'TENANT_CREATED',
          resource: 'tenant',
          resourceId: tenant1.id,
          resourceName: tenant1.name,
          timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
          ipAddress: '103.21.124.50',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          result: 'SUCCESS',
          notes: 'Institution provisioned with CBSE Affiliation and Senior Secondary Campus'
        },
        {
          id: 'aud_seed_03',
          tenantId: tenant1.id,
          tenantName: tenant1.name,
          userId: 'usr_principal_dps',
          userEmail: 'principal@dpsrkp.edu.in',
          userDisplayName: 'Dr. Meenakshi Sundaram',
          action: 'MODULE_ENABLED',
          resource: 'module',
          resourceId: 'mod_attendance',
          resourceName: 'Daily CBSE Attendance & Roster Tracking',
          timestamp: new Date(Date.now() - 3600000 * 6).toISOString(),
          ipAddress: '103.21.124.50',
          result: 'SUCCESS',
          notes: 'Plug-and-play attendance module activated'
        }
      ];

      for (const a of auditSeed) {
        await FirebaseService.setDocument('audit_logs', a.id, a);
      }

      console.log('Multi-tenant EduTech-SMS India seed completed successfully.');
      return true;
    } catch (e) {
      console.error('Error during Indian data bootstrap:', e);
      return false;
    }
  }
}
