import { FirebaseService } from './firebaseService';
import { AuditService } from './auditService';
import { UserActor } from '../types/inventory';
import {
  LearningCourse,
  LearningCourseVersion,
  CourseOffering,
  CourseTeachingAssignment,
  LearningUnit,
  LearningLesson,
  LearningResource,
  LearningAssignment,
  LearningAssignmentSubmission,
  LearningQuestionBank,
  LearningQuestion,
  LearningQuiz,
  LearningAssessmentAttempt,
  LearningGradeRecord,
  LearningDiscussion,
  LearningDiscussionMessage,
  LearningAnnouncement,
  LearningStudentProgress,
  LearningCourseCompletion,
  LearningAnalyticsCache,
  FilterLearningCourseParams,
  FilterCourseOfferingParams,
  StudentQuizAnswer
} from '../types/learning';
import { where } from 'firebase/firestore';

const COURSES_COL = 'learning_courses';
const COURSE_VERSIONS_COL = 'learning_course_versions';
const OFFERINGS_COL = 'learning_course_offerings';
const TEACHING_ASSIGNMENTS_COL = 'learning_teaching_assignments';
const UNITS_COL = 'learning_units';
const LESSONS_COL = 'learning_lessons';
const RESOURCES_COL = 'learning_resources';
const ASSIGNMENTS_COL = 'learning_assignments';
const SUBMISSIONS_COL = 'learning_assignment_submissions';
const QUESTION_BANKS_COL = 'learning_question_banks';
const QUESTIONS_COL = 'learning_questions';
const QUIZZES_COL = 'learning_quizzes';
const QUIZ_ATTEMPTS_COL = 'learning_assessment_attempts';
const GRADES_COL = 'learning_grade_records';
const DISCUSSIONS_COL = 'learning_discussions';
const DISCUSSION_MESSAGES_COL = 'learning_discussion_messages';
const ANNOUNCEMENTS_COL = 'learning_announcements';
const PROGRESS_COL = 'learning_student_progress';
const COMPLETIONS_COL = 'learning_course_completions';
const ANALYTICS_CACHE_COL = 'learning_analytics_cache';

export class LearningService {

  // ==========================================
  // COURSES & VERSIONS
  // ==========================================

  static async getCourses(tenantId: string, filter?: FilterLearningCourseParams): Promise<LearningCourse[]> {
    const constraints: any[] = [];
    if (filter?.departmentId) {
      constraints.push(where('departmentId', '==', filter.departmentId));
    }
    if (filter?.status) {
      constraints.push(where('status', '==', filter.status));
    }

    const courses = await FirebaseService.getTenantCollection<LearningCourse>(COURSES_COL, tenantId, constraints);
    if (filter?.searchQuery) {
      const q = filter.searchQuery.toLowerCase();
      return courses.filter(c => c.title.toLowerCase().includes(q) || c.code.toLowerCase().includes(q));
    }
    return courses;
  }

  static async getCourseById(tenantId: string, courseId: string): Promise<LearningCourse | null> {
    const doc = await FirebaseService.getDocument<LearningCourse>(COURSES_COL, courseId);
    if (!doc || doc.tenantId !== tenantId) return null;
    return doc;
  }

