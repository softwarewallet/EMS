import { AcademicYear, ClassGrade, Section, Subject } from '../types';
import { FirebaseService } from './firebaseService';
import { AuditService } from './auditService';

const ACADEMIC_YEARS_COL = 'academic_years';
const CLASSES_COL = 'classes';
const SECTIONS_COL = 'sections';
const SUBJECTS_COL = 'subjects';

export class AcademicService {
  // Academic Years
  static async getAcademicYears(tenantId: string): Promise<AcademicYear[]> {
    return FirebaseService.getTenantCollection<AcademicYear>(ACADEMIC_YEARS_COL, tenantId);
  }

  static async createAcademicYear(
    year: Omit<AcademicYear, 'id'>,
    performedBy: { userId: string; email: string; name: string }
  ): Promise<AcademicYear> {
    const id = FirebaseService.generateId('ay');
    const newYear: AcademicYear = { ...year, id };
    await FirebaseService.setDocument(ACADEMIC_YEARS_COL, id, newYear);

    await AuditService.log({
      tenantId: year.tenantId,
      userId: performedBy.userId,
      userEmail: performedBy.email,
      userDisplayName: performedBy.name,
      action: 'ACADEMIC_YEAR_CREATED',
      resource: 'academic',
      resourceId: id,
      resourceName: year.name,
      newValue: newYear,
      result: 'SUCCESS'
    });

    return newYear;
  }

  // Classes / Grades
  static async getClasses(tenantId: string): Promise<ClassGrade[]> {
    const classes = await FirebaseService.getTenantCollection<ClassGrade>(CLASSES_COL, tenantId);
    return classes.sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  static async createClass(
    classData: Omit<ClassGrade, 'id'>,
    performedBy: { userId: string; email: string; name: string }
  ): Promise<ClassGrade> {
    const id = FirebaseService.generateId('cls_grd');
    const newClass: ClassGrade = { ...classData, id };
    await FirebaseService.setDocument(CLASSES_COL, id, newClass);

    await AuditService.log({
      tenantId: classData.tenantId,
      userId: performedBy.userId,
      userEmail: performedBy.email,
      userDisplayName: performedBy.name,
      action: 'CLASS_CREATED',
      resource: 'academic',
      resourceId: id,
      resourceName: classData.name,
      newValue: newClass,
      result: 'SUCCESS'
    });

    return newClass;
  }

  // Sections
  static async getSections(tenantId: string, classId?: string): Promise<Section[]> {
    const allSections = await FirebaseService.getTenantCollection<Section>(SECTIONS_COL, tenantId);
    if (classId) {
      return allSections.filter(s => s.classId === classId);
    }
    return allSections;
  }

  static async createSection(
    sectionData: Omit<Section, 'id'>,
    performedBy: { userId: string; email: string; name: string }
  ): Promise<Section> {
    const id = FirebaseService.generateId('sec');
    const newSection: Section = { ...sectionData, id };
    await FirebaseService.setDocument(SECTIONS_COL, id, newSection);

    await AuditService.log({
      tenantId: sectionData.tenantId,
      userId: performedBy.userId,
      userEmail: performedBy.email,
      userDisplayName: performedBy.name,
      action: 'SECTION_CREATED',
      resource: 'academic',
      resourceId: id,
      resourceName: sectionData.name,
      newValue: newSection,
      result: 'SUCCESS'
    });

    return newSection;
  }

  // Subjects
  static async getSubjects(tenantId: string): Promise<Subject[]> {
    return FirebaseService.getTenantCollection<Subject>(SUBJECTS_COL, tenantId);
  }

  static async createSubject(subjectData: Omit<Subject, 'id'>): Promise<Subject> {
    const id = FirebaseService.generateId('sbj');
    const newSubject: Subject = { ...subjectData, id };
    await FirebaseService.setDocument(SUBJECTS_COL, id, newSubject);
    return newSubject;
  }
}
