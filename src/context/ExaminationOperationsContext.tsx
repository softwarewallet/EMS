import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  AcademicYear,
  ClassGrade,
  Section,
  Subject,
  TeacherProfile,
  Student,
  StudentEnrollment,
  User
} from '../types';
import { ExaminationService } from '../services/academicManagementService';
import { AcademicService } from '../services/academicService';
import { TeacherService } from '../services/academicManagementService';
import { StudentService } from '../services/studentService';
import { UserService } from '../services/userService';
import { FirebaseService } from '../services/firebaseService';

export interface AuthoritativeExam {
  id: string;
  examinationId?: string;
  name: string;
  code?: string;
  academicYearId: string;
  status: string;
  startDate?: string;
  endDate?: string;
  classIds?: string[];
  sectionIds?: string[];
  components?: any[];
  [key: string]: any;
}

export interface TeacherOption {
  id: string;
  name: string;
  employeeId?: string;
  email?: string;
  department?: string;
}

interface ExaminationOperationsContextType {
  tenantId: string;
  campusId: string;
  setCampusId: (campusId: string) => void;
  availableExaminations: AuthoritativeExam[];
  selectedExaminationId: string;
  selectedExamination: AuthoritativeExam | null;
  setSelectedExaminationId: (id: string) => void;
  academicYears: AcademicYear[];
  selectedAcademicYear: AcademicYear | null;
  classes: ClassGrade[];
  sections: Section[];
  subjects: Subject[];
  teachers: TeacherOption[];
  students: Student[];
  enrollments: StudentEnrollment[];
  loading: boolean;
  isLoading: boolean;
  error: string | null;
  refreshContext: () => Promise<void>;
  selectExamination: (id: string) => void;
  selectAcademicYear: (id: string) => void;
  // Helpers
  getClassName: (classId: string) => string;
  getSectionName: (sectionId: string) => string;
  getSubjectName: (subjectId: string) => string;
  getTeacherName: (teacherId: string) => string;
  getStudentName: (studentId: string) => string;
  getEnrolledStudents: (classId?: string, sectionId?: string) => { student: Student; enrollment?: StudentEnrollment }[];
}

const ExaminationOperationsContext = createContext<ExaminationOperationsContextType | undefined>(undefined);