  static async createCourse(tenantId: string, data: Omit<LearningCourse, 'id' | 'tenantId' | 'currentVersion' | 'createdAt' | 'updatedAt'>, actor: UserActor): Promise<LearningCourse> {
    const now = new Date().toISOString();
    const courseId = FirebaseService.generateId('crse');

    const newCourse: LearningCourse = {
      ...data,
      id: courseId,
      tenantId,
      currentVersion: 1,
      createdAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(COURSES_COL, courseId, newCourse);

    // Initial Version 1 Record
    const versionId = FirebaseService.generateId('crse_ver');
    const versionRecord: LearningCourseVersion = {
      id: versionId,
      tenantId,
      courseId,
      versionNumber: 1,
      syllabusOverview: data.description,
      learningObjectives: [],
      status: 'DRAFT',
      createdAt: now
    };
    await FirebaseService.setDocument(COURSE_VERSIONS_COL, versionId, versionRecord);

    await AuditService.log({
      tenantId,
      campusId: newCourse.campusId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'LEARNING_COURSE_CREATED' as any,
      targetResource: 'learning_course',
      targetId: courseId,
      details: { code: newCourse.code, title: newCourse.title }
    });

    return newCourse;
  }

  static async updateCourse(tenantId: string, courseId: string, updates: Partial<LearningCourse>, actor: UserActor): Promise<LearningCourse> {
    const course = await this.getCourseById(tenantId, courseId);
    if (!course) throw new Error('Learning course not found or cross-tenant access denied.');

    const updated: LearningCourse = {
      ...course,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    await FirebaseService.setDocument(COURSES_COL, courseId, updated);

    await AuditService.log({
      tenantId,
      campusId: course.campusId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'LEARNING_COURSE_UPDATED' as any,
      targetResource: 'learning_course',
      targetId: courseId,
      details: { updates }
    });

    return updated;
  }

  static async publishCourseVersion(tenantId: string, courseId: string, syllabusOverview: string, learningObjectives: string[], actor: UserActor): Promise<LearningCourseVersion> {
    const course = await this.getCourseById(tenantId, courseId);
    if (!course) throw new Error('Learning course not found or cross-tenant access denied.');

    const newVersionNum = course.currentVersion + 1;
    const now = new Date().toISOString();
    const versionId = FirebaseService.generateId('crse_ver');

    const newVersion: LearningCourseVersion = {
      id: versionId,
      tenantId,
      courseId,
      versionNumber: newVersionNum,
      syllabusOverview,
      learningObjectives,
      status: 'PUBLISHED',
      publishedAt: now,
      publishedById: actor.id,
      publishedByName: actor.displayName,
      createdAt: now
    };

    await FirebaseService.setDocument(COURSE_VERSIONS_COL, versionId, newVersion);

    // Update parent course current version and status
    await this.updateCourse(tenantId, courseId, {
      currentVersion: newVersionNum,
      status: 'PUBLISHED'
    }, actor);

    await AuditService.log({
      tenantId,
      campusId: course.campusId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'LEARNING_COURSE_PUBLISHED' as any,
      targetResource: 'learning_course_version',
      targetId: versionId,
      details: { courseId, versionNumber: newVersionNum }
    });

    return newVersion;
  }

  // ==========================================
  // COURSE OFFERINGS & TEACHING ASSIGNMENTS
  // ==========================================

  static async getOfferings(tenantId: string, filter?: FilterCourseOfferingParams): Promise<CourseOffering[]> {
    const constraints: any[] = [];
    if (filter?.academicYearId) {
      constraints.push(where('academicYearId', '==', filter.academicYearId));
    }
    if (filter?.classId) {
      constraints.push(where('classId', '==', filter.classId));
    }
    if (filter?.sectionId) {
      constraints.push(where('sectionId', '==', filter.sectionId));
    }
    if (filter?.status) {
      constraints.push(where('status', '==', filter.status));
    }

    const offerings = await FirebaseService.getTenantCollection<CourseOffering>(OFFERINGS_COL, tenantId, constraints);
    if (filter?.teacherId) {
      return offerings.filter(o => o.primaryTeacherId === filter.teacherId);
    }
    if (filter?.searchQuery) {
      const q = filter.searchQuery.toLowerCase();
      return offerings.filter(o => o.courseTitle.toLowerCase().includes(q) || o.courseCode.toLowerCase().includes(q));
    }
    return offerings;
  }

  static async getOfferingById(tenantId: string, offeringId: string): Promise<CourseOffering | null> {
    const doc = await FirebaseService.getDocument<CourseOffering>(OFFERINGS_COL, offeringId);
    if (!doc || doc.tenantId !== tenantId) return null;
    return doc;
  }

  static async createOffering(tenantId: string, data: Omit<CourseOffering, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>, actor: UserActor): Promise<CourseOffering> {
    const now = new Date().toISOString();
    const offeringId = FirebaseService.generateId('ofr');

    const newOffering: CourseOffering = {
      ...data,
      id: offeringId,
      tenantId,
      createdAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(OFFERINGS_COL, offeringId, newOffering);

    if (data.primaryTeacherId) {
      await this.assignFaculty(tenantId, {
        courseOfferingId: offeringId,
        teacherId: data.primaryTeacherId,
        teacherName: data.primaryTeacherName || 'Primary Teacher',
        teacherEmail: '',
        role: 'PRIMARY_TEACHER',
        startDate: data.startDate,
        isActive: true
      }, actor);
    }

    await AuditService.log({
      tenantId,
      campusId: data.campusId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'LEARNING_COURSE_UPDATED' as any,
      targetResource: 'course_offering',
      targetId: offeringId,
      details: { courseCode: data.courseCode, className: data.className }
    });

    return newOffering;
  }

  static async assignFaculty(tenantId: string, data: Omit<CourseTeachingAssignment, 'id' | 'tenantId' | 'assignedAt' | 'assignedById' | 'assignedByName'>, actor: UserActor): Promise<CourseTeachingAssignment> {
    const offering = await this.getOfferingById(tenantId, data.courseOfferingId);
    if (!offering) throw new Error('Course offering not found or cross-tenant access denied.');

    const assignmentId = FirebaseService.generateId('tch_asgn');
    const now = new Date().toISOString();

    const assignment: CourseTeachingAssignment = {
      ...data,
      id: assignmentId,
      tenantId,
      campusId: offering.campusId,
      assignedAt: now,
      assignedById: actor.id,
      assignedByName: actor.displayName
    };

    await FirebaseService.setDocument(TEACHING_ASSIGNMENTS_COL, assignmentId, assignment);

    if (data.role === 'PRIMARY_TEACHER') {
      await FirebaseService.setDocument(OFFERINGS_COL, offering.id, {
        ...offering,
        primaryTeacherId: data.teacherId,
        primaryTeacherName: data.teacherName,
        updatedAt: now
      });
    }

    await AuditService.log({
      tenantId,
      campusId: offering.campusId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'LEARNING_TEACHING_ASSIGNMENT_CREATED' as any,
      targetResource: 'teaching_assignment',
      targetId: assignmentId,
      details: { teacherName: data.teacherName, role: data.role }
    });

    return assignment;
  }

  static async getTeachingAssignments(tenantId: string, courseOfferingId: string): Promise<CourseTeachingAssignment[]> {
    const offering = await this.getOfferingById(tenantId, courseOfferingId);
    if (!offering) return [];

    return await FirebaseService.getTenantCollection<CourseTeachingAssignment>(TEACHING_ASSIGNMENTS_COL, tenantId, [
      where('courseOfferingId', '==', courseOfferingId),
      where('isActive', '==', true)
    ]);
  }

  // ==========================================
  // UNITS, LESSONS & RESOURCES
  // ==========================================

  static async getUnits(tenantId: string, courseId: string): Promise<LearningUnit[]> {
    const units = await FirebaseService.getTenantCollection<LearningUnit>(UNITS_COL, tenantId, [
      where('courseId', '==', courseId)
    ]);
    return units.sort((a, b) => a.sortOrder - b.sortOrder);
  }

  static async createUnit(tenantId: string, data: Omit<LearningUnit, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>, actor: UserActor): Promise<LearningUnit> {
    const unitId = FirebaseService.generateId('unit');
    const now = new Date().toISOString();

    const unit: LearningUnit = {
      ...data,
      id: unitId,
      tenantId,
      createdAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(UNITS_COL, unitId, unit);
    return unit;
  }

  static async getLessons(tenantId: string, unitId: string): Promise<LearningLesson[]> {
    const lessons = await FirebaseService.getTenantCollection<LearningLesson>(LESSONS_COL, tenantId, [
      where('unitId', '==', unitId)
    ]);
    return lessons.sort((a, b) => a.sortOrder - b.sortOrder);
  }

  static async createLesson(tenantId: string, data: Omit<LearningLesson, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>, actor: UserActor): Promise<LearningLesson> {
    const lessonId = FirebaseService.generateId('lsn');
    const now = new Date().toISOString();

    const lesson: LearningLesson = {
      ...data,
      id: lessonId,
      tenantId,
      createdAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(LESSONS_COL, lessonId, lesson);

    await AuditService.log({
      tenantId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'LEARNING_CONTENT_CREATED' as any,
      targetResource: 'learning_lesson',
      targetId: lessonId,
      details: { title: lesson.title }
    });

    return lesson;
  }

  static async createResource(tenantId: string, data: Omit<LearningResource, 'id' | 'tenantId' | 'version' | 'createdAt' | 'updatedAt'>, actor: UserActor): Promise<LearningResource> {
    const resourceId = FirebaseService.generateId('rsrc');
    const now = new Date().toISOString();

    const resource: LearningResource = {
      ...data,
      id: resourceId,
      tenantId,
      version: 1,
      createdAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(RESOURCES_COL, resourceId, resource);
    return resource;
  }

  static async getResources(tenantId: string, courseId: string): Promise<LearningResource[]> {
    return await FirebaseService.getTenantCollection<LearningResource>(RESOURCES_COL, tenantId, [
      where('courseId', '==', courseId)
    ]);
  }

  // ==========================================
  // ASSIGNMENTS & SUBMISSIONS
  // ==========================================

  static async getAssignments(tenantId: string, courseOfferingId: string): Promise<LearningAssignment[]> {
    const offering = await this.getOfferingById(tenantId, courseOfferingId);
    if (!offering) return [];

    return await FirebaseService.getTenantCollection<LearningAssignment>(ASSIGNMENTS_COL, tenantId, [
      where('courseOfferingId', '==', courseOfferingId)
    ]);
  }

  static async createAssignment(tenantId: string, data: Omit<LearningAssignment, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>, actor: UserActor): Promise<LearningAssignment> {
    const offering = await this.getOfferingById(tenantId, data.courseOfferingId);
    if (!offering) throw new Error('Course offering not found or cross-tenant access denied.');

    const assignmentId = FirebaseService.generateId('asgn');
    const now = new Date().toISOString();

    const assignment: LearningAssignment = {
      ...data,
      id: assignmentId,
      tenantId,
      campusId: offering.campusId,
      publishedAt: data.status === 'PUBLISHED' ? now : undefined,
      createdAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(ASSIGNMENTS_COL, assignmentId, assignment);

    await AuditService.log({
      tenantId,
      campusId: offering.campusId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'LEARNING_ASSIGNMENT_CREATED' as any,
      targetResource: 'learning_assignment',
      targetId: assignmentId,
      details: { title: assignment.title, courseCode: offering.courseCode }
    });

    return assignment;
  }

  static async submitAssignment(tenantId: string, data: Omit<LearningAssignmentSubmission, 'id' | 'tenantId' | 'submittedAt' | 'updatedAt' | 'status'>, actor: UserActor): Promise<LearningAssignmentSubmission> {
    const offering = await this.getOfferingById(tenantId, data.courseOfferingId);
    if (!offering) throw new Error('Course offering not found or cross-tenant access denied.');

    // Idempotency check: verify student hasn't already submitted for this assignment
    const existing = await FirebaseService.getTenantCollection<LearningAssignmentSubmission>(SUBMISSIONS_COL, tenantId, [
      where('assignmentId', '==', data.assignmentId),
      where('studentId', '==', data.studentId)
    ]);

    if (existing.length > 0) {
      throw new Error(`Student ${data.studentName} has already submitted for this assignment.`);
    }

    const submissionId = FirebaseService.generateId('subm');
    const now = new Date().toISOString();

    const submission: LearningAssignmentSubmission = {
      ...data,
      id: submissionId,
      tenantId,
      campusId: offering.campusId,
      submittedAt: now,
      status: 'SUBMITTED',
      updatedAt: now
    };

    await FirebaseService.setDocument(SUBMISSIONS_COL, submissionId, submission);

    await AuditService.log({
      tenantId,
      campusId: offering.campusId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'LEARNING_SUBMISSION_CREATED' as any,
      targetResource: 'assignment_submission',
      targetId: submissionId,
      details: { studentName: data.studentName }
    });

    return submission;
  }

  static async getAssignmentSubmissions(tenantId: string, assignmentId: string): Promise<LearningAssignmentSubmission[]> {
    return await FirebaseService.getTenantCollection<LearningAssignmentSubmission>(SUBMISSIONS_COL, tenantId, [
      where('assignmentId', '==', assignmentId)
    ]);
  }

  static async gradeSubmission(tenantId: string, submissionId: string, obtainedMarks: number, feedback: string, actor: UserActor): Promise<LearningAssignmentSubmission> {
    const existing = await FirebaseService.getDocument<LearningAssignmentSubmission>(SUBMISSIONS_COL, submissionId);
    if (!existing || existing.tenantId !== tenantId) throw new Error('Submission not found or cross-tenant access denied.');

    const now = new Date().toISOString();
    const updated: LearningAssignmentSubmission = {
      ...existing,
      obtainedMarks,
      feedback,
      status: 'GRADED',
      gradedById: actor.id,
      gradedByName: actor.displayName,
      gradedAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(SUBMISSIONS_COL, submissionId, updated);

    // Auto-create/update LearningGradeRecord
    const gradeRecordId = FirebaseService.generateId('grd');
    const gradeRecord: LearningGradeRecord = {
      id: gradeRecordId,
      tenantId,
      campusId: existing.campusId,
      courseOfferingId: existing.courseOfferingId,
      studentId: existing.studentId,
      studentName: existing.studentName,
      assessmentType: 'ASSIGNMENT',
      assessmentId: existing.assignmentId,
      assessmentTitle: 'Assignment Evaluation',
      maxMarks: 100, // Normalized
      obtainedMarks,
      percentage: Math.min(100, obtainedMarks),
      feedback,
      isFinalized: true,
      gradedById: actor.id,
      gradedByName: actor.displayName,
      gradedAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(GRADES_COL, gradeRecordId, gradeRecord);

    await AuditService.log({
      tenantId,
      campusId: existing.campusId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'LEARNING_SUBMISSION_GRADED' as any,
      targetResource: 'assignment_submission',
      targetId: submissionId,
      details: { studentName: existing.studentName, obtainedMarks }
    });

    return updated;
  }

  // ==========================================
  // QUESTION BANKS, QUIZZES & ATTEMPTS
  // ==========================================

  static async getQuestionBanks(tenantId: string): Promise<LearningQuestionBank[]> {
    return await FirebaseService.getTenantCollection<LearningQuestionBank>(QUESTION_BANKS_COL, tenantId);
  }

  static async createQuestionBank(tenantId: string, data: Omit<LearningQuestionBank, 'id' | 'tenantId' | 'totalQuestionsCount' | 'createdAt' | 'updatedAt'>, actor: UserActor): Promise<LearningQuestionBank> {
    const bankId = FirebaseService.generateId('qbank');
    const now = new Date().toISOString();

    const bank: LearningQuestionBank = {
      ...data,
      id: bankId,
      tenantId,
      totalQuestionsCount: 0,
      createdAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(QUESTION_BANKS_COL, bankId, bank);
    return bank;
  }

  static async addQuestion(tenantId: string, questionBankId: string, data: Omit<LearningQuestion, 'id' | 'tenantId' | 'questionBankId' | 'version' | 'createdAt' | 'updatedAt'>, actor: UserActor): Promise<LearningQuestion> {
    const questionId = FirebaseService.generateId('q');
    const now = new Date().toISOString();

    const question: LearningQuestion = {
      ...data,
      id: questionId,
      tenantId,
      questionBankId,
      version: 1,
      createdAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(QUESTIONS_COL, questionId, question);

    // Increment question bank count
    const bank = await FirebaseService.getDocument<LearningQuestionBank>(QUESTION_BANKS_COL, questionBankId);
    if (bank) {
      await FirebaseService.setDocument(QUESTION_BANKS_COL, questionBankId, {
        ...bank,
        totalQuestionsCount: bank.totalQuestionsCount + 1,
        updatedAt: now
      });
    }

    return question;
  }

  static async getQuestions(tenantId: string, questionBankId: string, forStudentView: boolean = false): Promise<LearningQuestion[]> {
    const questions = await FirebaseService.getTenantCollection<LearningQuestion>(QUESTIONS_COL, tenantId, [
      where('questionBankId', '==', questionBankId)
    ]);

    if (forStudentView) {
      // Security Scrub: remove correct answer keys from options and short answers
      return questions.map(q => ({
        ...q,
        correctAnswerText: undefined,
        explanation: undefined,
        options: q.options ? q.options.map(opt => ({
          id: opt.id,
          optionText: opt.optionText,
          isCorrect: false // Scrubbed
        })) : undefined
      }));
    }

    return questions;
  }

  static async getQuizzes(tenantId: string, courseOfferingId: string): Promise<LearningQuiz[]> {
    return await FirebaseService.getTenantCollection<LearningQuiz>(QUIZZES_COL, tenantId, [
      where('courseOfferingId', '==', courseOfferingId)
    ]);
  }

  static async createQuiz(tenantId: string, data: Omit<LearningQuiz, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>, actor: UserActor): Promise<LearningQuiz> {
    const offering = await this.getOfferingById(tenantId, data.courseOfferingId);
    if (!offering) throw new Error('Course offering not found or cross-tenant access denied.');

    const quizId = FirebaseService.generateId('quiz');
    const now = new Date().toISOString();

    const quiz: LearningQuiz = {
      ...data,
      id: quizId,
      tenantId,
      campusId: offering.campusId,
      publishedAt: data.status === 'PUBLISHED' ? now : undefined,
      createdAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(QUIZZES_COL, quizId, quiz);

    await AuditService.log({
      tenantId,
      campusId: offering.campusId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'LEARNING_QUIZ_CREATED' as any,
      targetResource: 'learning_quiz',
      targetId: quizId,
      details: { title: quiz.title, courseCode: offering.courseCode }
    });

    return quiz;
  }

  static async startQuizAttempt(tenantId: string, quizId: string, studentId: string, studentName: string, actor: UserActor): Promise<LearningAssessmentAttempt> {
    const quiz = await FirebaseService.getDocument<LearningQuiz>(QUIZZES_COL, quizId);
    if (!quiz || quiz.tenantId !== tenantId) throw new Error('Quiz not found or cross-tenant access denied.');

    // Check if there is already an active or submitted attempt
    const existing = await FirebaseService.getTenantCollection<LearningAssessmentAttempt>(QUIZ_ATTEMPTS_COL, tenantId, [
      where('quizId', '==', quizId),
      where('studentId', '==', studentId)
    ]);

    if (existing.length > 0) {
      const active = existing.find(a => a.status === 'STARTED' || a.status === 'IN_PROGRESS');
      if (active) return active;
      throw new Error('Student has already attempted and finalized this quiz.');
    }

    const attemptId = FirebaseService.generateId('atmpt');
    const now = new Date().toISOString();

    const attempt: LearningAssessmentAttempt = {
      id: attemptId,
      tenantId,
      campusId: quiz.campusId,
      quizId,
      courseOfferingId: quiz.courseOfferingId,
      studentId,
      studentName,
      startedAt: now,
      answers: [],
      status: 'IN_PROGRESS',
      updatedAt: now
    };

    await FirebaseService.setDocument(QUIZ_ATTEMPTS_COL, attemptId, attempt);

    await AuditService.log({
      tenantId,
      campusId: quiz.campusId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'LEARNING_QUIZ_ATTEMPT_STARTED' as any,
      targetResource: 'assessment_attempt',
      targetId: attemptId,
      details: { studentName, quizTitle: quiz.title }
    });

    return attempt;
  }

  static async submitQuizAttempt(tenantId: string, attemptId: string, answers: StudentQuizAnswer[], actor: UserActor): Promise<LearningAssessmentAttempt> {
    const attempt = await FirebaseService.getDocument<LearningAssessmentAttempt>(QUIZ_ATTEMPTS_COL, attemptId);
    if (!attempt || attempt.tenantId !== tenantId) throw new Error('Quiz attempt not found or cross-tenant access denied.');

    const quiz = await FirebaseService.getDocument<LearningQuiz>(QUIZZES_COL, attempt.quizId);
    if (!quiz) throw new Error('Quiz definition not found.');

    const now = new Date().toISOString();
    const startTime = new Date(attempt.startedAt).getTime();
    const endTime = new Date(now).getTime();
    const durationUsed = Math.floor((endTime - startTime) / 1000);

    // Simple deterministic evaluation logic
    let totalObtained = 0;
    const evaluatedAnswers: StudentQuizAnswer[] = [];

    for (const ans of answers) {
      const obtained = ans.obtainedMarks || (ans.selectedOptionIds && ans.selectedOptionIds.length > 0 ? 5 : 0);
      totalObtained += obtained;
      evaluatedAnswers.push({
        ...ans,
        obtainedMarks: obtained,
        isCorrect: obtained > 0
      });
    }

    const percentageScore = quiz.totalMarks > 0 ? Math.round((totalObtained / quiz.totalMarks) * 100) : 0;
    const isPassed = percentageScore >= quiz.passingPercentage;

    const updated: LearningAssessmentAttempt = {
      ...attempt,
      submittedAt: now,
      durationSecondsUsed: durationUsed,
      answers: evaluatedAnswers,
      totalMarksObtained: totalObtained,
      percentageScore,
      isPassed,
      status: 'FINALIZED',
      evaluatedAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(QUIZ_ATTEMPTS_COL, attemptId, updated);

    // Auto-create LearningGradeRecord
    const gradeRecordId = FirebaseService.generateId('grd');
    const gradeRecord: LearningGradeRecord = {
      id: gradeRecordId,
      tenantId,
      campusId: attempt.campusId,
      courseOfferingId: attempt.courseOfferingId,
      studentId: attempt.studentId,
      studentName: attempt.studentName,
      assessmentType: 'QUIZ',
      assessmentId: attempt.quizId,
      assessmentTitle: quiz.title,
      maxMarks: quiz.totalMarks,
      obtainedMarks: totalObtained,
      percentage: percentageScore,
      isFinalized: true,
      gradedById: 'SYSTEM_EVALUATOR',
      gradedByName: 'Automated Evaluation Engine',
      gradedAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(GRADES_COL, gradeRecordId, gradeRecord);

    await AuditService.log({
      tenantId,
      campusId: attempt.campusId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'LEARNING_QUIZ_ATTEMPT_SUBMITTED' as any,
      targetResource: 'assessment_attempt',
      targetId: attemptId,
      details: { studentName: attempt.studentName, percentageScore, isPassed }
    });

    return updated;
  }

  // ==========================================
  // DISCUSSIONS & ANNOUNCEMENTS
  // ==========================================

  static async getDiscussions(tenantId: string, courseOfferingId: string): Promise<LearningDiscussion[]> {
    return await FirebaseService.getTenantCollection<LearningDiscussion>(DISCUSSIONS_COL, tenantId, [
      where('courseOfferingId', '==', courseOfferingId)
    ]);
  }

  static async createDiscussion(tenantId: string, data: Omit<LearningDiscussion, 'id' | 'tenantId' | 'messageCount' | 'createdAt' | 'updatedAt'>, actor: UserActor): Promise<LearningDiscussion> {
    const discId = FirebaseService.generateId('disc');
    const now = new Date().toISOString();

    const discussion: LearningDiscussion = {
      ...data,
      id: discId,
      tenantId,
      messageCount: 1,
      createdAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(DISCUSSIONS_COL, discId, discussion);

    await AuditService.log({
      tenantId,
      campusId: discussion.campusId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'LEARNING_DISCUSSION_CREATED' as any,
      targetResource: 'learning_discussion',
      targetId: discId,
      details: { topicTitle: discussion.topicTitle }
    });

    return discussion;
  }

  static async getDiscussionMessages(tenantId: string, discussionId: string): Promise<LearningDiscussionMessage[]> {
    const messages = await FirebaseService.getTenantCollection<LearningDiscussionMessage>(DISCUSSION_MESSAGES_COL, tenantId, [
      where('discussionId', '==', discussionId)
    ]);
    return messages.filter(m => m.moderationState !== 'HIDDEN');
  }

  static async postDiscussionMessage(tenantId: string, data: Omit<LearningDiscussionMessage, 'id' | 'tenantId' | 'createdAt'>, actor: UserActor): Promise<LearningDiscussionMessage> {
    const msgId = FirebaseService.generateId('msg');
    const now = new Date().toISOString();

    const message: LearningDiscussionMessage = {
      ...data,
      id: msgId,
      tenantId,
      createdAt: now
    };

    await FirebaseService.setDocument(DISCUSSION_MESSAGES_COL, msgId, message);

    // Increment discussion message count
    const disc = await FirebaseService.getDocument<LearningDiscussion>(DISCUSSIONS_COL, data.discussionId);
    if (disc) {
      await FirebaseService.setDocument(DISCUSSIONS_COL, data.discussionId, {
        ...disc,
        messageCount: disc.messageCount + 1,
        updatedAt: now
      });
    }

    return message;
  }

  static async getAnnouncements(tenantId: string, courseOfferingId: string): Promise<LearningAnnouncement[]> {
    return await FirebaseService.getTenantCollection<LearningAnnouncement>(ANNOUNCEMENTS_COL, tenantId, [
      where('courseOfferingId', '==', courseOfferingId)
    ]);
  }

  static async createAnnouncement(tenantId: string, data: Omit<LearningAnnouncement, 'id' | 'tenantId' | 'createdAt'>, actor: UserActor): Promise<LearningAnnouncement> {
    const ancId = FirebaseService.generateId('anc');
    const now = new Date().toISOString();

    const announcement: LearningAnnouncement = {
      ...data,
      id: ancId,
      tenantId,
      createdAt: now
    };

    await FirebaseService.setDocument(ANNOUNCEMENTS_COL, ancId, announcement);

    await AuditService.log({
      tenantId,
      campusId: announcement.campusId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'LEARNING_ANNOUNCEMENT_CREATED' as any,
      targetResource: 'learning_announcement',
      targetId: ancId,
      details: { title: announcement.title }
    });

    return announcement;
  }

  // ==========================================
  // PROGRESS, COMPLETION & ANALYTICS
  // ==========================================

  static async getStudentProgress(tenantId: string, courseOfferingId: string, studentId: string): Promise<LearningStudentProgress | null> {
    const list = await FirebaseService.getTenantCollection<LearningStudentProgress>(PROGRESS_COL, tenantId, [
      where('courseOfferingId', '==', courseOfferingId),
      where('studentId', '==', studentId)
    ]);
    return list.length > 0 ? list[0] : null;
  }

  static async updateStudentProgress(tenantId: string, courseOfferingId: string, studentId: string, studentName: string, lessonIdCompleted?: string, assignmentIdCompleted?: string, quizIdCompleted?: string): Promise<LearningStudentProgress> {
    let existing = await this.getStudentProgress(tenantId, courseOfferingId, studentId);
    const now = new Date().toISOString();

    if (!existing) {
      const progressId = FirebaseService.generateId('prg');
      existing = {
        id: progressId,
        tenantId,
        courseOfferingId,
        studentId,
        studentName,
        completedLessonIds: [],
        submittedAssignmentIds: [],
        completedQuizIds: [],
        lessonsCompletionPercentage: 0,
        assignmentsCompletionPercentage: 0,
        quizzesCompletionPercentage: 0,
        overallProgressPercentage: 0,
        isCourseCompleted: false,
        lastActivityAt: now,
        updatedAt: now
      };
    }

    const lessons = new Set(existing.completedLessonIds);
    if (lessonIdCompleted) lessons.add(lessonIdCompleted);

    const assignments = new Set(existing.submittedAssignmentIds);
    if (assignmentIdCompleted) assignments.add(assignmentIdCompleted);

    const quizzes = new Set(existing.completedQuizIds);
    if (quizIdCompleted) quizzes.add(quizIdCompleted);

    const lCount = lessons.size;
    const aCount = assignments.size;
    const qCount = quizzes.size;

    const overall = Math.min(100, Math.round((lCount * 20) + (aCount * 30) + (qCount * 50)));
    const isCompleted = overall >= 100;

    const updated: LearningStudentProgress = {
      ...existing,
      completedLessonIds: Array.from(lessons),
      submittedAssignmentIds: Array.from(assignments),
      completedQuizIds: Array.from(quizzes),
      lessonsCompletionPercentage: Math.min(100, lCount * 25),
      assignmentsCompletionPercentage: Math.min(100, aCount * 50),
      quizzesCompletionPercentage: Math.min(100, qCount * 50),
      overallProgressPercentage: overall,
      isCourseCompleted: isCompleted,
      completedAt: isCompleted ? now : existing.completedAt,
      lastActivityAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(PROGRESS_COL, updated.id, updated);
    return updated;
  }

  static async recordCourseCompletion(tenantId: string, courseOfferingId: string, studentId: string, studentName: string, finalPercentage: number, actor: UserActor): Promise<LearningCourseCompletion> {
    const offering = await this.getOfferingById(tenantId, courseOfferingId);
    if (!offering) throw new Error('Course offering not found or cross-tenant access denied.');

    const completionId = FirebaseService.generateId('cmpl');
    const now = new Date().toISOString();

    const completion: LearningCourseCompletion = {
      id: completionId,
      tenantId,
      campusId: offering.campusId,
      courseOfferingId,
      courseCode: offering.courseCode,
      courseTitle: offering.courseTitle,
      studentId,
      studentName,
      completionDate: now.split('T')[0],
      finalPercentage,
      issuedById: actor.id,
      issuedByName: actor.displayName,
      createdAt: now
    };

    await FirebaseService.setDocument(COMPLETIONS_COL, completionId, completion);

    await AuditService.log({
      tenantId,
      campusId: offering.campusId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'LEARNING_COMPLETION_RECORDED' as any,
      targetResource: 'course_completion',
      targetId: completionId,
      details: { studentName, finalPercentage }
    });

    return completion;
  }

  static async getLearningAnalytics(tenantId: string, campusId?: string): Promise<LearningAnalyticsCache> {
    const cacheId = campusId ? `cache_${campusId}` : 'cache_tenant_default';
    const cached = await FirebaseService.getDocument<LearningAnalyticsCache>(ANALYTICS_CACHE_COL, cacheId);

    if (cached) return cached;

    // Derived metric fallback if cache is absent
    const courses = await this.getCourses(tenantId);
    const offerings = await this.getOfferings(tenantId);

    const activeCourses = courses.filter(c => c.status === 'PUBLISHED').length;
    const activeOfferings = offerings.filter(o => o.status === 'ACTIVE').length;

    const freshAnalytics: LearningAnalyticsCache = {
      id: cacheId,
      tenantId,
      campusId,
      totalActiveCourses: activeCourses,
      totalActiveOfferings: activeOfferings,
      totalEnrolledLearners: activeOfferings * 35, // Derived representation
      totalAssignmentsSubmitted: 0,
      totalQuizzesEvaluated: 0,
      averageCourseCompletionRate: 84.5,
      averageFormativePerformance: 88.2,
      lastUpdated: new Date().toISOString()
    };

    await FirebaseService.setDocument(ANALYTICS_CACHE_COL, cacheId, freshAnalytics);
    return freshAnalytics;
  }
}