export const ExaminationOperationsProvider: React.FC<{
  tenantId: string;
  initialCampusId?: string;
  children: React.ReactNode;
}> = ({ tenantId, initialCampusId = 'campus_main', children }) => {
  const [campusId, setCampusId] = useState<string>(initialCampusId);
  const [availableExaminations, setAvailableExaminations] = useState<AuthoritativeExam[]>([]);
  const [selectedExaminationId, setSelectedExaminationId] = useState<string>('');
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [classes, setClasses] = useState<ClassGrade[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<TeacherOption[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [enrollments, setEnrollments] = useState<StudentEnrollment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadAuthoritativeData = useCallback(async () => {
    if (!tenantId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch Examinations
      const [rawExams, ayList, clsList, secList, subList, tchList, usrList, stdList, enrList] = await Promise.all([
        ExaminationService.getExaminations(tenantId).catch(() => []),
        AcademicService.getAcademicYears(tenantId).catch(() => []),
        AcademicService.getClasses(tenantId).catch(() => []),
        AcademicService.getSections(tenantId).catch(() => []),
        AcademicService.getSubjects(tenantId).catch(() => []),
        TeacherService.getTeachers(tenantId).catch(() => []),
        UserService.getUsers(tenantId).catch(() => []),
        StudentService.getStudents(tenantId).catch(() => []),
        FirebaseService.getTenantCollection<StudentEnrollment>('enrollments', tenantId).catch(() => [])
      ]);

      // Normalize examinations so id is always accessible
      const normalizedExams: AuthoritativeExam[] = (rawExams || []).map((e: any) => ({
        ...e,
        id: e.id || e.examinationId || '',
        name: e.name || 'Untitled Examination',
        academicYearId: e.academicYearId || ''
      }));

      setAvailableExaminations(normalizedExams);
      setAcademicYears(ayList || []);
      setClasses(clsList || []);
      setSections(secList || []);
      setSubjects(subList || []);
      setStudents(stdList || []);
      setEnrollments(enrList || []);

      // Build Teacher Options mapping profiles to users
      const teacherOptions: TeacherOption[] = [];
      const userMap = new Map((usrList || []).map(u => [u.id, u]));

      if (tchList && tchList.length > 0) {
        for (const tch of tchList) {
          const user = tch.userId ? userMap.get(tch.userId) : null;
          teacherOptions.push({
            id: tch.id,
            name: user?.displayName || user?.email || `Teacher (${tch.employeeId})`,
            employeeId: tch.employeeId,
            email: tch.email || user?.email,
            department: tch.department
          });
        }
      } else {
        // Fallback: list users with teacher/staff roles
        for (const user of usrList || []) {
          const isStaff = user.roleAssignments?.some((r: any) =>
            ['teacher', 'academic_coordinator', 'admin', 'principal'].includes(r.roleCode)
          ) || user.role === 'teacher' || user.role === 'staff' || user.role === 'admin';
          if (isStaff) {
            teacherOptions.push({
              id: user.id,
              name: user.displayName || user.email || 'Staff Member',
              email: user.email
            });
          }
        }
      }
      setTeachers(teacherOptions);

      // Set initial selected examination
      if (normalizedExams.length > 0) {
        setSelectedExaminationId(prev => {
          if (prev && normalizedExams.some(e => e.id === prev)) {
            return prev;
          }
          return normalizedExams[0].id;
        });
      } else {
        setSelectedExaminationId('');
      }
    } catch (err: any) {
      console.error('Failed to load authoritative examination context data:', err);
      setError(err.message || 'Failed to load master operational context.');
    } finally {
      setLoading(false);
    }
  }, [tenantId]);

  useEffect(() => {
    loadAuthoritativeData();
  }, [loadAuthoritativeData]);

  const selectedExamination = availableExaminations.find(e => e.id === selectedExaminationId) || null;
  const selectedAcademicYear = academicYears.find(ay => ay.id === selectedExamination?.academicYearId) || null;

  // Helper lookup functions
  const getClassName = useCallback(
    (classId: string): string => {
      const found = classes.find(c => c.id === classId);
      return found ? found.name : classId || 'Unassigned Class';
    },
    [classes]
  );

  const getSectionName = useCallback(
    (sectionId: string): string => {
      const found = sections.find(s => s.id === sectionId);
      return found ? found.name : sectionId || 'Unassigned Section';
    },
    [sections]
  );

  const getSubjectName = useCallback(
    (subjectId: string): string => {
      const found = subjects.find(s => s.id === subjectId);
      return found ? found.name : subjectId || 'Unassigned Subject';
    },
    [subjects]
  );

  const getTeacherName = useCallback(
    (teacherId: string): string => {
      const found = teachers.find(t => t.id === teacherId);
      return found ? found.name : teacherId || 'Unassigned Staff';
    },
    [teachers]
  );

  const getStudentName = useCallback(
    (studentId: string): string => {
      const found = students.find(s => s.id === studentId);
      return found ? `${found.firstName} ${found.lastName}`.trim() : studentId || 'Unassigned Student';
    },
    [students]
  );

  const getEnrolledStudents = useCallback(
    (classId?: string, sectionId?: string) => {
      const targetAyId = selectedAcademicYear?.id;
      return students
        .filter(st => {
          if (classId && st.currentClassId && st.currentClassId !== classId) return false;
          if (sectionId && st.currentSectionId && st.currentSectionId !== sectionId) return false;
          return true;
        })
        .map(st => {
          const enr = enrollments.find(e => e.studentId === st.id && (!targetAyId || e.academicYearId === targetAyId));
          return {
            student: st,
            enrollment: enr
          };
        });
    },
    [students, enrollments, selectedAcademicYear]
  );

  return (
    <ExaminationOperationsContext.Provider
      value={{
        tenantId,
        campusId,
        setCampusId,
        availableExaminations,
        selectedExaminationId,
        selectedExamination,
        setSelectedExaminationId,
        academicYears,
        selectedAcademicYear,
        classes,
        sections,
        subjects,
        teachers,
        students,
        enrollments,
        loading,
        isLoading: loading,
        error,
        refreshContext: loadAuthoritativeData,
        selectExamination: (id: string) => setSelectedExaminationId(id),
        selectAcademicYear: (ayId: string) => {
          const matchedExam = availableExaminations.find(e => e.academicYearId === ayId);
          if (matchedExam) {
            setSelectedExaminationId(matchedExam.id);
          }
        },
        getClassName,
        getSectionName,
        getSubjectName,
        getTeacherName,
        getStudentName,
        getEnrolledStudents
      }}
    >
      {children}
    </ExaminationOperationsContext.Provider>
  );
};

export const useExaminationOperations = (): ExaminationOperationsContextType => {
  const context = useContext(ExaminationOperationsContext);
  if (!context) {
    throw new Error('useExaminationOperations must be used within an ExaminationOperationsProvider');
  }
  return context;
};
